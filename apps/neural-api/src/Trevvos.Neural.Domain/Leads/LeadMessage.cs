namespace Trevvos.Neural.Domain.Leads;

public sealed class LeadMessage
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid LeadId { get; private set; }

    public string Role { get; private set; } = "visitor";
    public string Content { get; private set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; private set; } = DateTimeOffset.UtcNow;

    private LeadMessage()
    {

    }

    public LeadMessage(Guid leadId, string role, string content)
    {
        LeadId = leadId;
        Role = string.IsNullOrWhiteSpace(role) ? "visitor" : role.Trim();
        Content = content.Trim();
    }

    public static LeadMessage Restore(Guid id, Guid leadId, string role, string content, DateTimeOffset createdAt)
    {
        var message = new LeadMessage(leadId, role, content)
        {
            Id = id,
            CreatedAt = createdAt
        };

        return message;
    }
}
