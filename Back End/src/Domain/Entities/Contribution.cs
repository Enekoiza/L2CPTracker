namespace L2CpTracker.Domain.Entities;

/// <summary>Kind of contribution that earned the points.</summary>
public enum ContributionType
{
    Material = 0,
    Event = 1,
}

/// <summary>A single logged contribution (donation, party split, or event attendance).</summary>
public class Contribution
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MemberId { get; set; }
    public Member? Member { get; set; }

    public ContributionType Type { get; set; }

    /// <summary>Points awarded (NPC price-based, can be fractional after divisor).</summary>
    public decimal Points { get; set; }

    /// <summary>Human-readable summary, e.g. "2000× Animal Bone" or "Castle Siege".</summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>Display badge: SOLO, PARTY ÷N, or EVENT.</summary>
    public string Badge { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
