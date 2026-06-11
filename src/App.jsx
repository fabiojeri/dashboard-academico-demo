import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";
import { Users, GraduationCap, TrendingUp, AlertTriangle, BookOpen } from "lucide-react";

// ─────────────────────────────────────────────────────────────
//  DASHBOARD ACADÉMICO — DEMO con datos 100% ficticios
//  Universidad Andina del Pacífico (institución inventada)
//  Autor: Fabio Jeri Alejos
// ─────────────────────────────────────────────────────────────

const C = {
  ink: "#1B2A33",        // texto principal
  petrol: "#0E5E6F",     // primario
  petrolSoft: "#E3EEF0", // fondo primario suave
  teal: "#2D9596",
  amber: "#E8A33D",      // advertencia
  red: "#C94444",        // crítico
  paper: "#F5F7F6",      // fondo
  line: "#DEE5E3",       // bordes
  mute: "#6B7C82",       // texto secundario
};

// ── Datos ficticios por carrera ──────────────────────────────
const CARRERAS = ["Todas", "Ing. Mecatrónica", "Ing. Informática", "Ing. Industrial", "Arquitectura"];

const MATRICULA = [
  { sem: "2023-II", "Ing. Mecatrónica": 412, "Ing. Informática": 538, "Ing. Industrial": 487, "Arquitectura": 356 },
  { sem: "2024-I",  "Ing. Mecatrónica": 428, "Ing. Informática": 561, "Ing. Industrial": 479, "Arquitectura": 348 },
  { sem: "2024-II", "Ing. Mecatrónica": 445, "Ing. Informática": 590, "Ing. Industrial": 492, "Arquitectura": 361 },
  { sem: "2025-I",  "Ing. Mecatrónica": 451, "Ing. Informática": 624, "Ing. Industrial": 503, "Arquitectura": 370 },
  { sem: "2025-II", "Ing. Mecatrónica": 468, "Ing. Informática": 652, "Ing. Industrial": 511, "Arquitectura": 365 },
  { sem: "2026-I",  "Ing. Mecatrónica": 482, "Ing. Informática": 689, "Ing. Industrial": 524, "Arquitectura": 379 },
];

const NOTAS = {
  "Ing. Mecatrónica": [14, 32, 58, 96, 138, 102, 42],
  "Ing. Informática": [22, 41, 79, 142, 198, 154, 53],
  "Ing. Industrial":  [11, 29, 64, 118, 161, 108, 33],
  "Arquitectura":     [9, 24, 47, 88, 121, 71, 19],
};
const RANGOS = ["0–5", "6–8", "9–10", "11–12", "13–14", "15–16", "17–20"];

const DOCENTES = {
  "Ing. Mecatrónica": [
    { doc: "R. Salcedo", horas: 18, max: 20 }, { doc: "M. Quispe", horas: 16, max: 20 },
    { doc: "L. Paredes", horas: 21, max: 20 }, { doc: "A. Bustamante", horas: 12, max: 16 },
    { doc: "C. Villar", horas: 14, max: 20 },
  ],
  "Ing. Informática": [
    { doc: "P. Cárdenas", horas: 20, max: 20 }, { doc: "S. Mendívil", horas: 17, max: 20 },
    { doc: "J. Rosales", horas: 22, max: 20 }, { doc: "N. Aguirre", horas: 15, max: 16 },
    { doc: "E. Chávez", horas: 11, max: 16 },
  ],
  "Ing. Industrial": [
    { doc: "G. Torres", horas: 19, max: 20 }, { doc: "F. Aliaga", horas: 14, max: 20 },
    { doc: "V. Espino", horas: 16, max: 16 }, { doc: "D. Lazo", horas: 13, max: 20 },
    { doc: "H. Cuba", horas: 10, max: 16 },
  ],
  "Arquitectura": [
    { doc: "I. Montoya", horas: 17, max: 20 }, { doc: "B. Falcón", horas: 15, max: 20 },
    { doc: "T. Reátegui", horas: 12, max: 16 }, { doc: "K. Ormeño", horas: 18, max: 20 },
    { doc: "W. Dávila", horas: 9, max: 16 },
  ],
};

const RIESGO = [
  { cod: "20210334", nombre: "Valeria Huamán C.", carrera: "Ing. Informática", prom: 8.4, inasist: 32, nivel: "Crítico" },
  { cod: "20190882", nombre: "Bruno Ttito M.", carrera: "Ing. Mecatrónica", prom: 9.1, inasist: 25, nivel: "Crítico" },
  { cod: "20221045", nombre: "Camila Esquivel R.", carrera: "Ing. Industrial", prom: 10.2, inasist: 18, nivel: "Alto" },
  { cod: "20200517", nombre: "Diego Pareja L.", carrera: "Arquitectura", prom: 10.6, inasist: 21, nivel: "Alto" },
  { cod: "20230229", nombre: "Fiorella Anchante S.", carrera: "Ing. Informática", prom: 10.8, inasist: 15, nivel: "Alto" },
  { cod: "20211190", nombre: "Renzo Ucañán P.", carrera: "Ing. Mecatrónica", prom: 11.3, inasist: 14, nivel: "Medio" },
  { cod: "20190406", nombre: "Lucía Carbajal V.", carrera: "Ing. Industrial", prom: 11.6, inasist: 12, nivel: "Medio" },
];

const SERIES_COLOR = {
  "Ing. Mecatrónica": C.petrol, "Ing. Informática": C.teal,
  "Ing. Industrial": C.amber, "Arquitectura": "#8C6BAE",
};

// ── Componentes ──────────────────────────────────────────────
const Card = ({ children, span }) => (
  <div className="rounded-xl bg-white p-5" style={{ border: `1px solid ${C.line}`, gridColumn: span }}>
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon size={15} style={{ color: C.petrol }} />
    <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: C.mute }}>{children}</h2>
  </div>
);

const Kpi = ({ label, value, delta, deltaUp }) => (
  <Card>
    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: C.mute }}>{label}</p>
    <div className="flex items-end gap-3">
      <span className="text-3xl font-bold" style={{ color: C.ink }}>{value}</span>
      <span className="text-xs font-semibold mb-1 px-2 py-0.5 rounded-full"
        style={{ background: deltaUp ? C.petrolSoft : "#F7E8E8", color: deltaUp ? C.petrol : C.red }}>
        {deltaUp ? "▲" : "▼"} {delta}
      </span>
    </div>
  </Card>
);

const NivelBadge = ({ nivel }) => {
  const map = { "Crítico": C.red, "Alto": C.amber, "Medio": C.teal };
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: map[nivel] + "1A", color: map[nivel] }}>
      {nivel}
    </span>
  );
};

export default function DashboardAcademico() {
  const [carrera, setCarrera] = useState("Todas");

  const activas = carrera === "Todas" ? CARRERAS.slice(1) : [carrera];

  const kpis = useMemo(() => {
    const ult = MATRICULA[MATRICULA.length - 1], prev = MATRICULA[MATRICULA.length - 2];
    const tot = activas.reduce((s, c) => s + ult[c], 0);
    const totPrev = activas.reduce((s, c) => s + prev[c], 0);
    const docentes = activas.reduce((s, c) => s + DOCENTES[c].length, 0) * 6; // factor demo
    const notas = activas.flatMap(c => NOTAS[c]);
    const aprob = activas.reduce((s, c) => s + NOTAS[c].slice(3).reduce((a, b) => a + b, 0), 0);
    const total = notas.reduce((a, b) => a + b, 0);
    return {
      estudiantes: tot.toLocaleString("es-PE"),
      deltaMat: (((tot - totPrev) / totPrev) * 100).toFixed(1) + "%",
      docentes,
      promedio: (12.1 + activas.length * 0.18).toFixed(1),
      aprobacion: ((aprob / total) * 100).toFixed(1) + "%",
    };
  }, [carrera]);

  const dataNotas = RANGOS.map((r, i) => ({
    rango: r,
    alumnos: activas.reduce((s, c) => s + NOTAS[c][i], 0),
  }));

  const dataDocentes = activas.flatMap(c => DOCENTES[c])
    .sort((a, b) => b.horas - a.horas).slice(0, 8)
    .map(d => ({ ...d, pct: Math.round((d.horas / d.max) * 100) }));

  const riesgoFiltrado = RIESGO.filter(r => carrera === "Todas" || r.carrera === carrera);

  const dataEstado = [
    { name: "Regular", value: 82, color: C.petrol },
    { name: "Riesgo medio", value: 11, color: C.teal },
    { name: "Riesgo alto", value: 5, color: C.amber },
    { name: "Crítico", value: 2, color: C.red },
  ];

  return (
    <div className="min-h-screen" style={{ background: C.paper, color: C.ink, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      {/* Header */}
      <header className="px-6 py-4 flex flex-wrap items-center justify-between gap-3"
        style={{ background: C.petrol }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: "rgba(255,255,255,.15)", color: "white" }}>UA</div>
          <div>
            <h1 className="text-white font-semibold leading-tight">Dashboard de Gestión Académica</h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,.7)" }}>
              Universidad Andina del Pacífico · Demo con datos ficticios
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: "rgba(255,255,255,.15)", color: "white" }}>Semestre 2026-I</span>
          <select value={carrera} onChange={e => setCarrera(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer"
            style={{ background: "white", color: C.ink, border: "none" }}>
            {CARRERAS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </header>

      <main className="p-6 grid gap-4" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
        {/* KPIs */}
        <div className="grid gap-4" style={{ gridColumn: "span 12", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <Kpi label="Matriculados" value={kpis.estudiantes} delta={kpis.deltaMat} deltaUp />
          <Kpi label="Docentes activos" value={kpis.docentes} delta="2 nuevos" deltaUp />
          <Kpi label="Promedio general" value={kpis.promedio} delta="0.3 pts" deltaUp />
          <Kpi label="Tasa de aprobación" value={kpis.aprobacion} delta="1.2%" deltaUp />
        </div>

        {/* Matrícula */}
        <Card span="span 7">
          <SectionTitle icon={TrendingUp}>Evolución de matrícula</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MATRICULA}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} />
              <XAxis dataKey="sem" tick={{ fontSize: 11, fill: C.mute }} />
              <YAxis tick={{ fontSize: 11, fill: C.mute }} width={36} />
              <Tooltip />
              {activas.map(c => (
                <Area key={c} type="monotone" dataKey={c} stackId="1"
                  stroke={SERIES_COLOR[c]} fill={SERIES_COLOR[c]} fillOpacity={0.55} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Estado del alumnado */}
        <Card span="span 5">
          <SectionTitle icon={Users}>Estado del alumnado</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={dataEstado} dataKey="value" nameKey="name"
                innerRadius={55} outerRadius={85} paddingAngle={2}>
                {dataEstado.map(d => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Tooltip formatter={v => v + "%"} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Distribución de notas */}
        <Card span="span 6">
          <SectionTitle icon={GraduationCap}>Distribución de notas (vigesimal)</SectionTitle>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={dataNotas}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
              <XAxis dataKey="rango" tick={{ fontSize: 11, fill: C.mute }} />
              <YAxis tick={{ fontSize: 11, fill: C.mute }} width={36} />
              <Tooltip />
              <Bar dataKey="alumnos" radius={[5, 5, 0, 0]}>
                {dataNotas.map((d, i) => (
                  <Cell key={i} fill={i < 3 ? C.red : i < 4 ? C.amber : C.petrol}
                    fillOpacity={i < 3 ? 0.75 : 1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs mt-1" style={{ color: C.mute }}>
            Rojo: desaprobados · Ámbar: zona límite · Verde petróleo: aprobados
          </p>
        </Card>

        {/* Carga lectiva */}
        <Card span="span 6">
          <SectionTitle icon={BookOpen}>Carga lectiva por docente (hrs/semana)</SectionTitle>
          <div className="space-y-3 pt-1">
            {dataDocentes.map(d => (
              <div key={d.doc} className="flex items-center gap-3">
                <span className="text-sm w-28 shrink-0 truncate font-medium">{d.doc}</span>
                <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: C.petrolSoft }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: Math.min(d.pct, 100) + "%",
                      background: d.pct > 100 ? C.red : d.pct >= 90 ? C.amber : C.petrol,
                    }} />
                </div>
                <span className="text-xs w-20 text-right tabular-nums" style={{ color: d.pct > 100 ? C.red : C.mute }}>
                  {d.horas}/{d.max} hrs {d.pct > 100 && "⚠"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: C.mute }}>
            ⚠ Sobrecarga: docentes por encima del máximo permitido por categoría
          </p>
        </Card>

        {/* Alumnos en riesgo */}
        <Card span="span 12">
          <SectionTitle icon={AlertTriangle}>Alumnos en riesgo académico</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: C.mute }} className="text-left text-xs uppercase tracking-wider">
                  <th className="py-2 pr-4 font-semibold">Código</th>
                  <th className="py-2 pr-4 font-semibold">Estudiante</th>
                  <th className="py-2 pr-4 font-semibold">Carrera</th>
                  <th className="py-2 pr-4 font-semibold text-right">Promedio</th>
                  <th className="py-2 pr-4 font-semibold text-right">Inasistencia</th>
                  <th className="py-2 font-semibold">Nivel</th>
                </tr>
              </thead>
              <tbody>
                {riesgoFiltrado.map(r => (
                  <tr key={r.cod} style={{ borderTop: `1px solid ${C.line}` }}>
                    <td className="py-2.5 pr-4 tabular-nums" style={{ color: C.mute }}>{r.cod}</td>
                    <td className="py-2.5 pr-4 font-medium">{r.nombre}</td>
                    <td className="py-2.5 pr-4">{r.carrera}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums font-semibold"
                      style={{ color: r.prom < 10.5 ? C.red : C.ink }}>{r.prom}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">{r.inasist}%</td>
                    <td className="py-2.5"><NivelBadge nivel={r.nivel} /></td>
                  </tr>
                ))}
                {riesgoFiltrado.length === 0 && (
                  <tr><td colSpan={6} className="py-6 text-center" style={{ color: C.mute }}>
                    Sin alumnos en riesgo para esta carrera
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-xs text-center pb-2" style={{ gridColumn: "span 12", color: C.mute }}>
          Demo de portafolio · Datos 100% ficticios · Desarrollado por Fabio Jeri Alejos — React + Recharts
        </p>
      </main>
    </div>
  );
}
