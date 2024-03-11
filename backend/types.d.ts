import {WebSocket} from "ws";

export interface ActiveConnections {
    [id: string]: WebSocket
}
export interface Pixel {
    x: string;
    y: string;
}
export interface IncomingPixelMessage {
    type: string;
    payload: {
        username: string,
        pixel: Pixel
    }

}

