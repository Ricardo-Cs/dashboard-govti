# Dashboard de Governança de TI — Prefeitura de Boa Esperança

Protótipo da atividade de Governança de TI (CSTSI 6 – IFAC). HTML, CSS e JavaScript puros, sem dependências nem build.

> Todos os valores mensais são **simulados** e estão marcados como *a validar*. Metas, linhas de base, prazos e riscos vêm do PDTI v0.1, da PSI e da Matriz de Riscos (Equipe 03).

## Conteúdo

Página única, com:

- **Cartões:** indicadores não atendidos, riscos críticos, marcos atrasados e decisões propostas.
- **Indicadores:** os 8 indicadores com valor, meta, situação, vínculos (PDTI, PSI e risco), fonte e responsável. Clique numa linha para ver a tendência.
- **Matriz de riscos:** probabilidade × impacto dos riscos R1 a R4, com a legenda das faixas (Baixo 1–5, Médio 6–12, Alto 13–19, Crítico 20–25) e o responsável de cada risco.
- **Tendência:** valor mensal do indicador selecionado, com a linha de meta. Abaixo, a periodicidade, o responsável, os vínculos, as práticas (SLA, OLA, DRP, DORA) e a fonte do indicador.
- **Marcos do tratamento de riscos:** barras com os marcos concluídos por risco e a lista dos marcos pendentes.
- **Decisões:** as 4 decisões prioritárias para a direção, com a evidência a confirmar. Elas se baseiam no último mês com dados (dez/2026).

Em telas pequenas, as colunas secundárias das tabelas ficam ocultas; essas informações continuam na linha abaixo da tendência.

O segmentador **Mês de referência** recalcula tudo. A situação segue a regra do PDTI (seção 7.3), a mesma da planilha:

- **Atendido**: a meta foi alcançada.
- **Em atenção**: abaixo da meta, mas o prazo da meta ainda não venceu.
- **Não atendido**: abaixo da meta com o prazo vencido, ou quando a meta é mensal.
- **Sem meta**: o indicador ainda não tem meta definida.

## Estrutura

```
site/
  index.html
  css/style.css
  js/data.js     ← dados (transcritos de Dados_Dashboard_GTI_Boa_Esperanca.xlsx)
  js/charts.js   ← gráficos SVG
  js/app.js      ← regras e visuais
.github/workflows/pages.yml
```

Para atualizar o mês, inclua o mês em `DATA.meses` e as novas linhas em `DATA.medicoes` (`js/data.js`).

## Rodar localmente

```bash
cd site && python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar no GitHub Pages (via GitHub Actions)

1. Crie o repositório e envie o projeto para a branch `main`.
2. No GitHub, abra **Settings › Pages › Build and deployment › Source** e escolha **GitHub Actions**.
3. O workflow `.github/workflows/pages.yml` publica a pasta `site/` a cada push que altera `site/`. Ele também pode ser disparado manualmente na aba **Actions**.

Só a pasta `site/` é publicada. Os PDFs e a planilha da raiz não vão para o site.
