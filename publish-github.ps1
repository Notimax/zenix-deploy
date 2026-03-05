$ErrorActionPreference = "Stop"

$repoDir = "C:\Users\user\Desktop\Bot osint\site\Zenix Stream"
$repoName = "zenix"

function Get-GitHubCredential {
  $input = "protocol=https`nhost=github.com`n`n"
  $result = $input | git credential fill
  if (-not $result) {
    throw "No GitHub credentials found in git credential manager."
  }

  $username = ""
  $password = ""
  foreach ($line in ($result -split "`n")) {
    if ($line -like "username=*") {
      $username = $line.Substring("username=".Length).Trim()
    }
    if ($line -like "password=*") {
      $password = $line.Substring("password=".Length).Trim()
    }
  }

  if (-not $username -or -not $password) {
    throw "GitHub credentials are incomplete."
  }

  return @{
    username = $username
    password = $password
  }
}

function New-GitHubHeaders($username, $password) {
  $token = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
  return @{
    Authorization = "Basic $token"
    "User-Agent" = "codex-agent"
    Accept = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
  }
}

$cred = Get-GitHubCredential
$headers = New-GitHubHeaders -username $cred.username -password $cred.password
$me = Invoke-RestMethod -Method GET -Uri "https://api.github.com/user" -Headers $headers
$owner = $me.login

$repoApi = "https://api.github.com/repos/$owner/$repoName"
$repo = $null
$exists = $false

try {
  $repo = Invoke-RestMethod -Method GET -Uri $repoApi -Headers $headers
  $exists = $true
}
catch {
  $statusCode = $_.Exception.Response.StatusCode.value__
  if ($statusCode -ne 404) {
    throw
  }
}

if (-not $exists) {
  $body = @{
    name = $repoName
    private = $true
    description = "Zenix Stream"
    auto_init = $false
  } | ConvertTo-Json
  $repo = Invoke-RestMethod -Method POST -Uri "https://api.github.com/user/repos" -Headers $headers -ContentType "application/json" -Body $body
}

$remoteUrl = $repo.clone_url

Push-Location $repoDir
try {
  if (-not (Test-Path ".git")) {
    git init -b main | Out-Null
  }

  $currentName = git config user.name
  if (-not $currentName) {
    git config user.name $owner
  }

  $currentEmail = git config user.email
  if (-not $currentEmail) {
    git config user.email "$owner@users.noreply.github.com"
  }

  git add . | Out-Null

  git diff --cached --quiet
  if ($LASTEXITCODE -ne 0) {
    git commit -m "Initial Zenix Stream import" | Out-Null
  }

  $hasOrigin = (git remote) -contains "origin"
  if ($hasOrigin) {
    git remote set-url origin $remoteUrl
  }
  else {
    git remote add origin $remoteUrl
  }

  git branch -M main | Out-Null
  git push -u origin main
}
finally {
  Pop-Location
}

Write-Host "owner=$owner"
Write-Host "repo=$remoteUrl"
