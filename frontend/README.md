# Frontend

Frontend development files for the Nepal Crisis Response Hub will be stored here.

## Run the classroom prototype

From the repository root, run `python -m http.server 8000 --directory frontend`, then open `http://localhost:8000`. Browser location permission is required for GPS sharing. Use localhost or HTTPS.

## Final demo

1. In one browser profile, register a resident, a volunteer responder, and the prototype admin (`test@example.com`). Use fictional details and a demo password.
2. As the resident, switch between English and Nepali. Submit a help request with a manual location or shared GPS, then add a note from the dashboard.
3. As admin, assign the request to the responder and publish an alert with a location, description, and safety instructions. Open the alert from the homepage to show its details.
4. As responder, open **My Assigned Requests** and show the location and note. As resident, cancel the request. Sign back in as the responder and show the canceled status.
5. As resident, save an emergency contact from **Resources**, then show and remove it from the dashboard. Use **Donate** to record a simulated contribution and view it in **Donation History**.

Accounts and activity are stored in the demo browser, so switch roles in that same profile. The donation flow records simulated entries only. The language switch translates the main interface and preserves user-entered content.
