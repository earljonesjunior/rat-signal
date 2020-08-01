// for future use

import express from "express";
import { client } from './mqtt';

export const switchRouter = express.Router();

switchRouter.get('/on', turnOn);
switchRouter.get('/off', turnOff);

function turnOn(req: express.Request, res: express.Response) {
    client.publish('switch', "1");
    return res.json("on");
}

function turnOff(req: express.Request, res: express.Response) {
    client.publish('switch', '0');
    return res.json("off");
}