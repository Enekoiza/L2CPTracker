using L2CpTracker.Application.Common.Interfaces;
using L2CpTracker.Infrastructure.Persistence;
using L2CpTracker.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace L2CpTracker.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, string connectionString)
    {
        // Explicit server version avoids opening a connection at startup
        // (ServerVersion.AutoDetect would require MySQL to be reachable when the app boots).
        var serverVersion = new MySqlServerVersion(new Version(8, 0, 21));

        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(
                connectionString,
                serverVersion,
                mySql => mySql.EnableRetryOnFailure()));

        // Expose the DbContext's change-tracking as the unit of work.
        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<AppDbContext>());

        services.AddScoped<IMemberRepository, MemberRepository>();
        services.AddScoped<IContributionRepository, ContributionRepository>();
        services.AddScoped<ISettingsRepository, SettingsRepository>();

        return services;
    }
}
