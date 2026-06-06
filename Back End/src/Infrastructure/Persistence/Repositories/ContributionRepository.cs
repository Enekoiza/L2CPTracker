using L2CpTracker.Application.Common.Interfaces;
using L2CpTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace L2CpTracker.Infrastructure.Persistence.Repositories;

public sealed class ContributionRepository(AppDbContext db) : IContributionRepository
{
    public async Task<IReadOnlyList<Contribution>> GetAllAsync(CancellationToken ct) =>
        await db.Contributions
            .AsNoTracking()
            .Include(c => c.Member)
            .OrderByDescending(c => c.CreatedAtUtc)
            .ToListAsync(ct);

    public async Task AddRangeAsync(IEnumerable<Contribution> contributions, CancellationToken ct) =>
        await db.Contributions.AddRangeAsync(contributions, ct);

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var contribution = await db.Contributions.FirstOrDefaultAsync(c => c.Id == id, ct);
        if (contribution is null) return false;
        db.Contributions.Remove(contribution);
        return true;
    }
}
