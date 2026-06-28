using System.Collections.Concurrent;
using Trevvos.Neural.Application.Leads;
using Trevvos.Neural.Domain.Leads;

namespace Trevvos.Neural.Infrastructure.Leads;

public sealed class InMemoryLeadRepository : ILeadRepository
{
    private readonly ConcurrentDictionary<Guid, Lead> _leads = new();

    public Task AddAsync(Lead lead, CancellationToken cancellationToken)
    {
        _leads[lead.Id] = lead;

        return Task.CompletedTask;
    }

    public Task<Lead?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        _leads.TryGetValue(id, out var lead);

        return Task.FromResult(lead);
    }

    public Task<IReadOnlyCollection<Lead>> GetAllAsync(CancellationToken cancellationToken)
    {
        IReadOnlyCollection<Lead> leads = _leads.Values.ToList();

        return Task.FromResult(leads);
    }

    public Task UpdateAsync(Lead lead, CancellationToken cancellationToken)
    {
        _leads[lead.Id] = lead;

        return Task.CompletedTask;
    }
}
