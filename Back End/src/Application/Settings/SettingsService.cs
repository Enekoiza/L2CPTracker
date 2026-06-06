using L2CpTracker.Application.Common.Exceptions;
using L2CpTracker.Application.Common.Interfaces;

namespace L2CpTracker.Application.Settings;

public sealed class SettingsService(ISettingsRepository repository, IUnitOfWork uow) : ISettingsService
{
    public async Task<SettingsDto> GetAsync(CancellationToken ct)
    {
        var setting = await repository.GetAsync(ct);
        return new SettingsDto(setting.Divisor);
    }

    public async Task<SettingsDto> UpdateAsync(UpdateSettingsRequest request, CancellationToken ct)
    {
        if (request.Divisor is < 50 or > 2000)
            throw new AppValidationException("Divisor must be between 50 and 2000.");

        await repository.UpdateDivisorAsync(request.Divisor, ct);
        await uow.SaveChangesAsync(ct);
        return new SettingsDto(request.Divisor);
    }
}
