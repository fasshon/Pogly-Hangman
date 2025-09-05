import PingHeartbeatReducer from "../module_bindings/ping_heartbeat_reducer"

let heartbeatInterval: NodeJS.Timeout | null = null;

export const StartHeartbeat = () => {
  if (heartbeatInterval) {
    return;
  }

  heartbeatInterval = setInterval(() => {
    try {
      PingHeartbeatReducer.call(); 
    } catch (error) {
      console.error("Failed to send heartbeat ping:", error);
      StopHeartbeat(); 
    }
  }, 5000);
}

export const StopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}