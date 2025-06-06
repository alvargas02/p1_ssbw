import { useState } from "react";

export default function Menu() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(!open);

  return (
    <div className="relative">
      <button
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        type="button"
        onClick={handleToggle}
        className="p-2 m-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
      >
        {open ? (
          <svg
            role="img"
            aria-label="close"
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 6L6 18M6 6l12 12"
            ></path>
          </svg>
        ) : (
          <svg
            role="img"
            aria-label="menu"
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 12h16M4 6h16M4 18h16"
            ></path>
          </svg>
        )}
      </button>

      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Menú</h2>
        </div>
        <ul className="mt-4 flex flex-col gap-2 p-4">
          <li>
            <a href="/" className="block px-2 py-1 hover:bg-gray-100 rounded">
              Home
            </a>
          </li>
          <li>
            <a href="/obras" className="block px-2 py-1 hover:bg-gray-100 rounded">
              Obras
            </a>
          </li>
          <li>
            <a href="/contacto" className="block px-2 py-1 hover:bg-gray-100 rounded">
              Contacto
            </a>
          </li>
        </ul>
      </nav>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={handleToggle}
        />
      )}
    </div>
  );
}
