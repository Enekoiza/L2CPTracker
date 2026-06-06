# L2 CP Tracker — Backend (.NET 10, Clean Architecture)

REST API for the L2 CP Tracker. .NET 10 minimal APIs, EF Core 9 + Pomelo (MySQL).

## Architecture

```
src/
├── Domain/          Entities (Member, Contribution, AppSetting) — no dependencies
├── Application/     DTOs, service interfaces + implementations, repository contracts
├── Infrastructure/  EF Core DbContext, Pomelo/MySQL, repositories
└── Api/             Minimal API endpoints, global exception handler (ProblemDetails), CORS
```

Dependency flow: `Api → Application → Domain`, `Infrastructure → Application`. The Api wires
Infrastructure at composition root only.

> **Versions:** EF Core / Pomelo are pinned to **9.0.0** (latest Pomelo build). They run on the
> `net10.0` target framework. When Pomelo ships an EF Core 10 build, bump both together.

## 1. Database

No EF migrations are used. Run [`schema.sql`](schema.sql) once against your MySQL server:

```bash
mysql -u root -p < schema.sql
```

It creates the `l2cp` database, the `members`, `contributions`, and `settings` tables
(seeding the singleton settings row with `Divisor = 1000`).

## 2. Connection string

The connection string is read from configuration key `ConnectionStrings:L2cp`, supplied via the
**environment variable** `ConnectionStrings__L2cp` (double underscore = section separator). It is
**not** stored in `appsettings.json`. The code only references the key name:

```csharp
builder.Configuration.GetConnectionString("L2cp")
```

Set it before running:

```bash
# PowerShell
$env:ConnectionStrings__L2cp = "server=localhost;port=3306;database=l2cp;user=root;password=YOUR_PASSWORD"

# bash
export ConnectionStrings__L2cp="server=localhost;port=3306;database=l2cp;user=root;password=YOUR_PASSWORD"
```

If the variable is missing the app fails fast at startup with a clear message.

## 3. Run

```bash
dotnet run --project src/Api
```

Dev URL comes from `launchSettings.json`. OpenAPI document is served at `/openapi/v1.json`
in Development. CORS allows the Vite frontend at `http://localhost:5173` and `:4173`.

## Endpoints

| Method | Route                  | Body                              | Description                        |
|--------|------------------------|-----------------------------------|------------------------------------|
| GET    | `/api/members`         | —                                 | List members                       |
| POST   | `/api/members`         | `{ "name": "Tank" }`              | Create a member                    |
| DELETE | `/api/members/{id}`    | —                                 | Delete a member (cascades log)     |
| GET    | `/api/contributions`   | —                                 | Full log, newest first            |
| POST   | `/api/contributions`   | `{ "entries": [ ... ] }`          | Log one or many contributions      |
| GET    | `/api/settings`        | —                                 | Get divisor                        |
| PUT    | `/api/settings`        | `{ "divisor": 1000 }`             | Update divisor (50–2000)           |

### Contribution entry shape

```json
{
  "entries": [
    {
      "memberId": "GUID",
      "type": "Material",          // "Material" | "Event"
      "points": 120.0,
      "description": "2000× Animal Bone",
      "badge": "SOLO"              // "SOLO" | "PARTY ÷N" | "EVENT"
    }
  ]
}
```

Returned contributions include `memberName` and `ts` (Unix epoch ms) for the frontend.

## Errors

All failures return RFC 7807 Problem Details:
`AppValidationException → 400`, `NotFoundException → 404`, anything else → `500`.
