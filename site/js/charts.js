// Gráficos em SVG puro, sem dependências. Cada função desenha dentro de um contêiner .chart
// usando a largura real dele, para o texto não ser escalado.

const Charts = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const tip = document.getElementById("tip");
  const C = {
    text: "#252423", text2: "#605e5c", text3: "#8a8886", grid: "#edebe9", axis: "#c8c6c4",
    navy: "#1f4e79", meta: "#8a8886", band: "#f3f6fa"
  };

  function node(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function text(parent, x, y, str, attrs = {}) {
    const t = node("text", Object.assign({ x, y, fill: C.text2, "font-size": 11 }, attrs), parent);
    t.textContent = str;
    return t;
  }
  function svgIn(container, w, h) {
    container.innerHTML = "";
    return node("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}`, role: "img" }, container);
  }
  // Dica de ferramenta
  function showTip(evt, html) {
    tip.innerHTML = html;
    tip.style.display = "block";
    const r = tip.getBoundingClientRect();
    let x = evt.clientX + 14, y = evt.clientY + 14;
    if (x + r.width > innerWidth - 8) x = evt.clientX - r.width - 14;
    if (y + r.height > innerHeight - 8) y = evt.clientY - r.height - 14;
    tip.style.left = Math.max(8, x) + "px";
    tip.style.top = Math.max(8, y) + "px";
  }
  function hideTip() { tip.style.display = "none"; }
  function bindTip(n, html) {
    n.addEventListener("mousemove", e => showTip(e, typeof html === "function" ? html() : html));
    n.addEventListener("mouseleave", hideTip);
  }
  function tipHTML(title, rows) {
    return (title ? `<div class="t-title">${title}</div>` : "") +
      rows.filter(Boolean).map(([k, v]) => `<div class="t-row"><span>${k}</span><span>${v}</span></div>`).join("");
  }

  function niceTicks(min, max, count = 4) {
    if (min === max) { min -= 1; max += 1; }
    const span = max - min;
    const raw = span / count;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
    const lo = Math.floor(min / step) * step;
    const hi = Math.ceil(max / step) * step;
    const out = [];
    for (let v = lo; v <= hi + step / 2; v += step) out.push(+v.toFixed(10));
    return out;
  }

  // Série temporal com linha de meta (TIME_SERIES)
  function line(container, o) {
    const w = container.clientWidth, h = container.clientHeight || 240;
    const s = svgIn(container, w, h);
    const m = { l: 46, r: 14, t: 22, b: 26 };
    const iw = w - m.l - m.r, ih = h - m.t - m.b;
    const n = o.labels.length;
    const present = o.values.filter(v => v !== null);
    const pool = present.concat(o.meta !== null && o.meta !== undefined ? [o.meta] : []);
    if (o.base !== null && o.base !== undefined && o.showBase) pool.push(o.base);
    if (!pool.length) { container.innerHTML = `<div class="empty">Sem medições no período.</div>`; return; }
    let lo = Math.min(...pool), hi = Math.max(...pool);
    const pad = (hi - lo || Math.abs(hi) || 1) * 0.12;
    lo = o.zero ? Math.min(0, lo) : lo - pad; hi = hi + pad;
    if (o.floor !== undefined) lo = Math.max(o.floor, lo);
    if (o.ceil !== undefined) hi = Math.min(o.ceil, hi);
    const ticks = niceTicks(lo, hi, Math.max(2, Math.min(5, Math.floor(ih / 40))));
    const y0 = ticks[0], y1 = ticks[ticks.length - 1];
    const y = v => m.t + ih - ((v - y0) / (y1 - y0)) * ih;
    const colW = iw / n;
    const x = i => m.l + colW * (i + 0.5);

    if (o.refIndex !== undefined && o.refIndex >= 0) {
      node("rect", { x: m.l + colW * o.refIndex, y: m.t, width: colW, height: ih, fill: C.band }, s);
    }
    ticks.forEach(t => {
      node("line", { x1: m.l, x2: m.l + iw, y1: y(t), y2: y(t), stroke: C.grid }, s);
      text(s, m.l - 8, y(t) + 4, o.axisFmt(t), { "text-anchor": "end" });
    });
    o.labels.forEach((lb, i) => text(s, x(i), h - 8, lb, { "text-anchor": "middle", "font-weight": i === o.refIndex ? 600 : 400, fill: i === o.refIndex ? C.text : C.text2 }));

    if (o.meta !== null && o.meta !== undefined) {
      node("line", { x1: m.l, x2: m.l + iw, y1: y(o.meta), y2: y(o.meta), stroke: C.meta, "stroke-width": 1.5, "stroke-dasharray": "5 4" }, s);
      const lab = text(s, m.l + iw, y(o.meta) - 5, o.metaLabel, { "text-anchor": "end", fill: C.text2, "font-size": 10.5 });
      lab.setAttribute("paint-order", "stroke"); lab.setAttribute("stroke", "#fff"); lab.setAttribute("stroke-width", 3);
    }

    let d = "", pen = false;
    o.values.forEach((v, i) => {
      if (v === null) { pen = false; return; }
      d += (pen ? "L" : "M") + x(i) + " " + y(v) + " ";
      pen = true;
    });
    node("path", { d, fill: "none", stroke: o.color || C.navy, "stroke-width": 2.25, "stroke-linejoin": "round" }, s);

    o.values.forEach((v, i) => {
      if (v === null) return;
      node("circle", { cx: x(i), cy: y(v), r: 4, fill: o.pointColor ? o.pointColor(i) : (o.color || C.navy), stroke: "#fff", "stroke-width": 1.5 }, s);
      const lab = text(s, x(i), y(v) - 9, o.fmt(v), { "text-anchor": "middle", fill: C.text, "font-size": 11, "font-weight": 600 });
      lab.setAttribute("paint-order", "stroke"); lab.setAttribute("stroke", "#fff"); lab.setAttribute("stroke-width", 3);
    });

    o.labels.forEach((lb, i) => {
      const hit = node("rect", { x: m.l + colW * i, y: m.t, width: colW, height: ih, fill: "transparent" }, s);
      if (o.tips && o.tips[i]) bindTip(hit, o.tips[i]);
    });
  }

  // Matriz probabilidade x impacto (RISK_MATRIX)
  function riskMatrix(container, o) {
    const w = container.clientWidth;
    const m = { l: 44, r: 6, t: 6, b: 38 };
    const cell = Math.max(28, Math.min((w - m.l - m.r) / 5, 58));
    const gw = cell * 5;
    const h = m.t + gw + m.b;
    container.style.height = h + "px";
    const s = svgIn(container, w, h);
    const ox = m.l + Math.max(0, (w - m.l - m.r - gw) / 2);
    for (let p = 1; p <= 5; p++) {
      for (let i = 1; i <= 5; i++) {
        const idx = p * i;
        const cx = ox + (i - 1) * cell, cy = m.t + (5 - p) * cell;
        const r = node("rect", { x: cx, y: cy, width: cell - 2, height: cell - 2, fill: o.faixaColor(idx) }, s);
        bindTip(r, tipHTML(`P${p} × I${i}`, [["Índice", idx], ["Faixa", o.faixaName(idx)]]));
        text(s, cx + 4, cy + 12, String(idx), { fill: "rgba(37,36,35,.45)", "font-size": 10 });
      }
      text(s, ox - 8, m.t + (5 - p) * cell + cell / 2 + 3, String(p), { "text-anchor": "end", fill: C.text });
    }
    for (let i = 1; i <= 5; i++) text(s, ox + (i - 1) * cell + cell / 2 - 1, m.t + gw + 13, String(i), { "text-anchor": "middle", fill: C.text });
    text(s, ox + gw / 2, h - 4, "Impacto", { "text-anchor": "middle", "font-weight": 600 });
    const py = text(s, 0, 0, "Probabilidade", { "text-anchor": "middle", "font-weight": 600 });
    py.setAttribute("transform", `translate(${ox - 30},${m.t + gw / 2}) rotate(-90)`);

    const byCell = {};
    o.risks.forEach(r => { (byCell[r.prob + "-" + r.imp] = byCell[r.prob + "-" + r.imp] || []).push(r); });
    Object.values(byCell).forEach(list => {
      list.forEach((r, k) => {
        const cx = ox + (r.imp - 1) * cell + (cell - 2) / 2 + (k - (list.length - 1) / 2) * 26;
        const cy = m.t + (5 - r.prob) * cell + (cell - 2) / 2 + 3;
        const g = node("g", {}, s);
        const sz = Math.min(26, cell * 0.5);
        node("rect", { x: cx - sz / 2, y: cy - sz / 2, width: sz, height: sz, fill: C.navy, stroke: "#fff", "stroke-width": 1.5 }, g);
        text(g, cx, cy + 4, r.id, { "text-anchor": "middle", fill: "#fff", "font-size": 11, "font-weight": 700 });
        bindTip(g, r.tip);
      });
    });
  }

  return { line, riskMatrix, tipHTML, hideTip };
})();
