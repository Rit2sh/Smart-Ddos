# REST API Reference: Smart DDoS Shield

All API endpoints accept and return `application/json` with standard HTTP response codes and structured error bodies.

Base URL: `http://localhost:3000/api`

---

## Authentication

Authentication is handled via session cookies (`smart_ddos_session`) or Bearer API keys passed in the `Authorization` header:

```http
Authorization: Bearer sds_live_your_api_key_here
```

---

## 1. Protected Endpoints (`/api/assets`)

### List Assets
- **Method**: `GET`
- **Query Params**: `?id=<asset_id>` (optional, returns single asset)
- **Response `200 OK`**:
```json
{
  "assets": [
    {
      "id": "ast_prod_api_01",
      "name": "Core Payments API Gateway",
      "domain": "api.shield-enterprise.io",
      "assetType": "API_GATEWAY",
      "originTarget": "198.51.100.42:443",
      "status": "UNDER_ATTACK",
      "protectionEnabled": true,
      "trafficRps": 184500,
      "blockedRate": "78.4%",
      "verification": {
        "token": "sd-verify-9a8b7c6d5e4f3a2b1c",
        "method": "DNS_TXT",
        "status": "VERIFIED"
      }
    }
  ]
}
```

### Register New Asset
- **Method**: `POST`
- **Request Body**:
```json
{
  "name": "Primary Customer Portal",
  "domain": "portal.customer.io",
  "assetType": "DOMAIN",
  "originTarget": "198.51.100.22:443",
  "verificationMethod": "DNS_TXT"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Asset registered. Ownership verification challenge generated.",
  "asset": {
    "id": "ast_k9f20s",
    "name": "Primary Customer Portal",
    "domain": "portal.customer.io",
    "status": "UNVERIFIED",
    "verification": {
      "token": "sd-verify-88fa3910c",
      "method": "DNS_TXT",
      "expectedRecord": "_smartddos-challenge.portal.customer.io",
      "expectedValue": "smart-ddos-verify=sd-verify-88fa3910c",
      "expiresAt": "2026-10-24T01:00:00Z"
    }
  }
}
```

---

## 2. Asset Verification (`/api/assets/[id]/verify`)

- **Method**: `POST`
- **Description**: Triggers DNS resolver or HTTP query to confirm ownership challenge token.
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Domain portal.customer.io verified successfully. Protective edge mitigation is now active.",
  "asset": {
    "id": "ast_k9f20s",
    "status": "ACTIVE",
    "protectionEnabled": true,
    "verification": {
      "status": "VERIFIED",
      "verifiedAt": "2026-10-21T01:25:00Z"
    }
  }
}
```

---

## 3. Incidents (`/api/incidents`)

### List Incidents
- **Method**: `GET`
- **Query Params**: `?id=<incident_id>` (optional)
- **Response `200 OK`**:
```json
{
  "incidents": [
    {
      "id": "inc_oct21_001",
      "title": "Multi-Vector Amplification & Layer 7 HTTP Flood",
      "assetDomain": "api.shield-enterprise.io",
      "severity": "CRITICAL",
      "status": "ACTIVE",
      "peakRps": 184500,
      "totalVolumeGb": 485.4
    }
  ]
}
```

---

## 4. Operator Authentication (`/api/auth`)

- `POST /api/auth/login`: Authenticates credentials and sets HTTP-only JWT cookie.
- `POST /api/auth/signup`: Provisions new tenant organization and owner user.
- `POST /api/auth/logout`: Clears session cookie.
