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


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapHealthEndpoints();
app.MapStudioEndpoints();
app.MapLeadsEndpoints();

app.Run();
