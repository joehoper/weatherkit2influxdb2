/* weatherkit2influxdb2
 * Stores weather forcecast data from Apple WeatherKit into an InfluxDB v2 database
 *
 * By Joe Hoper 
 * based on darksky2influxdb by SvenSommer https://github.com/SvenSommer/darksky2influxdb
 * based on ErwinSteffens project https://github.com/ErwinSteffens/darksky-influxdb
 * MIT Licensed.
 */

const
    Influx = require('@influxdata/influxdb-client'),
    config = require('config'),
    cron = require('node-cron'),
    WeatherKitApi = require('./WeatherKitApi.js');

const generalConfig = config.get('general'),
    influxConfig = config.get('influxdb2'),
    weatherKitConfig = config.get('weatherKit');

if (!weatherKitConfig.token)
    throw new Error('Apple WeatherKit JWT token must beprovided.');

const influxDb2 = new Influx.InfluxDB({
    url: influxConfig.url,
    token: influxConfig.token
})

const writeApi = influxDb2.getWriteApi(influxConfig.org, influxConfig.bucket);

writeApi.useDefaultTags({
    source: 'Apple WeatherKit'
});

const weatherKit = new WeatherKitApi(weatherKitConfig.token);

var getForecast = function () {
    weatherKit.forecast(weatherKitConfig.latitude, weatherKitConfig.longitude,
        function (err, responseBody) {
            if (err)
                console.error('Error while requesting darksky forecast', err);
            
            else {
                var forecast = JSON.parse(responseBody);

                var daily = forecast.forecastDaily;
                var hourly = forecast.forecastHourly;

                if (generalConfig.debug)
                    console.dir(hourly);

                console.log(`Writing ${hourly.hours.length} Datapoints to InfluxDB2 in bucket "${influxConfig.bucket}" with measurement "forecast" at ${influxConfig.url}`);

                for (var i = 0; i < hourly.hours.length; i++) {
                    var fc = hourly.hours[i];
                    var ts = new Date(fc.forecastStart);

                    var daytime = false;
                    for (var j = 0; j < daily.days.length; j++) {
                        var day = daily.days[j]

                        if (ts > new Date(day.sunrise) && ts < new Date(day.sunset)) {
                            daytime = true;
                        }
                    }

                    var daytime_show = -10;
                    var nightime_show = 0;

                    var sun_cover = 1 - fc.cloudCover;
                    if (!daytime) {
                        sun_cover = 0;
                        daytime_show = 0;
                        nightime_show = -10;
                    }

                    var point = new Influx.Point('forecast')
                        .floatField('precipIntensity', fc.precipitationIntensity)
                        .floatField('precipProbability', fc.precipitationChance)
                        .floatField('temperature', fc.temperature)
                        .floatField('apparent_temperature', fc.temperatureApparent)
                        .floatField('dew_point', fc.temperatureDewPoint)
                        .floatField('humidity', fc.humidity)
                        .floatField('wind_speed', fc.windSpeed)
                        .floatField('wind_bearing', fc.windDirection)
                        .floatField('cloud_cover', fc.cloudCover)
                        .floatField('sun_cover', sun_cover)
                        .booleanField('daytime', daytime)
                        .floatField('daytime_show', daytime_show)
                        .floatField('nightime_show', nightime_show)
                        .timestamp(ts);

                    writeApi.writePoint(point);

                    if (generalConfig.debug) {
                        console.log(`Writing Point ${i}:`);
                        console.log(`  Temperature    : ${fc.temperature}`);
                        console.log(`  timestamp      : ${ts}`);
                        console.log(`  daytime        : ${daytime}`);
                    }
                }

                writeApi.close().catch(err => {
                    console.error('Error writing to InfluxDB', err)
                }).then(() => {
                    console.log('Supposedly we have finished.');
                });
            }
    })
}

if (generalConfig.cron) {
    cron.schedule(generalConfig.cron, function () {
        getForecast();
    });

    console.log(`DarkSky data will be written to InfluxDB on cron interval '${generalConfig.cron}'`);
} else {
    getForecast();

    console.log('DarkSky data is written to InfluxDB');
}