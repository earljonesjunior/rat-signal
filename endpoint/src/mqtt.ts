import mqtt from "mqtt";

export const client = mqtt.connect('mqtt://broker:1883');

client.on('connect', (packet: mqtt.Packet) => {
    console.log("connected");
    client.subscribe("news");
    client.subscribe("switch");

})

client.on('message', (topic: string, message: Buffer) => {
    console.log(`topic is ${topic}`);
    console.log("message is " + message.toString());
})

client.on('error', (error: Error) => {
    console.log(error);
})