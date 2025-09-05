import { Identity, Address } from "@clockworklabs/spacetimedb-sdk";
import UpdateGuestNicknameReducer from "../../module_bindings/update_guest_nickname_reducer";
import AuthenticateReducer from "../../module_bindings/authenticate_reducer.js";
import ConnectReducer from "../../module_bindings/connect_reducer.js";
import fs from "fs";
import { StartHeartbeat } from "../../util/ping";

async function onSpacetimeDBConnect(token: string, Identity: Identity, Address: Address) {
  console.log("Connected to SpacetimeDB! [" + Identity.toHexString() + "] @ [" + Address.toHexString() + "]");

  fs.writeFileSync("token.txt", token);

  ConnectReducer.call();
  AuthenticateReducer.call(process.env.POGLY_AUTHENTICATION_KEY!);
  UpdateGuestNicknameReducer.call(process.env.BOT_GUEST_NAME!);
  StartHeartbeat();
}

export default onSpacetimeDBConnect;
