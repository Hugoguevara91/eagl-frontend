import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BRAND } from "../../config/brand";
import { useAuth } from "../../context/AuthContext";
import { fetchActiveOsTemplate, fetchOsDetail } from "../../services/osService";
import { osPrintTokens as tokens } from "../../theme/osPrintTokens";

const fallbackTemplate = {
  name: "Modelo OS A4",
  sections: [
    {
      key: "cliente",
      title: "Informações do cliente",
      fields: [
        { key: "clienteNome", label: "Cliente" },
        { key: "clienteDocumento", label: "CPF/CNPJ", hideIfEmpty: true },
        { key: "clienteContato", label: "Contato" },
        { key: "clienteEndereco", label: "Endereço" },
        { key: "clienteContrato", label: "Contrato/Obra" },
      ],
    },
    {
      key: "atividade",
      title: "Informações da atividade",
      fields: [
        { key: "status", label: "Status" },
        { key: "prioridade", label: "Prioridade" },
        { key: "checkinAt", label: "Check-in" },
        { key: "checkoutAt", label: "Check-out" },
        { key: "responsavel", label: "Responsável" },
      ],
    },
    {
      key: "equipamento",
      title: "Equipamento / Questionário",
      fields: [
        { key: "assetTag", label: "Tag / Ativo" },
        { key: "assetName", label: "Equipamento" },
        { key: "questionario", label: "Questionário" },
      ],
    },
  ],
  checklist: { title: "Checklist" },
  attachments: { title: "Anexos" },
  observations: { title: "Observações" },
};

const bandLeftLabel = "Cliente";
const bandRightLabel = "OS / Tarefa";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function OSPrintPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [template, setTemplate] = useState(fallbackTemplate);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      if (!token || !id) return;
      try {
        setLoading(true);
        const [detail, tpl] = await Promise.all([
          fetchOsDetail(id, token),
          fetchActiveOsTemplate(token).catch(() => null),
        ]);
        setData(detail);
        if (tpl?.template?.jsonSchema) {
          setTemplate(tpl.template.jsonSchema);
        }
      } catch (err) {
        setError(err?.message || "Não foi possível carregar a OS.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, token]);

  const normalized = useMemo(() => {
    const os = data?.os ?? {};
    const client = data?.client ?? {};
    const asset = data?.asset ?? {};
    const questionnaire = data?.questionnaire ?? {};
    const answers = data?.answers ?? [];
    const attachments = data?.attachments ?? [];
    return {
      os,
      client,
      asset,
      questionnaire,
      answers,
      attachments,
    };
  }, [data]);

  const renderFieldValue = (key) => {
    const { os, client, asset, questionnaire } = normalized;
    const map = {
      clienteNome: client.nome || os.clienteNome || "-",
      clienteDocumento: client.documento || client.cnpj || client.cpf || "",
      clienteContato: client.contato || client.telefone || client.email || "",
      clienteEndereco: client.endereco || "",
      clienteContrato: client.contrato || "",
      status: os.status || "-",
      prioridade: os.prioridade || "-",
      checkinAt: formatDate(os.checkinAt),
      checkoutAt: formatDate(os.checkoutAt),
      responsavel: os.createdBy || "-",
      assetTag: asset.tag || asset.serialNumber || "-",
      assetName: asset.name || "-",
      questionario: questionnaire.name || "-",
    };
    return map[key] ?? os[key] ?? client[key] ?? "-";
  };

  const renderSection = (section) => {
    const fields = section.fields || [];
    return (
      <div key={section.key} className="section">
        <div className="section-title">{section.title}</div>
        <table className="info-table">
          <tbody>
            {fields
              .filter((f) => {
                if (!f.hideIfEmpty) return true;
                const value = renderFieldValue(f.key);
                return value && value !== "-";
              })
              .map((field) => (
                <tr key={field.key}>
                  <th>{field.label}</th>
                  <td>{renderFieldValue(field.key)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  const checklistRows = normalized.answers.map((a, idx) => ({
    id: a.id || idx,
    question: a.question || a.questionLabel || a.questionId || `Pergunta ${idx + 1}`,
    answer: a.answerText || a.value || "-",
  }));

  const handleDownloadPdf = async () => {
    if (!pageRef.current) return;
    try {
      setDownloading(true);
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const imgProps = {
        width: pageWidth,
        height: (canvas.height * pageWidth) / canvas.width,
      };
      pdf.addImage(imgData, "PNG", 0, 0, imgProps.width, imgProps.height);
      pdf.save(`os-${normalized.os.id || "documento"}.pdf`);
    } catch (err) {
      console.error(err);
      setError("Falha ao gerar PDF. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="os-print">
      <style>{`
        @page { size: A4; margin: 12mm; }
        @media print {
          body { background: white; }
          .print-actions { display: none; }
          .page { box-shadow: none; margin: 0; }
        }
        .os-print {
          background: #e5ebf5;
          min-height: 100vh;
          padding: 24px;
          font-family: ${tokens.fontFamily};
          color: ${tokens.text};
        }
        .print-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }
        .print-actions button {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid ${tokens.border};
          background: white;
          cursor: pointer;
          font-weight: 600;
          color: ${tokens.text};
        }
        .page {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          padding: 18mm 16mm;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .header {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          border: 1px solid ${tokens.border};
          background: ${tokens.headerBg};
          color: #e8f6ff;
          border-radius: 10px;
        }
        .header img {
          max-height: 46px;
          width: auto;
          object-fit: contain;
          background: rgba(255,255,255,0.04);
          padding: 8px 10px;
          border-radius: 8px;
        }
        .header .brand {
          font-weight: 700;
          font-size: 18px;
        }
        .header .meta {
          font-size: 12px;
          color: #c8d8e8;
        }
        .header .os-id {
          margin-left: auto;
          text-align: right;
          font-weight: 700;
          font-size: 16px;
          color: ${tokens.headerAccent};
        }
        .band {
          display: grid;
          grid-template-columns: 1fr 0.5fr;
          background: ${tokens.tableHeaderBg};
          color: #e8f6ff;
          border: 1px solid ${tokens.border};
          border-radius: 10px;
          overflow: hidden;
        }
        .band .cell {
          padding: 10px 12px;
          border-right: 1px solid ${tokens.border};
        }
        .band .cell:last-child { border-right: none; }
        .band .label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #bcd3e8;
        }
        .band .value {
          font-weight: 700;
          font-size: 15px;
          color: #f2fbff;
        }
        .section {
          border: 1px solid ${tokens.border};
          border-radius: 10px;
          overflow: hidden;
          background: ${tokens.surface};
          page-break-inside: avoid;
        }
        .section-title {
          background: ${tokens.tableHeaderBg};
          color: #e8f6ff;
          padding: 10px 12px;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.05em;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
        }
        .info-table th {
          width: 32%;
          text-align: left;
          padding: 8px 12px;
          background: #eef3f8;
          font-weight: 700;
          color: ${tokens.muted};
          border-bottom: 1px solid #dfe7f1;
          border-right: 1px solid #dfe7f1;
        }
        .info-table td {
          padding: 8px 12px;
          color: ${tokens.text};
          border-bottom: 1px solid #dfe7f1;
        }
        .checklist-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6px;
        }
        .checklist-table th,
        .checklist-table td {
          border: 1px solid #dfe4ec;
          padding: 8px 10px;
          vertical-align: top;
        }
        .checklist-table th {
          background: ${tokens.tableHeaderBg};
          color: #e8f6ff;
          font-size: 13px;
        }
        .attachments {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
          padding: 12px;
        }
        .attachment {
          border: 1px solid #dfe4ec;
          border-radius: 10px;
          overflow: hidden;
          page-break-inside: avoid;
          background: white;
        }
        .attachment img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          display: block;
        }
        .attachment .caption {
          padding: 8px 10px;
          font-size: 12px;
          color: ${tokens.text};
        }
        .observations {
          padding: 12px;
          background: white;
          min-height: 60px;
          color: ${tokens.text};
        }
        .badge {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 8px;
          background: rgba(0, 200, 255, 0.1);
          border: 1px solid rgba(0, 200, 255, 0.35);
          color: ${tokens.headerAccent};
          font-weight: 700;
          font-size: 12px;
        }
      `}</style>

      <div className="print-actions">
        <button onClick={() => window.print()}>Imprimir</button>
        <button onClick={handleDownloadPdf} disabled={downloading}>
          {downloading ? "Gerando PDF..." : "Baixar PDF"}
        </button>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : error ? (
        <div className="badge" style={{ background: "rgba(252, 165, 165, 0.2)", color: "#b91c1c" }}>
          {error}
        </div>
      ) : (
        <div className="page" ref={pageRef}>
          <div className="header">
            {BRAND.logo ? <img src={BRAND.logo} alt={BRAND.name} /> : null}
            <div>
              <div className="brand">{BRAND.name ?? "EAGL"}</div>
              <div className="meta">{BRAND.domain ?? "eagl.com.br"}</div>
            </div>
            <div className="os-id">
              <div>{normalized.os.id || "-"}</div>
              <div style={{ fontSize: 12, color: "#9cc8ff" }}>{normalized.os.status || ""}</div>
            </div>
          </div>

          <div className="band">
            <div className="cell">
              <div className="label">{bandLeftLabel}</div>
              <div className="value">{normalized.client.nome || normalized.os.clienteNome || "-"}</div>
            </div>
            <div className="cell">
              <div className="label">{bandRightLabel}</div>
              <div className="value">{normalized.os.id || "-"}</div>
            </div>
          </div>

          {(template.sections || fallbackTemplate.sections).map((section) => renderSection(section))}

          <div className="section">
            <div className="section-title">
              {template.checklist?.title || fallbackTemplate.checklist.title}
            </div>
            <table className="checklist-table">
              <thead>
                <tr>
                  <th style={{ width: "55%" }}>Pergunta</th>
                  <th>Resposta</th>
                </tr>
              </thead>
              <tbody>
                {checklistRows.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center", color: tokens.muted }}>
                      Sem respostas registradas.
                    </td>
                  </tr>
                ) : (
                  checklistRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.question}</td>
                      <td>{row.answer}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="section">
            <div className="section-title">
              {template.attachments?.title || fallbackTemplate.attachments.title}
            </div>
            <div className="attachments">
              {normalized.attachments.length === 0 ? (
                <div style={{ color: tokens.muted, fontSize: 13 }}>Nenhum anexo.</div>
              ) : (
                normalized.attachments.map((att, idx) => (
                  <div className="attachment" key={att.id || idx}>
                    {att.url ? <img src={att.url} alt={att.caption || `Anexo ${idx + 1}`} /> : null}
                    <div className="caption">{att.caption || `Anexo ${idx + 1}`}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="section">
            <div className="section-title">
              {template.observations?.title || fallbackTemplate.observations.title}
            </div>
            <div className="observations">
              {normalized.os.narrative || normalized.os.descricao || "Sem observações adicionais."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
