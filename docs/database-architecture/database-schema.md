# Nepal Crisis Response Hub - Database Schema

## Users

| Field | Description |
|---|---|
| user_id | Unique user identifier |
| name | User's name |
| email | User email |
| password_hash | Encrypted password |
| role | User or administrator |
| created_at | Account creation date |

## Crisis Alerts

| Field | Description |
|---|---|
| alert_id | Unique alert identifier |
| title | Alert title |
| description | Emergency information |
| location | Affected location |
| severity | Low, Medium, High, Critical |
| created_by | Administrator user ID |
| created_at | Alert creation time |

## Help Requests

| Field | Description |
|---|---|
| request_id | Unique request identifier |
| user_id | User submitting request |
| assistance_type | Medical, rescue, food, shelter, etc. |
| location | User location |
| urgency | Low, Medium, High, Critical |
| description | Request details |
| status | Pending, Assigned, Completed |
| created_at | Request creation time |

## Emergency Resources

| Field | Description |
|---|---|
| resource_id | Unique resource identifier |
| name | Resource name |
| resource_type | Hospital, shelter, relief center, etc. |
| location | Resource location |
| contact | Contact information |
| availability | Current availability |

## Relationships

```text
USERS
   |
   | 1
   |
   | many
   v
HELP_REQUESTS

USERS (Administrators)
   |
   | 1
   |
   | many
   v
CRISIS_ALERTS
