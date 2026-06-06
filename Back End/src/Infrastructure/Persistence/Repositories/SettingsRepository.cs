using L2CpTracker.Application.Common.Interfaces;
using L2CpTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace L2CpTracker.Infrastructure.Persistence.Repositories;

public sealed class SettingsRepository(AppDbContext db) : ISettingsRepository
{
    public async Task<AppSetting> GetAsync(CancellationToken ct)
    {
        var setting = await db.Settings.FirstOrDefaultAsync(s => s.Id == 1, ct);
        if (setting is null)
        {
            setting = new AppSetting { Id = 1, Divisor = 1000 };
            await db.Settings.AddAsync(setting, ct);
            await db.SaveChangesAsync(ct);
        }
        return setting;
    }

    public async Task UpdateDivisorAsync(int divisor, CancellationToken ct)
    {
        var setting = await GetAsync(ct);
        setting.Divisor = divisor;
        db.Settings.Update(setting);
    }
}
