using L2CpTracker.Application.Settings;

namespace L2CpTracker.Api.Endpoints;

public static class SettingsEndpoints
{
    public static IEndpointRouteBuilder MapSettingsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/settings").WithTags("Settings");

        group.MapGet("/", async (ISettingsService service, CancellationToken ct) =>
            TypedResults.Ok(await service.GetAsync(ct)));

        group.MapPut("/", async (
            UpdateSettingsRequest request, ISettingsService service, CancellationToken ct) =>
            TypedResults.Ok(await service.UpdateAsync(request, ct)));

        return app;
    }
}
