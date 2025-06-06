// src/App.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ConfettiBoom from "react-confetti-boom";

function App() {
  // Número secreto (1 a 10)
  const [secreto, setSecreto] = useState<number>(0);

  // Controlled component: valor actual del input (como string)
  const [intento, setIntento] = useState<string>("");

  // Mensaje de feedback ("Mayor", "Menor", "¡Acertaste!", o error de rango)
  const [feedback, setFeedback] = useState<string>("");

  // Contador de intentos realizados
  const [contador, setContador] = useState<number>(0);

  // Controlar si mostramos la animación de confeti
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Genera un número secreto nuevo al montar el componente
  useEffect(() => {
    generarSecreto();
  }, []);

  // Función para (re)iniciar el juego: genera un número aleatorio y resetea estados
  const generarSecreto = () => {
    const numeroAleatorio = Math.floor(Math.random() * 10) + 1; // 1..10
    setSecreto(numeroAleatorio);
    setIntento("");
    setFeedback("");
    setContador(0);
    setShowConfetti(false);
  };

  // Manejador del cambio en el input → actualiza el estado "intento"
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitir dígitos
    const valor = e.target.value;
    if (/^\d*$/.test(valor)) {
      setIntento(valor);
    }
  };

  // Manejador del envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convertir el string a número
    const numero = parseInt(intento, 10);

    // Validar si es número válido entre 1 y 10
    if (isNaN(numero) || numero < 1 || numero > 10) {
      setFeedback("Por favor ingresa un número entre 1 y 10.");
      setIntento(""); // Limpiar input porque el valor no es válido
      return;
    }

    // Aumentar contador de intentos
    setContador((prev) => prev + 1);

    // Comprobar si acertó
    if (numero === secreto) {
      setFeedback(`¡Acertaste en ${contador + 1} intento(s)!`);
      setShowConfetti(true);

      // Limpiamos el input para que no quede el número adentro
      setIntento("");

      // Opcional: ocultar confeti después de 3 segundos
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    } else if (numero < secreto) {
      setFeedback("Mayor");
      setIntento(""); // limpiar tras cada intento incorrecto
    } else {
      setFeedback("Menor");
      setIntento("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      {/* Si showConfetti=true, renderizamos ConfettiBoom en capa superior */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ConfettiBoom />
        </div>
      )}

      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center">Adivina el Número</h1>
        <p className="text-center text-sm text-gray-600">
          Estoy pensando en un número entre <strong>1</strong> y <strong>10</strong>. ¡Adivina cuál es!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={intento}
            onChange={handleChange}
            placeholder="Tu número (1-10)"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-lg focus:border-blue-500 focus:outline-none"
            maxLength={2}
            aria-label="Intento de número"
          />

          <Button type="submit" className="w-full">
            Enviar intento
          </Button>
        </form>

        {/* Mostrar feedback (condicionalmente) */}
        {feedback && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-center text-lg font-medium 
            ${
              feedback.startsWith("¡Acertaste")
                ? "bg-green-100 text-green-800"
                : feedback.startsWith("Por favor")
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {feedback}
          </div>
        )}

        {/* Botón para reiniciar el juego */}
        <div className="mt-4 text-center">
          <button
            onClick={generarSecreto}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Reiniciar juego
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
