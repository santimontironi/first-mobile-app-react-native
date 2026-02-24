import Task from "../models/Task.js";

class TasksController {
    async createTask(req, res) {
        try{
            const { title, description } = req.body;
            const userId = req.user.id;

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

            const tasks = await Task.find({ fk_user_id: userId });

            res.status(200).json({ tasks: tasks });
        }
        catch(error){
            res.status(500).json({ message: "Error al obtener las tareas", error: error.message });
        }
    }

    async getCompletedTasks(req, res) {
        try{
            const userId = req.user.id;

            const tasks = await Task.find({ fk_user_id: userId, is_completed: true });

            res.status(200).json({ tasks: tasks });
        }
        catch(error){
            res.status(500).json({ message: "Error al obtener las tareas completadas", error: error.message });
        }
    }

    async deleteTask(req, res) {
        try{
            const taskId = req.params.id;
            const userId = req.user.id;

            const task = await Task.findByIdAndUpdate({ _id: taskId, fk_user_id: userId }, { is_active: false }, { new: true });

            if (!task) {
                return res.status(404).json({ message: "Tarea no encontrada" });
            }

            res.status(200).json({ message: "Tarea eliminada exitosamente" });
        }
        catch(error){
            return res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
        }
    }

    async taskById(req, res) {
        try{
            const taskId = req.params.id;
            const userId = req.user.id;

            const task = await Task.findOne({ _id: taskId, fk_user_id: userId });

            if (!task) {
                return res.status(404).json({ message: "Tarea no encontrada" });
            }

            res.status(200).json({ task: task });
        }
        catch(error){
            return res.status(500).json({ message: "Error al obtener la tarea", error: error.message });
        }
    }
}

const tasksController = new TasksController();

export default tasksController;