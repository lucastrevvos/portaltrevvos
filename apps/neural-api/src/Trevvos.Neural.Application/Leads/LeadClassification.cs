using Trevvos.Neural.Domain.Leads;

namespace Trevvos.Neural.Application.Leads;
public sealed record LeadClassification(
    VisitorType VisitorType,
    VisitorIntent Intent,
    LeadTemperature Temperature,
    string Summary,
    string RecommendedProduct,
    string NextAction
);
