import { createContext, useState } from "react";
import { getTasksService, createTaskService } from "../services/tasksService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TaskContext = createContext()

const TaskProvider = ({ children }) => {

    const [taskList, setTaskList] = useState([]);
    const [loading, setLoading] = useState({
        tasks: false,
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

    async function createTask(data) {
        setLoading(prev => ({ ...prev, create: true }))
        try {
            const token = await AsyncStorage.getItem("token"); 
            const res = await createTaskService(token, data);
            setTaskList(prev => [res.data.task, ...prev]); // Agrega la nueva tarea al inicio de la lista, los tres puntitos significa que se mantiene el contenido anterior del array y se agrega el nuevo elemento al inicio
            return res.data.task;
        }
        catch (error) {
            throw error
        }
        finally {
            setLoading(prev => ({ ...prev, create: false }))
        }
    }

        return (
            <TaskContext.Provider value={{ taskList, loading, fetchTasks, createTask }}>
                {children}
            </TaskContext.Provider>
        );
    }

    export default TaskProvider;