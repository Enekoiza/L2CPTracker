# ============================================================
# One-time IIS setup for the L2 CP Tracker API.
# Run ONCE on the server in an elevated (Administrator) PowerShell.
# Safe to re-run: it only creates what is missing.
# ============================================================

#Requires -RunAsAdministrator

$ErrorActionPreference = 'Stop'
Import-Module WebAdministration

# ---- Must match the values in .github/workflows/deploy-backend.yml ----
$SiteName    = 'L2CPTracker'
$AppPoolName = 'L2CPTracker'
$PhysPath    = 'C:\inetpub\wwwroot\l2cp-api'
$Port        = 80          # change if you bind a different port/host header
# Optional: set your MySQL connection string here to register it machine-wide.
# Leave empty to set it yourself later.
$ConnString  = ''
# ----------------------------------------------------------------------

# 1. Physical path
if (-not (Test-Path $PhysPath)) {
    New-Item -ItemType Directory -Path $PhysPath -Force | Out-Null
    Write-Host "Created folder $PhysPath"
}

# 2. Application pool (No Managed Code = required for ASP.NET Core)
if (-not (Test-Path "IIS:\AppPools\$AppPoolName")) {
    New-WebAppPool -Name $AppPoolName | Out-Null
    Write-Host "Created app pool $AppPoolName"
}
Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name managedRuntimeVersion -Value ''
Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name startMode -Value 'AlwaysRunning'

# 3. Web site
if (-not (Test-Path "IIS:\Sites\$SiteName")) {
    New-Website -Name $SiteName -PhysicalPath $PhysPath -ApplicationPool $AppPoolName -Port $Port | Out-Null
    Write-Host "Created site $SiteName on port $Port"
} else {
    Set-ItemProperty "IIS:\Sites\$SiteName" -Name physicalPath -Value $PhysPath
    Set-ItemProperty "IIS:\Sites\$SiteName" -Name applicationPool -Value $AppPoolName
    Write-Host "Site $SiteName already existed — path/pool ensured"
}

# 4. Connection string as a machine-level environment variable (optional)
if ($ConnString -ne '') {
    [Environment]::SetEnvironmentVariable('ConnectionStrings__L2cp', $ConnString, 'Machine')
    Write-Host "Set machine env var ConnectionStrings__L2cp"
}

# 5. Verify the ASP.NET Core Module is present (needs the Hosting Bundle)
if ((Get-WebGlobalModule).Name -contains 'AspNetCoreModuleV2') {
    Write-Host "AspNetCoreModuleV2 present ✔"
} else {
    Write-Warning "AspNetCoreModuleV2 NOT found — install the .NET ASP.NET Core Hosting Bundle."
}

Write-Host "`nIIS setup complete. The deploy workflow can now publish to $PhysPath."
