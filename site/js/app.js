// Montagem do painel: regras de cálculo (PDTI 7.3), filtro de mês e visuais.

(() => {
  const D = DATA;
  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const COR = { ok: "#2e7d4f", warn: "#d08c00", bad: "#c0392b", info: "#4f7fb0", none: "#a19f9d" };
  const SIT = {
    "Atendido": "ok", "Em atenção": "warn", "Não atendido": "bad", "Sem meta": "none", "Sem medição": "none",
    "Concluído": "ok", "Em dia": "info", "Atrasado": "bad"
  };
  const FAIXA_COR = { Baixo: "#dcebd9", Médio: "#fbebc2", Alto: "#f8d2a8", Crítico: "#f2b8b5" };

  const state = { mes: D.meses[D.meses.length - 1], ind: "IND01" };

  // ---------- utilitários ----------
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const parse = iso => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d || 1); };
  const eom = ym => { const [y, m] = ym.split("-").map(Number); return new Date(y, m, 0); };
  const mesLabel = ym => MESES[+ym.slice(5) - 1] + "/" + ym.slice(0, 4);
  const fmtDate = iso => { const [y, m, d] = iso.split("-"); return `${d}/${m}/${y.slice(2)}`; };
  const fmtD = dt => `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
  const num = (v, dec = 2) => v.toLocaleString("pt-BR", { maximumFractionDigits: dec });
  const pct = v => (v * 100).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";
  const ref = () => eom(state.mes);
  const status = s => `<span class="status st-${SIT[s] || "none"}">${esc(s)}</span>`;
  const un = u => (u === "horas" ? "h" : u);

  // ---------- regras ----------
  const valor = m => (m.total ? m.medido / m.total : m.medido);
  const ind = id => D.indicadores.find(i => i.id === id);
  const medsDe = id => D.medicoes.filter(m => m.ind === id).sort((a, b) => a.mes.localeCompare(b.mes));
  const medAte = id => medsDe(id).filter(m => m.mes <= state.mes).pop() || null;
  const fmtValor = (i, v) => (i.unidade === "%" ? pct(v) : num(v) + " " + un(i.unidade));
  function textoMeta(i) {
    if (i.meta === null) return "a definir";
    return `${i.sentido === "maior" ? "≥" : "≤"} ${i.unidade === "%" ? Math.round(i.meta * 100) + "%" : num(i.meta) + " " + un(i.unidade)}`;
  }

  // PDTI, seção 7.3: Atendido = alcançou a meta; Em atenção = abaixo da meta com prazo ainda vigente;
  // Não atendido = abaixo da meta com prazo vencido (ou meta mensal); Sem meta = meta não definida.
  function situacao(i, m) {
    if (!m) return "Sem medição";
    if (i.meta === null) return "Sem meta";
    const v = valor(m);
    if (i.sentido === "maior" ? v >= i.meta - 1e-9 : v <= i.meta + 1e-9) return "Atendido";
    if (i.prazo && parse(i.prazo) > eom(m.mes)) return "Em atenção";
    return "Não atendido";
  }
  const sitAtual = i => situacao(i, medAte(i.id));
  function marcoSit(k) {
    if (k.conclusao && parse(k.conclusao) <= ref()) return "Concluído";
    return parse(k.prazo) < ref() ? "Atrasado" : "Em dia";
  }
  const indice = r => r.prob * r.imp;
  const faixa = x => (x >= 20 ? "Crítico" : x >= 13 ? "Alto" : x >= 6 ? "Médio" : "Baixo");

  // ---------- visuais ----------
  function visual(span, title, sub, body, foot) {
    const v = document.createElement("section");
    v.className = `visual s${span}`;
    v.innerHTML = `<div class="v-head"><div><div class="v-title">${title}</div>${sub ? `<div class="v-sub">${sub}</div>` : ""}</div></div>
      <div class="v-body"></div>${foot ? `<div class="v-foot">${foot}</div>` : ""}`;
    const b = v.querySelector(".v-body");
    if (typeof body === "string") b.innerHTML = body; else if (body) b.appendChild(body);
    return v;
  }

  function card(title, big, note, color) {
    const v = visual(3, title, "", `<div class="big" style="${color ? `color:${color}` : ""}">${big}</div><div class="note">${note}</div>`);
    v.classList.add("card");
    return v;
  }

  function table(cols, rows, { onRow, rowCls } = {}) {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    wrap.innerHTML = `<table class="tbl">
      <thead><tr>${cols.map(c => `<th class="${c.num ? "num" : ""} ${c.opt ? "opt" : ""} ${c.opt === "md" ? "opt-md" : ""}">${c.label}</th>`).join("")}</tr></thead>
      <tbody>${rows.length ? rows.map((r, i) => `<tr data-i="${i}" class="${onRow ? "clickable" : ""} ${rowCls ? rowCls(r) : ""}">${cols.map(c => `<td class="${c.num ? "num" : ""} ${c.opt ? "opt" : ""} ${c.opt === "md" ? "opt-md" : ""} ${c.cls || ""}">${c.fmt(r)}</td>`).join("")}</tr>`).join("")
        : `<tr><td colspan="${cols.length}" class="empty">Nenhum registro.</td></tr>`}</tbody>
    </table>`;
    if (onRow) wrap.querySelectorAll("tbody tr[data-i]").forEach(tr => tr.addEventListener("click", () => onRow(rows[+tr.dataset.i])));
    return wrap;
  }

  const vinculos = i => [...i.pdti.map(x => "PDTI " + x), ...i.psi.map(x => "PSI " + x), i.risco].filter(Boolean).join(" · ") || "—";

  const legenda = list => `<div class="legend">${list.map(([t, c]) => `<span><i style="background:${c}"></i>${t}</span>`).join("")}</div>`;

  function build() {
    const out = [];
    const nao = D.indicadores.filter(i => sitAtual(i) === "Não atendido").map(i => i.id);
    const crit = D.riscos.filter(r => faixa(indice(r)) === "Crítico").sort((a, b) => a.prioridade - b.prioridade);
    const atras = D.marcos.filter(k => marcoSit(k) === "Atrasado");

    // Cartões
    out.push(card("Indicadores não atendidos", `${nao.length}<small>de ${D.indicadores.length}</small>`, nao.join(" · ") || "nenhum", nao.length ? COR.bad : null));
    out.push(card("Riscos críticos", `${crit.length}<small>de ${D.riscos.length}</small>`, crit.map(r => `${r.id} (índice ${indice(r)})`).join(" · ") || "nenhum", crit.length ? COR.bad : null));
    out.push(card("Marcos atrasados", `${atras.length}<small>de ${D.marcos.length}</small>`, atras.map(k => `${k.id} (${k.risco})`).join(" · ") || "nenhum", atras.length ? COR.bad : null));
    out.push(card("Decisões propostas", String(D.decisoes.length), "aguardam registro em ata", COR.warn));

    // Indicadores (KPI_DASHBOARD)
    out.push(visual(8, "Indicadores", `Situação em ${mesLabel(state.mes)} · clique numa linha para ver a tendência`,
      table([
        { label: "ID", cls: "nowrap", opt: true, fmt: i => i.id },
        { label: "Indicador", fmt: i => esc(i.curto) },
        { label: "Valor", num: true, cls: "nowrap", fmt: i => { const m = medAte(i.id); return m ? `<b>${fmtValor(i, valor(m))}</b>` : "—"; } },
        { label: "Meta", cls: "nowrap", fmt: i => textoMeta(i) },
        { label: "Situação", fmt: i => status(sitAtual(i)) },
        { label: "Vínculos", opt: true, fmt: i => `<span class="muted">${vinculos(i)}</span>` },
        { label: "Fonte", opt: "md", fmt: i => `<span class="muted">${esc(i.fonte)}</span>` },
        { label: "Responsável", opt: true, fmt: i => esc(i.responsavel) }
      ], D.indicadores, { onRow: i => { state.ind = i.id; render(); }, rowCls: i => (i.id === state.ind ? "sel" : "") }),
      "Dados simulados (a validar). Metas e prazos: PDTI v0.1, PSI e Matriz de Riscos."));

    // Matriz de riscos (RISK_MATRIX)
    const matriz = document.createElement("div");
    matriz.className = "chart";
    matriz._draw = () => Charts.riskMatrix(matriz, {
      risks: D.riscos.map(r => ({
        id: r.id, prob: r.prob, imp: r.imp,
        tip: Charts.tipHTML(`${r.id} · ${esc(r.nome)}`, [["P × I", `${r.prob} × ${r.imp} = ${indice(r)}`], ["Faixa", faixa(indice(r))], ["Responsável", esc(r.responsavel)]])
      })),
      faixaColor: x => FAIXA_COR[faixa(x)], faixaName: faixa
    });
    const lista = D.riscos.slice().sort((a, b) => a.prioridade - b.prioridade)
      .map(r => `<div class="risk-row"><b>${r.id}</b><span>${esc(r.nome)}<br><span class="muted">${esc(r.responsavel)}</span></span><span class="tag" style="background:${FAIXA_COR[faixa(indice(r))]};border-color:transparent;color:#252423">${indice(r)} · ${faixa(indice(r))}</span></div>`).join("");
    const riscoBody = document.createElement("div");
    riscoBody.append(matriz);
    riscoBody.insertAdjacentHTML("beforeend", `<div class="risk-list">${lista}</div>`);
    out.push(visual(4, "Matriz de riscos", "Índice = probabilidade × impacto (escala 1–5)", riscoBody,
      legenda([["Baixo 1–5", FAIXA_COR.Baixo], ["Médio 6–12", FAIXA_COR.Médio], ["Alto 13–19", FAIXA_COR.Alto], ["Crítico 20–25", FAIXA_COR.Crítico]])));

    // Tendência do indicador selecionado (TIME_SERIES)
    const i = ind(state.ind);
    const meds = medsDe(i.id);
    const isPct = i.unidade === "%";
    const linha = document.createElement("div");
    linha.className = "chart";
    linha.style.height = "260px";
    linha._draw = () => Charts.line(linha, {
      labels: D.meses.map(mesLabel),
      values: D.meses.map(ym => { const x = meds.find(q => q.mes === ym); return x && ym <= state.mes ? valor(x) : null; }),
      meta: i.meta, metaLabel: "Meta " + textoMeta(i),
      fmt: v => (isPct ? pct(v) : num(v)), axisFmt: t => (isPct ? num(t * 100, 1) + "%" : num(t, 1)),
      zero: !isPct || i.base === 0, floor: isPct ? 0 : undefined,
      tips: D.meses.map(ym => { const x = meds.find(q => q.mes === ym); return x && ym <= state.mes ? Charts.tipHTML(mesLabel(ym), [["Valor", fmtValor(i, valor(x))], ["Situação", situacao(i, x)], x.obs ? ["Obs.", esc(x.obs)] : null]) : null; }),
      pointColor: k => { const x = meds.find(q => q.mes === D.meses[k]); return x ? COR[SIT[situacao(i, x)]] : COR.none; }
    });
    out.push(visual(7, `${i.id} · ${esc(i.curto)}`, `Valor por mês · linha tracejada = meta (${textoMeta(i)})`, linha,
      legenda([["Atendido", COR.ok], ["Em atenção", COR.warn], ["Não atendido", COR.bad]]) +
      `<div class="v-ctx">Periodicidade: ${esc(i.periodicidade)} · Responsável: ${esc(i.responsavel)} · Vínculos: ${vinculos(i)}${i.praticas.length ? " · Práticas: " + i.praticas.join(", ") : ""} · Fonte: ${esc(i.fonte)}</div>`));

    // Marcos pendentes
    const ordem = { "Atrasado": 0, "Em dia": 1 };
    const pend = D.marcos.filter(k => marcoSit(k) !== "Concluído").sort((a, b) => ordem[marcoSit(a)] - ordem[marcoSit(b)] || a.prazo.localeCompare(b.prazo));
    const barras = D.riscos.map(r => {
      const ks = D.marcos.filter(k => k.risco === r.id), ok = ks.filter(k => marcoSit(k) === "Concluído").length;
      return `<div class="bar-row"><b>${r.id}</b><span class="bar"><i style="width:${(ok / ks.length) * 100}%"></i></span><span class="muted">${ok} de ${ks.length}</span></div>`;
    }).join("");
    const marcosBody = document.createElement("div");
    marcosBody.innerHTML = `<div class="bars">${barras}</div>`;
    marcosBody.append(table([
        { label: "Marco", fmt: k => `${esc(k.marco)} <span class="muted">(${k.risco})</span>` },
        { label: "Prazo", cls: "nowrap", fmt: k => fmtDate(k.prazo) },
        { label: "Situação", fmt: k => status(marcoSit(k)) }
      ], pend));
    out.push(visual(5, "Marcos do tratamento de riscos", `Concluídos por risco e pendentes até ${fmtD(ref())}`, marcosBody));

    // Decisões
    out.push(visual(12, "Decisões prioritárias para a direção", `Com base nos dados de ${mesLabel(D.meses[D.meses.length - 1])} · status: proposta · ata pendente (comitê de governança não formalizado)`,
      table([
        { label: "ID", fmt: d => d.id },
        { label: "Decisão", fmt: d => esc(d.decisao) },
        { label: "Justificativa", opt: true, fmt: d => `<span class="muted">${esc(d.justificativa)}</span>` },
        { label: "Risco", fmt: d => d.risco },
        { label: "Responsável", fmt: d => esc(d.responsavel) },
        { label: "Prazo", cls: "nowrap", fmt: d => fmtDate(d.prazo) },
        { label: "Evidência a confirmar", fmt: d => `<span class="muted">${esc(d.evidencia)}</span>` }
      ], D.decisoes)));

    return out;
  }

  const redraw = () => document.querySelectorAll(".chart").forEach(c => c._draw && c._draw());

  function render() {
    Charts.hideTip();
    $("#page-meta").innerHTML = `Mês de referência: <b>${mesLabel(state.mes)}</b> · situação calculada em ${fmtD(ref())}`;
    const grid = $("#grid");
    grid.innerHTML = "";
    build().forEach(v => grid.appendChild(v));
    redraw();
  }

  $("#f-mes").innerHTML = D.meses.map(m => `<option value="${m}">${mesLabel(m)}</option>`).join("");
  $("#f-mes").value = state.mes;
  $("#f-mes").addEventListener("change", e => { state.mes = e.target.value; render(); });
  let t;
  addEventListener("resize", () => { clearTimeout(t); t = setTimeout(redraw, 120); });
  render();
})();
