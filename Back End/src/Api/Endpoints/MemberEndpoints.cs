using L2CpTracker.Application.Members;

namespace L2CpTracker.Api.Endpoints;

public static class MemberEndpoints
{
    public static IEndpointRouteBuilder MapMemberEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/members").WithTags("Members");

        group.MapGet("/", async (IMemberService service, CancellationToken ct) =>
            TypedResults.Ok(await service.GetAllAsync(ct)));

        group.MapPost("/", async (
            CreateMemberRequest request, IMemberService service, CancellationToken ct) =>
        {
            var member = await service.CreateAsync(request, ct);
            return TypedResults.Created($"/api/members/{member.Id}", member);
        });

        group.MapDelete("/{id:guid}", async (
            Guid id, IMemberService service, CancellationToken ct) =>
        {
            await service.DeleteAsync(id, ct);
            return TypedResults.NoContent();
        });

        return app;
    }
}
