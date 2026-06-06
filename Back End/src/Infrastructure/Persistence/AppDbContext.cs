using L2CpTracker.Application.Common.Interfaces;
using L2CpTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace L2CpTracker.Infrastructure.Persistence;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options), IUnitOfWork
{
    public DbSet<Member> Members => Set<Member>();
    public DbSet<Contribution> Contributions => Set<Contribution>();
    public DbSet<AppSetting> Settings => Set<AppSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Seed the singleton settings row.
        modelBuilder.Entity<AppSetting>().HasData(new AppSetting { Id = 1, Divisor = 1000 });

        base.OnModelCreating(modelBuilder);
    }

    Task<int> IUnitOfWork.SaveChangesAsync(CancellationToken ct) => SaveChangesAsync(ct);
}
