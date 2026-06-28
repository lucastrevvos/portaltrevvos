using Trevvos.Neural.Application.Leads;

namespace Trevvos.Neural.Api.Modules.Leads;

public static class LeadsEndpoints
{
    public static IEndpointRouteBuilder MapLeadsEndpoints(this IEndpointRouteBuilder app)
    {
        var publicGroup = app
            .MapGroup("/api/leads")
            .WithTags("Leads");

        publicGroup.MapPost("/", async (
            CreateLeadRequest request,
            LeadsService service,
            CancellationToken cancellationToken
        ) =>
        {
            var lead = await service.CreateAsync(request, cancellationToken);

            return Results.Created($"/api/admin/leads/{lead.Id}", lead);
        });

        publicGroup.MapPost("/{id:guid}/messages", async (
            Guid id,

            AddLeadMessageRequest request,

            LeadsService service,

            CancellationToken cancellationToken) =>
        {
            var lead = await service.AddMessageAsync(id, request, cancellationToken);

            return lead is null
                ? Results.NotFound()
                : Results.Ok(lead);
        });

        var adminGroup = app
            .MapGroup("/api/admin/leads")
            .WithTags("Admin Leads");

        adminGroup.MapGet("/", async (
            LeadsService service,
            CancellationToken cancellationToken
        ) =>
        {
            var leads = await service.GetAllAsync(cancellationToken);

            return Results.Ok(leads);
        });

        adminGroup.MapPatch("/{id:guid}/status", async (
            Guid id,
            ChangeLeadStatusRequest request,
            LeadsService service,
            CancellationToken cancellationToken
        ) =>
        {
            try
            {
                var lead = await service.ChangeStatusAsync(id, request, cancellationToken);

                return lead is null
                    ? Results.NotFound()
                    : Results.Ok(lead);
            }
            catch (InvalidOperationException exception)
            {
                return Results.BadRequest(new
                {
                    error = exception.Message
                });
            }
        });

        return app;
    }
}
