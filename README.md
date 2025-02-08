# weatherkit2influxdb2
Stores weather forcecast data from Apple WeatherKit API into an influxdb v2 bucket.
<br>[Powered by Apple WeatherKit](https://developer.apple.com/weatherkit/data-source-attribution/)

This information can by used to display forecast data with [grafana](https://grafana.com/).

<b>Tip:</b> [This blogpost](http://www.robstechlog.com/2017/06/30/personal-weather-chart-module/) describes the installation and setup for a personal weather chart using influxdb and grafana and step-by-step.

## Preview

![](https://github.com/joehoper/weatherkit2influxdb2/blob/master/forecast_preview.png?raw=true)


## Getting Started

Clone repository `git clone https://github.com/joehoper/weatherkit2influxdb2`

### Prerequisites

#### Node and npm
Node and npm are required. See https://docs.npmjs.com/getting-started/installing-node.
Test your version by
```
node -v
npm -v
```
Get the latest npm version with `npm install npm@latest -g`

#### Apple WeatherKit API
Get your https://developer.apple.com/documentation/weatherkitrestapi/request-authentication-for-weatherkit-rest-api here.

#### Influxdb
Please follow the official installation documentation https://docs.influxdata.com/influxdb/v2/install/

#### Grafana
If you want to visualise the data in a chart I can hardily reccomend [grafana](https://grafana.com/). <br> You can find my dashboard for import in `grafana\Weather - Forecast-Dashboard.json`.

### Installing

1. Enter cloned directory: `cd weatherkit2influxdb2` and install dependencies `npm install`
2. Configure config/default.yml file

Here is an example of `default.yml`
```
general:
  debug: true
  cron: '*/15 * * * *'
weatherKit:
  token: apple_jwt_token
  longitude: -123.41670367098749
  latitude: 47.20296790272209
influxdb2:
  host: 192.168.188.2
  bucket: weatherkit
  org: influx_org
  token: access_token
```

|Option|Description|
|---|---|
|`debug`|Enables Debug mode and provides additional informations <br><br>**Type:** `booleon`<br>**Possible values:** `true`,`false`|
|`cron`|Programm is repating itself in a given period<br><br>**Type:** `string`<br>**Possible values:** `'*/15 * * * *'` - every 15 minutes,<br>`''` - running only once|
|weatherKit - `token`|get your Apple WeatherKit token here https://developer.apple.com/documentation/weatherkitrestapi/request-authentication-for-weatherkit-rest-api<br><br>**Type:** `string`<br>**Possible values:** `abcdefghiklmnopqrstuvwxyz1234567` |
|weatherKit - `longitude` and `latitude `|Coordinates of forecast location (in decimal degrees).<br><br>**Type:** `float`<br>**Possible values:** `latitude: 47.20296790272209` and `longitude:-123.41670367098749` |
|influxdb2 - `url`|URL for your influxdb <br><br>**Type:** `string`<br>**Possible values:** `http://localhost:8086` , `http://192.168.188.2:8086` |
|influxdb2 - `bucket`|Name of your bucket the forecast data is stored. <br><br>**Type:** `string`<br>**Possible values:** `weather` , `forecast`|
|influxdb2 - `org`|Org name of yoru influxdb|
|influxdb2 - `token`|Token with writing privileges on the database|



## Running the Import

Start the import with `node importForecast.js` If you have given a valid cron interval in the configfile the programm will repeat the import automaticly.

## Tested

This is coded on a PC and tested on a RaspberryPi 4

## Authors

* **SvenSommer** - [SvenSommer](https://github.com/SvenSommer/)
* **Brianantonelli** - [Brianantolelli](https://github.com/brianantonelli/) 
See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* DarkSky client from [darksky-node](https://github.com/brianantonelli/darksky-node). Many thanks!
* This code is originally based on ErwinSteffens project [darksky-influxdb](https://github.com/ErwinSteffens/darksky-influxdb). Many thanks to him!
