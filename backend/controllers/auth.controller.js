import User from "../models/User.js";
import bcrypt from "bcrypt";
import transporter from "../config/mail.config.js";
import jwt from "jsonwebtoken";

class AuthController {
  async registerUser(req, res) {
    const { name, surname, email, username, password } = req.body;

    if (!name || !surname || !email || !username || !password) {
      return res
        .status(400)
        .json({ message: "Debe ingresar todos los datos correspondientes." });
    }

    const userExists = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const codeGenerated = Math.floor(10000 + Math.random() * 900000).toString();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registro exitoso",
      text: `Hola ${name}, tu registro fue exitoso. Tu código de confirmación es: ${codeGenerated}. Este código es válido por 30 minutos.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar correo: ", error);
      } else {
        console.log("Correo enviado: ", info.response);
      }
    });

    const newUser = new User({
      name,
      surname,
      email,
      username,
      password: hashedPassword,
      code_generated: codeGenerated,
      code_expiration: new Date(Date.now() + 30 * 60 * 1000), // código válido por 30 minutos
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente." });
  }

  async confirmUser(req, res) {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.is_confirmed) {
      return res.status(400).json({ message: "La cuenta ya está confirmada" });
    }

    if (user.code_generated !== code) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    if (user.code_expiration < Date.now()) {
      return res.status(400).json({ message: "El código expiró" });
    }

    user.is_confirmed = true;
    user.code_generated = null;
    user.code_expiration = null;

    await user.save();

    res.json({ message: "Cuenta confirmada exitosamente" });
  }

  async loginUser(req, res) {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if(!user){
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if(!user.is_confirmed){
        return res.status(400).json({ message: "La cuenta no está confirmada" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const userFormatted = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        username: user.username
    }

    res.status(200).json({ token, user: userFormatted });
  }
}

const authController = new AuthController();

export default authController;
