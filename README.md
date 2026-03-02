# Mi primera aplicación con React Native

> **Estado**: En desarrollo

## Descripción

Aplicación fullstack de gestión de tareas con autenticación de usuarios. Incluye una API REST en Node.js/Express y una app móvil con React Native (Expo).

---

## Arquitectura general

```plantuml
@startuml
skinparam backgroundColor #0f172a
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 13
skinparam defaultFontColor #e2e8f0
skinparam ArrowColor #7dd3fc
skinparam ArrowThickness 1.8

skinparam rectangle {
  BackgroundColor #1e293b
  BorderColor #334155
  FontColor #e2e8f0
  RoundCorner 14
}

skinparam database {
  BackgroundColor #1e3a5f
  BorderColor #3b82f6
  FontColor #bfdbfe
}

skinparam package {
  BackgroundColor #0f172a
  BorderColor #475569
  FontColor #94a3b8
  Style rectangle
}

package "Dispositivo móvil" {
  rectangle "**React Native**\nExpo Go" as Mobile #1e293b
}

package "Backend  —  Node.js / Express" {
  rectangle "**REST API**\n:PORT" as API
  rectangle "**verifyAuth**\nMiddleware JWT" as MW
  rectangle "**AuthController**\nregistro · login · confirm" as AuthC
  rectangle "**TasksController**\nCRUD tareas" as TaskC
}

package "Servicios externos" {
  database "**MongoDB**\nMongoose" as DB
  rectangle "**SMTP**\nNodemailer" as Mail #1e3a2f
}

Mobile -right-> API : HTTP / Axios
API -down-> MW : todas las rutas\nprotegidas
MW -right-> AuthC
MW -down-> TaskC
AuthC -right-> DB
TaskC -right-> DB
AuthC -down-> Mail : código de\nconfirmación

@enduml
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
    │   │   └── Dashboard.js
    │   └── services/
    │       ├── authService.js
    │       └── tasksService.js
```

---

## Navegación de la app móvil

```plantuml
@startuml
skinparam backgroundColor #0f172a
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 12

skinparam state {
  BackgroundColor #1e293b
  BorderColor #3b82f6
  FontColor #e2e8f0
  StartColor #3b82f6
  EndColor #ef4444
  ArrowColor #7dd3fc
  ArrowThickness 1.6
  AttributeFontColor #94a3b8
}

skinparam note {
  BackgroundColor #172554
  BorderColor #3b82f6
  FontColor #bfdbfe
}

[*] -[#7dd3fc]-> HomeScreen

state HomeScreen : Pantalla de bienvenida\nIniciar sesión / Registrarse

HomeScreen -[#7dd3fc]--> LoginScreen    : Iniciar sesión
HomeScreen -[#7dd3fc]--> RegisterScreen : Crear cuenta

state RegisterScreen : Formulario de registro\nname · surname · email\nusername · password
RegisterScreen -[#7dd3fc]--> ConfirmUser : Registro exitoso\n(token JWT recibido)

state LoginScreen : Email o username\n+ contraseña
LoginScreen -[#7dd3fc]--> Dashboard : Login exitoso\n(JWT 7 días)

state ConfirmUser : Ingreso del código\nde 6 dígitos recibido\npor email
ConfirmUser -[#7dd3fc]--> LoginScreen : Cuenta confirmada

state Dashboard : Lista de tareas\nCompletadas / Pendientes\nCerrar sesión
Dashboard -[#7dd3fc]--> CreateTask  : Nueva tarea
Dashboard -[#ef4444]--> HomeScreen  : Logout

state CreateTask : Título + Descripción
CreateTask -[#7dd3fc]--> Dashboard : Tarea creada

note right of ConfirmUser
  Token válido 30 min.
  El código expira junto
  con el token.
end note

note right of Dashboard
  Stack Navigator protegido:
  requiere JWT válido en
  AsyncStorage.
end note

@enduml
```

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Node.js, Express 5, JWT, bcrypt, Nodemailer |
| Base de datos | MongoDB, Mongoose |
| Mobile | React Native, Expo, React Navigation |
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
| `GET` | `/tasks` | Obtiene todas las tareas del usuario |
| `GET` | `/tasks/completed` | Obtiene solo las tareas completadas |
| `GET` | `/tasks/:id` | Obtiene una tarea por ID |
| `PATCH` | `/tasks/:id` | Marca una tarea como completada |
| `DELETE` | `/tasks/:id` | Elimina (desactiva) una tarea |

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
Realiza un **soft delete** (`is_active: false`).  
**Respuesta 200:**
```json
{ "message": "Tarea eliminada exitosamente", "task": { ... } }
```

---

## Flujo de autenticación

```plantuml
@startuml
skinparam backgroundColor #0f172a
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 12
skinparam sequenceMessageAlign center

skinparam participant {
  BackgroundColor #1e293b
  BorderColor #3b82f6
  FontColor #e2e8f0
  RoundCorner 8
}

skinparam sequence {
  ArrowColor #7dd3fc
  ArrowThickness 1.6
  LifeLineBorderColor #475569
  LifeLineBackgroundColor #1e293b
  BoxBackgroundColor #0f172a
  BoxBorderColor #334155
  DividerBackgroundColor #1e293b
  DividerBorderColor #475569
  DividerFontColor #94a3b8
  NoteBackgroundColor #172554
  NoteBorderColor #3b82f6
  NoteFontColor #bfdbfe
  GroupBackgroundColor #0f172a
  GroupBorderColor #334155
  GroupFontColor #94a3b8
  GroupBodyBackgroundColor #0f172a
}

participant "**Móvil**\nReact Native" as CLI
participant "**API**\nExpress" as API
participant "**verifyAuth**\nMiddleware" as MW
participant "**MongoDB**" as DB
participant "**Email**\nNodemailer" as MAIL

== Registro ==

CLI  -[#7dd3fc]>  API  : POST /register\n{ name, surname, email, username, password }
API  -[#7dd3fc]>  DB   : findOne({ email | username })
DB  --[#94a3b8]>  API  : null  (usuario disponible)
API  -[#7dd3fc]>  DB   : save User\n{ is_confirmed: false, code, code_expiration }
API  -[#7dd3fc]>  MAIL : sendMail → código 6 dígitos\nválido 30 min
API --[#7dd3fc]>  CLI  : 201  { token JWT, message }

== Confirmación de cuenta ==

CLI  -[#7dd3fc]>  API  : POST /confirm/:token\n{ code }
API  -[#7dd3fc]>  API  : jwt.verify(token)
API  -[#7dd3fc]>  DB   : findOne({ email, code })
DB  --[#94a3b8]>  API  : usuario encontrado
note right of API #172554: Verifica código\ny expiración
API  -[#7dd3fc]>  DB   : is_confirmed = true
API --[#7dd3fc]>  CLI  : 200  { message: "Cuenta confirmada" }

== Login ==

CLI  -[#7dd3fc]>  API  : POST /login\n{ identifier, password }
API  -[#7dd3fc]>  DB   : findOne({ email | username })
DB  --[#94a3b8]>  API  : usuario
API  -[#7dd3fc]>  API  : bcrypt.compare(password, hash)
API --[#7dd3fc]>  CLI  : 200  { token JWT (7d), user }

== Acceso protegido ==

CLI  -[#7dd3fc]>  MW   : GET /dashboard\nAuthorization: Bearer <token>
MW   -[#7dd3fc]>  MW   : jwt.verify(token)\nreq.user = payload
MW   -[#7dd3fc]>  DB   : findById(userId)
DB  --[#94a3b8]>  MW   : usuario
MW  --[#7dd3fc]>  CLI  : 200  { user }

@enduml
```

---

## Flujo de tareas

```plantuml
@startuml
skinparam backgroundColor #0f172a
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 12
skinparam sequenceMessageAlign center

skinparam participant {
  BackgroundColor #1e293b
  BorderColor #3b82f6
  FontColor #e2e8f0
  RoundCorner 8
}

skinparam sequence {
  ArrowColor #7dd3fc
  ArrowThickness 1.6
  LifeLineBorderColor #475569
  LifeLineBackgroundColor #1e293b
  BoxBackgroundColor #0f172a
  BoxBorderColor #334155
  DividerBackgroundColor #1e293b
  DividerBorderColor #475569
  DividerFontColor #94a3b8
  NoteBackgroundColor #172554
  NoteBorderColor #3b82f6
  NoteFontColor #bfdbfe
  GroupBackgroundColor #0f172a
  GroupBorderColor #334155
  GroupFontColor #94a3b8
  GroupBodyBackgroundColor #0f172a
}

participant "**Móvil**\nReact Native" as CLI
participant "**verifyAuth**\nMiddleware" as MW
participant "**TasksController**\nExpress" as API
participant "**MongoDB**" as DB

note over MW #172554: Todas las rutas de tareas\nrequieren Bearer token

== Crear tarea ==

CLI  -[#7dd3fc]>  MW   : POST /new-task  { title, description }
MW   -[#7dd3fc]>  API  : next()  req.user.id
API  -[#7dd3fc]>  DB   : new Task({ title, description, fk_user_id })
DB  --[#94a3b8]>  API  : task guardada
API --[#7dd3fc]>  CLI  : 201  { task }

== Obtener tareas ==

CLI  -[#7dd3fc]>  MW   : GET /tasks
MW   -[#7dd3fc]>  API  : next()
API  -[#7dd3fc]>  DB   : Task.find({ fk_user_id, is_active: true })
DB  --[#94a3b8]>  API  : tasks[]
API --[#7dd3fc]>  CLI  : 200  { tasks[] }

CLI  -[#7dd3fc]>  MW   : GET /tasks/completed
MW   -[#7dd3fc]>  API  : next()
API  -[#7dd3fc]>  DB   : Task.find({ fk_user_id, is_completed: true })
DB  --[#94a3b8]>  API  : completed tasks[]
API --[#7dd3fc]>  CLI  : 200  { tasks[] }

== Completar tarea ==

CLI  -[#7dd3fc]>  MW   : PATCH /tasks/:id
MW   -[#7dd3fc]>  API  : next()
API  -[#7dd3fc]>  DB   : findByIdAndUpdate → is_completed: true
DB  --[#94a3b8]>  API  : task actualizada
API --[#7dd3fc]>  CLI  : 200  { task }

== Eliminar tarea (soft delete) ==

CLI  -[#7dd3fc]>  MW   : DELETE /tasks/:id
MW   -[#7dd3fc]>  API  : next()
API  -[#7dd3fc]>  DB   : findByIdAndUpdate → is_active: false
DB  --[#94a3b8]>  API  : task desactivada
API --[#7dd3fc]>  CLI  : 200  { task }

@enduml
```

---

## Modelos de datos

```plantuml
@startuml
skinparam backgroundColor #0f172a
skinparam defaultFontName "Segoe UI"
skinparam defaultFontSize 12

skinparam class {
  BackgroundColor #1e293b
  BorderColor #3b82f6
  FontColor #e2e8f0
  HeaderBackgroundColor #1d4ed8
  HeaderFontColor #ffffff
  AttributeFontColor #cbd5e1
  StereotypeFontColor #7dd3fc
  ArrowColor #7dd3fc
  ArrowThickness 1.8
  RoundCorner 10
}

skinparam note {
  BackgroundColor #172554
  BorderColor #3b82f6
  FontColor #bfdbfe
}

class User {
  + _id       : ObjectId
  --
  # name           : String  [required]
  # surname        : String  [required]
  # email          : String  [required, unique]
  # username       : String  [required, unique]
  # password       : String  [bcrypt hash]
  --
  ~ is_confirmed    : Boolean  = false
  ~ code_generated  : String   = null
  ~ code_expiration : Date     = null
}

class Task {
  + _id         : ObjectId
  --
  # fk_user_id  : ObjectId  [ref: User]
  # title       : String    [required]
  # description : String    [required]
  --
  ~ is_completed : Boolean  = false
  ~ is_active    : Boolean  = true
  ~ created_at   : Date     = now()
  ~ updated_at   : Date     = now()
}

User "1" -[#7dd3fc]-o{ Task : posee >

note right of User::is_confirmed
  false → cuenta pendiente
  true  → puede iniciar sesión
end note

note right of Task::is_active
  true  → visible en listados
  false → eliminada (soft delete)
end note

@enduml
```

---

## Testing

El backend cuenta con tests unitarios implementados con **Jest**, usando mocks para aislar las dependencias (MongoDB, bcrypt, JWT, Nodemailer).

### Cobertura actual

| Archivo | Suite | Tests |
|---|---|---|
| `auth.test.js` | Registro de usuarios | 4 tests |
| `auth.test.js` | Confirmación de cuenta | 7 tests |
| `auth.test.js` | Login de usuarios | 6 tests |
| `tasks.controller.test.js` | TasksController | 1 test |

### Casos testeados

**Registro** — campos faltantes · usuario duplicado · registro exitoso + envío de email · error interno  
**Confirmación** — token/código faltante · token inválido · usuario no encontrado · cuenta ya confirmada · código incorrecto · código expirado · confirmación exitosa · error interno  
**Login** — campos faltantes · usuario no encontrado · cuenta sin confirmar · contraseña incorrecta · login exitoso + generación de JWT · error interno  
**Tareas** — creación exitosa de tarea

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

### Tests (backend)
```bash
cd backend
npm test
```

### Frontend móvil
```bash
cd frontend
npm install
npx expo start
```

---

## Visualizar los diagramas PlantUML

Los diagramas están escritos en sintaxis [PlantUML](https://plantuml.com/). Para renderizarlos:

| Entorno | Cómo |
|---|---|
| **VS Code** | Extensión [PlantUML](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) — `Alt + D` para previsualizar |
| **Online** | Pegar el código en [plantuml.com/plantuml](https://www.plantuml.com/plantuml/uml/) |
| **GitLab** | Renderizado nativo en Markdown |
| **IntelliJ / PyCharm** | Plugin PlantUML Integration |

---

## Santiago Montironi

Proyecto personal: primera app en React Native, en desarrollo.
