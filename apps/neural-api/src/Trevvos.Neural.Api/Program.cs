using Microsoft.OpenApi;
using Trevvos.Neural.Api.Modules.Health;
using Trevvos.Neural.Api.Modules.Studio;

using Trevvos.Neural.Api.Modules.Leads;
using Trevvos.Neural.Application.Leads;
using Trevvos.Neural.Infrastructure.Leads;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<ILeadRepository, InMemoryLeadRepository>();
builder.Services.AddSingleton<ILeadClassifier, HeuristicLeadClassifier>();
builder.Services.AddScoped<LeadsService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PortalDev", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:4200",

                "https://localhost:4200"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();



if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("PortalDev");

app.MapHealthEndpoints();
app.MapStudioEndpoints();
app.MapLeadsEndpoints();

app.Run();
