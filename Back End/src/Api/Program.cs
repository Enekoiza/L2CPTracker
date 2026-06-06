using L2CpTracker.Api;
using L2CpTracker.Api.Endpoints;
using L2CpTracker.Application;
using L2CpTracker.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Read from configuration key ConnectionStrings:L2cp — set via the
// environment variable `ConnectionStrings__L2cp` (double underscore = section separator).
var connectionString = builder.Configuration.GetConnectionString("L2cp")
    ?? throw new InvalidOperationException(
        "Connection string 'L2cp' is not configured. Set the environment variable 'ConnectionStrings__L2cp'.");

builder.Services.AddApplication();
builder.Services.AddInfrastructure(connectionString);

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddOpenApi();

const string CorsPolicy = "frontend";
builder.Services.AddCors(options =>
    options.AddPolicy(CorsPolicy, policy => policy
        .WithOrigins(
            "http://localhost:5173",
            "http://localhost:4173")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors(CorsPolicy);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapMemberEndpoints();
app.MapContributionEndpoints();
app.MapSettingsEndpoints();

app.MapGet("/", () => Results.Ok(new { service = "L2 CP Tracker API", status = "ok" }));

app.Run();
