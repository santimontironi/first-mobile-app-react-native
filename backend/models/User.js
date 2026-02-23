import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_confirmed: {
        type: Boolean,
        default: false
    },
    code_generated: {
        type: String,
        default: null
    },
    code_expiration: {
        type: Date,
        default: null
    }
})

export default mongoose.model("User", UserSchema)
