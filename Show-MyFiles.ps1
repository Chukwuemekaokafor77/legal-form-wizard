# Save as Show-FullStructure.ps1 and run in your project directory

$exclude = @('node_modules', '.git', 'bin', 'obj', 'dist', 'build')
$maxDepth = 6  # Increase if needed

function Show-Structure {
    param(
        [string]$Path,
        [int]$Depth = 0,
        [string]$Prefix = ""
    )

    if ($Depth -gt $maxDepth) { return }

    $items = Get-ChildItem $Path -Force | Where-Object { $exclude -notcontains $_.Name } | Sort-Object Name

    for ($i = 0; $i -lt $items.Count; $i++) {
        $item = $items[$i]
        $isLast = ($i -eq $items.Count - 1)
        
        # Current item prefix
        if ($isLast) {
            $currentPrefix = "└── "
            $nextPrefix = "    "
        } else {
            $currentPrefix = "├── "
            $nextPrefix = "│   "
        }

        # Show item
        if ($item.PSIsContainer) {
            Write-Host ("$Prefix$currentPrefix" + $item.Name) -ForegroundColor Cyan
            Show-Structure -Path $item.FullName -Depth ($Depth + 1) -Prefix ($Prefix + $nextPrefix)
        } else {
            Write-Host ("$Prefix$currentPrefix" + $item.Name) -ForegroundColor Yellow
        }
    }
}

# Run from current directory
Clear-Host
Write-Host "`nCOMPLETE PROJECT STRUCTURE" -ForegroundColor Green
Write-Host "=========================`n"
Show-Structure -Path .