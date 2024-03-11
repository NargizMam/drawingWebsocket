// import express from 'express';
// import { ActiveConnections, IncomingPixelMessage } from '../types';
// import crypto from 'crypto';
//
// const drawingRouter = express.Router();
// const activeConnections: ActiveConnections = {};
// const existingPixelsArray: IncomingPixelMessage[] = [];
//
// drawingRouter.ws('/drawing', (ws, _req) => {
//     const id = crypto.randomUUID();
//     activeConnections[id] = ws;
//     ws.send(JSON.stringify(existingPixelsArray));
//
//     ws.on('message', (msg: IncomingPixelMessage) => {
//         try {
//             const parsedMessage = JSON.parse(msg.toString()) as IncomingPixelMessage;
//             if (parsedMessage.type === 'SET_PIXEL') {
//             } else if (parsedMessage.type === 'SEND_PIXEL') {
//                 existingPixelsArray.push(parsedMessage);
//                 Object.values(activeConnections).forEach(connection => {
//                     const outgoingMsg: IncomingPixelMessage = {
//                         type: 'NEW_PIXEL',
//                         payload: parsedMessage.payload,
//                     };
//                     connection.send(JSON.stringify(outgoingMsg));
//                 });
//             }
//         } catch (error) {
//             console.error('Error parsing message:', error);
//         }
//     });
//
//     ws.on('close', () => {
//         console.log('Client disconnected!');
//         delete activeConnections[id];
//     });
// });
//
// export default drawingRouter;
