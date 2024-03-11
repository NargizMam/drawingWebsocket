import {createAsyncThunk} from '@reduxjs/toolkit';
import {Pixel} from './drawingSlice';
import axiosApi from "../axiosApi.ts";

export const sendPixelData = createAsyncThunk<void, Pixel>(
    'drawing/sendPixelData',
    async (pixel) => {
        await axiosApi.post('/drawing', pixel);
    }
);

export default sendPixelData;
