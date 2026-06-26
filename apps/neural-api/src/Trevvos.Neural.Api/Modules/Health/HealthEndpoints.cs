namespace Trevvos.Neural.Api.Modules.Health;

public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app
            .MapGroup("/health")
            .WithTags("Health");

        group.MapGet("/", () =>
        {
            return Results.Ok(new
            {
                status = "ok",
                service = "trevvos-neural-api",
                timestamp = DateTimeOffset.UtcNow
            });
        })
        .WithName("GetHealth")
        .WithSummary("Returns the general API health status.");

        group.MapGet("/live", () =>
        {
            return Results.Ok(new
            {
                status = "alive",
                service = "trevvos-neural-api",
                timestamp = DateTimeOffset.UtcNow
            });
        })
        .WithName("GetHealthLive")
        .WithSummary("Returns whether the API process is alive.");

        group.MapGet("/ready", () =>
        {
            return Results.Ok(new
            {
                status = "ready",
                service = "trevvos-neural-api",
                checks = new
                {
                    api = "ok"
                },
                timestamp = DateTimeOffset.UtcNow
            });
        })
        .WithName("GetHealthReady")
        .WithSummary("Return whether the API is ready to receive traffic.");

        return app;
    }
}
