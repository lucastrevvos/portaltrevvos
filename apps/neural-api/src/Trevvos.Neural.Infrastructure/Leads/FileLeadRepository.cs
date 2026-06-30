using System.Text.Json;
using System.Text.Json.Serialization;
using Trevvos.Neural.Application.Leads;
using Trevvos.Neural.Domain.Leads;

namespace Trevvos.Neural.Infrastructure.Leads;

public sealed class FileLeadRepository : ILeadRepository
{
    private readonly SemaphoreSlim _gate = new(1, 1);
    private readonly string _filePath;
    private readonly JsonSerializerOptions _jsonOptions = CreateJsonOptions();

    public FileLeadRepository()
    {
        var dataDirectory =
            Environment.GetEnvironmentVariable("TREVVOS_DATA_PATH")
            ?? Path.Combine(Directory.GetCurrentDirectory(), ".trevvos-data");

        Directory.CreateDirectory(dataDirectory);

        _filePath = Path.Combine(dataDirectory, "leads.json");
    }

    public async Task AddAsync(Lead lead, CancellationToken cancellationToken)
    {
        await _gate.WaitAsync(cancellationToken);

        try
        {
            var leads = await LoadAsync(cancellationToken);

            leads.RemoveAll(currentLead => currentLead.Id == lead.Id);
            leads.Add(LeadSnapshot.FromDomain(lead));

            await SaveAsync(leads, cancellationToken);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<Lead?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        await _gate.WaitAsync(cancellationToken);

        try
        {
            var leads = await LoadAsync(cancellationToken);
            var lead = leads.FirstOrDefault(currentLead => currentLead.Id == id);

            return lead?.ToDomain();
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<IReadOnlyCollection<Lead>> GetAllAsync(CancellationToken cancellationToken)
    {
        await _gate.WaitAsync(cancellationToken);

        try
        {
            var leads = await LoadAsync(cancellationToken);

            return leads
                .Select(lead => lead.ToDomain())
                .ToList();
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task UpdateAsync(Lead lead, CancellationToken cancellationToken)
    {
        await _gate.WaitAsync(cancellationToken);

        try
        {
            var leads = await LoadAsync(cancellationToken);

            leads.RemoveAll(currentLead => currentLead.Id == lead.Id);
            leads.Add(LeadSnapshot.FromDomain(lead));

            await SaveAsync(leads, cancellationToken);
        }
        finally
        {
            _gate.Release();
        }
    }

    private async Task<List<LeadSnapshot>> LoadAsync(CancellationToken cancellationToken)
    {
        if (!File.Exists(_filePath))
        {
            return [];
        }

        await using var stream = File.OpenRead(_filePath);

        var leads = await JsonSerializer.DeserializeAsync<List<LeadSnapshot>>(
            stream,
            _jsonOptions,
            cancellationToken
        );

        return leads ?? [];
    }

    private async Task SaveAsync(
        List<LeadSnapshot> leads,
        CancellationToken cancellationToken)
    {
        await using var stream = File.Create(_filePath);

        await JsonSerializer.SerializeAsync(
            stream,
            leads,
            _jsonOptions,
            cancellationToken
        );
    }

    private static JsonSerializerOptions CreateJsonOptions()
    {
        var options = new JsonSerializerOptions(JsonSerializerDefaults.Web)
        {
            WriteIndented = true
        };

        options.Converters.Add(new JsonStringEnumConverter());

        return options;
    }
}

public sealed record LeadSnapshot(
    Guid Id,
    string? Name,
    string? Email,
    string? Phone,
    string? CompanyName,
    VisitorType VisitorType,
    VisitorIntent Intent,
    LeadTemperature Temperature,
    LeadStatus Status,
    string Source,
    string? Summary,
    string? RecommendedProduct,
    string? NextAction,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    List<LeadMessageSnapshot> Messages
)
{
    public static LeadSnapshot FromDomain(Lead lead)
    {
        return new LeadSnapshot(
            lead.Id,
            lead.Name,
            lead.Email,
            lead.Phone,
            lead.CompanyName,
            lead.VisitorType,
            lead.Intent,
            lead.Temperature,
            lead.Status,
            lead.Source,
            lead.Summary,
            lead.RecommendedProduct,
            lead.NextAction,
            lead.CreatedAt,
            lead.UpdatedAt,
            lead.Messages
                .Select(LeadMessageSnapshot.FromDomain)
                .ToList()
        );
    }

    public Lead ToDomain()
    {
        return Lead.Restore(
            Id,
            Name,
            Email,
            Phone,
            CompanyName,
            VisitorType,
            Intent,
            Temperature,
            Status,
            Source,
            Summary,
            RecommendedProduct,
            NextAction,
            CreatedAt,
            UpdatedAt,
            Messages.Select(message => message.ToDomain())
        );
    }
}

public sealed record LeadMessageSnapshot(
    Guid Id,
    Guid LeadId,
    string Role,
    string Content,
    DateTimeOffset CreatedAt
)
{
    public static LeadMessageSnapshot FromDomain(LeadMessage message)
    {
        return new LeadMessageSnapshot(
            message.Id,
            message.LeadId,
            message.Role,
            message.Content,
            message.CreatedAt
        );
    }

    public LeadMessage ToDomain()
    {
        return LeadMessage.Restore(
            Id,
            LeadId,
            Role,
            Content,
            CreatedAt
        );
    }
}
