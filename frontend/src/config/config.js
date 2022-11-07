import configJson from "./auth_config.json";

// Description: Configures the Auth0 settings for the frontend by pulling data from JSON file.
// Requirements & Setup: Requires a file named "auth_config.json" containing a JSON object; the JSON object
// should be populated with the user's Auth0 settings.
//      Sample auth_config.json object:
//      {
//          "domain": "YOUR_DOMAIN",
//          "clientId": "YOUR CLIENT ID",
//          "audience": "YOUR_API_IDENTIFIER",
//          "appOrigin": "APP ORIGIN",
//          "apiOrigin": "API ORIGIN"
//      }


export function getConfig() {
    const audience =
        configJson.audience && configJson.audience !== "YOUR_API_IDENTIFIER"
            ? configJson.audience
            : null;

    return {
        domain: configJson.domain,
        clientId: configJson.clientId,
        appOrigin: configJson.appOrigin,
        apiOrigin: configJson.apiOrigin,
        ...(audience ? {audience} : null),
    };
}
