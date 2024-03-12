import expressWs from 'express-ws';
import express from 'express';
import cors from 'cors';
import { ActiveConnections, IncomingPixelMessage, Pixel } from './types';
import crypto from 'crypto';

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());

const drawingRouter = express.Router();
const activeConnections: ActiveConnections = {};
const existingPixelsArray: Pixel[] = [];

drawingRouter.ws('/', (ws, _req) => {
  const id = crypto.randomUUID();
  activeConnections[id] = ws;
  ws.send(JSON.stringify({ type: 'INITIAL_PIXELS', payload: existingPixelsArray }));

  ws.on('message', (payload: string) => {
    try {
      const parsedMessage = JSON.parse(payload) as IncomingPixelMessage;
      if (parsedMessage.type === 'NEW_PIXEL') {
        existingPixelsArray.push(parsedMessage.payload);

        Object.values(activeConnections).forEach((connection) => {
          const outgoingMsg = {
            type: 'NEW_PIXEL',
            payload: parsedMessage.payload,
          };
          connection.send(JSON.stringify(outgoingMsg));
        });
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected!');
    delete activeConnections[id];
  });
});
app.use('/drawing', drawingRouter);

app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});
