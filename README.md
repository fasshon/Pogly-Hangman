## Pogly Standalone Twitch chat bot integration PoC

This is a VERY simple **proof of concept** on how you could integrate Pogly Standalone into your **own** chat bot.

The point of this project is to push you in the right direction if you're interested in doing something like this. This project will most likely not be maintained and is not guaranteed to function properly.

### **Pogly Standalone frontend is not currently designed with Twitch Chat bot integration in mind so... keep that in mind.**

https://github.com/user-attachments/assets/18c223e8-957c-4c9b-85e5-2cdc34222a2e

## PoC contents

- [How to connect to a Pogly module](https://github.com/PoglyApp/pogly-twitch-bot-poc/blob/635d6cdbab66d8871de98b765e1a23dde19f2374/src/events/twitch/onTwitchConnect.ts#L15)
- [How to authenticate in a Pogly Module](https://github.com/PoglyApp/pogly-twitch-bot-poc/blob/635d6cdbab66d8871de98b765e1a23dde19f2374/src/events/spacetimedb/onSpacetimeDBConnect.ts#L12)
- [Example code to trigger an event within the module](https://github.com/PoglyApp/pogly-twitch-bot-poc/blob/635d6cdbab66d8871de98b765e1a23dde19f2374/src/events/twitch/onTwitchMessage.ts#L15)
- [A simple way to save SpacetimeDB token / Pogly identity](https://github.com/PoglyApp/pogly-twitch-bot-poc/blob/635d6cdbab66d8871de98b765e1a23dde19f2374/src/events/spacetimedb/onSpacetimeDBConnect.ts#L10)

## Usage

First fill `.env` variables

```
npm install
```

```
npm run start_bot
```

## Development

Due to this being just a proof of concept, there aren't many reducers and table references in this project out of the box. Since interacting with the overlay via text is significantly different compared to the React frontend, you most likely have to write your own SpacetimeDB reducers for your specific use cases.

When developing, you need to first build with `tsc` then `ts-add-js-extension --dir=dist` to fix all the importing related issues. Everything you need to do is bundled up in `npm run start_bot` so use that instead.

For any questions / assistance for integrating Pogly into your Twitch Chat bot, feel free to join our [Discord](https://discord.gg/uPQsBaVdB7).
