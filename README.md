# Mi primera aplicación con React Native

> **Estado**: En desarrollo

## Descripción

Aplicación fullstack de gestión de tareas con autenticación de usuarios. Incluye una API REST en Node.js/Express y una app móvil con React Native (Expo).

---

## Arquitectura general

```mermaid
graph TD
    subgraph Clientes
        A[📱 React Native\nExpo - Mobile]
    end

    subgraph Backend["Backend — Node.js / Express"]
        C[REST API\n:PORT]
        D[verifyAuth\nMiddleware JWT]
        E[Auth Controller]
        F[Tasks Controller]
    end

    subgraph Datos
        G[(MongoDB\nMongoose)]
        H[📧 SMTP\nNodemailer]
    end

    A -- HTTP / Axios --> C
    C --> D
    D --> E
    D --> F
    E --> G
    F --> G
    E --> H
```

---

## Estructura del repositorio

```
├── backend/
│   ├── app.js                  # Configuración Express, CORS, rutas
│   ├── server.js               # Arranque del servidor + conexión DB
│   ├── index.js                # Entry point
│   ├── config/
│   │   ├── mongodb.config.js   # Conexión a MongoDB
│   │   └── mail.config.js      # Configuración Nodemailer
│   ├── controllers/
│   │   ├── auth.controller.js  # Registro, confirmación, login, dashboard
│   │   └── tasks.controller.js # CRUD de tareas
│   ├── middlewares/
│   │   └── verify-auth.js      # Verificación de JWT
│   ├── models/
│   │   ├── User.js             # Modelo de usuario
│   │   └── Task.js             # Modelo de tarea
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── tasks.routes.js
│   └── tests/
│       ├── auth.test.js
│       └── tasks.controller.test.js
│
└── frontend/
    ├── App.js
    ├── src/
    │   ├── components/
    │   │   └── TaskCard.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── TaskContext.js
    │   ├── navigation/
    │   │   └── AppNavigation.js
    │   ├── screens/
    │   │   ├── HomeScreen.js
    │   │   ├── LoginScreen.js
    │   │   ├── RegisterScreen.js
    │   │   ├── ConfirmUser.js
    │   │   ├── Dashboard.js
    │   │   ├── CreateTask.js
    │   │   └── TasksCompleted.js
    │   └── services/
    │       ├── authService.js
    │       └── tasksService.js
```

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Node.js, Express 5, JWT, bcrypt, Nodemailer |
| Base de datos | MongoDB, Mongoose |
| Mobile | React Native, Expo, React Navigation, Axios, React Hook Form |
| Testing | Jest, Babel |

---

## API — Endpoints

Base URL: `http://localhost:<PORT>`

### Autenticación

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `POST` | `/register` | ❌ | Registra un nuevo usuario y envía código de confirmación por email |
| `POST` | `/confirm/:token` | ❌ | Confirma la cuenta usando el token JWT y el código recibido por email |
| `POST` | `/login` | ❌ | Inicia sesión, devuelve JWT de acceso (7 días) |
| `GET` | `/dashboard` | ✅ | Devuelve los datos del usuario autenticado |

#### `POST /register`
**Body:**
```json
{
  "name": "Juan",
  "surname": "Pérez",
  "email": "juan@example.com",
  "username": "juanp",
  "password": "secreto123"
}
```
**Respuesta 201:**
```json
{
  "message": "Usuario registrado exitosamente. Revisa tu correo para confirmar tu cuenta.",
  "token": "<jwt_token>"
}
```

---

#### `POST /confirm/:token`
**Params:** `token` — JWT recibido en el registro  
**Body:**
```json
{ "code": "123456" }
```
**Respuesta 200:**
```json
{ "message": "Cuenta confirmada exitosamente, ahora puedes iniciar sesión." }
```

---

#### `POST /login`
**Body:**
```json
{ "identifier": "juan@example.com", "password": "secreto123" }
```
> `identifier` puede ser email o username.

**Respuesta 200:**
```json
{
  "token": "<jwt_token>",
  "user": { "id": "...", "name": "Juan", "surname": "Pérez", "email": "...", "username": "..." }
}
```

---

#### `GET /dashboard`
**Header:** `Authorization: Bearer <token>`  
**Respuesta 200:**
```json
{ "user": { "name": "Juan", "email": "...", ... } }
```

---

### Tareas
> Todos los endpoints de tareas requieren `Authorization: Bearer <token>`.

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/new-task` | Crea una nueva tarea |
| `GET` | `/tasks` | Obtiene las tareas pendientes del usuario |
| `GET` | `/tasks/completed` | Obtiene las tareas completadas del usuario |
| `PATCH` | `/tasks/:id` | Marca una tarea como completada |
| `DELETE` | `/tasks/:id` | Elimina (desactiva) una tarea — soft delete |

#### `POST /new-task`
**Body:**
```json
{ "title": "Mi tarea", "description": "Descripción de la tarea" }
```
**Respuesta 201:**
```json
{ "message": "Tarea creada exitosamente", "task": { ... } }
```

---

#### `GET /tasks`
**Respuesta 200:**
```json
{ "tasks": [ { "_id": "...", "title": "...", "is_completed": false, ... } ] }
```

---

#### `PATCH /tasks/:id`
Marca la tarea `is_completed: true`.  
**Respuesta 200:**
```json
{ "message": "Tarea completada exitosamente", "task": { ... } }
```

---

#### `DELETE /tasks/:id`
Realiza un **soft delete** (`is_active: false`). Las tareas eliminadas dejan de aparecer en cualquier listado pero no se borran de la base de datos.  
**Respuesta 200:**
```json
{ "message": "Tarea eliminada exitosamente", "task": { ... } }
```

---

## Flujo de autenticación

```mermaid
sequenceDiagram
    participant Cliente
    participant API
    participant MongoDB
    participant Email

    Cliente->>API: POST /register {name, email, password...}
    API->>MongoDB: Guardar usuario (is_confirmed: false)
    API->>Email: Enviar código de 6 dígitos
    API-->>Cliente: 201 { token JWT, message }

    Cliente->>API: POST /confirm/:token {code}
    API->>MongoDB: Verificar código y expiración
    MongoDB-->>API: Usuario encontrado
    API->>MongoDB: is_confirmed = true
    API-->>Cliente: 200 { message: "Cuenta confirmada" }

    Cliente->>API: POST /login {identifier, password}
    API->>MongoDB: Buscar usuario, verificar contraseña
    API-->>Cliente: 200 { token JWT (7d), user }

    Cliente->>API: GET /dashboard (Authorization: Bearer token)
    API->>API: verifyAuth middleware
    API->>MongoDB: findById(userId)
    API-->>Cliente: 200 { user }
```

---

## Flujo de tareas

```mermaid
sequenceDiagram
    participant Cliente
    participant verifyAuth
    participant API
    participant MongoDB

    Cliente->>verifyAuth: Request + Authorization: Bearer token
    verifyAuth->>verifyAuth: jwt.verify(token)
    verifyAuth->>API: next() — req.user = decoded

    Cliente->>API: POST /new-task {title, description}
    API->>MongoDB: new Task({ ...data, fk_user_id })
    API-->>Cliente: 201 { task }

    Cliente->>API: GET /tasks
    API->>MongoDB: Task.find({ fk_user_id, is_active: true, is_completed: false })
    API-->>Cliente: 200 { tasks[] }

    Cliente->>API: PATCH /tasks/:id
    API->>MongoDB: findByIdAndUpdate → is_completed: true
    API-->>Cliente: 200 { task }

    Cliente->>API: DELETE /tasks/:id
    API->>MongoDB: findByIdAndUpdate → is_active: false
    API-->>Cliente: 200 { task }
```

---

## Modelos de datos

### User

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | String | Nombre |
| `surname` | String | Apellido |
| `email` | String | Email único |
| `username` | String | Nombre de usuario único |
| `password` | String | Hash bcrypt |
| `is_confirmed` | Boolean | Cuenta confirmada (default: `false`) |
| `code_generated` | String | Código de confirmación temporal |
| `code_expiration` | Date | Expiración del código (30 min) |

### Task

| Campo | Tipo | Descripción |
|---|---|---|
| `fk_user_id` | ObjectId | Referencia al usuario dueño |
| `title` | String | Título de la tarea |
| `description` | String | Descripción |
| `is_completed` | Boolean | Completada (default: `false`) |
| `is_active` | Boolean | Activa/soft delete (default: `true`) |
| `created_at` | Date | Fecha de creación (default: `Date.now`) |

---

## Testing

El backend cuenta con tests unitarios implementados con **Jest**, usando mocks para aislar las dependencias (MongoDB, bcrypt, JWT, Nodemailer).

### Cobertura actual

| Archivo | Suite | Tests |
|---|---|---|
| `auth.test.js` | Registro de usuarios | 4 tests |
| `auth.test.js` | Confirmación de cuenta | 8 tests |
| `auth.test.js` | Login de usuarios | 6 tests |
| `auth.test.js` | Dashboard de usuario | 3 tests |
| `tasks.controller.test.js` | createTask | 3 tests |
| `tasks.controller.test.js` | getTasks | 3 tests |
| `tasks.controller.test.js` | getCompletedTasks | 2 tests |
| `tasks.controller.test.js` | completeTask | 4 tests |
| `tasks.controller.test.js` | deleteTask | 4 tests |

**Total: 37 tests**

### Casos testeados

**Registro** — campos faltantes · usuario duplicado · registro exitoso + envío de email · error interno  
**Confirmación** — token/código faltante · token inválido · token malformado/expirado · usuario no encontrado · cuenta ya confirmada · código incorrecto · código expirado · confirmación exitosa  
**Login** — campos faltantes · usuario no encontrado · cuenta sin confirmar · contraseña incorrecta · login exitoso + generación de JWT · error interno  
**Dashboard** — usuario no encontrado · datos del usuario correctos · error interno  
**createTask** — campos faltantes · creación exitosa · error interno  
**getTasks** — lista con tareas · lista vacía · error interno  
**getCompletedTasks** — lista con tareas completadas · error interno  
**completeTask** — IDs faltantes · tarea no encontrada · completado exitoso · error interno  
**deleteTask** — IDs faltantes · tarea no encontrada · soft delete exitoso · error interno  

### Ejecutar tests

```bash
cd backend
npm test
```

---

## Variables de entorno (backend)

Crear un archivo `.env` en `backend/`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tu_base_de_datos
JWT_SECRET=tu_secreto_jwt
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_o_app_password
```

---

## Instalación y ejecución

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend móvil
```bash
cd frontend
npm install
npx expo start
```

---

## Santiago Montironi

Proyecto personal: primera app en React Native, en desarrollo.
