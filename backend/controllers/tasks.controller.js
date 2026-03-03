import Task from "../models/Task.js";

class TasksController {
    async createTask(req, res) {
        try{
            const { title, description } = req.body;
            const userId = req.user.id;

            if (!title || !description) {
                return res.status(400).json({ message: "Debe ingresar todos los datos correspondientes." });
            }

            if (!userId) {
                return res.status(400).json({ message: "ID de usuario faltante" });
            }

            const task = new Task({ title, description, fk_user_id: userId });
            await task.save();

            res.status(201).json({ message: "Tarea creada exitosamente", task:task });
        }
        catch(error){
            res.status(500).json({ message: "Error al crear la tarea", error: error.message });
        }
    }

    async getTasks(req, res) {
        try{
            const userId = req.user.id;

            if (!userId) {
                return res.status(400).json({ message: "ID de usuario faltante" });
            }

            const tasks = await Task.find({ fk_user_id: userId, is_active: true, is_completed: false }).sort({ created_at: -1 });

            res.status(200).json({ tasks: tasks });
        }
        catch(error){
            res.status(500).json({ message: "Error al obtener las tareas", error: error.message });
        }
    }

    async getCompletedTasks(req, res) {
        try{
            const userId = req.user.id;

            if (!userId) {
                return res.status(400).json({ message: "ID de usuario faltante" });
            }

            const tasks = await Task.find({ fk_user_id: userId, is_active: true, is_completed: true }).sort({ created_at: -1 });

            res.status(200).json({ tasks: tasks });
        }
        catch(error){
            res.status(500).json({ message: "Error al obtener las tareas completadas", error: error.message });
        }
    }

    async completeTask(req, res) {
        try{
            const taskId = req.params.id;
            const userId = req.user.id;

            if (!taskId || !userId) {
                return res.status(400).json({ message: "ID de tarea o usuario faltante" });
            }

            const task = await Task.findByIdAndUpdate({ _id: taskId, fk_user_id: userId, is_active: true }, { is_completed: true }, { returnDocument: 'after' });

            if (!task) {
                return res.status(404).json({ message: "Tarea no encontrada" });
            }

            res.status(200).json({ message: "Tarea completada exitosamente", task: task });
        }
        catch(error){
            res.status(500).json({ message: "Error al completar la tarea", error: error.message });
        }
    }

    async deleteTask(req, res) {
        try{
            const taskId = req.params.id;
            const userId = req.user.id;

            if (!taskId || !userId) {
                return res.status(400).json({ message: "ID de tarea o usuario faltante" });
            }

            const task = await Task.findByIdAndUpdate({ _id: taskId, fk_user_id: userId, is_active: true }, { is_active: false }, { returnDocument: 'after' });

            if (!task) {
                return res.status(404).json({ message: "Tarea no encontrada" });
            }

            res.status(200).json({ message: "Tarea eliminada exitosamente", task: task });
        }
        catch(error){
            return res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
        }
    }
}

const tasksController = new TasksController();

export default tasksController;