import express from "express";
import axios from "axios";

export const reportRouter = express.Router();

const mswEndpoint = "https://magicseaweed.com/api/mdkey/forecast?spot_id=954&fields=timestamp,threeHourTimeText,fadedRating,solidRating,swell.minBreakingHeight,swell.maxBreakingHeight,swell.period,wind.speed";

interface MSWResponse {
    timestamp: number,
    fadedRating: number,
    solidRating: number,
    threeHourTimeText: string,
    swell: {
        period: number,
        minBreakingHeight: number,
        maxBreakingHeight: number
    },
    wind: {
        speed: number
    }
}

// router endpoints
reportRouter.get('/', getReport);

// GET '/'
// using promises here so i can reuse the getMSW method
function getReport(req: express.Request, res: express.Response) {

    getMSWData()
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.json(err);
        });

}

// using promises
export function getMSWData(): Promise<MSWResponse> {

    return new Promise((resolve, reject) => {
        axios.get(mswEndpoint)
            .then(response => {
                return filterMSWData(response.data);
            })
            .then(filteredData => {
                resolve(filteredData);
            })
            .catch(err => {
                reject(err);
            })
    })
}


// MSW endpoint returns a week of forecast data
// compare data timestamp to current time and return closest forecast in time
function filterMSWData(data: MSWResponse[]): MSWResponse {

    let timestamp = Math.floor(Date.now() / 1000);
    let i = 0;

    // setup delta to 1ms later than first timestamp in to keep loop happy
    let delta = Math.abs(timestamp - data[0].timestamp) + 1;

    // iterate through data until delta is no longer decreasing
    for (let element of data) {
        if (Math.abs(timestamp - element.timestamp) < delta) {
            delta = Math.abs(timestamp - element.timestamp);
            i++;
        } else {
            // if no longer decreasing, return previous timestamp
            i = (i == 0) ? 0 : i - 1;
            break;
        }
    }

    return data[i];
}

