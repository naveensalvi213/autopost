$apiKey = "rnd_oZvmtjO7gMqZpz1Cr02J3w0xCT72"
$serviceId = "srv-dapobu0u01pc73dcr4gg"
$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

# Update build command with memory limit
Write-Host "Updating Render build settings..."
$body = @{
    serviceDetails = @{
        buildCommand = "NODE_OPTIONS='--max-old-space-size=460' npm install && npm run build"
        startCommand = "npm start"
    }
} | ConvertTo-Json -Depth 5

try {
    $result = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId" -Method PATCH -Headers $headers -Body $body
    Write-Host "Build command updated!"
} catch {
    Write-Host "Update note: $($_.ErrorDetails.Message)"
}

# Trigger new deploy
Write-Host "Triggering new deploy..."
$deployBody = @{ clearCache = "clear" } | ConvertTo-Json
$deploy = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId/deploys" -Method POST -Headers $headers -Body $deployBody
Write-Host "Deploy triggered! Watch at: https://dashboard.render.com/web/$serviceId"
