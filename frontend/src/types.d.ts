export interface Pixel {
    x: string;
    y: string;
}
export interface IncomingPixel {
    type: string;
    payload: {
        username: string,
        pixel: Pixel
    }

}