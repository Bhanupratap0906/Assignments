$files = @(
    ".\src\utils\api.js",
    ".\src\utils\mockApi.js",
    ".\src\utils\mockData.js", 
    ".\src\store\bookStore.js"
)

foreach ($file in $files) {
    Write-Host "Processing $file"
    $content = Get-Content $file
    $content = $content -replace '\/\*\*[\s\S]*?\*\/', ''  # Remove multiline comments
    $content = $content -replace '\/\/.*$', ''            # Remove single line comments
    $content = $content -replace '^\s*$\n', ''           # Remove empty lines
    
    # Write the content back to the original file
    $content | Out-File -FilePath $file -Encoding utf8 -Force
    
    Write-Host "Processed $file"
}

Write-Host "Comments removed from all files." 