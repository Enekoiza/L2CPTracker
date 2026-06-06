using L2CpTracker.Application.Common.Interfaces;
using L2CpTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace L2CpTracker.Infrastructure.Persistence.Repositories;

public sealed class MemberRepository(AppDbContext db) : IMemberRepository
{
    public async Task<IReadOnlyList<Member>> GetAllAsync(CancellationToken ct) =>
        await db.Members.AsNoTracking().OrderBy(m => m.Name).ToListAsync(ct);

    public Task<Member?> GetByIdAsync(Guid id, CancellationToken ct) =>
        db.Members.FirstOrDefaultAsync(m => m.Id == id, ct);

    public Task<bool> ExistsByNameAsync(string name, CancellationToken ct) =>
        db.Members.AnyAsync(m => m.Name == name, ct);

    public async Task AddAsync(Member member, CancellationToken ct) =>
        await db.Members.AddAsync(member, ct);

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        var member = await db.Members.FirstOrDefaultAsync(m => m.Id == id, ct);
        if (member is null) return false;
        db.Members.Remove(member);
        return true;
    }
}
