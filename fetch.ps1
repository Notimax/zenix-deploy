$ErrorActionPreference = "Stop"

$target = "C:\Users\user\Desktop\Bot osint\site\Zenix Stream"
$urlsFile = Join-Path $target "_urls.txt"

if (-not (Test-Path $urlsFile)) {
  throw "Missing URLs file: $urlsFile"
}

$textExt = @(".html", ".js", ".css", ".json", ".webmanifest", ".txt", ".map", ".xml")
$downloaded = 0
$skipped = 0

Get-Content $urlsFile | ForEach-Object {
  $u = $_.Trim()
  if ([string]::IsNullOrWhiteSpace($u)) {
    return
  }

  $uri = [uri]$u
  $path = $uri.AbsolutePath
  if ([string]::IsNullOrWhiteSpace($path) -or $path -eq "/") {
    $path = "/index.html"
  }

  $localPath = Join-Path $target ($path.TrimStart("/") -replace "/", "\")
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $localPath) | Out-Null

  curl.exe -sSL $u -o $localPath

  $bytes = [System.IO.File]::ReadAllBytes($localPath)
  $head = [System.Text.Encoding]::ASCII.GetString($bytes, 0, [Math]::Min(32, $bytes.Length))
  if ($path -ne "/index.html" -and $head -match "^<!doctype html>") {
    Remove-Item $localPath -Force
    $skipped++
    Write-Host "skip-fallback $path"
    return
  }

  $ext = [IO.Path]::GetExtension($localPath).ToLowerInvariant()
  if ($textExt -contains $ext) {
    $firstLine = Get-Content $localPath -Encoding UTF8 -TotalCount 1
    if ($path -ne "/index.html" -and $firstLine -match "^<!doctype html>") {
      Remove-Item $localPath -Force
      $skipped++
      Write-Host "skip-fallback $path"
      return
    }
  }

  $downloaded++
  Write-Host "ok $path"
}

$src192 = Join-Path $target "images\android-chrome-192x192.png"
$src256 = Join-Path $target "images\android-chrome-256x256.png"
$srcApple = Join-Path $target "images\apple-touch-icon.png"
if (Test-Path $src192) {
  Copy-Item -Force $src192 (Join-Path $target "android-chrome-192x192.png")
}
if (Test-Path $src256) {
  Copy-Item -Force $src256 (Join-Path $target "android-chrome-512x512.png")
}
if (Test-Path $srcApple) {
  Copy-Item -Force $srcApple (Join-Path $target "apple-touch-icon.png")
}

Write-Host "downloaded=$downloaded skipped=$skipped"
