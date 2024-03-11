import express from 'express';
import expressWs from "express-ws";
import cors from 'cors';

const app = express();

expressWs(app);

const port = 8000;
app.use(cors());


app.listen(port, () => {
    console.log(`Server started on ${port} port!`)
});