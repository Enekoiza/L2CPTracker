using L2CpTracker.Domain.Entities;

namespace L2CpTracker.Application.Common.Interfaces;

public interface IMemberRepository
{
    Task<IReadOnlyList<Member>> GetAllAsync(CancellationToken ct);
    Task<Member?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<bool> ExistsByNameAsync(string name, CancellationToken ct);
    Task AddAsync(Member member, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
