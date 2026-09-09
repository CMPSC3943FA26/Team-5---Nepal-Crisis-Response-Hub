# Nepal Crisis Response Hub - API Plan

The backend technology has not yet been finalized.

## Planned Endpoints

### Crisis Alerts

GET /api/alerts

Returns active crisis alerts.

POST /api/alerts

Allows an authorized administrator to publish an alert.

### Emergency Resources

GET /api/resources

Returns available emergency resources.

### Help Requests

POST /api/help-requests

Creates a new emergency assistance request.

GET /api/help-requests/:id

Returns the current status of a help request.

PATCH /api/help-requests/:id

Allows an authorized responder or administrator to update a request.

### Authentication

POST /api/register

Creates a user account.

POST /api/login

Authenticates a registered user.

## Important

These endpoints are planning targets only. They may change as Team 5 develops the MVP.
