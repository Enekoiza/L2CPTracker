namespace L2CpTracker.Domain.Entities;

/// <summary>Singleton settings row (Id is always 1).</summary>
public class AppSetting
{
    public int Id { get; set; } = 1;

    /// <summary>Points = NPC price ÷ Divisor. Range 50–2000, default 1000.</summary>
    public int Divisor { get; set; } = 1000;
}
