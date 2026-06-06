namespace L2CpTracker.Application.Members;

public interface IMemberService
{
    Task<IReadOnlyList<MemberDto>> GetAllAsync(CancellationToken ct);
    Task<MemberDto> CreateAsync(CreateMemberRequest request, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
}
