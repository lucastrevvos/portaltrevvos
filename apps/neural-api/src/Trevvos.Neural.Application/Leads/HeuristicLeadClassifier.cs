using Trevvos.Neural.Domain.Leads;

namespace Trevvos.Neural.Application.Leads;

public sealed class HeuristicLeadClassifier : ILeadClassifier
{
    public LeadClassification Classify(Lead lead)
    {
        var text = BuildSearchText(lead);

        if (ContainsAny(text, "empresa", "negócio", "negocio", "automação", "automacao", "vendas", "lead", "atendimento", "cliente", "crm"))
        {
            return new LeadClassification(
                VisitorType.Campany,
                VisitorIntent.HireAutomation,
                LeadTemperature.Hot,
                "Visitante demonstrou interesse em automação, vendas, atendimento ou operação empresarial.",
                "Trevvos Automations",
                "Oferecer diagnóstico inicial e solicitar melhor canal de contato."
            );
        }

        if (ContainsAny(text, "dev", "desenvolvedor", "programador", "github", "portfólio", "portfolio", "forge", ".net", "angular", "python"))
        {
            return new LeadClassification(
                VisitorType.Developer,
                VisitorIntent.UseForge,
                LeadTemperature.Warm,
                "Visitante parece ser dev ou ter interesse em ferramentas para desenvolvimento e evolução técnica.",
                "Trevvos Forge",
                "Apresentar Forge, Academy e opção de análise de GitHub."
            );
        }

         if (ContainsAny(text, "aluno", "curso", "aprender", "estudar", "aula", "trilha", "ia aplicada", "engenharia de software"))
        {
            return new LeadClassification(
                VisitorType.Student,
                VisitorIntent.LearnAi,
                LeadTemperature.Warm,
                "Visitante demonstrou interesse em aprendizado, cursos ou trilhas de IA e engenharia de software.",
                "Trevvos Academy",
                "Oferecer entrada na lista da Academy ou trilha inicial recomendada."
            );
        }

        if(ContainsAny(text, "recrutador", "vaga", "candidato", "currículo", "curriculo", "contratar", "talento"))
        {
            return new LeadClassification(
                VisitorType.Recruiter,
                VisitorIntent.AnalyzeGithub,
                LeadTemperature.Warm,
                "Visitante demonstrou interesse relacionado a recrutamento, candidatos ou análise de perfis.",
                "Trevvos Github Analyzer",
                "Apresentar análise de perfis técnicos e captura de requisitos de vaga."
            );
        }

        return new LeadClassification(
            VisitorType.Curious,

            VisitorIntent.KnowTrevvos,

            LeadTemperature.Cold,

            "Visitante está explorando a Trevvos sem intenção comercial clara ainda.",

            "Trevvos Portal",

            "Apresentar visão geral da Trevvos e convidar para acompanhar conteúdos."
        );
    }


    private static string BuildSearchText(Lead lead)
    {
        var messages = string.Join(" ", lead.Messages.Select(message => message.Content));

        return string.Join(" ", new[]
        {
            lead.Name,
            lead.Email,
            lead.Phone,
            lead.CompanyName,
            messages
        }).ToLowerInvariant();
    }

    private static bool ContainsAny(string text, params string[] terms)
    {
        return terms.Any(term => text.Contains(term, StringComparison.OrdinalIgnoreCase));
    }

}
