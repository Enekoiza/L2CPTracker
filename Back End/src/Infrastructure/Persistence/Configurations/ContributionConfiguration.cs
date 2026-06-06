using L2CpTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace L2CpTracker.Infrastructure.Persistence.Configurations;

public sealed class ContributionConfiguration : IEntityTypeConfiguration<Contribution>
{
    public void Configure(EntityTypeBuilder<Contribution> builder)
    {
        builder.ToTable("contributions");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Type).HasConversion<int>().IsRequired();
        builder.Property(c => c.Points).HasPrecision(18, 2).IsRequired();
        builder.Property(c => c.Description).HasMaxLength(255).IsRequired();
        builder.Property(c => c.Badge).HasMaxLength(20).IsRequired();
        builder.Property(c => c.CreatedAtUtc).IsRequired();

        builder.HasIndex(c => c.MemberId);
        builder.HasIndex(c => c.CreatedAtUtc);
    }
}
