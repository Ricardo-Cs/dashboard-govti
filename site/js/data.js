// Base de dados do painel — transcrita de Dados_Dashboard_GTI_Boa_Esperanca.xlsx.
// Valores mensais são SIMULADOS para a atividade (CSTSI 6 / IFAC) e estão marcados como "A validar".
// Linhas de base, metas, prazos e riscos vêm do PDTI v0.1, da PSI e da Matriz de Riscos (Equipe 03).

const DATA = {
  meses: ["2026-09", "2026-10", "2026-11", "2026-12"],

  indicadores: [
    {
      id: "IND01", nome: "Disponibilidade mensal do portal", curto: "Disponibilidade do portal",
      tipo: "Principal", unidade: "%", sentido: "maior", meta: 0.99, prazo: null, base: 0.9736,
      fonte: "Ferramenta de monitoramento, registros de incidentes e relatórios do prestador",
      periodicidade: "Mensal", responsavel: "Gestão de TI", artefato: "PDTI O1 / PSI P1", risco: "R4",
      pdti: ["O1"], psi: ["P1"], praticas: ["SLA", "DRP"], validacao: "A validar"
    },
    {
      id: "IND02", nome: "Chamados de lentidão do prontuário (janela de 20 dias úteis)", curto: "Chamados de lentidão do prontuário",
      tipo: "Principal", unidade: "chamados", sentido: "menor", meta: 29, prazo: "2027-03-31", base: 146,
      fonte: "Central de atendimento / Service Desk",
      periodicidade: "Mensal", responsavel: "Coordenação de Sistemas e Infraestrutura", artefato: "PDTI O2 / PSI P2", risco: "R2",
      pdti: ["O2"], psi: ["P2"], praticas: ["SLA", "OLA"], validacao: "A validar"
    },
    {
      id: "IND03", nome: "Testes de restauração realizados (acumulado previsto)", curto: "Testes de restauração realizados",
      tipo: "Principal", unidade: "%", sentido: "maior", meta: 1, prazo: "2027-09-30", base: 0,
      fonte: "Ferramenta de backup, logs e relatórios de teste",
      periodicidade: "Mensal", responsavel: "Coordenação de TI", artefato: "PDTI O3 / PSI P3", risco: "R1",
      pdti: ["O3"], psi: ["P3"], praticas: ["DRP"], validacao: "A validar"
    },
    {
      id: "IND04", nome: "Computadores sem atualização ligados à rede", curto: "Computadores sem atualização",
      tipo: "Principal", unidade: "computadores", sentido: "menor", meta: 0, prazo: "2026-11-30", base: 14,
      fonte: "Inventário de ativos",
      periodicidade: "Mensal", responsavel: "Coordenação de TI", artefato: "Matriz de Riscos R3 (sem linha no PDTI/PSI)", risco: "R3",
      pdti: [], psi: [], praticas: [], validacao: "A validar"
    },
    {
      id: "IND05", nome: "Tempo de recuperação do portal (último incidente)", curto: "Tempo de recuperação do portal",
      tipo: "Complementar", unidade: "horas", sentido: "menor", meta: 4, prazo: null, base: null,
      fonte: "Registro de incidentes",
      periodicidade: "Por incidente", responsavel: "Gestão de TI", artefato: "PSI P1 (meta de 4 h)", risco: "R4",
      pdti: ["O1"], psi: ["P1"], praticas: ["SLA", "DRP", "DORA"], validacao: "A validar"
    },
    {
      id: "IND06", nome: "Dias com lentidão no prontuário (de 20 dias úteis)", curto: "Dias com lentidão no prontuário",
      tipo: "Complementar", unidade: "dias", sentido: "menor", meta: null, prazo: null, base: 7,
      fonte: "Central de atendimento / Service Desk",
      periodicidade: "Mensal", responsavel: "Gestor de Sistemas", artefato: "Matriz de Riscos R2", risco: "R2",
      pdti: ["O2"], psi: [], praticas: ["SLA"], validacao: "A validar — meta a definir"
    },
    {
      id: "IND07", nome: "Folha e prontuário com backup automatizado", curto: "Backup automatizado (folha e prontuário)",
      tipo: "Complementar", unidade: "%", sentido: "maior", meta: 1, prazo: "2026-12-31", base: 0,
      fonte: "Ferramenta de backup",
      periodicidade: "Mensal", responsavel: "Coordenação de TI", artefato: "PSI P3 / Matriz de Riscos R1", risco: "R1",
      pdti: ["O3"], psi: ["P3"], praticas: ["DRP"], validacao: "A validar"
    },
    {
      id: "IND08", nome: "Revisões de permissões do prontuário no trimestre", curto: "Revisões de permissões do prontuário",
      tipo: "Complementar", unidade: "revisões", sentido: "maior", meta: 1, prazo: "2026-12-31", base: 0,
      fonte: "Relação de permissões e registros de acesso",
      periodicidade: "Trimestral", responsavel: "Gestão de TI", artefato: "PSI P4 / LGPD", risco: null,
      pdti: [], psi: ["P4"], praticas: [], validacao: "A validar"
    }
  ],

  // Valor = Medido ÷ Total quando há Total; senão Valor = Medido.
  medicoes: [
    { id: "M001", ind: "IND01", mes: "2026-09", medido: 701, total: 720, obs: "Linha de base: 19 h fora do ar em 720 h" },
    { id: "M002", ind: "IND01", mes: "2026-10", medido: 730, total: 744, obs: "14 h fora do ar" },
    { id: "M003", ind: "IND01", mes: "2026-11", medido: 714, total: 720, obs: "6 h fora do ar" },
    { id: "M004", ind: "IND01", mes: "2026-12", medido: 733.5, total: 744, obs: "10,5 h fora do ar" },
    { id: "M005", ind: "IND02", mes: "2026-09", medido: 146, total: null, obs: "Linha de base do PDTI" },
    { id: "M006", ind: "IND02", mes: "2026-10", medido: 131, total: null, obs: "" },
    { id: "M007", ind: "IND02", mes: "2026-11", medido: 88, total: null, obs: "Após plano de correção" },
    { id: "M008", ind: "IND02", mes: "2026-12", medido: 64, total: null, obs: "" },
    { id: "M009", ind: "IND03", mes: "2026-10", medido: 1, total: 1, obs: "1º teste realizado em out/2026" },
    { id: "M010", ind: "IND03", mes: "2026-11", medido: 1, total: 2, obs: "Teste de nov/2026 não realizado" },
    { id: "M011", ind: "IND03", mes: "2026-12", medido: 2, total: 3, obs: "Teste de dez/2026 realizado; nov continua pendente" },
    { id: "M012", ind: "IND04", mes: "2026-09", medido: 14, total: null, obs: "Linha de base da Matriz de Riscos" },
    { id: "M013", ind: "IND04", mes: "2026-10", medido: 14, total: null, obs: "Inventário concluído" },
    { id: "M014", ind: "IND04", mes: "2026-11", medido: 9, total: null, obs: "" },
    { id: "M015", ind: "IND04", mes: "2026-12", medido: 6, total: null, obs: "8 de 14 tratados" },
    { id: "M016", ind: "IND05", mes: "2026-11", medido: 2, total: null, obs: "Incidente de nov/2026" },
    { id: "M017", ind: "IND05", mes: "2026-12", medido: 5.33, total: null, obs: "Incidente de dez/2026: 5h20" },
    { id: "M018", ind: "IND06", mes: "2026-09", medido: 7, total: null, obs: "Linha de base: 7 de 20 dias úteis" },
    { id: "M019", ind: "IND06", mes: "2026-10", medido: 6, total: null, obs: "" },
    { id: "M020", ind: "IND06", mes: "2026-11", medido: 4, total: null, obs: "" },
    { id: "M021", ind: "IND06", mes: "2026-12", medido: 3, total: null, obs: "" },
    { id: "M022", ind: "IND07", mes: "2026-09", medido: 0, total: 2, obs: "Backup parcialmente manual" },
    { id: "M023", ind: "IND07", mes: "2026-10", medido: 0, total: 2, obs: "" },
    { id: "M024", ind: "IND07", mes: "2026-11", medido: 1, total: 2, obs: "Folha automatizada" },
    { id: "M025", ind: "IND07", mes: "2026-12", medido: 2, total: 2, obs: "Prontuário automatizado" },
    { id: "M026", ind: "IND08", mes: "2026-12", medido: 0, total: null, obs: "Nenhuma revisão no 4º trimestre" }
  ],

  riscos: [
    { id: "R1", nome: "Falha na restauração de dados", ativo: "Dados da folha e do prontuário (rotina de backup)", prob: 4, imp: 5, prioridade: 2, pdti: "O3 / I3", psi: "P3", responsavel: "Coordenação de TI",
      causa: "Backup parcialmente manual; sem teste mensal de restauração; último teste há 11 meses." },
    { id: "R2", nome: "Lentidão ou queda do prontuário", ativo: "Sistema de prontuário (4 unidades de saúde e hospital)", prob: 5, imp: 5, prioridade: 1, pdti: "O2 / I2", psi: "P2", responsavel: "Gestor de Sistemas + Sec. de Saúde",
      causa: "Causa raiz não identificada; sem monitoramento de desempenho; sem SLA; chamados tratados caso a caso." },
    { id: "R3", nome: "Malware via computadores desatualizados", ativo: "Estações de trabalho (14 sem atualização)", prob: 3, imp: 4, prioridade: 3, pdti: "Sem linha (propor)", psi: "Sem diretriz (propor)", responsavel: "Coordenação de TI + Sec. de Administração",
      causa: "14 computadores sem atualizações de segurança; 38 computadores com mais de 7 anos." },
    { id: "R4", nome: "Indisponibilidade do portal", ativo: "Portal da Prefeitura (serviços ao cidadão)", prob: 4, imp: 3, prioridade: 4, pdti: "O1 / I1", psi: "P1", responsavel: "Gestor de Sistemas",
      causa: "Sem SLA nem procedimento de continuidade; causa da queda de 19 h não identificada." }
  ],

  marcos: [
    { id: "K01", risco: "R1", marco: "1º teste de restauração da folha e do prontuário", prazo: "2026-10-30", conclusao: "2026-10-28", evidencia: "Relatório de teste (data, sistema, tempo, resultado)", responsavel: "Coordenação de TI" },
    { id: "K02", risco: "R1", marco: "Teste mensal de restauração de nov/2026", prazo: "2026-11-30", conclusao: null, evidencia: "Relatório de teste", responsavel: "Coordenação de TI" },
    { id: "K03", risco: "R1", marco: "Backup automatizado da folha e do prontuário", prazo: "2026-12-31", conclusao: "2026-12-15", evidencia: "Logs de execução automática", responsavel: "Coordenação de TI" },
    { id: "K04", risco: "R1", marco: "Testes mensais de restauração (ciclo completo)", prazo: "2027-09-30", conclusao: null, evidencia: "Relatórios mensais de teste", responsavel: "Coordenação de TI" },
    { id: "K05", risco: "R2", marco: "Análise dos 146 chamados (causa raiz)", prazo: "2026-10-30", conclusao: "2026-10-27", evidencia: "Relatório de causa raiz", responsavel: "Gestor de Sistemas" },
    { id: "K06", risco: "R2", marco: "Plano de correção", prazo: "2026-11-30", conclusao: "2026-11-25", evidencia: "Plano de correção aprovado", responsavel: "Gestor de Sistemas" },
    { id: "K07", risco: "R2", marco: "SLA de desempenho com o fornecedor", prazo: "2026-12-31", conclusao: null, evidencia: "Cláusula de SLA no contrato", responsavel: "Gestor de Sistemas + Sec. de Saúde" },
    { id: "K08", risco: "R3", marco: "Inventário dos 38 computadores antigos", prazo: "2026-10-30", conclusao: "2026-10-30", evidencia: "Inventário de ativos atualizado", responsavel: "Coordenação de TI" },
    { id: "K09", risco: "R3", marco: "Tratar os 14 computadores sem atualização", prazo: "2026-11-30", conclusao: null, evidencia: "Relatório com 0 computador sem atualização na rede", responsavel: "Coordenação de TI" },
    { id: "K10", risco: "R3", marco: "Plano de substituição do parque", prazo: "2027-03-31", conclusao: null, evidencia: "Processo de aquisição aprovado", responsavel: "Sec. de Administração" },
    { id: "K11", risco: "R4", marco: "Monitoramento de disponibilidade com alerta", prazo: "2026-10-30", conclusao: "2026-10-20", evidencia: "Relatório mensal de disponibilidade", responsavel: "Gestor de Sistemas" },
    { id: "K12", risco: "R4", marco: "Procedimento de continuidade do portal", prazo: "2026-11-30", conclusao: null, evidencia: "Procedimento aprovado", responsavel: "Gestor de Sistemas" }
  ],

  decisoes: [
    { id: "D1", decisao: "Isolar da rede os 6 computadores ainda sem atualização", risco: "R3", indicadores: ["IND04"],
      justificativa: "6 computadores sem atualização; meta 0 com prazo vencido em 30/11/2026",
      responsavel: "Coordenação de TI", prazo: "2027-01-15",
      evidencia: "Setor de cada máquina; se for saúde ou folha, o R3 sobe para 15 (Alto)", status: "Proposta", registro: "Ata — pendente (comitê não formalizado)" },
    { id: "D2", decisao: "Formalizar SLA e plano de recuperação do portal", risco: "R4", indicadores: ["IND01", "IND05"],
      justificativa: "Disponibilidade 98,6% (meta 99%) e recuperação em 5h20 (meta 4 h)",
      responsavel: "Gestor de Sistemas", prazo: "2027-03-31",
      evidencia: "Causa da queda de set/2026 e se a hospedagem é contratada", status: "Proposta", registro: "Ata — pendente (comitê não formalizado)" },
    { id: "D3", decisao: "Manter o plano do prontuário e definir meta para dias com lentidão", risco: "R2", indicadores: ["IND02", "IND06"],
      justificativa: "Chamados caíram de 146 para 64, ainda acima da meta de 29 (prazo mar/2027); dias com lentidão sem meta",
      responsavel: "Gestor de Sistemas + Sec. de Saúde", prazo: "2027-01-31",
      evidencia: "Relatório de causa raiz e chamados por unidade de saúde", status: "Proposta", registro: "Ata — pendente (comitê não formalizado)" },
    { id: "D4", decisao: "Repor o teste de restauração em atraso e instituir revisão trimestral de permissões", risco: "R1", indicadores: ["IND03", "IND08"],
      justificativa: "Testes 2 de 3 previstos; nenhuma revisão de permissões no trimestre",
      responsavel: "Coordenação de TI e Gestão de TI", prazo: "2027-01-31",
      evidencia: "Relatório do teste e relação de permissões do prontuário", status: "Proposta", registro: "Ata — pendente (comitê não formalizado)" }
  ],

  // Artefatos de referência (Mapa de Artefatos — Equipe 03).
  artefatos: {
    pdti: [
      { id: "O1", nome: "Disponibilidade, continuidade e recuperação do portal", iniciativa: "I1 – Gestão de disponibilidade e continuidade do portal" },
      { id: "O2", nome: "Desempenho estável do sistema de prontuário", iniciativa: "I2 – Diagnóstico e estabilização do prontuário" },
      { id: "O3", nome: "Integridade e recuperação dos dados institucionais", iniciativa: "I3 – Automação e validação das rotinas de backup" }
    ],
    psi: [
      { id: "P1", nome: "SLA, monitoramento e recuperação do portal (≤ 4 h)" },
      { id: "P2", nome: "Gestão de mudanças e desempenho do prontuário" },
      { id: "P3", nome: "Backup 3-2-1 automatizado e teste mensal de restauração" },
      { id: "P4", nome: "Controle de acesso por função e revisão de permissões" }
    ],
    praticas: [
      { id: "SLA", nome: "Acordo de nível de serviço" },
      { id: "OLA", nome: "Acordo de nível operacional" },
      { id: "DRP", nome: "Plano de recuperação de desastres" },
      { id: "DORA", nome: "Métrica DORA — tempo de restauração" }
    ]
  }
};
