import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Activity,
  Cpu,
  Radar,
  Boxes,
  PlugZap,
  FileText,
  Wrench,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const LOGO_SRC = "/assets/eagl-logo.svg";

const COLORS = {
  bg: "#0A0A0A",
  cyan: "#00CFFF",
  green: "#15FF8C",
  magenta: "#FF1579",
  muted: "rgba(255,255,255,0.65)",
};

export default function LandingEAGL() {
  const availability = [
    { m: "Jan", v: 96 },
    { m: "Fev", v: 97 },
    { m: "Mar", v: 98 },
    { m: "Abr", v: 97 },
    { m: "Mai", v: 98 },
    { m: "Jun", v: 99 },
  ];

  const pie = [
    { name: "Operando", value: 72 },
    { name: "Em risco", value: 21 },
    { name: "Crítico", value: 7 },
  ];

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src={LOGO_SRC} className="h-8" />
            <div>
              <div className="font-semibold">EAGL</div>
              <div className="text-xs text-white/60">
                Tecnologia aplicada à manutenção e engenharia
              </div>
            </div>
          </div>
          <a
            href="#contato"
            className="px-4 py-2 rounded-xl font-semibold text-black"
            style={{ background: COLORS.cyan }}
          >
            Agendar demo
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-2 gap-12">
        <div>
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(0,207,255,0.15)", color: COLORS.cyan }}
          >
            Manutenção inteligente
          </span>

          <h1 className="text-4xl font-semibold leading-tight">
            Controle absoluto de ativos críticos, com inteligência e
            previsibilidade
          </h1>

          <p className="mt-4 text-white/70">
            EAGL. Tecnologia aplicada à manutenção e engenharia. Dados,
            telemetria e execução em campo em um único cockpit operacional.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="#contato"
              className="px-5 py-3 rounded-xl font-semibold text-black"
              style={{ background: COLORS.cyan }}
            >
              Agendar demo
            </a>
            <a
              href="#"
              className="px-5 py-3 rounded-xl border border-white/20"
            >
              Ver módulos
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex gap-2">
              <CheckCircle2 style={{ color: COLORS.green }} />
              <span>Decisão por risco</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 style={{ color: COLORS.cyan }} />
              <span>Rastreabilidade total</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="text-sm font-semibold mb-2">Mini cockpit EAGL</div>

            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={availability}>
                  <XAxis dataKey="m" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={COLORS.cyan}
                    fill="rgba(0,207,255,0.2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" innerRadius={45} outerRadius={70}>
                    <Cell fill={COLORS.green} />
                    <Cell fill={COLORS.magenta} />
                    <Cell fill={COLORS.cyan} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </section>

      <footer
        id="contato"
        className="border-t border-white/10 py-10 text-center text-white/60"
      >
        EAGL • Tecnologia aplicada à manutenção e engenharia
      </footer>
    </div>
  );
}
