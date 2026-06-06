using L2CpTracker.Domain.Entities;

namespace L2CpTracker.Application.Common.Interfaces;

public interface ISettingsRepository
{
    Task<AppSetting> GetAsync(CancellationToken ct);
    Task UpdateDivisorAsync(int divisor, CancellationToken ct);
}
