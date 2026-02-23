import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("CONEXION A LA BASE DE DATOS ESTABLECIDA")
    }
    catch(error){
        console.log("Error al contectarse a la base de datos: ", error)
    }
}

export default connectDB;