namespace L2CpTracker.Application.Common.Interfaces;

/// <summary>Commits pending changes tracked across repositories in one transaction.</summary>
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct);
}
