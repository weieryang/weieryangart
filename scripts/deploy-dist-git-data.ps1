param(
  [string]$Repository = "weieryang/weieryangart",
  [string]$Branch = "main",
  [string]$DistDirectory = "dist",
  [string]$CommitMessage = "Publish Middle East landmark sculpture SEO guide",
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Invoke-GhJson {
  param(
    [Parameter(Mandatory = $true)][string]$Endpoint,
    [ValidateSet("GET", "POST", "PATCH")][string]$Method = "GET",
    [object]$Body
  )

  if ($null -eq $Body) {
    $output = & gh api $Endpoint --method $Method
  } else {
    $json = $Body | ConvertTo-Json -Depth 12 -Compress
    $output = $json | & gh api $Endpoint --method $Method --input -
  }

  if ($LASTEXITCODE -ne 0) {
    throw "GitHub API request failed: $Method $Endpoint"
  }

  return ($output | ConvertFrom-Json)
}

function Get-GitBlobSha {
  param([Parameter(Mandatory = $true)][byte[]]$Bytes)

  $header = [System.Text.Encoding]::UTF8.GetBytes("blob $($Bytes.Length)`0")
  $payload = New-Object byte[] ($header.Length + $Bytes.Length)
  [Array]::Copy($header, 0, $payload, 0, $header.Length)
  [Array]::Copy($Bytes, 0, $payload, $header.Length, $Bytes.Length)
  $sha1 = [System.Security.Cryptography.SHA1]::Create()
  try {
    return (($sha1.ComputeHash($payload) | ForEach-Object { $_.ToString("x2") }) -join "")
  } finally {
    $sha1.Dispose()
  }
}

$distRoot = (Resolve-Path -LiteralPath $DistDirectory).Path
$ref = Invoke-GhJson -Endpoint "repos/$Repository/git/ref/heads/$Branch"
$baseCommitSha = $ref.object.sha
$baseCommit = Invoke-GhJson -Endpoint "repos/$Repository/git/commits/$baseCommitSha"
$baseTreeSha = $baseCommit.tree.sha
$remoteTree = Invoke-GhJson -Endpoint "repos/$Repository/git/trees/$baseTreeSha`?recursive=1"

if ($remoteTree.truncated) {
  throw "Remote tree response was truncated; refusing to publish an incomplete comparison."
}

$remoteBlobByPath = @{}
foreach ($entry in $remoteTree.tree) {
  if ($entry.type -eq "blob") {
    $remoteBlobByPath[$entry.path] = $entry.sha
  }
}

$changedFiles = New-Object System.Collections.Generic.List[object]
foreach ($file in Get-ChildItem -LiteralPath $distRoot -Recurse -File) {
  $relativePath = $file.FullName.Substring($distRoot.Length + 1).Replace("\", "/")
  $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
  $localBlobSha = Get-GitBlobSha -Bytes $bytes
  if (-not $remoteBlobByPath.ContainsKey($relativePath) -or $remoteBlobByPath[$relativePath] -ne $localBlobSha) {
    $changedFiles.Add([pscustomobject]@{
      Path = $relativePath
      Bytes = $bytes
      LocalBlobSha = $localBlobSha
    })
  }
}

if ($changedFiles.Count -eq 0) {
  [pscustomobject]@{
    status = "unchanged"
    commit = $baseCommitSha
    changed = 0
  } | ConvertTo-Json -Compress
  exit 0
}

if ($DryRun) {
  [pscustomobject]@{
    status = "dry-run"
    baseCommit = $baseCommitSha
    changed = $changedFiles.Count
    paths = @($changedFiles | ForEach-Object { $_.Path })
  } | ConvertTo-Json -Depth 4 -Compress
  exit 0
}

$treeEntries = New-Object System.Collections.Generic.List[object]
foreach ($changed in $changedFiles) {
  $blob = Invoke-GhJson -Endpoint "repos/$Repository/git/blobs" -Method POST -Body @{
    content = [Convert]::ToBase64String($changed.Bytes)
    encoding = "base64"
  }
  $treeEntries.Add(@{
    path = $changed.Path
    mode = "100644"
    type = "blob"
    sha = $blob.sha
  })
}

$newTree = Invoke-GhJson -Endpoint "repos/$Repository/git/trees" -Method POST -Body @{
  base_tree = $baseTreeSha
  tree = $treeEntries
}

$newCommit = Invoke-GhJson -Endpoint "repos/$Repository/git/commits" -Method POST -Body @{
  message = $CommitMessage
  tree = $newTree.sha
  parents = @($baseCommitSha)
}

$null = Invoke-GhJson -Endpoint "repos/$Repository/git/refs/heads/$Branch" -Method PATCH -Body @{
  sha = $newCommit.sha
  force = $false
}

[pscustomobject]@{
  status = "published"
  previous = $baseCommitSha
  commit = $newCommit.sha
  changed = $changedFiles.Count
  paths = @($changedFiles | ForEach-Object { $_.Path })
} | ConvertTo-Json -Depth 4 -Compress
