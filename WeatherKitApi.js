const request = require('request');

class WeatherKitApi {
    baseUrl = 'https://weatherkit.apple.com/api/v1';
    accessToken;

    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    forecast(latitude, longitude, callback) {
        var req = {
            url: `${this.baseUrl}/weather/en/${latitude}/${longitude}?dataSets=forecastHourly,forecastDaily`,
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        };

        request(req, function (error, response, body) {
            if (!error && response.statusCode == 200)
                callback(null, body);
            else
                callback(error, null);
        });
    }
}

module.exports = WeatherKitApi;