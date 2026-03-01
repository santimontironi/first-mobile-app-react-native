import authController from "../controllers/auth.controller.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/mail.config.js";
import dotenv from "dotenv";

dotenv.config();

jest.mock("../models/User.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../config/mail.config.js", () => ({
    sendMail: jest.fn((opts, cb) => cb(null, { response: "ok" })),
}));

// ----TEST DE REGISTRO -----

describe("Test unitario del registro de usuarios", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                name: "Test",
                surname: "User",
                email: "test@example.com",
                username: "testuser",
                password: "password123"
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    test("Devuelve 400 si faltan campos requeridos", async () => {
        req.body = { email: "onlyemail@example.com" };
        await authController.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Debe ingresar todos los datos correspondientes." });
    });

    test("Devuelve 400 si el usuario ya existe", async () => {
        User.findOne.mockResolvedValue({ email: "test@example.com" });
        await authController.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "El usuario ya existe." });
    });

    test("Devuelve 201 si el usuario se registra correctamente y envía correo", async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue("hashedPassword");
        jwt.sign.mockReturnValue("tokenGenerated");
        User.prototype.save.mockResolvedValue();

        await authController.registerUser(req, res);

        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
        expect(jwt.sign).toHaveBeenCalledWith(
            { email: req.body.email },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        );
        expect(transporter.sendMail).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Usuario registrado exitosamente. Revisa tu correo para confirmar tu cuenta.", token: "tokenGenerated" });
    });

    test("Devuelve 500 si ocurre un error interno durante el registro", async () => {
        User.findOne.mockImplementation(() => { throw new Error('DB failure'); });
        await authController.registerUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al registrar usuario" }));
    });
})

// ----TEST DE CONFIRMACION DE USUARIOS -----

describe("Test unitario de la confirmación de usuarios", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            params: { token: "validToken" },
            body: { code: "123456" }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    test("Devuelve 400 si no se envía token o código", async () => {
        req.params.token = null;
        await authController.confirmUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Deben de enviarse el token y el código de confirmación." });
    })

    test("Devuelve 400 si el token es inválido", async () => {
        jwt.verify.mockImplementation(() => null);
        await authController.confirmUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Token inválido" });
    })

    test("Devuelve 404 si el usuario no existe", async () => {
        jwt.verify.mockReturnValue({ email: "nonexistent@example.com" });
        User.findOne.mockResolvedValue(null);
        await authController.confirmUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Usuario no encontrado" });
    })

    test("Devuelve 400 si la cuenta ya está confirmada", async () => {
        jwt.verify.mockReturnValue({ email: "confirmed@example.com" });
        User.findOne.mockResolvedValue({ email: "confirmed@example.com", is_confirmed: true });
        await authController.confirmUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "La cuenta ya está confirmada" });
    })

    test("Devuelve 400 si el código es incorrecto", async () => {
        jwt.verify.mockReturnValue({ email: "user@example.com" });
        User.findOne.mockResolvedValue({ email: "user@example.com", is_confirmed: false, code_generated: "654321", save: jest.fn().mockResolvedValue() });
        await authController.confirmUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Código incorrecto" });
    })

    test("Devuelve 400 si el código expiró", async () => {
        jwt.verify.mockReturnValue({ email: "user@example.com" });
        User.findOne.mockResolvedValue({ email: "user@example.com", is_confirmed: false, code_generated: "123456", code_expiration: new Date(Date.now() - 1000), save: jest.fn().mockResolvedValue() });
        await authController.confirmUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "El código expiró" });
    })

    test("Devuelve 200 si la cuenta se confirma exitosamente", async () => {
        jwt.verify.mockReturnValue({ email: "user@example.com" });
        User.findOne.mockResolvedValue({ email: "user@example.com", is_confirmed: false, code_generated: "123456", code_expiration: new Date(Date.now() + 1000), save: jest.fn().mockResolvedValue() });
        await authController.confirmUser(req, res);
        expect(res.json).toHaveBeenCalledWith({ message: "Cuenta confirmada exitosamente, ahora puedes iniciar sesión." });
    })

    test("Devuelve 500 si ocurre un error interno durante la confirmación", async () => {
        jwt.verify.mockReturnValue({ email: "user@example.com" });
        User.findOne.mockImplementation(() => { throw new Error('DB failure'); });
        await authController.confirmUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Error al confirmar usuario" }));
    })

})