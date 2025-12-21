# Git SSH Key Configuration Script
# This script helps you configure Git to use a specific SSH key

Write-Host "Git SSH Key Configuration" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Find SSH keys
$sshDir = "$env:USERPROFILE\.ssh"
$sshKeys = Get-ChildItem $sshDir -Filter "*" -File | Where-Object { $_.Name -notlike "*.pub" -and $_.Name -ne "config" -and $_.Name -ne "known_hosts" }

if ($sshKeys.Count -eq 0) {
    Write-Host "No SSH keys found in $sshDir" -ForegroundColor Red
    exit 1
}

Write-Host "Available SSH keys:" -ForegroundColor Yellow
$index = 1
$keyMap = @{}
foreach ($key in $sshKeys) {
    Write-Host "$index. $($key.Name)" -ForegroundColor White
    $keyMap[$index] = $key.FullName
    $index++
}

Write-Host ""
$selection = Read-Host "Enter the number of the key you want to use for GitHub"

if (-not $keyMap.ContainsKey([int]$selection)) {
    Write-Host "Invalid selection" -ForegroundColor Red
    exit 1
}

$selectedKey = $keyMap[[int]$selection]
$keyFileName = (Get-Item $selectedKey).Name
$sshConfigPath = "$sshDir\config"

Write-Host ""
Write-Host "Selected key: $keyFileName" -ForegroundColor Green

# Create or update SSH config
$configContent = @"
# GitHub configuration
Host github.com
    HostName github.com
    User git
    IdentityFile $selectedKey
    IdentitiesOnly yes

"@

# Check if config exists and has github.com entry
if (Test-Path $sshConfigPath) {
    $existingConfig = Get-Content $sshConfigPath -Raw
    if ($existingConfig -match "Host github\.com") {
        Write-Host "Updating existing GitHub configuration..." -ForegroundColor Yellow
        # Remove existing github.com section
        $existingConfig = $existingConfig -replace "(?s)Host github\.com.*?(?=\nHost|\Z)", ""
        $configContent = $existingConfig + $configContent
    } else {
        Write-Host "Adding GitHub configuration to existing config..." -ForegroundColor Yellow
        $configContent = $existingConfig + $configContent
    }
} else {
    Write-Host "Creating new SSH config file..." -ForegroundColor Yellow
}

Set-Content -Path $sshConfigPath -Value $configContent -NoNewline

Write-Host ""
Write-Host "Configuration saved to $sshConfigPath" -ForegroundColor Green
Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Yellow
Write-Host ""

# Test connection
ssh -T git@github.com

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "If the test shows 'successfully authenticated', you're all set!" -ForegroundColor Cyan
Write-Host "If you see errors, check:" -ForegroundColor Yellow
Write-Host "  1. The key is added to your GitHub account (Settings > SSH and GPG keys)" -ForegroundColor White
Write-Host "  2. The key file path is correct" -ForegroundColor White
Write-Host "  3. You have permission to read the key file" -ForegroundColor White

