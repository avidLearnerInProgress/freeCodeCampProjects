$(document).ready(function() {
    // set margin-top dynamically by window size
    $(".wrapper").css("margin-top", ($(window).height()) / 6);

    //get date and time and convert it to days, months, hours, day-name, AM/PM
    var dt = new Date() //system date

    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $('#day').html(days[dt.getDay()]); //set days[n]

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    $('#date').html(months[dt.getMonth()] + " " + dt.getDate() + ", " + dt.getFullYear()); //set date months[n],1,2018


    $('#time').html((dt.getHours() > 12 ? (dt.getHours() - 12) : dt.getHours()).toString() + ":" + ((dt.getMinutes() < 10 ? '0' : '').toString() + dt.getMinutes().toString()) + (dt.getHours() < 12 ? ' AM' : ' PM').toString()); //set time x:y a.m/p.m.


    //render temperature in fahrenheit
    var temp = 0;
    
    $('#fahrenheit').click(function() {
        $(this).css("color", "white");
        $('#celsius').css("color", "#b0bec5");
        $('#temperature').html(Math.round(temp * 1.8 + 32));
    });

    //render temperature in celsius
    $('#celsius').click(function() {
        $(this).css("color", "white");
        $('#fahrenheit').css("color", "#b0bec5");
        $('#temperature').html(Math.round(temp));
    });

    //html5 geolocation api
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

          //latitude and longitude round of values to fixed 2 decimals
            var myLatitude = parseFloat(Math.round(position.coords.latitude * 100) / 100).toFixed(2);
            var myLongitude = parseFloat(Math.round(position.coords.longitude * 100) / 100).toFixed(2); 

            //weather api
            $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + myLatitude + "&lon=" + myLongitude + "&id=524901&appid=ca8c2c7970a09dc296d9b3cfc4d06940", function(json) {
                $('#city').html(json.name + ", " + json.sys.country);
                $('#weather-status').html(json.weather[0].main + " / " + json.weather[0].description);

                // we have considered weather[0] becz there maybe multiple reports for single location
                //weather conditions
                //check api conditions here --> https://openweathermap.org/weather-conditions
                switch (json.weather[0].main) {
                    case "Clouds":
                        $('.weather-icon').attr("src", "icon/cloudy.png");
                        break;
                    case "Clear":
                        $('.weather-icon').attr("src", "icon/sunny2.png");
                        break;
                    case "Thunderstorm":
                        $('.weather-icon').attr("src", "icon/thunderstorm.png");
                        break;
                    case "Drizzle":
                        $('.weather-icon').attr("src", "icon/drizzle.png");
                        break;
                    case "Rain":
                        $('.weather-icon').attr("src", "icon/rain.png");
                        break;
                    case "Snow":
                        $('.weather-icon').attr("src", "icon/snow.png");
                        break;
                    case "Extreme":
                        $('.weather-icon').attr("src", "icon/warning.png");
                        break;
                }

                temperature = (json.main.temp - 273); 
                $('#temperature').html(Math.round(temperature));
                $('.windspeed').html(json.wind.speed + " Km/h")
                $('.humidity').html(json.main.humidity + " %");
                $('.pressure').html(json.main.pressure + " hPa");
                var sunriseUTC = json.sys.sunrise * 1000;
                var sunsetUTC = json.sys.sunset * 1000;
                var sunriseDt = new Date(sunriseUTC);
                var sunsetDt = new Date(sunsetUTC);
                $('.sunrise-time').html((sunriseDt.getHours() > 12 ? (sunriseDt.getHours() - 12) : sunriseDt.getHours()).toString() + ":" + ((sunriseDt.getMinutes() < 10 ? '0' : '').toString() + sunriseDt.getMinutes().toString()) + (sunriseDt.getHours() < 12 ? ' AM' : ' PM').toString());
                $('.sunset-time').html((sunsetDt.getHours() > 12 ? (sunsetDt.getHours() - 12) : sunsetDt.getHours()).toString() + ":" + ((sunsetDt.getMinutes() < 10 ? '0' : '').toString() + sunsetDt.getMinutes().toString()) + (sunsetDt.getHours() < 12 ? ' AM' : ' PM').toString());
            });
        });
    } else {
        $("#city").html("Please turn on Geolocator on Browser.")
    }
});