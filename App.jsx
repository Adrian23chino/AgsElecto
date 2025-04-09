"use client";
import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/mexico/mexico-states.json";

const initialData = [
  { estado: "Aguascalientes", candidato: "Ana López", votos: 12000 },
  { estado: "Aguascalientes", candidato: "Luis Pérez", votos: 8000 },
  { estado: "Jalisco", candidato: "Ana López", votos: 15000 },
  { estado: "Jalisco", candidato: "Luis Pérez", votos: 18000 },
];

export default function App() {
  const [resultados, setResultados] = useState(initialData);
  const [form, setForm] = useState({ estado: "", candidato: "", votos: "" });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResultados([...resultados, { ...form, votos: parseInt(form.votos) }]);
    setForm({ estado: "", candidato: "", votos: "" });
  };

  const candidatos = Array.from(new Set(resultados.map(r => r.candidato)));

  const votosPorCandidato = candidatos.map(candidato => ({
    name: candidato,
    votos: resultados.filter(r => r.candidato === candidato).reduce((sum, r) => sum + r.votos, 0),
  }));

  const ganadorPorEstado = {};
  resultados.forEach(r => {
    if (!ganadorPorEstado[r.estado] || ganadorPorEstado[r.estado].votos < r.votos) {
      ganadorPorEstado[r.estado] = { candidato: r.candidato, votos: r.votos };
    }
  });

  const colores = {
    "Ana López": "#1f77b4",
    "Luis Pérez": "#ff7f0e",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">AgsElecto</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Votos por candidato</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={votosPorCandidato}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="votos" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Mapa por estado</h2>
          <ComposableMap projection="geoMercator">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const estado = geo.properties.NAME_1;
                  const ganador = ganadorPorEstado[estado];
                  const color = ganador ? colores[ganador.candidato] || "#ccc" : "#ccc";
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={color}
                      stroke="#FFF"
                      style={{ outline: "none" }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>

      <div className="bg-white mt-10 p-4 rounded-2xl shadow max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Agregar resultado</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="estado"
            value={form.estado}
            onChange={handleInput}
            placeholder="Estado (ej. Aguascalientes)"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="candidato"
            value={form.candidato}
            onChange={handleInput}
            placeholder="Candidato"
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="votos"
            value={form.votos}
            onChange={handleInput}
            placeholder="Número de votos"
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Agregar
          </button>
        </form>
      </div>
    </div>
  );
}