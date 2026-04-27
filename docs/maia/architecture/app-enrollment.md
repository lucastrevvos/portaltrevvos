# App Enrollment no Ecossistema Trevvos

## Contexto

Hoje a API principal da Trevvos separa, na prática, duas responsabilidades:

- identidade do usuário, criada em `/auth/register`;
- autorização por app, definida pelos vínculos em `UserAppRole`.

O problema atual é que o cadastro do usuário não garante acesso automático a um app do ecossistema. Para a Ma.ia, durante o desenvolvimento, o vínculo com o app `maia` foi feito manualmente via Prisma Studio.

Isso resolve o ambiente local, mas não é um fluxo adequado para produção, onboarding mobile ou convites entre usuários.

## Decisão Futura

A direção futura é separar explicitamente identidade de autorização:

- `/auth/register` deve criar apenas a identidade do usuário;
- o acesso a cada app deve ser concedido por um fluxo próprio de enrollment;
- uma rota futura de enrollment deve criar o vínculo do usuário com um app específico.

Em outras palavras, registrar um usuário não significa automaticamente liberar todos os apps do ecossistema.

## Fluxo Proposto

Fluxo alvo para apps como Ma.ia:

1. O usuário registra ou faz login na API principal.
2. O app cliente, por exemplo o `maia-mobile`, chama `POST /apps/:slug/enroll` ou endpoint equivalente.
3. A API principal valida o JWT do usuário autenticado.
4. A API principal cria `UserAppRole` para aquele app, se as regras permitirem.
5. O usuário faz `refresh` ou novo `login`, ou então recebe um token atualizado, para que o claim `apps` passe a refletir o novo vínculo.

Esse fluxo permite manter a autenticação centralizada e a autorização por app controlada de forma explícita.

## Regras de Enrollment

As regras futuras devem distinguir tipos de app e de acesso:

- auto-enroll deve ser permitido apenas para apps públicos e gratuitos;
- apps pagos devem depender de confirmação de pagamento, assinatura ou webhook de billing;
- apps privados devem depender de convite, aprovação administrativa ou provisionamento interno;
- a Ma.ia free pode começar com role `READER`;
- em ambientes de administração, desenvolvimento ou seed controlada, a Ma.ia pode usar role `OWNER`.

Isso evita que um registro simples libere acesso indevido a produtos pagos, privados ou experimentais.

## Impacto no Ma.ia

Para a Ma.ia, esse desenho tem consequências diretas:

- o usuário precisa ter `apps.maia` no JWT para conseguir usar a `maia-api`;
- no futuro, o onboarding do `maia-mobile` deve garantir o enrollment antes de chamar a `maia-api`;
- convites de casal devem permitir registrar e vincular automaticamente o parceiro ao app `maia`, reduzindo fricção no fluxo de entrada compartilhada.

Ou seja, a identidade Trevvos pode ser compartilhada entre produtos, mas a ativação do app Ma.ia precisa ser garantida antes do uso do backend dedicado.

## Riscos e Pontos de Atenção

- um token antigo não reflete novas roles até que o usuário faça login novamente, use refresh ou receba um token reemitido;
- um auto-enroll mal configurado pode liberar acesso a app indevido;
- as roles atuais são mais orientadas a conteúdo/editorial e talvez precisem evoluir para representar melhor planos, assinaturas e permissões B2C.

## Consequência Arquitetural

Essa decisão preserva um núcleo único de identidade na API principal e reduz acoplamento entre produtos do ecossistema. Ao mesmo tempo, exige que cada app trate enrollment como parte explícita do onboarding e não como efeito colateral do cadastro global do usuário.
