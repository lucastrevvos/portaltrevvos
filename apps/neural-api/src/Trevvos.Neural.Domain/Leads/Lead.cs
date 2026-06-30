namespace Trevvos.Neural.Domain.Leads;

public sealed class Lead
{
    private readonly List<LeadMessage> _messages = [];

    public Guid Id { get; private set; } = Guid.NewGuid();

    public string? Name { get; private set; }
    public string? Email { get; private set; }
    public string? Phone { get; private set; }
    public string? CompanyName { get; private set; }

    public VisitorType VisitorType { get; private set; } = VisitorType.Unknown;
    public VisitorIntent Intent { get; private set; } = VisitorIntent.Unknown;
    public LeadTemperature Temperature { get; private set; } = LeadTemperature.Cold;
    public LeadStatus Status { get; private set; } = LeadStatus.New;

    public string Source { get; private set; } = "portal";
    public string? Summary { get; private set; }
    public string? RecommendedProduct { get; private set; }
    public string? NextAction { get; private set; }

    public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; private set; } = DateTimeOffset.UtcNow;

    public IReadOnlyCollection<LeadMessage> Messages => _messages.AsReadOnly();

    private Lead()
    {
    }

    public Lead(string? name, string? email, string? phone, string? companyName, string? initialMessage)
    {
        Name = Normalize(name);
        Email = Normalize(email);
        Phone = Normalize(phone);
        CompanyName = Normalize(companyName);

        if (!string.IsNullOrWhiteSpace(initialMessage))
        {
            AddMessage("visitor", initialMessage);
        }
    }

    public void ApplyClassification(VisitorType visitorType, VisitorIntent intent, LeadTemperature temperature, string? summary, string? recommendedProduct, string? nextAction)
    {
        VisitorType = visitorType;
        Intent = intent;
        Temperature = temperature;
        Summary = Normalize(summary);
        RecommendedProduct = Normalize(recommendedProduct);
        NextAction = Normalize(nextAction);

        if (Status == LeadStatus.New)
        {
            Status = LeadStatus.Qualified;
        }

        Touch();
    }

    public void AddMessage(string role, string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return;
        }

        _messages.Add(new LeadMessage(Id, role, content));
        Touch();
    }



    public void ChangeStatus(LeadStatus status)
    {
        Status = status;
        Touch();
    }

    public void UpdateContact(string? name, string? email, string? phone, string? companyName)
    {
        if (!string.IsNullOrWhiteSpace(name))
        {
            Name = Normalize(name);
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            Email = Normalize(email);
        }

        if (!string.IsNullOrWhiteSpace(phone))
        {
            Phone = Normalize(phone);
        }

        if (!string.IsNullOrWhiteSpace(companyName))
        {
            CompanyName = Normalize(companyName);
        }

        Touch();
    }

    public void Touch()
    {
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    private static string? Normalize(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

}
