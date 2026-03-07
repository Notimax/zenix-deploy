$ErrorActionPreference = "Stop"

param(
  [string]$Message = "chore: update live site",
  [string[]]$Remotes = @("origin", "deploypublic"),
  [string]$Branch = "main",
  [switch]$SkipCommit
)

function Invoke-GitChecked {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Args
  )
  & git @Args
  if ($LASTEXITCODE -ne 0) {
    throw "git $($Args -join ' ') failed."
  }
}

Push-Location $PSScriptRoot
try {
  $isRepo = (& git rev-parse --is-inside-work-tree 2>$null)
  if ($LASTEXITCODE -ne 0 -or "$isRepo".Trim() -ne "true") {
    throw "This folder is not a git repository."
  }

  if (-not $SkipCommit) {
    Invoke-GitChecked -Args @("add", "-u")
    & git diff --cached --quiet
    if ($LASTEXITCODE -ne 0) {
      Invoke-GitChecked -Args @("commit", "-m", $Message)
    } else {
      Write-Host "No tracked file changes to commit."
    }
  }

  foreach ($remote in $Remotes) {
    if ([string]::IsNullOrWhiteSpace($remote)) {
      continue
    }
    & git remote get-url $remote 1>$null 2>$null
    if ($LASTEXITCODE -ne 0) {
      Write-Host "Skipping missing remote: $remote"
      continue
    }
    Invoke-GitChecked -Args @("push", $remote, $Branch)
  }

  $hook = [Environment]::GetEnvironmentVariable("RENDER_DEPLOY_HOOK_URL")
  if (-not [string]::IsNullOrWhiteSpace($hook)) {
    try {
      $response = Invoke-WebRequest -Method POST -Uri $hook -UseBasicParsing -TimeoutSec 15
      Write-Host "Render deploy hook status: $($response.StatusCode)"
    } catch {
      Write-Host "Render deploy hook call failed: $($_.Exception.Message)"
    }
  }

  Write-Host "Publish complete."
}
finally {
  Pop-Location
}
