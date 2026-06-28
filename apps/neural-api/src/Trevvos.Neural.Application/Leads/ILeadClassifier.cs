using Trevvos.Neural.Domain.Leads;

namespace Trevvos.Neural.Application.Leads;

public interface ILeadClassifier
{
    LeadClassification Classify(Lead lead);
}


