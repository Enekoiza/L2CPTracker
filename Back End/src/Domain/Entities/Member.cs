namespace L2CpTracker.Domain.Entities;

/// <summary>A player belonging to the CP (party group).</summary>
public class Member
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<Contribution> Contributions { get; set; } = new List<Contribution>();
}
