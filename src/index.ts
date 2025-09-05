import "dotenv/config";

import * as tmi from "tmi.js";
import { SpacetimeDBClient } from "@clockworklabs/spacetimedb-sdk";
import onTwitchMessage from "./events/twitch/onTwitchMessage";
import onTwitchConnect from "./events/twitch/onTwitchConnect";
import UpdateGuestNicknameReducer from "./module_bindings/update_guest_nickname_reducer";
import AuthenticateReducer from "./module_bindings/authenticate_reducer.js";
import ConnectReducer from "./module_bindings/connect_reducer.js";
import Layouts from "./module_bindings/layouts.js";
import SetLayoutActiveReducer from "./module_bindings/set_layout_active_reducer.js";

if (
  !process.env.TWITCH_CHANNEL ||
  !process.env.BOT_GUEST_NAME ||
  !process.env.POGLY_DOMAIN ||
  !process.env.POGLY_MODULE ||
  !process.env.POGLY_MODULE
) {
  console.log("MISSING ENVIRONMENT VARIABLES!!");
  process.exit();
}

SpacetimeDBClient.registerTables(Layouts);
SpacetimeDBClient.registerReducers(
  AuthenticateReducer,
  ConnectReducer,
  UpdateGuestNicknameReducer,
  SetLayoutActiveReducer
);

const twitchChannel: string = process.env.TWITCH_CHANNEL;

const twitchClient = tmi.Client({ channels: [twitchChannel] });

twitchClient.connect();
twitchClient.on("connected", onTwitchConnect);
twitchClient.on("message", onTwitchMessage);
