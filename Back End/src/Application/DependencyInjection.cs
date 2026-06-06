using L2CpTracker.Application.Contributions;
using L2CpTracker.Application.Members;
using L2CpTracker.Application.Settings;
using Microsoft.Extensions.DependencyInjection;

namespace L2CpTracker.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IMemberService, MemberService>();
        services.AddScoped<IContributionService, ContributionService>();
        services.AddScoped<ISettingsService, SettingsService>();
        return services;
    }
}
