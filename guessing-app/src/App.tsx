// src/App.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

function App() {
  // Estado para almacenar el número secreto (1 a 10)
  const [secreto, setSecreto] = useState<number>(0);

  // Estado para el valor actual que el usuario escribe (cadena)
  const [intento, setIntento] = useState<string>("");

  // Estado para el mensaje de feedback ("mayor", "menor", "¡acertaste!")
  const [feedback, setFeedback] = useState<string>("");

  // Estado para contar la cantidad de intentos
  const [contador, setContador] = useState<number>(0);

  // Al cargar el componente, generamos un número aleatorio entre 1 y 10
  useEffect(() => {
    generarSecreto();
  }, []);

  // Función para generar o resetear el número secreto
  const generarSecreto = () => {
    const numero = Math.floor(Math.random() * 10) + 1; // 1..10
    setSecreto(numero);
    setIntento("");
    setFeedback("");
    setContador(0);
  };

  // Cuando el usuario cambia el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitimos solo caracteres numéricos
    const valor = e.target.value;
    if (/^\d*$/.test(valor)) {
      setIntento(valor);
    }
  };

  // Al enviar el intento (clic en “Enviar”)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numeroIntento = parseInt(intento, 10);

    // Verificar que sea un número del 1 al 10
    if (isNaN(numeroIntento) || numeroIntento < 1 || numeroIntento > 10) {
      setFeedback("Por favor ingresa un número entre 1 y 10.");
      return;
    }

    setContador((c) => c + 1);

    if (numeroIntento === secreto) {
      setFeedback(`¡Acertaste en ${contador + 1} intento(s)!`);
    } else if (numeroIntento < secreto) {
      setFeedback("Mayor");
    } else {
      setFeedback("Menor");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center">Adivina el Número</h1>
        <p className="text-center text-sm text-gray-600">
          Estoy pensando en un número entre <strong>1</strong> y <strong>10</strong>.{" "}
          ¡Adivina cuál es!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Asi seria con input
          <Input
            type="text"
            value={intento}
            onChange={handleChange}
            placeholder="Escribe tu intento"
            className="w-full"
          /> 
          */}
          {/* Sino, usamos un <input> normal con clases Tailwind: */}
          <input
            type="text"
            value={intento}
            onChange={handleChange}
            placeholder="Tu número (1-10)"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-lg focus:border-blue-500 focus:outline-none"
            maxLength={2}
          />

          <Button type="submit" className="w-full">
            Enviar intento
          </Button>
        </form>

        {/* Sección de feedback */}
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
