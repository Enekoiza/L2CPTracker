using L2CpTracker.Application.Contributions;

namespace L2CpTracker.Api.Endpoints;

public static class ContributionEndpoints
{
    public static IEndpointRouteBuilder MapContributionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/contributions").WithTags("Contributions");

        group.MapGet("/", async (IContributionService service, CancellationToken ct) =>
            TypedResults.Ok(await service.GetAllAsync(ct)));

        group.MapPost("/", async (
            CreateContributionsRequest request, IContributionService service, CancellationToken ct) =>
        {
            var created = await service.CreateAsync(request, ct);
            return TypedResults.Created("/api/contributions", created);
        });

        group.MapDelete("/{id:guid}", async (
            Guid id, IContributionService service, CancellationToken ct) =>
        {
            await service.DeleteAsync(id, ct);
            return TypedResults.NoContent();
        });

        return app;
    }
}
