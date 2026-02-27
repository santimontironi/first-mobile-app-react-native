import User from "../models/User.js";
import bcrypt from "bcrypt";
import transporter from "../config/mail.config.js";
import jwt from "jsonwebtoken";

class AuthController {
  async registerUser(req, res) {
    try {
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

      const tokenGenerated = jwt.sign(
        {
          email,
          code: codeGenerated,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confirmá tu cuenta",
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 40px 20px;">
            
            <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
              
              <h2 style="margin-top: 0; color: #1e293b;">¡Hola ${name}! 👋</h2>
              
              <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                Tu registro fue exitoso. Para activar tu cuenta ingresá el siguiente código:
              </p>

              <div style="text-align: center; margin: 25px 0;">
                <span style="
                  display: inline-block;
                  background-color: #0f172a;
                  color: #ffffff;
                  font-size: 22px;
                  letter-spacing: 3px;
                  padding: 12px 24px;
                  border-radius: 8px;
                  font-weight: bold;
                ">
                  ${codeGenerated}
                </span>
              </div>

              <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
                Este código es válido por 30 minutos. Si no solicitaste este registro, podés ignorar este mensaje.
              </p>

            </div>

          </div>
          `,
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

      res.status(201).json({ message: "Usuario registrado exitosamente. Revisa tu correo para confirmar tu cuenta.", token: tokenGenerated });
    } catch (error) {
      res.status(500).json({ message: "Error al registrar usuario", error: error.message });
    }
  }

  async confirmUser(req, res) {
    try {
      const { code, token } = req.body;

      if (!token || !code) {
        return res.status(400).json({ message: "Deben de enviarse el token y el código de confirmación." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.email || !decoded.code) {
        return res.status(400).json({ message: "Token inválido" });
      }

      const { email } = decoded;

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

      res.json({ message: "Cuenta confirmada exitosamente, ahora puedes iniciar sesión." });

    } catch (error) {
      res.status(500).json({ message: "Error al confirmar usuario", error: error.message });
    }
  }

  async loginUser(req, res) {
    try {
      const { identifier, password } = req.body;

      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (!user.is_confirmed) {
        return res.status(400).json({ message: "La cuenta no está confirmada" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
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
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
  }

  async dashboardUser(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({ user: user });
    }
    catch (error) {
      res.status(500).json({ message: "Error al acceder al dashboard", error: error.message });
    }
  }
}

const authController = new AuthController();

export default authController;
