using L2CpTracker.Application.Common.Exceptions;
using L2CpTracker.Application.Common.Interfaces;
using L2CpTracker.Domain.Entities;

namespace L2CpTracker.Application.Contributions;

public sealed class ContributionService(
    IContributionRepository contributions,
    IMemberRepository members,
    IUnitOfWork uow) : IContributionService
{
    public async Task<IReadOnlyList<ContributionDto>> GetAllAsync(CancellationToken ct)
    {
        var list = await contributions.GetAllAsync(ct);
        return list.Select(ToDto).ToList();
    }

    public async Task<IReadOnlyList<ContributionDto>> CreateAsync(
        CreateContributionsRequest request, CancellationToken ct)
    {
        if (request.Entries is null || request.Entries.Count == 0)
            throw new AppValidationException("At least one contribution is required.");

        var entities = new List<Contribution>(request.Entries.Count);
        foreach (var e in request.Entries)
        {
            if (!ParseType(e.Type, out var type))
                throw new AppValidationException($"Invalid contribution type '{e.Type}'.");
            if (e.Points <= 0)
                throw new AppValidationException("Points must be greater than zero.");

            var member = await members.GetByIdAsync(e.MemberId, ct)
                ?? throw new NotFoundException($"Member '{e.MemberId}' was not found.");

            entities.Add(new Contribution
            {
                MemberId = member.Id,
                Type = type,
                Points = e.Points,
                Description = e.Description?.Trim() ?? string.Empty,
                Badge = e.Badge?.Trim() ?? string.Empty,
            });
        }

        await contributions.AddRangeAsync(entities, ct);
        await uow.SaveChangesAsync(ct);

        // member navigation may be null on freshly created entities — resolve names from request scope
        var names = await members.GetAllAsync(ct);
        var nameById = names.ToDictionary(m => m.Id, m => m.Name);
        return entities
            .Select(c => new ContributionDto(
                c.Id, c.MemberId, nameById.GetValueOrDefault(c.MemberId, ""),
                c.Type.ToString(), c.Points, c.Description, c.Badge, ToUnixMs(c.CreatedAtUtc)))
            .ToList();
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        var removed = await contributions.DeleteAsync(id, ct);
        if (!removed)
            throw new NotFoundException($"Contribution '{id}' was not found.");
        await uow.SaveChangesAsync(ct);
    }

    private static ContributionDto ToDto(Contribution c) => new(
        c.Id,
        c.MemberId,
        c.Member?.Name ?? string.Empty,
        c.Type.ToString(),
        c.Points,
        c.Description,
        c.Badge,
        ToUnixMs(c.CreatedAtUtc));

    private static bool ParseType(string value, out ContributionType type) =>
        Enum.TryParse(value, ignoreCase: true, out type);

    private static long ToUnixMs(DateTime utc) =>
        new DateTimeOffset(DateTime.SpecifyKind(utc, DateTimeKind.Utc)).ToUnixTimeMilliseconds();
}
