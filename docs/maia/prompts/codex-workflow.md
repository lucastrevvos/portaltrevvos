# Ma.ia - Workflow com Codex

## Idioma

Neste projeto, trabalhar em portugues por padrao. Codigos, nomes de arquivos, variaveis e contratos tecnicos podem permanecer em ingles quando isso for mais natural para a stack.

## Regras Gerais

- Entender a estrutura atual antes de propor alteracoes.
- Respeitar o monorepo existente: `apps/*` para apps e `packages/*` para pacotes compartilhados.
- Nao modificar `apps/api`, `apps/web` ou pacotes compartilhados sem necessidade clara.
- Nao criar `maia-api` nem `maia-mobile` ate que essa etapa seja explicitamente solicitada.
- Manter documentacao, arquitetura e implementacao em passos separados quando a mudanca for estrutural.

## Antes de Modificar

Para tarefas estruturais, sempre propor antes de modificar:

- nova app;
- novo pacote compartilhado;
- mudanca de autenticacao;
- mudanca de banco ou migracao;
- dependencia nova;
- alteracao em configuracao raiz;
- integracao com IA;
- pipeline de deploy ou CI.

A proposta deve indicar objetivo, arquivos afetados, riscos e como validar.

## Tarefas Pequenas e Verificaveis

Dividir trabalho em entregas pequenas:

- documentar antes de implementar;
- criar estrutura antes de escrever dominio complexo;
- adicionar contrato antes de integrar mobile;
- testar uma rota antes de expandir modulo;
- validar autenticacao antes de adicionar funcionalidades dependentes dela.

Cada tarefa deve terminar com uma forma objetiva de verificacao.

## Separacao de Dominios

- Nao misturar dominio Ma.ia com blog, portal, todo ou Controllar.
- Nao importar services NestJS dentro do FastAPI.
- Nao apontar migrations do Ma.ia para schemas de outros produtos.
- Nao adicionar regras especificas do Ma.ia em pacotes compartilhados genericos sem justificativa.
- Compartilhar apenas contratos, identidade e configuracoes explicitamente desenhadas para isso.

## Dependencias

Nao criar dependencias sem justificar.

Ao sugerir ou adicionar dependencia, explicar:

- por que ela e necessaria;
- qual problema resolve;
- alternativa considerada;
- impacto em build, runtime e manutencao;
- se afeta apenas Ma.ia ou o monorepo inteiro.

## Arquivos Alterados

Sempre explicar os arquivos alterados ao final da tarefa:

- caminho do arquivo;
- motivo da alteracao;
- impacto esperado;
- qualquer decisao relevante tomada durante a edicao.

Se nenhum arquivo for alterado, dizer isso explicitamente.

## Como Testar

Sempre indicar como testar ou validar:

- comando de teste, quando existir;
- comando de lint/build, quando aplicavel;
- rota ou fluxo manual a conferir;
- verificacao de documentacao para mudancas sem codigo.

Quando nao for possivel testar, explicar o motivo.

## Criterios de Qualidade

- Mudancas pequenas e focadas.
- Sem refatoracoes oportunistas.
- Sem alteracoes em apps existentes sem pedido explicito.
- Contratos claros entre mobile, API e autenticacao.
- Configuracao por ambiente bem nomeada.
- Preparacao para IA sem acoplar o MVP a um provedor cedo demais.
