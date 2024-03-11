import './Drawing.css';
const DrawingBox = () => {
    const ws = useRef<WebSocket | null>(null);
    const [pixels, setPixels] = useState<{ x: number; y: number }[]>([]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/drawing');

        ws.current.onopen = () => {
            console.log('Connected to server');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'INITIAL_PIXELS') {
                setPixels(data.pixels);
            } else if (data.type === 'NEW_PIXEL') {
                setPixels((prevPixels) => [...prevPixels, data.pixel]);
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
        ws.current.send(JSON.stringify({ type: 'NEW_PIXEL', pixel: pixel }));
    };

    return (
        <div className='box'>
            {pixels.length}
            <canvas id="canvas" onClick={handleCanvasClick}></canvas>
        </div>
    );
};

import React, {useState, useEffect, useRef} from 'react';

export default DrawingBox;