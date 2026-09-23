$apiKey = "rnd_oZvmtjO7gMqZpz1Cr02J3w0xCT72"
$serviceId = "srv-dapobu0u01pc73dcr4gg"
$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Accept" = "application/json"
    "Content-Type" = "application/json"
}

# Add NEXTAUTH_URL with the render domain
$envBody = @(
    @{ key = "NEXTAUTH_URL"; value = "https://autopost-gwnz.onrender.com" }
) | ConvertTo-Json

$result = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId/env-vars" -Method PUT -Headers $headers -Body $envBody
Write-Host "Env var NEXTAUTH_URL set to https://autopost-gwnz.onrender.com"
Write-Host ($result | ConvertTo-Json)
