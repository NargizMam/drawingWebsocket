import './Drawing.css';
import React, { useState, useEffect, useRef } from 'react';
import { Pixel } from "../types";

const DrawingBox = () => {
    const ws = useRef<WebSocket | null>(null);
    const [pixels, setPixels] = useState<Pixel[]>([]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/drawing');

        ws.current.onopen = () => {
            console.log('Connected to server');
        };
        ws.current.onclose = () => console.log("ws closed");

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'INITIAL_PIXELS') {
                setPixels(data.pixels);
            } else if (data.type === 'NEW_PIXEL') {
                setPixels((prevPixels: Pixel[]) => [...prevPixels, data.payload.pixel]);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!ws.current) return;
        const pixel = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
        ws.current.send(JSON.stringify({ type: 'NEW_PIXEL', payload: { pixel: pixel } }));
    };

    return (
        <div className='box'>
            {pixels.length}
            <canvas id="canvas" onClick={handleCanvasClick}></canvas>
        </div>
    );
};

export default DrawingBox;

