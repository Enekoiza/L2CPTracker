namespace L2CpTracker.Application.Contributions;

public interface IContributionService
{
    Task<IReadOnlyList<ContributionDto>> GetAllAsync(CancellationToken ct);
    Task<IReadOnlyList<ContributionDto>> CreateAsync(CreateContributionsRequest request, CancellationToken ct);
    Task DeleteAsync(Guid id, CancellationToken ct);
}
