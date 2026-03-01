-- =============================================
-- SEED: Case Stage â€” Dados de exemplo
-- =============================================
-- Execute este script no PostgreSQL para popular o banco
-- com Ã¡reas organizacionais e processos de exemplo.
--
-- Uso: psql -U <user> -d <database> -f seed.sql
-- =============================================

-- Limpar dados existentes (ordem respeitando FKs)
DELETE FROM documents;
DELETE FROM responsibles;
DELETE FROM tools;
DELETE FROM processes;
DELETE FROM areas;

-- =============================================
-- ÃREAS ORGANIZACIONAIS
-- =============================================
INSERT INTO areas (id, name, created_at, updated_at) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Recursos Humanos',       NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000002', 'Tecnologia da InformaÃ§Ã£o', NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000003', 'Financeiro',              NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000004', 'Comercial',               NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000005', 'OperaÃ§Ãµes',               NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000006', 'JurÃ­dico',                NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000007', 'Marketing',               NOW(), NOW());

-- =============================================
-- PROCESSOS â€” Recursos Humanos
-- =============================================
INSERT INTO processes (id, title, description, type, status, priority, start_date, end_date, area_id, parent_id, created_at, updated_at) VALUES
  -- Processo pai
  ('b1000000-0000-0000-0000-000000000001', 'AdmissÃ£o de Colaboradores',
   'Processo completo de admissÃ£o, desde a abertura da vaga atÃ© a integraÃ§Ã£o do novo colaborador.',
   'Manual', 'Em_Andamento', 'Alta', '2026-01-15', '2026-06-30',
   'a1000000-0000-0000-0000-000000000001', NULL, NOW(), NOW()),

  -- Subprocessos de AdmissÃ£o
  ('b1000000-0000-0000-0000-000000000002', 'Abertura de Vaga',
   'DefiniÃ§Ã£o do perfil da vaga, requisitos e aprovaÃ§Ã£o orÃ§amentÃ¡ria.',
   'Manual', 'Concluido', 'Alta', '2026-01-15', '2026-01-25',
   'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', NOW(), NOW()),

  ('b1000000-0000-0000-0000-000000000003', 'Triagem de CurrÃ­culos',
   'AnÃ¡lise e seleÃ§Ã£o de currÃ­culos recebidos conforme requisitos da vaga.',
   'Sistemico', 'Concluido', 'Media', '2026-01-26', '2026-02-10',
   'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', NOW(), NOW()),

  ('b1000000-0000-0000-0000-000000000004', 'Entrevistas e SeleÃ§Ã£o',
   'ConduÃ§Ã£o de entrevistas tÃ©cnicas e comportamentais.',
   'Manual', 'Em_Andamento', 'Alta', '2026-02-11', NULL,
   'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', NOW(), NOW()),

  ('b1000000-0000-0000-0000-000000000005', 'Onboarding',
   'IntegraÃ§Ã£o do colaborador: documentaÃ§Ã£o, acesso a sistemas, treinamento inicial.',
   'Manual', 'Planejado', 'Media', NULL, NULL,
   'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', NOW(), NOW()),

  -- Processo independente RH
  ('b1000000-0000-0000-0000-000000000006', 'GestÃ£o de Folha de Pagamento',
   'CÃ¡lculo mensal da folha, encargos e benefÃ­cios.',
   'Sistemico', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000001', NULL, NOW(), NOW()),

  ('b1000000-0000-0000-0000-000000000007', 'AvaliaÃ§Ã£o de Desempenho',
   'Ciclo semestral de avaliaÃ§Ã£o de desempenho dos colaboradores.',
   'Manual', 'Planejado', 'Media', '2026-07-01', '2026-08-15',
   'a1000000-0000-0000-0000-000000000001', NULL, NOW(), NOW());

-- =============================================
-- PROCESSOS â€” Tecnologia da InformaÃ§Ã£o
-- =============================================
INSERT INTO processes (id, title, description, type, status, priority, start_date, end_date, area_id, parent_id, created_at, updated_at) VALUES
  ('b2000000-0000-0000-0000-000000000001', 'GestÃ£o de Incidentes',
   'Recebimento, triagem e resoluÃ§Ã£o de incidentes de TI reportados pelos usuÃ¡rios.',
   'Sistemico', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000002', NULL, NOW(), NOW()),

  ('b2000000-0000-0000-0000-000000000002', 'Registro do Incidente',
   'Abertura do chamado no sistema de service desk.',
   'Sistemico', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000001', NOW(), NOW()),

  ('b2000000-0000-0000-0000-000000000003', 'DiagnÃ³stico e ResoluÃ§Ã£o',
   'AnÃ¡lise tÃ©cnica e aplicaÃ§Ã£o da soluÃ§Ã£o ou workaround.',
   'Manual', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000001', NOW(), NOW()),

  ('b2000000-0000-0000-0000-000000000004', 'Deploy de AplicaÃ§Ãµes',
   'Pipeline de CI/CD para todas as aplicaÃ§Ãµes da empresa.',
   'Sistemico', 'Concluido', 'Alta', '2025-09-01', '2026-01-30',
   'a1000000-0000-0000-0000-000000000002', NULL, NOW(), NOW()),

  ('b2000000-0000-0000-0000-000000000005', 'GestÃ£o de Acessos',
   'Controle de permissÃµes e acessos a sistemas corporativos.',
   'Sistemico', 'Em_Andamento', 'Media', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000002', NULL, NOW(), NOW()),

  ('b2000000-0000-0000-0000-000000000006', 'Backup e Disaster Recovery',
   'Rotinas de backup e plano de recuperaÃ§Ã£o de desastres.',
   'Sistemico', 'Concluido', 'Alta', '2025-06-01', '2025-12-31',
   'a1000000-0000-0000-0000-000000000002', NULL, NOW(), NOW()),

  ('b2000000-0000-0000-0000-000000000007', 'ModernizaÃ§Ã£o do ERP',
   'Projeto de migraÃ§Ã£o do ERP legado para soluÃ§Ã£o cloud.',
   'Sistemico', 'Planejado', 'Alta', '2026-04-01', '2027-03-31',
   'a1000000-0000-0000-0000-000000000002', NULL, NOW(), NOW());

-- =============================================
-- PROCESSOS â€” Financeiro
-- =============================================
INSERT INTO processes (id, title, description, type, status, priority, start_date, end_date, area_id, parent_id, created_at, updated_at) VALUES
  ('b3000000-0000-0000-0000-000000000001', 'Contas a Pagar',
   'GestÃ£o de pagamentos a fornecedores, tributos e demais obrigaÃ§Ãµes.',
   'Sistemico', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000003', NULL, NOW(), NOW()),

  ('b3000000-0000-0000-0000-000000000002', 'Contas a Receber',
   'Controle de cobranÃ§as, recebimentos e inadimplÃªncia.',
   'Sistemico', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000003', NULL, NOW(), NOW()),

  ('b3000000-0000-0000-0000-000000000003', 'ConciliaÃ§Ã£o BancÃ¡ria',
   'VerificaÃ§Ã£o diÃ¡ria de extratos bancÃ¡rios vs lanÃ§amentos contÃ¡beis.',
   'Sistemico', 'Em_Andamento', 'Media', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000003', NULL, NOW(), NOW()),

  ('b3000000-0000-0000-0000-000000000004', 'Fechamento ContÃ¡bil Mensal',
   'Processo de fechamento e geraÃ§Ã£o de demonstrativos financeiros.',
   'Manual', 'Planejado', 'Alta', '2026-03-01', '2026-03-10',
   'a1000000-0000-0000-0000-000000000003', NULL, NOW(), NOW()),

  ('b3000000-0000-0000-0000-000000000005', 'Planejamento OrÃ§amentÃ¡rio 2027',
   'ElaboraÃ§Ã£o do orÃ§amento anual para o prÃ³ximo exercÃ­cio.',
   'Manual', 'Planejado', 'Media', '2026-08-01', '2026-11-30',
   'a1000000-0000-0000-0000-000000000003', NULL, NOW(), NOW());

-- =============================================
-- PROCESSOS â€” Comercial
-- =============================================
INSERT INTO processes (id, title, description, type, status, priority, start_date, end_date, area_id, parent_id, created_at, updated_at) VALUES
  ('b4000000-0000-0000-0000-000000000001', 'ProspecÃ§Ã£o de Clientes',
   'IdentificaÃ§Ã£o e qualificaÃ§Ã£o de leads para o funil de vendas.',
   'Manual', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000004', NULL, NOW(), NOW()),

  ('b4000000-0000-0000-0000-000000000002', 'ElaboraÃ§Ã£o de Propostas',
   'CriaÃ§Ã£o de propostas comerciais personalizadas para cada oportunidade.',
   'Manual', 'Em_Andamento', 'Media', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000004', NULL, NOW(), NOW()),

  ('b4000000-0000-0000-0000-000000000003', 'GestÃ£o de Contratos',
   'Acompanhamento de vigÃªncia, renovaÃ§Ãµes e aditivos contratuais.',
   'Sistemico', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000004', NULL, NOW(), NOW()),

  ('b4000000-0000-0000-0000-000000000004', 'PÃ³s-Venda',
   'Acompanhamento da satisfaÃ§Ã£o do cliente apÃ³s a venda.',
   'Manual', 'Planejado', 'Baixa', '2026-03-01', NULL,
   'a1000000-0000-0000-0000-000000000004', NULL, NOW(), NOW());

-- =============================================
-- PROCESSOS â€” OperaÃ§Ãµes
-- =============================================
INSERT INTO processes (id, title, description, type, status, priority, start_date, end_date, area_id, parent_id, created_at, updated_at) VALUES
  ('b5000000-0000-0000-0000-000000000001', 'GestÃ£o da Cadeia de Suprimentos',
   'Controle de compras, estoque e logÃ­stica de distribuiÃ§Ã£o.',
   'Sistemico', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000005', NULL, NOW(), NOW()),

  ('b5000000-0000-0000-0000-000000000002', 'Controle de Qualidade',
   'InspeÃ§Ã£o e garantia da qualidade dos produtos/serviÃ§os entregues.',
   'Manual', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000005', NULL, NOW(), NOW()),

  ('b5000000-0000-0000-0000-000000000003', 'GestÃ£o de Frotas',
   'ManutenÃ§Ã£o preventiva e controle de veÃ­culos operacionais.',
   'Sistemico', 'Concluido', 'Media', '2025-06-01', '2025-12-31',
   'a1000000-0000-0000-0000-000000000005', NULL, NOW(), NOW()),

  ('b5000000-0000-0000-0000-000000000004', 'ManutenÃ§Ã£o Predial',
   'GestÃ£o de manutenÃ§Ãµes preventivas e corretivas nas instalaÃ§Ãµes.',
   'Manual', 'Cancelado', 'Baixa', '2025-09-01', '2025-10-15',
   'a1000000-0000-0000-0000-000000000005', NULL, NOW(), NOW()),

  ('b5000000-0000-0000-0000-000000000005', 'LogÃ­stica de Entregas',
   'RoteirizaÃ§Ã£o e acompanhamento de entregas para clientes.',
   'Sistemico', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000005', NULL, NOW(), NOW()),

  ('b5000000-0000-0000-0000-000000000006', 'GestÃ£o de Estoque',
   'Controle de entradas, saÃ­das e inventÃ¡rio dos materiais.',
   'Sistemico', 'Em_Andamento', 'Media', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000005', NULL, NOW(), NOW());

-- =============================================
-- PROCESSOS â€” JurÃ­dico
-- =============================================
INSERT INTO processes (id, title, description, type, status, priority, start_date, end_date, area_id, parent_id, created_at, updated_at) VALUES
  ('b6000000-0000-0000-0000-000000000001', 'AnÃ¡lise de Contratos',
   'RevisÃ£o jurÃ­dica de contratos com clientes, fornecedores e parceiros.',
   'Manual', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000006', NULL, NOW(), NOW()),

  ('b6000000-0000-0000-0000-000000000002', 'GestÃ£o de Contencioso',
   'Acompanhamento de processos judiciais ativos.',
   'Manual', 'Em_Andamento', 'Alta', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000006', NULL, NOW(), NOW()),

  ('b6000000-0000-0000-0000-000000000003', 'Compliance e LGPD',
   'Programa de conformidade com a Lei Geral de ProteÃ§Ã£o de Dados.',
   'Manual', 'Planejado', 'Alta', '2026-04-01', '2026-09-30',
   'a1000000-0000-0000-0000-000000000006', NULL, NOW(), NOW());

-- =============================================
-- PROCESSOS â€” Marketing
-- =============================================
INSERT INTO processes (id, title, description, type, status, priority, start_date, end_date, area_id, parent_id, created_at, updated_at) VALUES
  ('b7000000-0000-0000-0000-000000000001', 'GestÃ£o de MÃ­dias Sociais',
   'CriaÃ§Ã£o de conteÃºdo e gestÃ£o de perfis nas redes sociais.',
   'Manual', 'Em_Andamento', 'Media', '2026-01-01', '2026-12-31',
   'a1000000-0000-0000-0000-000000000007', NULL, NOW(), NOW()),

  ('b7000000-0000-0000-0000-000000000002', 'Campanhas de E-mail Marketing',
   'SegmentaÃ§Ã£o de base e disparos de campanhas de e-mail.',
   'Sistemico', 'Concluido', 'Media', '2026-01-15', '2026-02-28',
   'a1000000-0000-0000-0000-000000000007', NULL, NOW(), NOW()),

  ('b7000000-0000-0000-0000-000000000003', 'Rebranding Institucional',
   'Projeto de redesign da marca: logo, paleta de cores e manual de identidade visual.',
   'Manual', 'Cancelado', 'Baixa', '2025-11-01', '2026-01-15',
   'a1000000-0000-0000-0000-000000000007', NULL, NOW(), NOW()),

  ('b7000000-0000-0000-0000-000000000004', 'SEO e Performance Digital',
   'OtimizaÃ§Ã£o de mecanismos de busca e anÃ¡lise de mÃ©tricas digitais.',
   'Sistemico', 'Planejado', 'Media', '2026-03-01', '2026-06-30',
   'a1000000-0000-0000-0000-000000000007', NULL, NOW(), NOW());

-- =============================================
-- FERRAMENTAS (Tools)
-- =============================================
INSERT INTO tools (id, name, process_id) VALUES
  -- RH - AdmissÃ£o
  (gen_random_uuid(), 'Gupy',           'b1000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'LinkedIn Recruiter', 'b1000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'Google Meet',    'b1000000-0000-0000-0000-000000000004'),
  -- RH - Folha
  (gen_random_uuid(), 'TOTVS RM',       'b1000000-0000-0000-0000-000000000006'),
  (gen_random_uuid(), 'eSocial',        'b1000000-0000-0000-0000-000000000006'),
  -- TI
  (gen_random_uuid(), 'Jira Service Management', 'b2000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Freshdesk',      'b2000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'GitHub Actions', 'b2000000-0000-0000-0000-000000000004'),
  (gen_random_uuid(), 'Docker',         'b2000000-0000-0000-0000-000000000004'),
  (gen_random_uuid(), 'Active Directory', 'b2000000-0000-0000-0000-000000000005'),
  (gen_random_uuid(), 'Veeam Backup',   'b2000000-0000-0000-0000-000000000006'),
  -- Financeiro
  (gen_random_uuid(), 'SAP FI',         'b3000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Conta Azul',     'b3000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'Excel AvanÃ§ado', 'b3000000-0000-0000-0000-000000000004'),
  -- Comercial
  (gen_random_uuid(), 'Salesforce',     'b4000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'HubSpot CRM',    'b4000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'DocuSign',       'b4000000-0000-0000-0000-000000000003'),
  -- OperaÃ§Ãµes
  (gen_random_uuid(), 'SAP MM',         'b5000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'RoutEasy',       'b5000000-0000-0000-0000-000000000005'),
  -- Marketing
  (gen_random_uuid(), 'Hootsuite',      'b7000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Mailchimp',      'b7000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'Google Analytics', 'b7000000-0000-0000-0000-000000000004'),
  (gen_random_uuid(), 'SEMrush',        'b7000000-0000-0000-0000-000000000004');

-- =============================================
-- RESPONSÃVEIS (Responsibles)
-- =============================================
INSERT INTO responsibles (id, name, role, process_id) VALUES
  -- RH
  (gen_random_uuid(), 'Ana Paula Mendes',    'Gerente de RH',         'b1000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Carlos Eduardo Silva', 'Analista de Recrutamento', 'b1000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'Juliana Rocha',       'Analista de Recrutamento', 'b1000000-0000-0000-0000-000000000003'),
  (gen_random_uuid(), 'Ana Paula Mendes',    'Entrevistadora',        'b1000000-0000-0000-0000-000000000004'),
  (gen_random_uuid(), 'Fernanda Costa',      'Analista de DP',        'b1000000-0000-0000-0000-000000000006'),
  -- TI
  (gen_random_uuid(), 'Ricardo Oliveira',    'Coordenador de TI',     'b2000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Lucas Andrade',       'Analista de Suporte N2', 'b2000000-0000-0000-0000-000000000003'),
  (gen_random_uuid(), 'Mariana Sousa',       'DevOps Engineer',       'b2000000-0000-0000-0000-000000000004'),
  (gen_random_uuid(), 'Ricardo Oliveira',    'Administrador de Sistemas', 'b2000000-0000-0000-0000-000000000005'),
  (gen_random_uuid(), 'Pedro Henrique Lima', 'DBA',                   'b2000000-0000-0000-0000-000000000006'),
  -- Financeiro
  (gen_random_uuid(), 'PatrÃ­cia Almeida',    'Controller',            'b3000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Roberto Machado',     'Analista Financeiro',   'b3000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'PatrÃ­cia Almeida',    'Controller',            'b3000000-0000-0000-0000-000000000004'),
  -- Comercial
  (gen_random_uuid(), 'Gustavo Pereira',     'Gerente Comercial',     'b4000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Camila Ferreira',     'Executiva de Contas',   'b4000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'Thiago Barbosa',      'Analista de Contratos', 'b4000000-0000-0000-0000-000000000003'),
  -- OperaÃ§Ãµes
  (gen_random_uuid(), 'Diego Martins',       'Gerente de OperaÃ§Ãµes',  'b5000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Renata Nascimento',   'Analista de Qualidade', 'b5000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'Diego Martins',       'Gerente de OperaÃ§Ãµes',  'b5000000-0000-0000-0000-000000000005'),
  -- JurÃ­dico
  (gen_random_uuid(), 'Dra. Beatriz Carvalho', 'Advogada SÃªnior',    'b6000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Dr. AndrÃ© Lopes',     'Advogado Contencioso',  'b6000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'Dra. Beatriz Carvalho', 'DPO',                'b6000000-0000-0000-0000-000000000003'),
  -- Marketing
  (gen_random_uuid(), 'Isabela Cardoso',     'Coordenadora de Marketing', 'b7000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Felipe Santos',       'Analista de Growth',    'b7000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'Isabela Cardoso',     'Coordenadora de Marketing', 'b7000000-0000-0000-0000-000000000004');

-- =============================================
-- DOCUMENTOS (Documents)
-- =============================================
INSERT INTO documents (id, title, url, process_id) VALUES
  -- RH
  (gen_random_uuid(), 'PolÃ­tica de AdmissÃ£o',          'https://docs.empresa.com/rh/politica-admissao.pdf',   'b1000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Template de DescriÃ§Ã£o de Cargo', 'https://docs.empresa.com/rh/template-cargo.docx',    'b1000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'Checklist de Onboarding',        'https://docs.empresa.com/rh/checklist-onboarding.pdf', 'b1000000-0000-0000-0000-000000000005'),
  (gen_random_uuid(), 'Manual da Folha de Pagamento',   'https://docs.empresa.com/rh/manual-folha.pdf',       'b1000000-0000-0000-0000-000000000006'),
  -- TI
  (gen_random_uuid(), 'Runbook de Incidentes',          'https://docs.empresa.com/ti/runbook-incidentes.md',  'b2000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'Pipeline CI/CD - DocumentaÃ§Ã£o',  'https://docs.empresa.com/ti/cicd-docs.md',           'b2000000-0000-0000-0000-000000000004'),
  (gen_random_uuid(), 'Plano de Disaster Recovery',     'https://docs.empresa.com/ti/dr-plan.pdf',            'b2000000-0000-0000-0000-000000000006'),
  (gen_random_uuid(), 'RFP ModernizaÃ§Ã£o ERP',           'https://docs.empresa.com/ti/rfp-erp.pdf',            'b2000000-0000-0000-0000-000000000007'),
  -- Financeiro
  (gen_random_uuid(), 'Procedimento de Contas a Pagar', 'https://docs.empresa.com/fin/proc-contas-pagar.pdf', 'b3000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'RelatÃ³rio de InadimplÃªncia',     NULL,                                                  'b3000000-0000-0000-0000-000000000002'),
  -- Comercial
  (gen_random_uuid(), 'Modelo de Proposta Comercial',   'https://docs.empresa.com/com/modelo-proposta.pptx',  'b4000000-0000-0000-0000-000000000002'),
  (gen_random_uuid(), 'Template de Contrato SaaS',      'https://docs.empresa.com/jur/contrato-saas.docx',    'b4000000-0000-0000-0000-000000000003'),
  -- JurÃ­dico
  (gen_random_uuid(), 'RelatÃ³rio LGPD - Gap Analysis',  'https://docs.empresa.com/jur/lgpd-gap-analysis.pdf', 'b6000000-0000-0000-0000-000000000003'),
  -- Marketing
  (gen_random_uuid(), 'CalendÃ¡rio Editorial 2026',      'https://docs.empresa.com/mkt/calendario-2026.xlsx',  'b7000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), 'RelatÃ³rio de Performance Q1',    'https://docs.empresa.com/mkt/performance-q1.pdf',    'b7000000-0000-0000-0000-000000000002');

-- =============================================
-- FIM DO SEED
-- =============================================
-- Totais esperados:
--   7 Ã¡reas
--   38 processos (com hierarquias em RH e TI)
--   23 ferramentas
--   25 responsÃ¡veis
--   15 documentos

