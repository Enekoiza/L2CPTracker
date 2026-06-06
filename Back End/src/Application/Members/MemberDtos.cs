namespace L2CpTracker.Application.Members;

public record MemberDto(Guid Id, string Name);

public record CreateMemberRequest(string Name);
