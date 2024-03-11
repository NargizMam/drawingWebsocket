import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {RootState} from "../app/store.ts";

export interface Pixel {
    x: number;
    y: number;
    color: string;
}

interface DrawingState {
    pixels: Pixel[];
}

const initialState: DrawingState = {
    pixels: [],
};

export const drawingSlice = createSlice({
    name: 'drawing',
    initialState,
    reducers: {
        drawPixel: (state, action: PayloadAction<Pixel>) => {
            state.pixels.push(action.payload);
        },
    },
});

export const { drawPixel } = drawingSlice.actions;

export const drawingReducer = drawingSlice.reducer;

export const selectDrawing = (state: RootState) => state.drawing.pixels;
