import { SpacetimeDBClient } from "@clockworklabs/spacetimedb-sdk";
import onSpacetimeDBConnect from "../spacetimedb/onSpacetimeDBConnect.js";
import onSpacetimeDBError from "../spacetimedb/onSpacetimeDBError.js";
import fs from "fs";
import { StartHeartbeat } from "../../util/ping";
import Elements from "../../module_bindings/elements.js";
import ElementStruct from "../../module_bindings/element_struct.js";
import WidgetElement from "../../module_bindings/widget_element.js";
import TextElement from "../../module_bindings/text_element.js";
import ConnectReducer from "../../module_bindings/connect_reducer.js";
import AuthenticateReducer from "../../module_bindings/authenticate_reducer.js";
import UpdateElementStructReducer from "../../module_bindings/update_element_struct_reducer.js";
import Heartbeat from "../../module_bindings/heartbeat.js";
import PingHeartbeatReducer from "../../module_bindings/ping_heartbeat_reducer.js";
import KeepAliveReducer from "../../module_bindings/keep_alive_reducer.js";

async function onTwitchConnect() {
  console.log("Bot online");

  let token: string | undefined = undefined;

  try {
    token = fs.readFileSync("token.txt").toString();
  } catch (err) {}

  const spacetimeDBClient = new SpacetimeDBClient(process.env.POGLY_DOMAIN!, process.env.POGLY_MODULE!, token);
  SpacetimeDBClient.registerTables(Elements, WidgetElement, TextElement, Heartbeat);
  SpacetimeDBClient.registerReducers(ConnectReducer, AuthenticateReducer, UpdateElementStructReducer, PingHeartbeatReducer, KeepAliveReducer);
  spacetimeDBClient.connect();
  spacetimeDBClient.onConnect(onSpacetimeDBConnect);
  spacetimeDBClient.onError(onSpacetimeDBError);

  spacetimeDBClient.subscribe(["SELECT * FROM Elements","SELECT * FROM Heartbeat"]);
}

export default onTwitchConnect;
