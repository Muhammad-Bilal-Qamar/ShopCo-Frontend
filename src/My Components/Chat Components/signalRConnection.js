import * as signalR from "@microsoft/signalr";

let connection = null;

export const getChatConnection = () => {
    if (connection) return connection;

    connection = new signalR.HubConnectionBuilder()
        .withUrl("/chat", {
            accessTokenFactory: () => localStorage.getItem("token") || "",
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Warning)
        .build();

    return connection;
};

export const startChatConnection = async () => {
    const conn = getChatConnection();
    if (conn.state === signalR.HubConnectionState.Disconnected) {
        await conn.start();
    }
    return conn;
};

export const stopChatConnection = async () => {
    if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
        await connection.stop();
    }
};