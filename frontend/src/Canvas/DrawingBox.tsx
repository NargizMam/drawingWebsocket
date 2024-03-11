import React, {useEffect, useRef, useState} from 'react';
import {Pixel} from "../types";
import './Drawing.css';

const DrawingBox = () => {
    const ws = useRef<WebSocket | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [_pixels, setPixels] = useState<Pixel[]>([]);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [prevPos, setPrevPos] = useState<{ x: number; y: number } | null>(null);

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
                redrawPixels(data.pixels);
            } else if (data.type === 'NEW_PIXEL') {
                setPixels((prevPixels: Pixel[]) => [...prevPixels, data.payload.pixel]);
                redrawPixel(data.payload.pixel);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const redrawPixels = (pixels: Pixel[]) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        pixels.forEach(pixel => {
            ctx.fillStyle = 'red';
            ctx.fillRect(pixel.x, pixel.y, 1, 1);
        });
    };

    const redrawPixel = (pixel: Pixel) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = 'red';
        ctx.fillRect(pixel.x, pixel.y, 1, 1);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!ws.current) return;
        setIsDrawing(true);
        const pixel = {x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY};
        ws.current.send(JSON.stringify({type: 'NEW_PIXEL', payload: {pixel: pixel}}));
        setPrevPos({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY});
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setPrevPos(null);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!ws.current || !isDrawing || !prevPos) return;
        const pixel = {x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY};
        ws.current.send(JSON.stringify({type: 'NEW_PIXEL', payload: {pixel: pixel}}));
        drawLine(prevPos, pixel);
        setPrevPos({x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY});
    };

    const drawLine = (startPos: { x: number; y: number }, endPos: { x: number; y: number }) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    };

    return (
        <>
            <canvas
                className='box'
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            ></canvas>
        </>
    );
};

export default DrawingBox;
