import connectDB from "./config/mongodb.config.js";
import app from "./app.js";

export const startServer = () => {
    try{
        connectDB()
        app.listen(process.env.PORT, () => {
            console.log("API REST corriendo...")
        })
    }
    catch(error){
        console.log("Error al iniciar servidor: ", error)
    }
}