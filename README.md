# Proxy-giftcard-hub

Hub to handle GiftCard provider requests.

## Objective

Currently, the external GitHub provider service in VTEX makes numerous requests to the application's `_search` endpoint. These requests are necessary to obtain the most up-to-date balance of the user during their navigation through the checkout process. However, the high frequency of these requests significantly impacts VTEX client integrations, leading to increased data consumption and other performance issues.

The objective of this proxy is to optimize the process by reducing the number of `_search` calls through caching the information for a defined period (in minutes). This way, the external integration will only need to make one request during the cache duration, decreasing data consumption and improving system efficiency.

## Usage for Postman Testing

[Create a mock in Postman](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/) tied to the GiftCard provider endpoints. The relevant endpoints are:

- [`_search`](https://developers.vtex.com/docs/api-reference/giftcard-hub-api#post-/api/giftcardproviders/-giftCardProviderId-/giftcards/_search)
- [`GiftCard by ID`](https://developers.vtex.com/docs/api-reference/giftcard-provider-protocol#get-/giftcards/-giftCardId-)
- [`Create Transaction`](https://developers.vtex.com/docs/api-reference/giftcard-provider-protocol#post-/giftcards/-giftCardId-/transactions)

The app provides an endpoint in `service.json` to configure the provider in VTEX. For example:

```json
{
  "id": "customProvider",
  "serviceUrl": "https://{{workspacename}}--{{accountName}}.myvtex.com/giftcard-hub", // workspace for testing or production
  "oauthProvider": "vtex",
  "preAuthEnabled": true,
  "cancelEnabled": true,
  "appToken": "appTokenhub",
  "appKey": "appKeyhub"
}
```

In the `manifest.json` file under policies: `outbound-access`, insert the mock created in Postman. For example:
```json
"policies": [
    {
      "name": "outbound-access",
      "attrs": {
        "host": "1c383d6c-ec4c-4404-a7ab-711aa5a9864b.mock.pstmn.io",
        "path": "*"
      }
    }
  ]
```

In the `constant.ts` file:

-  Insert the application endpoint into the variable `mock_BASE_URL`.
- Insert the token configured in the provider into the variable: `VTEX_PROVIDER_HUB_TOKEN`. Example: `appTokenhub`
- Insert the key configured in the provider into the variable: `VTEX_PROVIDER_HUB_KEY`. Example: `appKeyhub`

The constant `DEFAULT_GIFTCARD_CACHE` is responsible for setting the caching duration for this data. This directly affects how long the client's balance information will be retained before being refreshed. We recommend performing a detailed analysis for each client to understand the average cart duration of their users. This point is crucial to ensure that if a client quickly revisits the site to make a new purchase, their balance is up-to-date.

# Usage for provider service.

The app provides an endpoint in `service.json` that will be used to configure the provider in VTEX. For example:

```json
{
    "id": "customProvider",
    "serviceUrl": "https://{{workspacename}}--{{accountName}}.myvtex.com/giftcard-hub", // workspace for testing or production
    "oauthProvider": "vtex",
    "preAuthEnabled": true,
    "cancelEnabled": true,
    "appToken": "appTokenhub",
    "appKey": "appKeyhub"
}
```

In the `manifest.json` file under policies: `outbound-access`, insert the endpoint of the application. For example:

```json
"policies": [
    {
      "name": "outbound-access",
      "attrs": {
        "host": "/you-application",
        "path": "*"
      }
    }
  ]
```

In the `constant.ts` file:

- Insert the application endpoint into the variable `mock_BASE_URL`.
- Insert the token configured in the provider into the variable: `VTEX_PROVIDER_HUB_TOKEN`. Example: `appTokenhub`
- Insert the key configured in the provider into the variable: `VTEX_PROVIDER_HUB_KEY`. Example: `appKeyhub`

The constant `DEFAULT_GIFTCARD_CACHE` is responsible for setting the caching duration for this data. This directly affects how long the client's balance information will be retained before being refreshed. We recommend performing a detailed analysis for each client to understand the average cart duration of their users. This point is crucial to ensure that if a client quickly revisits the site to make a new purchase, their balance is up-to-date.

# TODO.

- Consider implementing a dynamic way to set the cache. Analyze the possibility of making this configurable via the app settings in the VTEX admin.
- Review the use of keys and tokens to eliminate the need for hardcoded keys in the codebase.
- Check the time zone issue. In the vbase.ts file, there is a new Date() that sets an additional 3 hours. This is because the database is 3 hours ahead of the current time.
