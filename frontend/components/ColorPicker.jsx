import React, { useState } from "react";

const themes = [
  { id: "theme-green", color: "#22be9f" },
  { id: "theme-orange", color: "#ff9344" },
  { id: "theme-primary", color: "#ff4444" },
];

export default function ColorPicker() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const changeTheme = (theme) => {
    setLoading(true);

    setTimeout(() => {
      document.body.className = theme;
      setLoading(false);
    }, 300); // symulacja preloadera
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition hover:scale-110"
      >
        🎨
      </button>

      {/* Panel color */}
      {open && (
        <div className="mt-3 p-3 bg-white shadow-xl rounded-xl flex gap-3 border border-gray-200 animate-fadeIn">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTheme(t.id)}
              className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-110 transition"
              style={{ backgroundColor: t.color }}
            />
          ))}
        </div>
      )}

      {/* Preloader */}
      {loading && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
