import { confirmUserService } from "../services/ApiServices";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ConfirmUser = () => {
    const { token } = useParams();

    const [response, setResponse] = useState(null);
    const [errorToken, setErrorToken] = useState(null);
    const [errorBackend, setErrorBackend] = useState(null);

    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (!token) {
            setErrorToken("Token de confirmación no proporcionado");
        }
    }, [token]);

    const onSubmit = async (data) => {
        try {
            const res = await confirmUserService(token, data.code);
            setResponse(res.data.message);
            setErrorBackend(null);
            reset();
        }
        catch (error) {
            setErrorBackend(error.response?.data?.message || "Error al confirmar la cuenta");
            setResponse(null);
            console.error("Error al confirmar usuario: ", error);
            console.log("error:", error.response?.data?.error || error.message);
        }
    };

    return (
        <section className="min-h-screen bg-linear-to-br from-black via-zinc-950 to-black flex items-center justify-center px-4">

            <div className="w-full max-w-md 
                            bg-zinc-900/80 backdrop-blur-md
                            border border-green-900/60
                            rounded-2xl shadow-[0_0_40px_rgba(0,100,0,0.25)]
                            p-8 transition-all duration-300">

                {errorToken ? (
                    <p className="text-red-500 text-sm text-center animate-pulse">
                        {errorToken}
                    </p>
                ) : (
                    <div>
                        <h1 className="text-2xl font-semibold text-green-600 text-center mb-2 tracking-wide">
                            Confirmar Cuenta
                        </h1>

                        <p className="text-zinc-400 text-sm text-center mb-8">
                            Ingresá el código que recibiste para activar tu cuenta
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="code"
                                    className="text-sm text-green-700 font-medium"
                                >
                                    Código de verificación
                                </label>

                                <input
                                    type="text"
                                    id="code"
                                    placeholder="Ej: 123456"
                                    className={`bg-black/70 border
                                    ${errors.code ? "border-red-500" : "border-green-900"}
                                    text-green-400 placeholder-green-900
                                    rounded-xl px-4 py-3
                                    focus:outline-none 
                                    focus:ring-2
                                    ${errors.code ? "focus:ring-red-500" : "focus:ring-green-700"}
                                    focus:shadow-[0_0_15px_rgba(0,128,0,0.4)]
                                    transition-all duration-300`}
                                    {...register("code", {
                                        required: "El código es obligatorio",
                                        minLength: {
                                            value: 6,
                                            message: "El código debe tener al menos 6 caracteres"
                                        }
                                    })}
                                />

                                {errors.code && (
                                    <p className="text-red-500 text-xs animate-fadeIn">
                                        {errors.code.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-2 
                                           bg-green-800 hover:bg-green-700 
                                           active:scale-95
                                           text-black font-semibold 
                                           py-3 rounded-xl 
                                           transition-all duration-200 
                                           shadow-[0_0_20px_rgba(0,128,0,0.35)]
                                           hover:shadow-[0_0_30px_rgba(0,128,0,0.55)]"
                            >
                                Verificar Código
                            </button>

                        </form>

                        {errorBackend && (
                            <p className="mt-6 text-red-500 text-sm text-center animate-pulse">
                                {errorBackend}
                            </p>
                        )}

                        {response && (
                            <p className="mt-6 text-green-500 text-sm text-center animate-fadeIn">
                                {response}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ConfirmUser;