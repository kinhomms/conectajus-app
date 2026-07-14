# ConectaJus — Checklist final jurídico/comercial de go-live

Data: 2026-07-14  
Branch: `ui-v6-premium`  
Status técnico de referência: preview Vercel validado com fluxo Marketplace -> CRM.

> Observação: este checklist é operacional e não substitui revisão jurídica formal por advogado responsável, DPO/encarregado de dados ou contador/consultor fiscal.

## 1. Domínio e publicação

- [ ] Definir domínio oficial da plataforma.
- [ ] Configurar domínio na Vercel.
- [ ] Confirmar HTTPS ativo.
- [ ] Confirmar redirecionamento correto de domínio raiz e `www`, se aplicável.
- [ ] Confirmar que o ambiente de produção aponta para o projeto Supabase correto.
- [ ] Definir se o preview da branch continuará disponível apenas para testes internos.

## 2. Variáveis e ambientes

- [ ] Configurar `NEXT_PUBLIC_SUPABASE_URL` em Production.
- [ ] Configurar `NEXT_PUBLIC_SUPABASE_ANON_KEY` em Production.
- [ ] Confirmar que Preview e Production usam o Supabase pretendido.
- [ ] Confirmar que `.env.local` não foi commitado.
- [ ] Validar build de produção com `npm run validate`.
- [ ] Executar smoke test depois do deploy em domínio final.

## 3. Supabase e dados

- [ ] Confirmar migrations aplicadas no Supabase alvo.
- [ ] Confirmar `docs/SUPABASE_POST_APPLY_VALIDATION.sql`.
- [ ] Confirmar bucket privado `citizen-documents`.
- [ ] Confirmar RLS ativo nas tabelas sensíveis.
- [ ] Confirmar RPCs administrativas e de marketplace.
- [ ] Confirmar backups automáticos do Supabase.
- [ ] Definir rotina de exportação/backup antes de mudanças estruturais.

## 4. LGPD e privacidade

- [ ] Publicar Política de Privacidade.
- [ ] Publicar Termos de Uso.
- [ ] Publicar Política de Cookies, se houver cookies/analytics adicionais.
- [ ] Definir encarregado/DPO ou canal de contato de privacidade.
- [ ] Definir base legal para tratamento de dados do cidadão.
- [ ] Definir base legal para documentos enviados.
- [ ] Definir prazo de retenção de demandas, documentos, leads e logs.
- [ ] Definir processo de atendimento a solicitações do titular:
  - acesso;
  - correção;
  - portabilidade, quando aplicável;
  - exclusão;
  - revogação de consentimento, quando aplicável.
- [ ] Confirmar que exclusão de conta permanece auditável e não apaga dados com retenção obrigatória sem análise.
- [ ] Confirmar linguagem clara sobre uso de IA na triagem.

## 5. Marketplace e créditos

- [ ] Publicar regras do Marketplace.
- [ ] Explicar que dados pessoais ficam ocultos até desbloqueio por créditos.
- [ ] Definir regra comercial de consumo de créditos.
- [ ] Definir política de estorno/reembolso de créditos.
- [ ] Definir validade dos créditos, se houver.
- [ ] Definir termos para leads incompletos, duplicados ou inválidos.
- [ ] Definir termos para indisponibilidade técnica.
- [ ] Definir se haverá moderação/administração de oportunidades.
- [ ] Definir como será tratada disputa entre cidadão e advogado.

## 6. OAB, advogados e responsabilidade profissional

- [ ] Revisar fluxo de cadastro de advogado.
- [ ] Confirmar que OAB/UF é exigida.
- [ ] Confirmar que Marketplace/Financeiro ficam bloqueados até OAB verificada.
- [ ] Definir procedimento administrativo de verificação OAB.
- [ ] Registrar responsável pela aprovação/rejeição.
- [ ] Definir termo de responsabilidade do advogado parceiro.
- [ ] Confirmar aderência às regras éticas aplicáveis à publicidade/captação jurídica.

## 7. IA jurídica e triagem

- [ ] Informar que a triagem por IA não substitui consulta jurídica individual.
- [ ] Informar que classificação de área, urgência e complexidade é preliminar.
- [ ] Informar que o cidadão deve revisar informações antes de publicar.
- [ ] Definir política de uso aceitável.
- [ ] Definir tratamento de conteúdo sensível, ofensivo, falso ou ilegal.

## 8. Atendimento, suporte e operação

- [ ] Definir canal oficial de suporte.
- [ ] Definir SLA inicial de resposta.
- [ ] Definir processo para problemas de login.
- [ ] Definir processo para falha de pagamento/crédito.
- [ ] Definir processo para contestação de lead.
- [ ] Definir processo para denúncia de abuso.
- [ ] Criar rotina de revisão diária das filas:
  - OAB pendente;
  - créditos pendentes;
  - exclusões pendentes;
  - leads com dados incompletos.

## 9. Monitoramento pós-deploy

- [ ] Monitorar builds da Vercel.
- [ ] Monitorar erros no console/browser.
- [ ] Monitorar erros de RPC no Supabase.
- [ ] Monitorar falhas de login/cadastro.
- [ ] Monitorar consumo de créditos.
- [ ] Monitorar criação de clientes via Marketplace.
- [ ] Monitorar storage de documentos privados.
- [ ] Definir rotina de auditoria semanal das tabelas administrativas.

## 10. Teste final antes de produção

Executar em domínio final:

- [ ] Visitante acessa home/login/cadastro.
- [ ] Cidadão cria/login e faz triagem.
- [ ] Cidadão publica oportunidade.
- [ ] Cidadão envia documento.
- [ ] Advogado com OAB pendente é bloqueado.
- [ ] Admin verifica OAB.
- [ ] Advogado solicita créditos.
- [ ] Admin aprova créditos.
- [ ] Advogado desbloqueia lead.
- [ ] Dados privados aparecem somente após desbloqueio.
- [ ] Advogado envia lead para CRM.
- [ ] Cliente aparece em `/clientes`.
- [ ] Admin consegue auditar decisões.

## 11. Critério de pronto para 100%

Considerar pronto para go-live quando:

- checklist técnico estiver aprovado;
- preview e domínio final estiverem validados;
- documentos legais estiverem publicados;
- termos comerciais de Marketplace/créditos estiverem aprovados;
- política de LGPD/retenção estiver definida;
- suporte/monitoramento pós-deploy estiverem definidos.

