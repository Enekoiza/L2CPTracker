namespace L2CpTracker.Application.Settings;

public interface ISettingsService
{
    Task<SettingsDto> GetAsync(CancellationToken ct);
    Task<SettingsDto> UpdateAsync(UpdateSettingsRequest request, CancellationToken ct);
}
