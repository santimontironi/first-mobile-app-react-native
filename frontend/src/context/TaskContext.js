import { createContext, useState, useEffect } from "react";
import { getTasksService } from "../services/tasksService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TaskContext = createContext()

const TaskProvider = ({ children }) => {

    const [taskList, setTaskList] = useState([]);
    const [loading, setLoading] = useState({
        tasks: false
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

    return (
        <TaskContext.Provider value={{ taskList, loading, fetchTasks }}>
            {children}
        </TaskContext.Provider>
    );
}

export default TaskProvider;