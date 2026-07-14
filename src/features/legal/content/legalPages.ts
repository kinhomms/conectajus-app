import type { LegalPageContent } from "@/features/legal/components/LegalPage";

export const privacyPolicyContent: LegalPageContent = {
  eyebrow: "Privacidade e LGPD",
  title: "Política de Privacidade",
  description:
    "Documento inicial revisável sobre como a ConectaJus trata dados pessoais, documentos e informações jurídicas inseridas por cidadãos, advogados e administradores.",
  lastUpdated: "14/07/2026",
  reviewNote: "Documento sujeito a atualizações para refletir melhorias da plataforma, exigências legais e regras operacionais.",
  sections: [
    {
      title: "Dados tratados",
      items: [
        "Podemos tratar dados cadastrais, informações de contato, perfil de acesso, OAB/UF de advogados, relatos de triagem, documentos enviados, logs operacionais, solicitações administrativas e registros de créditos.",
        "Dados pessoais e documentos do cidadão ficam protegidos e não são exibidos no Marketplace antes do desbloqueio por advogado autorizado.",
        "O Marketplace exibe inicialmente apenas informações mascaradas: área, cidade, urgência, resumo, complexidade e custo em créditos.",
      ],
    },
    {
      title: "Finalidades",
      items: [
        "Organizar demandas jurídicas por triagem assistida por IA.",
        "Permitir que cidadãos acompanhem suas demandas e documentos.",
        "Permitir que advogados parceiros analisem oportunidades mascaradas e, após desbloqueio, acessem dados privados necessários ao atendimento.",
        "Manter CRM jurídico, auditoria administrativa, controle de créditos, validação de OAB e segurança da plataforma.",
      ],
    },
    {
      title: "Compartilhamento e acesso",
      items: [
        "Dados privados do cidadão são liberados ao advogado apenas após desbloqueio com créditos e dentro de fluxo auditável.",
        "Administradores podem acessar filas e dados necessários para suporte, auditoria, validação de OAB, créditos, exclusão de conta e segurança operacional.",
        "A ConectaJus pode usar provedores de infraestrutura, como Supabase e Vercel, para autenticação, banco de dados, armazenamento e hospedagem.",
      ],
    },
    {
      title: "Direitos do titular",
      items: [
        "O usuário pode solicitar acesso, correção, revisão ou exclusão de dados, observadas obrigações legais, auditoria e retenções necessárias.",
        "A exclusão de conta pode passar por análise administrativa para preservar histórico mínimo, evidências, obrigações jurídicas e prevenção a fraude.",
        "Solicitações devem ser feitas pelo canal oficial de privacidade a ser definido antes da publicação em produção.",
      ],
    },
  ],
};

export const termsContent: LegalPageContent = {
  eyebrow: "Condições de uso",
  title: "Termos de Uso",
  description:
    "Documento inicial revisável sobre regras de acesso e uso da ConectaJus por cidadãos, advogados parceiros e administradores.",
  lastUpdated: "14/07/2026",
  reviewNote: "Ao utilizar a plataforma, o usuário declara ciência das regras aplicáveis ao seu perfil de acesso.",
  sections: [
    {
      title: "Natureza da plataforma",
      items: [
        "A ConectaJus é um ecossistema jurídico inteligente com portal do cidadão, triagem assistida por IA, CRM jurídico, Marketplace de oportunidades e sistema de créditos.",
        "A triagem por IA organiza informações preliminares e não substitui consulta jurídica individualizada com advogado habilitado.",
        "A plataforma não promete resultado jurídico, financeiro ou processual.",
      ],
    },
    {
      title: "Responsabilidades do usuário",
      items: [
        "O usuário deve fornecer informações verdadeiras, atualizadas e lícitas.",
        "É proibido enviar documentos de terceiros sem autorização, conteúdo falso, ofensivo, ilícito ou que viole direitos.",
        "O cidadão deve revisar suas informações antes de publicar uma demanda ou enviar documentos.",
      ],
    },
    {
      title: "Responsabilidades do advogado",
      items: [
        "O advogado deve informar OAB/UF válida e aguardar verificação administrativa para acessar recursos restritos.",
        "O advogado é responsável por cumprir regras profissionais, éticas e legais aplicáveis à advocacia.",
        "Dados liberados no Marketplace devem ser usados apenas para análise e atendimento do caso correspondente.",
      ],
    },
    {
      title: "Disponibilidade e alterações",
      items: [
        "A plataforma pode passar por manutenções, atualizações, indisponibilidades ou ajustes de regras operacionais.",
        "Funcionalidades, fluxos, créditos e políticas podem ser alterados mediante atualização dos documentos públicos e comunicação razoável quando aplicável.",
        "O uso continuado da plataforma após alterações pode representar ciência das novas condições.",
      ],
    },
  ],
};

export const marketplaceRulesContent: LegalPageContent = {
  eyebrow: "Marketplace e créditos",
  title: "Regras do Marketplace Jurídico",
  description:
    "Documento inicial revisável sobre funcionamento de oportunidades mascaradas, desbloqueio por créditos e conversão para CRM.",
  lastUpdated: "14/07/2026",
  reviewNote: "As regras de créditos, desbloqueio e atendimento podem variar conforme plano, campanha ou política comercial vigente.",
  sections: [
    {
      title: "Funcionamento das oportunidades",
      items: [
        "O cidadão realiza triagem e a plataforma organiza uma oportunidade jurídica mascarada.",
        "Antes do desbloqueio, o advogado visualiza apenas área, cidade, urgência, resumo, complexidade e custo em créditos.",
        "Nome, telefone, WhatsApp, e-mail, documentos e histórico completo permanecem bloqueados até desbloqueio.",
      ],
    },
    {
      title: "Créditos e desbloqueio",
      items: [
        "O advogado precisa ter saldo de créditos suficiente para desbloquear uma oportunidade.",
        "Ao desbloquear, o sistema consome créditos e registra auditoria da operação.",
        "O desbloqueio libera dados privados disponíveis e permite envio do lead para o CRM.",
      ],
    },
    {
      title: "Leads incompletos, legados ou indisponíveis",
      items: [
        "Algumas oportunidades podem ter dados incompletos, especialmente registros antigos ou casos com narrativa insuficiente.",
        "A plataforma pode reconstruir dados mínimos de oportunidades legadas para manter rastreabilidade, deixando claro quando os dados foram reconstruídos.",
        "Políticas de estorno, reembolso, validade de créditos e contestação de lead devem ser definidas pela operação antes do go-live comercial.",
      ],
    },
    {
      title: "Conversão para CRM",
      items: [
        "Após o desbloqueio, o advogado pode enviar a oportunidade para o CRM, criando cliente, caso, nota inicial e vínculo auditável.",
        "A conversão para CRM não cria promessa de contratação, êxito ou resultado jurídico.",
        "O advogado deve respeitar sigilo, privacidade e regras profissionais no tratamento das informações liberadas.",
      ],
    },
  ],
};
