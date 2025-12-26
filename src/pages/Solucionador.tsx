import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layout/AppShell";

type Draft = {
  cliente: string;
  ativo: string;
  sintoma: string;
  urgencia: "Baixa" | "Média" | "Alta" | "Crítica";
  logs: string;
  tentativas: string;
};

const urgenciaTone: Record<Draft["urgencia"], string> = {
  Baixa: "text-slate-200 bg-white/5 border-white/10",
  Média: "text-cyan-200 bg-cyan-500/10 border-cyan-500/30",
  Alta: "text-amber-200 bg-amber-500/10 border-amber-500/30",
  Crítica: "text-pink-100 bg-pink-500/10 border-pink-500/30",
};

function buildChecklist(d: Draft) {
  const base = [
    "Confirmar escopo e impacto (área afetada, usuários, SLA).",
    "Validar segurança e bloqueios (NR-10/LOTO quando aplicável).",
    "Coletar evidências: fotos, leituras, alarmes, data/hora, condições do ambiente.",
    "Checar histórico recente: OS anteriores, peças trocadas, tendências.",
    "Isolar variável: energia, comunicação, sensores, comando, atuadores.",
    "Definir ação imediata: contingência / mitigação / parada segura.",
    "Definir próxima etapa: diagnóstico aprofundado + peças + janela de manutenção.",
  ];

  const hvacHints: string[] = [];
  const s = (d.sintoma + " " + d.logs).toLowerCase();

  if (s.includes("alarme") || s.includes("falha")) {
    hvacHints.push("Mapear alarmes por código e confirmar ocorrência no BMS/controle local.");
  }
  if (s.includes("pressão") || s.includes("pressao") || s.includes("psi") || s.includes("bar")) {
    hvacHints.push("Registrar pressões (sucção/descarga) e comparar com condições de carga/ambiente.");
  }
  if (s.includes("temperatura") || s.includes("delta") || s.includes("superaquec")) {
    hvacHints.push("Registrar temperaturas (retorno/suprimento), Delta-T, superaquecimento/sub-resfriamento (se aplicável).");
  }
  if (s.includes("comunica") || s.includes("modbus") || s.includes("rs485")) {
    hvacHints.push("Checar rede (terminação, polaridade, aterramento, ruído), endereço e baud rate.");
  }
  if (s.includes("vibra") || s.includes("ruído") || s.includes("ruido")) {
    hvacHints.push("Checar vibração/ruído: rolamentos, desalinhamento, suportes, fixações, balanceamento.");
  }

  return [...base, ...(hvacHints.length ? ["--- Pontos específicos (detectados pelo texto) ---", ...hvacHints] : [])];
}

export default function Solucionador() {
  const nav = useNavigate();

  const [draft, setDraft] = useState<Draft>({
    cliente: "",
    ativo: "",
    sintoma: "",
    urgencia: "Média",
    logs: "",
    tentativas: "",
  });

  const [checklist, setChecklist] = useState<string[]>([]);
  const [msg, setMsg] = useState<string>("");

  const canGenerate = useMemo(() => {
    return draft.sintoma.trim().length >= 8;
  }, [draft.sintoma]);

  const payload = useMemo(() => {
    return {
      tipo: "INCIDENTE_DIAGNOSTICO",
      cliente: draft.cliente || null,
      ativo: draft.ativo || null,
      urgencia: draft.urgencia,
      sintoma: draft.sintoma,
      tentativas: draft.tentativas || null,
      logs: draft.logs || null,
      geradoEm: new Date().toISOString(),
      observacao: "Sem IA: rascunho local para colar em OS ou enviar ao backend.",
    };
  }, [draft]);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setMsg("Copiado para a área de transferência.");
      setTimeout(() => setMsg(""), 2000);
    } catch {
      setMsg("Falha ao copiar. Seu navegador bloqueou.");
      setTimeout(() => setMsg(""), 2500);
    }
  }

  function gerarChecklist() {
    const list = buildChecklist(draft);
    setChecklist(list);
    setMsg("Checklist gerado (local).");
    setTimeout(() => setMsg(""), 2000);
  }

  function limpar() {
    setDraft({
      cliente: "",
      ativo: "",
      sintoma: "",
      urgencia: "Média",
      logs: "",
      tentativas: "",
    });
    setChecklist([]);
    setMsg("");
  }

  function criarOS() {
    // Ajuste se você tiver rota /app/os/nova
    const q = new URLSearchParams();
    if (draft.cliente) q.set("cliente", draft.cliente);
    if (draft.ativo) q.set("ativo", draft.ativo);
    q.set("urgencia", draft.urgencia);
    nav(`/app/os?${q.toString()}`);
  }

  return (
    <AppShell title="Solucionador de problemas">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">Triagem rápida</div>
                <p className="mt-1 text-sm text-slate-400">
                  Preencha o mínimo para gerar checklist e preparar conteúdo para OS. IA entra depois.
                </p>
              </div>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${urgenciaTone[draft.urgencia]}`}>
                {draft.urgencia}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block">
                <div className="text-xs font-semibold text-slate-300">Cliente</div>
                <input
                  value={draft.cliente}
                  onChange={(e) => setDraft((p) => ({ ...p, cliente: e.target.value }))}
                  placeholder="Ex: Meta SP"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/40"
                />
              </label>

              <label className="block">
                <div className="text-xs font-semibold text-slate-300">Ativo</div>
                <input
                  value={draft.ativo}
                  onChange={(e) => setDraft((p) => ({ ...p, ativo: e.target.value }))}
                  placeholder="Ex: Chiller 01"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/40"
                />
              </label>

              <label className="block md:col-span-2">
                <div className="text-xs font-semibold text-slate-300">Sintoma</div>
                <textarea
                  value={draft.sintoma}
                  onChange={(e) => setDraft((p) => ({ ...p, sintoma: e.target.value }))}
                  placeholder="Descreva o problema com objetividade. Ex: VRF com alarme X, baixa capacidade, ΔT caiu..."
                  rows={3}
                  className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/40"
                />
                <div className="mt-1 text-xs text-slate-500">Mínimo recomendado: 1–2 frases claras.</div>
              </label>

              <label className="block">
                <div className="text-xs font-semibold text-slate-300">Urgência</div>
                <select
                  value={draft.urgencia}
                  onChange={(e) => setDraft((p) => ({ ...p, urgencia: e.target.value as Draft["urgencia"] }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/40"
                >
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                  <option>Crítica</option>
                </select>
              </label>

              <label className="block">
                <div className="text-xs font-semibold text-slate-300">Ações já tentadas</div>
                <input
                  value={draft.tentativas}
                  onChange={(e) => setDraft((p) => ({ ...p, tentativas: e.target.value }))}
                  placeholder="Ex: reset, troca filtro, reaperto..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/40"
                />
              </label>

              <label className="block md:col-span-2">
                <div className="text-xs font-semibold text-slate-300">Logs / leituras</div>
                <textarea
                  value={draft.logs}
                  onChange={(e) => setDraft((p) => ({ ...p, logs: e.target.value }))}
                  placeholder="Cole leituras, alarmes, medições, timestamps. Ex: sucção 58 psi, descarga 250 psi..."
                  rows={4}
                  className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/40"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={gerarChecklist}
                disabled={!canGenerate}
                className="rounded-xl bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-500/30 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Gerar checklist
              </button>

              <button
                onClick={copyToClipboard}
                className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/10"
              >
                Copiar para OS
              </button>

              <button
                onClick={criarOS}
                className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/10"
              >
                Criar OS
              </button>

              <button
                onClick={limpar}
                className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/10"
              >
                Limpar
              </button>

              <button
                onClick={() => nav("/app/configuracoes")}
                className="ml-auto rounded-xl bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-100 ring-1 ring-pink-500/30 transition hover:bg-pink-500/15"
              >
                Configurar IA
              </button>
            </div>

            {msg ? (
              <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-300">
                {msg}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/5">
            <div className="text-sm font-semibold text-white">Payload para OS</div>
            <p className="mt-1 text-sm text-slate-400">
              Isso aqui é o que você vai enviar pro backend depois (ou colar na OS agora).
            </p>
            <pre className="mt-3 max-h-64 overflow-auto rounded-xl border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-200">
{JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/5">
            <div className="text-sm font-semibold text-white">Checklist de diagnóstico</div>
            <p className="mt-1 text-sm text-slate-400">
              Gerado localmente. Quando plugar OpenAI, esse bloco vira “plano guiado + perguntas”.
            </p>

            {checklist.length ? (
              <div className="mt-4 space-y-2">
                {checklist.map((item, idx) => (
                  <div
                    key={`${idx}-${item}`}
                    className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-4 text-sm text-slate-400">
                Preencha o sintoma e clique em <span className="text-slate-200">Gerar checklist</span>.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-cyan-500/5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">Status do conector OpenAI</div>
                <p className="mt-1 text-sm text-slate-400">
                  Ainda não implementado. Próximo passo: endpoint backend + chave por ambiente + rate limit + auditoria.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                Desconectado
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <div className="text-xs font-semibold text-slate-300">Modo</div>
                <div className="mt-1 text-sm text-white">Somente triagem (local)</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <div className="text-xs font-semibold text-slate-300">Próximo</div>
                <div className="mt-1 text-sm text-white">Perguntas guiadas + plano</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
