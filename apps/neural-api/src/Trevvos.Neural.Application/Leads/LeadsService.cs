using Trevvos.Neural.Domain.Leads;

namespace Trevvos.Neural.Application.Leads;

public sealed class LeadsService
{
    private readonly ILeadRepository _repository;
    private readonly ILeadClassifier _classifier;

    public LeadsService(ILeadRepository leadRepository, ILeadClassifier classifier)
    {
        _repository = leadRepository;
        _classifier = classifier;
    }

    public async Task<LeadDto> CreateAsync(CreateLeadRequest request, CancellationToken cancellationToken)
    {
        var lead = new Lead(
            request.Name,
            request.Email,
            request.Phone,
            request.CompanyName,
            request.InitialMessage
        );

        var classification = _classifier.Classify(lead);

        lead.ApplyClassification(
            classification.VisitorType,
            classification.Intent,
            classification.Temperature,
            classification.Summary,
            classification.RecommendedProduct,
            classification.NextAction
        );

        await _repository.AddAsync(lead, cancellationToken);

        return MapToDto(lead);
    }

    public async Task<IReadOnlyCollection<LeadDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var leads = await _repository.GetAllAsync(cancellationToken);

        return leads
            .OrderByDescending(lead => lead.CreatedAt)
            .Select(MapToDto)
            .ToList();
    }

    public async Task<LeadDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var lead = await _repository.GetByIdAsync(id, cancellationToken);

        return lead is null ? null : MapToDto(lead);
    }

    public async Task<LeadDto?> AddMessageAsync(Guid id, AddLeadMessageRequest request, CancellationToken cancellationToken)
    {
        var lead = await _repository.GetByIdAsync(id, cancellationToken);

        if (lead is null)
        {
            return null;
        }

        lead.AddMessage(request.Role ?? "visitor", request.Content);

        var classification = _classifier.Classify(lead);

        lead.ApplyClassification(
            classification.VisitorType,
            classification.Intent,
            classification.Temperature,
            classification.Summary,
            classification.RecommendedProduct,
            classification.NextAction
        );

        await _repository.UpdateAsync(lead, cancellationToken);

        return MapToDto(lead);
    }

    public async Task<LeadDto?> ChangeStatusAsync(Guid id, ChangeLeadStatusRequest request, CancellationToken cancellationToken)
    {
        var lead = await _repository.GetByIdAsync(id, cancellationToken);

        if (lead is null)
        {
            return null;
        }

        if (!Enum.TryParse<LeadStatus>(request.Status, ignoreCase: true, out var status))
        {
            throw new InvalidOperationException($"Invalid lead status: {request.Status}");
        }

        lead.ChangeStatus(status);

        await _repository.UpdateAsync(lead, cancellationToken);

        return MapToDto(lead);
    }
    private static LeadDto MapToDto(Lead lead)
    {
        return new LeadDto(
            lead.Id,
            lead.Name,
            lead.Email,
            lead.Phone,
            lead.CompanyName,
            lead.VisitorType.ToString(),
            lead.Intent.ToString(),
            lead.Temperature.ToString(),
            lead.Status.ToString(),
            lead.Source,
            lead.Summary,
            lead.RecommendedProduct,
            lead.NextAction,
            lead.CreatedAt,
            lead.UpdatedAt,
            lead.Messages
                .OrderBy(message => message.CreatedAt)
                .Select(message => new LeadMessageDto(
                    message.Id,
                    message.Role,
                    message.Content,
                    message.CreatedAt
                ))
                .ToList()
        );
    }
}
