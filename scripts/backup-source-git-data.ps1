param(
  [Parameter(Mandatory = $true)][string]$BaseRevision,
  [Parameter(Mandatory = $true)][string]$ExpectedRemoteCommit,
  [string]$Repository = "weieryang/weieryangart",
  [string]$Branch = "codex/hotel-seo-geo",
  [string]$CommitMessage = "Optimize U.S. hotel sculpture acquisition and procurement",
  [switch]$DryRun
)
$ErrorActionPreference = "Stop"
if ($Branch -eq "main") { throw "Source backup must never target the production branch." }
function Invoke-SourceApi {
  param([string]$Endpoint, [string]$Method = "GET", [object]$Body)
  if ($null -eq $Body) { $result = & gh api $Endpoint --method $Method }
  else { $result = ($Body | ConvertTo-Json -Depth 12 -Compress) | & gh api $Endpoint --method $Method --input - }
  if ($LASTEXITCODE -ne 0) { throw "GitHub source-backup request failed: $Endpoint" }
  return ($result | ConvertFrom-Json)
}
$repoRoot = (& git rev-parse --show-toplevel).Trim().Replace("/", "\")
if ($LASTEXITCODE -ne 0 -or (Get-Location).Path -ne $repoRoot) { throw "Run from the source repository root." }
$deleted = @(& git diff --name-only --diff-filter=D $BaseRevision --)
if ($LASTEXITCODE -ne 0 -or $deleted.Count -gt 0) { throw "Source deletion requires a separately reviewed backup plan." }
$paths = @(@(& git diff --name-only --diff-filter=ACMRT $BaseRevision --) + @(& git ls-files --others --exclude-standard)) | Sort-Object -Unique
if ($LASTEXITCODE -ne 0 -or !$paths.Count) { throw "No source changes to back up." }
$ref = Invoke-SourceApi "repos/$Repository/git/ref/heads/$Branch"
if ($ref.object.sha -ne $ExpectedRemoteCommit) { throw "Source branch changed; review it before backing up." }
$commit = Invoke-SourceApi "repos/$Repository/git/commits/$ExpectedRemoteCommit"
foreach ($relative in $paths) {
  if ($relative -match '(^|/)(\.env[^/]*|node_modules|dist|\.git)(/|$)') { throw "Refusing private/generated path: $relative" }
  $resolved = (Resolve-Path -LiteralPath (Join-Path $repoRoot $relative)).Path
  if (!$resolved.StartsWith($repoRoot + "\", [StringComparison]::OrdinalIgnoreCase)) { throw "Path outside source checkout." }
}
if ($DryRun) { @{ status="dry-run"; branch=$Branch; base=$ExpectedRemoteCommit; paths=$paths } | ConvertTo-Json -Depth 4; exit 0 }
$entries = @()
foreach ($relative in $paths) {
  $bytes = [System.IO.File]::ReadAllBytes((Join-Path $repoRoot $relative))
  $blob = Invoke-SourceApi "repos/$Repository/git/blobs" "POST" @{ content=[Convert]::ToBase64String($bytes); encoding="base64" }
  $entries += @{ path=$relative; mode="100644"; type="blob"; sha=$blob.sha }
}
$tree = Invoke-SourceApi "repos/$Repository/git/trees" "POST" @{ base_tree=$commit.tree.sha; tree=$entries }
$newCommit = Invoke-SourceApi "repos/$Repository/git/commits" "POST" @{ message=$CommitMessage; tree=$tree.sha; parents=@($ExpectedRemoteCommit) }
$null = Invoke-SourceApi "repos/$Repository/git/refs/heads/$Branch" "PATCH" @{ sha=$newCommit.sha; force=$false }
@{ status="backed-up"; branch=$Branch; commit=$newCommit.sha; changed=$paths.Count } | ConvertTo-Json -Compress
