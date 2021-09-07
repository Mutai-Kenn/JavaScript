// OpenWeatherMap API 

const app = {
    init: () => {
        document
        .getElementById('btnGet')
        .addEventListener('click', app.fetchWeather);

        document
        .getElementById('btnCurrent')
        .addEventListener('click', app.getLocation);
    },

// Weather async
 fetchWeather: (ev) =>{
     let lat = document.getElementById('latitude').value;
     let lon = document.getElementById('longitude').value;
     let key= '6d62521480623a7333521d4efd4b309d';
     let lang= 'en';
     let units = 'metric';
     let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${key}&units=${units}&lang=${lang}`;

    //  Fetch Weather Data
    fetch(url)
        .then((resp) => {
            if(!resp.ok)
             {throw new Error(`HTTP error status:${resp.statusText}`);
            }
            return resp.json();
    })
    .then((data) => {
        app.showWeather(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
 },

// Geolocation coordinates
getLocation: (ev)=> {
    let options = {
        enableHighAccuracy: true,
        timeout:1000 * 10,
        maximumAge: 1000 * 60 * 5,
    };
    navigator.geolocation.getCurrentPosition(app.locationsuccess, app.locationfailure, options);
},

// Success getting coordinate
locationsuccess: (position) => {
    document.getElementById('latitude').value = position.coords.latitude.toFixed(2);
    document.getElementById('longitude').value = position.coords.longitude.toFixed(2);
},

// Failure getting coordinates
locationfailure: (err) => {
console.warn(`ERROR(${err.code}): ${err.message}`);
},
showWeather: (resp) => {
    console.log(resp.daily);
    let row = document.querySelector('.weather .row');
    // Using map and join to select 3 day weather
    row.innerHTML = resp.daily.map((day, idx) => {
        if(idx <= 2){
            let dt = new Date(day.dt * 1000);
            let sr = new Date(day.sunrise * 1000).toTimeString();
            let ss = new Date(day.sunset *1000).toTimeString();
        return ` <div class="card">
                    <div class="date">${dt.toDateString()} </div>
                    <div class="icon">
                         <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="${day.weather[0].description}">
                    </div>
                    <div class="condition"> ${day.weather[0].main} </div>
                    <div class="card-body">
                        <div class="temp">Temp ${day.temp.day}&deg; C</div>   
                        <p class="card-text">High ${day.temp.max} &deg;C</p>
                        <p class="card-text">Low ${day.temp.min} &deg;C</p>
                        <p class="card-text">Feels like ${day.feels_like.day} &deg;C</p>
                        <p class="card-text">Pressure ${day.pressure} mb</p>
                        <p class="card-text">Humidity ${day.humidity}%</p>              
                        </div>
                </div> `;
        }
    })
    .join(' ');
}

}

app.init();