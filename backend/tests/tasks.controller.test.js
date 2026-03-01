import tasksController from "../controllers/tasks.controller.js";
import Task from "../models/Task.js";

jest.mock("../models/Task.js");

describe("Test unitario del TasksController", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                title: "Test Task",
                description: "This is a test task"
            }
        };
        req.user = { id: "userId123" };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    test("Devuelve 201 si la tarea se crea correctamente", async () => {
        // Mockear el constructor Task para capturar los datos y simular save()
        Task.mockImplementation(function (data) {
            this.title = data.title;
            this.description = data.description;
            this.fk_user_id = data.fk_user_id;
            this.save = jest.fn().mockResolvedValue(this);
            return this;
        });

        await tasksController.createTask(req, res);

        expect(Task).toHaveBeenCalledWith({ title: req.body.title, description: req.body.description, fk_user_id: req.user.id });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Tarea creada exitosamente", task: expect.objectContaining({ title: req.body.title, description: req.body.description, fk_user_id: req.user.id }) });
    })
})
