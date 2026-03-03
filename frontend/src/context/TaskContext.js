import { createContext, useState } from "react";
import { getTasksService, createTaskService, completeTaskService, getCompletedTasksService } from "../services/tasksService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TaskContext = createContext()

const TaskProvider = ({ children }) => {

    const [taskList, setTaskList] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState({
        tasks: false,
        completed: false,
        create: false
    });

    async function fetchTasks() {
        setLoading(prev => ({ ...prev, tasks: true }))
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await getTasksService(token);
            setTaskList(res.data.tasks);
        }
        catch (error) {
            throw error
        }
        finally {
            setLoading(prev => ({ ...prev, tasks: false }))
        }
    }

    async function fetchCompletedTasks() {
        setLoading(prev => ({ ...prev, completed: true }))
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await getCompletedTasksService(token);
            setCompletedTasks(res.data.tasks);
        }
        catch (error) {
            throw error
        }
        finally {
            setLoading(prev => ({ ...prev, completed: false }))
        }
    }

    async function createTask(data) {
        setLoading(prev => ({ ...prev, create: true }))
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await createTaskService(token, data);
            setTaskList(prev => [...prev, res.data.task]); // Agrega la nueva tarea al final de la lista, los tres puntitos significa que se mantiene el contenido anterior del array y se agrega el nuevo elemento al final
            return res.data.task;
        }
        catch (error) {
            throw error
        }
        finally {
            setLoading(prev => ({ ...prev, create: false }))
        }
    }

    async function completeTask(id) {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await completeTaskService(token, id);
            setTaskList(prev => prev.filter(task => task._id !== id));
            setCompletedTasks(prev => [...prev, res.data.task]);
            return res.data.task;
        }
        catch (error) {
            throw error
        }
    }

    return (
        <TaskContext.Provider value={{ taskList, completedTasks, loading, fetchTasks, fetchCompletedTasks, createTask, completeTask }}>
            {children}
        </TaskContext.Provider>
    );
}



export default TaskProvider;