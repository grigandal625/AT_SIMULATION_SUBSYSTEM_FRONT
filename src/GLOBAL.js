export const LOAD_STATUSES = {
    LOADING: "loading",
    LOADED: "loaded",
    SUCCESS: "loaded",
    ERROR: "error",
    IDLE: "idle",
    TO_REFRESH: "to_refresh",
};

export const PROCES_STATUSES = {
    RUNNING: "RUNNING",
    PAUSED: "PAUSE",
    KILLED: "KILLED",
    ERROR: "ERROR",
};

export const OPERATION_TYPES = {
    IRREGULAR_EVENT: "IRREGULAR_EVENT",
    OPERATION: "OPERATION",
    RULE: "RULE",
};

export const OPERATION_TYPE_LABELS = Object.fromEntries([
    [OPERATION_TYPES.IRREGULAR_EVENT, "Нерегулярное событие"],
    [OPERATION_TYPES.OPERATION, "Операция"],
    [OPERATION_TYPES.RULE, "Правило"],
]);

export const API_PROTOCOL = process.env.REACT_APP_API_PROTOCOL || "http";
export const WS_PROTOCOL = process.env.REACT_APP_WS_PROTOCOL || "ws";
export const API_HOST = process.env.REACT_APP_API_HOST || window.location.hostname;
export const API_PORT = process.env.REACT_APP_API_PORT || 80;

export const API_URL = process.env.REACT_APP_API_URL || `${API_PROTOCOL}://${API_HOST}:${API_PORT}`;
export const WS_URL = process.env.REACT_APP_WS_URL || `${WS_PROTOCOL}://${API_HOST}:${API_PORT}`;
export const MOCKING = ["true", "false"].includes(String(process.env.REACT_APP_MOCKING)) ? JSON.parse(String(process.env.REACT_APP_MOCKING)) : false;

export const getHeaders = (extra = {}) => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
    ...extra,
});
