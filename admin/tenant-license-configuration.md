# Tenant License Configuration

Ejemplo de configuración:

```json
{
  "clientId": "client_banco_demo",
  "applicationId": "app_onboarding",
  "licenseId": "lic_web_prod_onboarding",
  "environment": "production",
  "entitlements": [
    {
      "platform": "web",
      "allowedOrigins": ["https://onboarding.bancodemo.com"],
      "allowedChannels": ["whatsapp", "sms", "email"]
    }
  ],
  "quotaPolicy": {
    "monthlyOtpSentLimit": 100000,
    "hardLimit": true
  }
}
```

Para usar `https://creditos.bancodemo.com` se requiere otra licencia o entitlement explícito.
