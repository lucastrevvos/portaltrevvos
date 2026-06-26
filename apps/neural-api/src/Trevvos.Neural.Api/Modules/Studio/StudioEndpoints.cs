namespace Trevvos.Neural.Api.Modules.Studio;

public static class StudioEndpoints
{
    public static IEndpointRouteBuilder MapStudioEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app
            .MapGroup("/api/studio")
            .WithTags("Studio");

        group.MapGet("/health", () =>
        {
            return Results.Ok(new
            {
                status = "ok",
                service = "trevvos-studio-module",
                host = "trevvos-neural-api",
                timestamp = DateTimeOffset.UtcNow
            });
        })
        .WithName("GetStudioHealth")
        .WithSummary("Returns the Studio module health status.");

        group.MapGet("/me", () =>
        {
            return Results.Ok(new
            {
                user = new
                {
                    id = "dev-lucas",
                    name = "Lucas",
                    email = "lucas@trevvos.local"
                },
                organization = new
                {
                    id = "trevvos-dev",
                    name = "Trevvos Dev"
                },
                roles = new[]
               {
                    "platform.admin",
                    "studio.admin"
                },
                authMode = "dev",
                timestamp = DateTimeOffset.UtcNow
            });
        })
        .WithName("GetStudioMe")
        .WithSummary("Returns the currenct Studio user context in development mode.");

        return app;
    }
}
