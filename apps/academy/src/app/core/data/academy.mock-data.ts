import { AcademyCourse, ForgeLog, StudentDashboard, TokenTransaction } from '../models/academy.models';

const criteria = [
  { id: 'c1', description: 'A regra principal fica fora da camada HTTP.', required: true },
  { id: 'c2', description: 'A solucao deixa evidencias no codigo e em uma explicacao curta.', required: true },
  { id: 'c3', description: 'O aluno consegue justificar o impacto da decisao tecnica.', required: true },
];

export const academyCourseMock: AcademyCourse = {
  id: 'course-se-2026',
  slug: 'engenharia-software-2026',
  title: 'Engenharia de Software 2026',
  level: 'Intermediario para avancado',
  format: 'Textual, consultavel e pratico',
  statusLabel: 'em construcao / preview',
  description:
    'Um curso profundo para formar engenharia de software de verdade: sistemas compreensiveis, arquitetura aplicada, codigo sustentavel e pratica validada pelo Trevvos Forge Tutor.',
  modules: [
    {
      id: 'mod-1',
      slug: 'fundamentos-engenharia-software',
      title: 'Modulo 1 - Fundamentos de Engenharia de Software',
      order: 1,
      lessons: [
        {
          id: 'lesson-1',
          slug: 'o-que-e-engenharia-de-software-de-verdade',
          moduleId: 'mod-1',
          order: 1,
          title: 'O que e Engenharia de Software de verdade',
          summary: 'Entenda engenharia como disciplina para reduzir risco, custo de mudanca e ambiguidade.',
          estimatedMinutes: 42,
          status: 'in_progress',
          objectives: [
            'Diferenciar programacao de engenharia de software.',
            'Reconhecer decisoes tecnicas que afetam manutencao.',
            'Criar uma primeira evidencia local para validacao do Forge.',
          ],
          theory:
            'Engenharia de Software nao e apenas escrever codigo. E transformar uma necessidade em um sistema que possa evoluir sem colapsar. Isso inclui modelar responsabilidades, nomear conceitos, reduzir acoplamento, testar comportamento e tomar decisoes que continuem compreensiveis meses depois.',
          guidedExample:
            'Imagine um endpoint que calcula desconto, valida permissao e salva pedido. A primeira melhoria nao e criar mais arquivos por estetica; e separar entrada HTTP, caso de uso e regra de negocio para que cada parte tenha um motivo claro para mudar.',
          commonMistakes: [
            'Confundir arquitetura com quantidade de pastas.',
            'Colocar regra de negocio em controller porque parece mais rapido.',
            'Testar apenas o caminho feliz e ignorar custo de manutencao.',
          ],
          localPractice:
            'Crie uma pequena API ou modulo local com um fluxo de pedido simples. Separe a decisao de negocio da entrada HTTP e escreva uma explicacao curta sobre a responsabilidade de cada camada.',
          forgeMission:
            'Peca ao Forge Tutor para analisar se a regra principal esta fora do controller e se a explicacao demonstra entendimento da separacao de responsabilidades.',
          approvalCriteria: criteria,
          exercises: [
            {
              id: 'ex-1',
              slug: 'separar-regra-do-controller',
              lessonId: 'lesson-1',
              title: 'Separar regra principal do controller',
              description:
                'Refatore um fluxo pequeno para que a decisao de negocio fique em uma camada de aplicacao ou dominio, deixando o controller apenas como entrada HTTP.',
              type: 'mixed',
              required: true,
              status: 'pending',
              instructions: [
                'Escolha um fluxo simples: criar pedido, aprovar cadastro ou calcular desconto.',
                'Mantenha o controller sem decisao de negocio relevante.',
                'Documente em poucas linhas onde a regra ficou e por que.',
              ],
              expectedEvidence: [
                'Codigo local com controller, caso de uso e regra isolada.',
                'Explicacao curta sobre a responsabilidade de cada parte.',
                'Uma execucao ou teste simples mostrando o comportamento.',
              ],
              validationCriteria: criteria,
              attempts: [],
            },
            {
              id: 'ex-2',
              slug: 'explicar-custo-de-mudanca',
              lessonId: 'lesson-1',
              title: 'Explicar custo de mudanca',
              description:
                'Escreva uma analise curta mostrando como sua separacao reduz o custo de alterar a regra no futuro.',
              type: 'written_explanation',
              required: true,
              status: 'pending',
              instructions: [
                'Liste uma mudanca provavel de negocio.',
                'Explique quais arquivos mudariam.',
                'Mostre por que a entrada HTTP nao deveria ser afetada.',
              ],
              expectedEvidence: [
                'Texto objetivo com uma mudanca futura.',
                'Raciocinio sobre impacto e fronteiras.',
              ],
              validationCriteria: criteria,
              attempts: [],
            },
          ],
        },
        {
          id: 'lesson-2',
          slug: 'do-codigo-ao-sistema',
          moduleId: 'mod-1',
          order: 2,
          title: 'Do codigo ao sistema',
          summary: 'Como arquivos viram comportamento de produto, operacao e manutencao.',
          estimatedMinutes: 38,
          status: 'locked',
          objectives: ['Mapear fluxo de aplicacao.', 'Identificar dependencias centrais.', 'Separar comportamento de detalhe tecnico.'],
          theory: 'Um sistema e a soma das decisoes de comportamento, dados, integracao, observabilidade e manutencao.',
          guidedExample: 'Um cadastro simples envolve validacao, persistencia, eventos e retorno claro para o usuario.',
          commonMistakes: ['Pensar so em endpoint.', 'Ignorar fluxo de erro.', 'Tratar banco como regra de negocio.'],
          localPractice: 'Mapeie um fluxo real em passos e dependencias.',
          forgeMission: 'O Forge deve validar se o mapa separa comportamento de detalhes.',
          approvalCriteria: criteria,
          exercises: [],
        },
        {
          id: 'lesson-3',
          slug: 'complexidade-manutencao-custo-de-mudanca',
          moduleId: 'mod-1',
          order: 3,
          title: 'Complexidade, manutencao e custo de mudanca',
          summary: 'Aprenda a enxergar complexidade antes que ela vire retrabalho.',
          estimatedMinutes: 45,
          status: 'locked',
          objectives: ['Reconhecer acoplamento.', 'Estimar impacto de mudanca.', 'Definir limites saudaveis.'],
          theory: 'Complexidade aparece quando uma mudanca pequena exige conhecimento de partes demais do sistema.',
          guidedExample: 'Uma regra de preco espalhada por tres telas, dois services e um job e cara de mudar.',
          commonMistakes: ['Medir qualidade so por linhas de codigo.', 'Otimizar antes de entender fronteiras.'],
          localPractice: 'Analise uma mudanca simples em um projeto local.',
          forgeMission: 'O Forge valida se a analise tem evidencia concreta.',
          approvalCriteria: criteria,
          exercises: [],
        },
        {
          id: 'lesson-4',
          slug: 'separacao-de-responsabilidades',
          moduleId: 'mod-1',
          order: 4,
          title: 'Separacao de responsabilidades',
          summary: 'Responsabilidades claras como base para evolucao sustentavel.',
          estimatedMinutes: 41,
          status: 'locked',
          objectives: ['Nomear responsabilidades.', 'Evitar mistura entre entrada, regra e infra.', 'Criar fronteiras simples.'],
          theory: 'Separar responsabilidades e reduzir motivos concorrentes de mudanca no mesmo ponto do codigo.',
          guidedExample: 'Controller recebe, caso de uso coordena, dominio decide, infraestrutura persiste.',
          commonMistakes: ['Criar camadas vazias.', 'Mover codigo sem mudar dependencia real.'],
          localPractice: 'Refatore um fluxo pequeno e justifique as fronteiras.',
          forgeMission: 'O Forge valida evidencias de fronteira e justificativa.',
          approvalCriteria: criteria,
          exercises: [],
        },
      ],
    },
    {
      id: 'mod-2',
      slug: 'arquitetura-sistemas-reais',
      title: 'Modulo 2 - Arquitetura de Sistemas Reais',
      order: 2,
      lessons: [
        lessonPlaceholder('lesson-5', 'mod-2', 5, 'camadas-dependencias-fronteiras', 'Camadas, dependencias e fronteiras'),
        lessonPlaceholder('lesson-6', 'mod-2', 6, 'monolito-modular-vs-monolito-baguncado', 'Monolito modular vs monolito baguncado'),
        lessonPlaceholder('lesson-7', 'mod-2', 7, 'casos-de-uso-fluxo-aplicacao', 'Casos de uso e fluxo de aplicacao'),
        lessonPlaceholder('lesson-8', 'mod-2', 8, 'introducao-ddd-pratica', 'Introducao a DDD na pratica'),
      ],
    },
    {
      id: 'mod-3',
      slug: 'backend-profissional-dotnet',
      title: 'Modulo 3 - Backend Profissional com .NET',
      order: 3,
      lessons: [
        lessonPlaceholder('lesson-9', 'mod-3', 9, 'estrutura-inicial-api-profissional', 'Estrutura inicial de uma API profissional'),
        lessonPlaceholder('lesson-10', 'mod-3', 10, 'entidades-value-objects-regras-dominio', 'Entidades, Value Objects e regras de dominio'),
        lessonPlaceholder('lesson-11', 'mod-3', 11, 'repositorios-persistencia-infraestrutura', 'Repositorios, persistencia e infraestrutura'),
        lessonPlaceholder('lesson-12', 'mod-3', 12, 'testes-validacao-comportamento', 'Testes e validacao de comportamento'),
      ],
    },
  ],
};

function lessonPlaceholder(id: string, moduleId: string, order: number, slug: string, title: string) {
  return {
    id,
    slug,
    moduleId,
    order,
    title,
    summary: 'Aula prevista no roteiro inicial do curso, bloqueada ate a conclusao da etapa anterior.',
    estimatedMinutes: 40,
    status: 'locked' as const,
    objectives: ['Estudar o conceito central.', 'Aplicar em um projeto local.', 'Validar evidencias com o Forge Tutor.'],
    theory: 'Conteudo textual profundo em preparacao para a versao completa do curso.',
    guidedExample: 'Exemplo guiado sera conectado a um projeto local do aluno.',
    commonMistakes: ['Avancar sem evidencia pratica.', 'Copiar solucao sem entender a decisao.'],
    localPractice: 'Pratica local conectada ao tema da aula.',
    forgeMission: 'O Forge Tutor validara evidencias antes de liberar a proxima aula.',
    approvalCriteria: criteria,
    exercises: [],
  };
}

export const studentDashboardMock: StudentDashboard = {
  studentId: 'student-1',
  studentName: 'Lucas',
  currentCourseSlug: 'engenharia-software-2026',
  currentLessonSlug: 'o-que-e-engenharia-de-software-de-verdade',
  aiMode: 'local',
  tokenBalance: 1240,
};

export const tokenTransactionsMock: TokenTransaction[] = [
  { id: 't1', description: 'Bonus inicial da conta demo', amount: 1500, createdAt: '2026-06-20T14:00:00.000Z' },
  { id: 't2', description: 'Sessao Trevvos IA online para revisao textual', amount: -180, createdAt: '2026-06-22T18:30:00.000Z' },
  { id: 't3', description: 'Validacao local pelo Forge Tutor', amount: 0, createdAt: '2026-06-25T10:15:00.000Z' },
];

export const forgeLogsMock: ForgeLog[] = [
  { id: 'l1', message: 'Forge Local detectado na porta demo 4317.', createdAt: '2026-06-26T09:10:00.000Z', mode: 'local', status: 'success' },
  { id: 'l2', message: 'Ultima validacao reprovou sem consumir tokens.', createdAt: '2026-06-26T09:21:00.000Z', mode: 'local', status: 'warning' },
];
