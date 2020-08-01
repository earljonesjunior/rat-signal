import chalk from "chalk";
import express from "express";
import bodyparser from "body-parser";
import cron from "node-cron";


/// switch imports (future use)
// import { switchRouter } from './switch';
// api.use('/switch', switchRouter);

// report imports
import { reportRouter, getMSWData } from './report';

// mqtt client import
import { client } from './mqtt';

// set up api
const api = express();
const port = 8080;
api.use(bodyparser.urlencoded({ extended: true }));
api.use(bodyparser.json());

// set up router
api.use('/report', reportRouter);


// meat and taters

// listen for api calls
api.listen(port, () => {
    console.log(new Date().toLocaleTimeString());
    console.log(`endpoint server started on port ${port}`);
});

// set up cron job
// check every hour
const timestring = '0 0 */1 * * *';

const job = cron.schedule(timestring, () => {
    let time = new Date().toLocaleString();
    console.log(chalk.bgGreen(`cron job ticked. time is ${time}`));

    getMSWData()
        .then(res => {
            console.log(res);
            var rideable = (res.fadedRating >= 1 || res.solidRating >= 1) ? "1" : "0";
            client.publish("surf/rideable", rideable);
            client.publish("surf/timestamp", res.timestamp.toString());
            client.publish("surf/solidRating", res.fadedRating.toString());
            client.publish("surf/fadedRating", res.solidRating.toString());
            client.publish("surf/timeText", res.threeHourTimeText);
            client.publish("surf/period", res.swell.period.toString());
            client.publish("surf/minHeight", res.swell.minBreakingHeight.toString());
            client.publish("surf/maxHeight", res.swell.maxBreakingHeight.toString());
            client.publish("surf/windSpeed", res.wind.speed.toString());
        })
        .catch(err => {
            console.log(err);
        })

})

job.start();  
