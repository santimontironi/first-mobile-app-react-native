import tasksController from "../controllers/tasks.controller.js";
import Task from "../models/Task.js";

jest.mock("../models/Task.js");

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    return res;
};

// ---- TEST DE CREACIÓN DE TAREAS ----

describe("createTask", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: { title: "Test Task", description: "This is a test task" },
            user: { id: "userId123" }
        };
        res = mockRes();
        jest.clearAllMocks();
    });

    test("Devuelve 400 si faltan campos requeridos", async () => {
        req.body = {};
        await tasksController.createTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Debe ingresar todos los datos correspondientes." });
    });

    test("Devuelve 201 si la tarea se crea correctamente", async () => {
        const mockTask = { title: req.body.title, description: req.body.description, fk_user_id: req.user.id, save: jest.fn().mockResolvedValue() };
        Task.mockReturnValue(mockTask);

        await tasksController.createTask(req, res);

        expect(Task).toHaveBeenCalledWith({ title: req.body.title, description: req.body.description, fk_user_id: req.user.id });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Tarea creada exitosamente",
            task: expect.objectContaining({ title: req.body.title, description: req.body.description, fk_user_id: req.user.id })
        });
    });

    test("Devuelve 500 si ocurre un error interno al crear la tarea", async () => {
        Task.mockImplementation(() => { throw new Error("DB failure"); });
        await tasksController.createTask(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al crear la tarea" }));
    });
});

// ---- TEST DE OBTENCIÓN DE TAREAS ----

describe("getTasks", () => {
    let req;
    let res;

    beforeEach(() => {
        req = { user: { id: "userId123" } };
        res = mockRes();
        jest.clearAllMocks();
    });

    test("Devuelve 200 con la lista de tareas pendientes del usuario", async () => {
        const mockTasks = [
            { _id: "task1", title: "Tarea 1", description: "Desc 1", fk_user_id: "userId123", is_active: true, is_completed: false },
            { _id: "task2", title: "Tarea 2", description: "Desc 2", fk_user_id: "userId123", is_active: true, is_completed: false }
        ];
        Task.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockTasks) });

        await tasksController.getTasks(req, res);

        expect(Task.find).toHaveBeenCalledWith({ fk_user_id: req.user.id, is_active: true, is_completed: false });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ tasks: mockTasks });
    });

    test("Devuelve 200 con lista vacía si el usuario no tiene tareas pendientes", async () => {
        Task.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

        await tasksController.getTasks(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ tasks: [] });
    });

    test("Devuelve 500 si ocurre un error interno al obtener las tareas", async () => {
        Task.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error("DB failure")) });

        await tasksController.getTasks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al obtener las tareas" }));
    });
});

// ---- TEST DE OBTENCIÓN DE TAREAS COMPLETADAS ----

describe("getCompletedTasks", () => {
    let req;
    let res;

    beforeEach(() => {
        req = { user: { id: "userId123" } };
        res = mockRes();
        jest.clearAllMocks();
    });

    test("Devuelve 200 con la lista de tareas completadas del usuario", async () => {
        const mockTasks = [
            { _id: "task1", title: "Tarea 1", fk_user_id: "userId123", is_active: true, is_completed: true }
        ];
        Task.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockTasks) });

        await tasksController.getCompletedTasks(req, res);

        expect(Task.find).toHaveBeenCalledWith({ fk_user_id: req.user.id, is_active: true, is_completed: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ tasks: mockTasks });
    });

    test("Devuelve 500 si ocurre un error interno al obtener las tareas completadas", async () => {
        Task.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error("DB failure")) });

        await tasksController.getCompletedTasks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al obtener las tareas completadas" }));
    });
});

// ---- TEST DE COMPLETAR TAREA ----

describe("completeTask", () => {
    let req;
    let res;

    beforeEach(() => {
        req = { params: { id: "taskId123" }, user: { id: "userId123" } };
        res = mockRes();
        jest.clearAllMocks();
    });

    test("Devuelve 400 si faltan IDs requeridos", async () => {
        req.params.id = null;
        await tasksController.completeTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "ID de tarea o usuario faltante" });
    });

    test("Devuelve 404 si la tarea no existe o no pertenece al usuario", async () => {
        Task.findByIdAndUpdate.mockResolvedValue(null);
        await tasksController.completeTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Tarea no encontrada" });
    });

    test("Devuelve 200 si la tarea se completa correctamente", async () => {
        const mockTask = { _id: "taskId123", is_completed: true };
        Task.findByIdAndUpdate.mockResolvedValue(mockTask);

        await tasksController.completeTask(req, res);

        expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
            { _id: req.params.id, fk_user_id: req.user.id, is_active: true },
            { is_completed: true },
            { returnDocument: "after" }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Tarea completada exitosamente", task: mockTask });
    });

    test("Devuelve 500 si ocurre un error interno al completar la tarea", async () => {
        Task.findByIdAndUpdate.mockRejectedValue(new Error("DB failure"));
        await tasksController.completeTask(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al completar la tarea" }));
    });
});

// ---- TEST DE ELIMINACIÓN DE TAREA ----

describe("deleteTask", () => {
    let req;
    let res;

    beforeEach(() => {
        req = { params: { id: "taskId123" }, user: { id: "userId123" } };
        res = mockRes();
        jest.clearAllMocks();
    });

    test("Devuelve 400 si faltan IDs requeridos", async () => {
        req.params.id = null;
        await tasksController.deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "ID de tarea o usuario faltante" });
    });

    test("Devuelve 404 si la tarea no existe o no pertenece al usuario", async () => {
        Task.findByIdAndUpdate.mockResolvedValue(null);
        await tasksController.deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Tarea no encontrada" });
    });

    test("Devuelve 200 si la tarea se elimina correctamente (soft delete)", async () => {
        const mockTask = { _id: "taskId123", is_active: false };
        Task.findByIdAndUpdate.mockResolvedValue(mockTask);

        await tasksController.deleteTask(req, res);

        expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
            { _id: req.params.id, fk_user_id: req.user.id, is_active: true },
            { is_active: false },
            { returnDocument: "after" }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Tarea eliminada exitosamente", task: mockTask });
    });

    test("Devuelve 500 si ocurre un error interno al eliminar la tarea", async () => {
        Task.findByIdAndUpdate.mockRejectedValue(new Error("DB failure"));
        await tasksController.deleteTask(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al eliminar la tarea" }));
    });
});
