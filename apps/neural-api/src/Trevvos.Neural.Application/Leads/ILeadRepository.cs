using Trevvos.Neural.Domain.Leads;

namespace Trevvos.Neural.Application.Leads;

public interface ILeadRepository
{
    Task AddAsync(Lead lead, CancellationToken cancellationToken);
    Task<Lead?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Lead>> GetAllAsync(CancellationToken cancellationToken);
    Task UpdateAsync(Lead lead, CancellationToken cancellationToken);
}
