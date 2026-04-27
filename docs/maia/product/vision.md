# Ma.ia - Visao do Produto

## Visao

Ma.ia e um produto mobile-first da Trevvos para apoiar pessoas em rotinas de organizacao, decisao e execucao com inteligencia artificial aplicada. O objetivo inicial e criar uma experiencia simples, confiavel e recorrente, onde a IA ajuda o usuario a transformar informacoes soltas em proximas acoes claras.

O produto deve nascer com dominio proprio, evoluir de forma independente dos outros produtos Trevvos e se integrar ao ecossistema apenas onde fizer sentido: identidade, configuracao operacional e contratos bem definidos.

## Problema

Usuarios acumulam tarefas, ideias, mensagens, planos e decisoes em lugares diferentes. Mesmo quando usam apps de notas, listas ou chatbots, a friccao continua alta:

- informacoes ficam dispersas;
- o contexto se perde entre ferramentas;
- a IA responde bem pontualmente, mas nem sempre acompanha a continuidade da rotina;
- tarefas e decisoes nao viram fluxo de execucao;
- produtos genericos nao refletem o jeito real de trabalho do usuario.

## Solucao

Ma.ia deve oferecer uma camada pessoal de apoio inteligente para organizar entradas, sugerir proximas acoes, acompanhar contexto e ajudar o usuario a executar pequenas decisoes do dia a dia.

No MVP, a solucao deve priorizar:

- captura rapida de informacoes;
- organizacao em itens acionaveis;
- sugestoes simples geradas por IA;
- historico e contexto por usuario;
- experiencia mobile leve em React Native/Expo;
- backend proprio em Python/FastAPI preparado para futuras integracoes de IA.

## Core Loop

1. O usuario registra uma informacao, ideia, tarefa ou contexto.
2. Ma.ia interpreta e organiza essa entrada.
3. O produto sugere uma proxima acao ou estrutura util.
4. O usuario aceita, ajusta, conclui ou descarta.
5. O historico melhora o contexto para as proximas interacoes.

O loop principal deve ser curto, frequente e verificavel. A IA deve reduzir friccao, nao substituir clareza de produto.

## Principios do Produto

- Mobile-first: a experiencia principal deve funcionar bem no celular.
- Utilidade antes de automacao: toda funcao deve resolver uma acao real do usuario.
- IA como apoio, nao como interface unica: o usuario deve conseguir entender, revisar e controlar resultados.
- Contexto com responsabilidade: guardar apenas o que for necessario para melhorar a experiencia.
- Dominio isolado: Ma.ia nao deve depender de regras internas de outros produtos.
- Evolucao incremental: cada entrega deve ser pequena, testavel e reversivel.
- Clareza operacional: erros, limites e estados de carregamento devem ser explicitos.

## Escopo do MVP

- Aplicativo mobile Expo para login e uso inicial.
- Backend FastAPI dedicado ao produto Ma.ia.
- Autenticacao reaproveitando a identidade Trevvos, quando possivel.
- Banco de dados isolado em schema ou database proprio.
- Entidades iniciais para usuario Ma.ia, entradas, itens organizados e historico minimo.
- Contratos HTTP claros entre mobile e API.
- Estrutura preparada para integracao futura com provedores de IA.
- Configuracao por ambiente para API, banco, autenticacao e provedor de IA.

## Fora do Escopo Inicial

- Criar `apps/maia-api`.
- Criar `apps/maia-mobile`.
- Implementar IA generativa em producao.
- Criar agente autonomo com execucao externa.
- Integrar pagamentos.
- Criar painel administrativo completo.
- Migrar autenticacao Trevvos para outro provedor.
- Compartilhar banco ou models Prisma diretamente com Ma.ia.
- Reescrever funcionalidades existentes do portal, blog, todo ou Controllar.
