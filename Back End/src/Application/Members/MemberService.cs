using L2CpTracker.Application.Common.Exceptions;
using L2CpTracker.Application.Common.Interfaces;
using L2CpTracker.Domain.Entities;

namespace L2CpTracker.Application.Members;

public sealed class MemberService(IMemberRepository repository, IUnitOfWork uow) : IMemberService
{
    public async Task<IReadOnlyList<MemberDto>> GetAllAsync(CancellationToken ct)
    {
        var members = await repository.GetAllAsync(ct);
        return members.Select(m => new MemberDto(m.Id, m.Name)).ToList();
    }

    public async Task<MemberDto> CreateAsync(CreateMemberRequest request, CancellationToken ct)
    {
        var name = request.Name?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(name))
            throw new AppValidationException("Member name is required.");
        if (name.Length > 50)
            throw new AppValidationException("Member name must be 50 characters or fewer.");
        if (await repository.ExistsByNameAsync(name, ct))
            throw new AppValidationException($"A member named '{name}' already exists.");

        var member = new Member { Name = name };
        await repository.AddAsync(member, ct);
        await uow.SaveChangesAsync(ct);
        return new MemberDto(member.Id, member.Name);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var removed = await repository.DeleteAsync(id, ct);
        if (!removed)
            throw new NotFoundException($"Member '{id}' was not found.");
        await uow.SaveChangesAsync(ct);
    }
}
