using L2CpTracker.Domain.Entities;

namespace L2CpTracker.Application.Common.Interfaces;

public interface IContributionRepository
{
    Task<IReadOnlyList<Contribution>> GetAllAsync(CancellationToken ct);
    Task AddRangeAsync(IEnumerable<Contribution> contributions, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
