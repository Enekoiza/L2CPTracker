namespace L2CpTracker.Application.Contributions;

/// <summary>A logged contribution returned to the client.</summary>
public record ContributionDto(
    Guid Id,
    Guid MemberId,
    string MemberName,
    string Type,
    decimal Points,
    string Description,
    string Badge,
    long Ts);

/// <summary>A single contribution to log.</summary>
public record CreateContributionRequest(
    Guid MemberId,
    string Type,
    decimal Points,
    string Description,
    string Badge);

/// <summary>Batch insert — Donate logs one, Party/Event log several at once.</summary>
public record CreateContributionsRequest(List<CreateContributionRequest> Entries);
