using L2CpTracker.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace L2CpTracker.Infrastructure.Persistence.Configurations;

public sealed class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> builder)
    {
        builder.ToTable("members");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Name).HasMaxLength(50).IsRequired();
        builder.HasIndex(m => m.Name).IsUnique();
        builder.Property(m => m.CreatedAtUtc).IsRequired();

        builder.HasMany(m => m.Contributions)
            .WithOne(c => c.Member!)
            .HasForeignKey(c => c.MemberId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
