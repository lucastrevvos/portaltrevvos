import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

const utm = 'utm_source=trevvos_portal&utm_medium=landing&utm_campaign=forge_alpha';

const forgeLinks = {
  github: `https://github.com/trevvos/trevvos-forge?${utm}`,
  release: `https://github.com/trevvos/trevvos-forge/releases/tag/v0.1.0-alpha.1?${utm}`,
  feedback: `https://github.com/trevvos/trevvos-forge/issues/new?template=alpha-feedback.md&${utm}`,
  academy: '/academy',
};

@Component({
  selector: 'app-forge-landing',
  standalone: true,
  templateUrl: './forge-landing.component.html',
  styleUrl: './forge-landing.component.scss',
})
export class ForgeLandingComponent {
  readonly links = forgeLinks;

  readonly problemCards = [
    {
      title: 'Contexto sensivel',
      text: 'Nem todo projeto deveria depender 100% de ferramentas fechadas.',
    },
    {
      title: 'Pouca transparencia',
      text: 'Usar IA sem entender o fluxo limita seu aprendizado.',
    },
    {
      title: 'Dependencia externa',
      text: 'Modelos locais permitem experimentar com mais autonomia.',
    },
    {
      title: 'Engenharia real',
      text: 'O Forge aproxima IA, CLI, contexto, testes e evolucao de codigo.',
    },
  ];

  readonly forgeHighlights = [
    'CLI local-first',
    'Integracao com modelos via Ollama',
    'Comandos para ask, plan, scan e doctor',
    'Caminho para diff, apply e sessoes locais',
    'Base pratica para aprender IA aplicada e LLMOps',
  ];

  readonly usageSteps = [
    { step: 'Passo 1', title: 'Instale', command: 'pip install trevvos-forge' },
    { step: 'Passo 2', title: 'Verifique o ambiente', command: 'trevvos doctor' },
    {
      step: 'Passo 3',
      title: 'Pergunte ao projeto',
      command: 'trevvos ask "Explique a estrutura deste projeto"',
    },
    {
      step: 'Passo 4',
      title: 'Gere um plano',
      command: 'trevvos plan "Adicionar suporte a sessoes locais"',
    },
    { step: 'Passo 5', title: 'Escaneie contexto', command: 'trevvos scan' },
  ];

  readonly commands = [
    { name: 'trevvos doctor', text: 'Verifica se o ambiente local esta pronto.' },
    { name: 'trevvos ask "..."', text: 'Faz perguntas tecnicas sobre o projeto.' },
    { name: 'trevvos plan "..."', text: 'Gera um plano antes de alterar codigo.' },
    { name: 'trevvos scan', text: 'Ajuda a mapear arquivos e contexto relevante.' },
    { name: 'trevvos diff', text: 'Em evolucao: caminho para visualizar mudancas propostas.' },
    { name: 'trevvos apply', text: 'Em evolucao: caminho para aplicar alteracoes com confirmacao.' },
  ];

  readonly localFirst = [
    'Mais controle sobre ambiente',
    'Bom para estudo e experimentacao',
    'Ideal para projetos pessoais e ambientes sensiveis',
    'Evolucao aberta com feedback real',
  ];

  readonly audiences = [
    'Devs estudando IA aplicada',
    'Engenheiros querendo entender ferramentas de IA por baixo',
    'Pessoas criando portfolio tecnico real',
    'Times testando IA local',
    'Comunidade open source',
  ];

  readonly alphaNow = [
    'CLI inicial',
    'ask / plan / scan / doctor',
    'documentacao inicial',
    'release alpha',
    'feedback via GitHub',
  ];

  readonly nextSteps = [
    'sessoes locais em .trevvos/',
    'historico entre comandos',
    'diff estruturado',
    'apply com confirmacao',
    'versionamento de prompts',
    'logs locais',
    'avaliacao de respostas',
    'RAG/LLMOps no futuro',
  ];

  private readonly browserTitle = inject(Title);

  constructor() {
    this.browserTitle.setTitle('Trevvos Forge | IA local para desenvolvimento');
  }
}
