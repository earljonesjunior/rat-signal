# Rat-Signal

*A collection of microservices that feed surf report data into my automated home.*

- Endpoint: responsible for pulling data from MSW and sending it to the MQTT broker. Data can also be accessed via a REST API.
- Middleman: the middleman between my home network and the outside world. Uses NODE-RED to ping IfTTT
webhooks which can be consumed by my devices.
- Broker: runs the Mosquitto MQTT broker

## To Run:
1) Add the IfTTT webhook key to the http request in `flow.json` in `/middleman`
2) Run `docker-compose up -d`.

## Disclaimer

These microservices are meant to run on a home enclave network. Absolutely zero security measures have been implemented.