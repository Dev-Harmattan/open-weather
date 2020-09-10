const search = document.getElementById('serchInput');
const message = document.getElementById('message');
const button = document.getElementById('submitButton');
const form =  document.getElementById('form');
const list = document.querySelector(".ajax-section .cities");


function showError(input, messageElement, errMess) {
    input.className = 'search inputError';
    messageElement.innerHTML = errMess;
    messageElement.className = 'errorDisplay';
    search.className = 'input-error';
};

function success(msg) {
    msg.innerHTML = '';
}


function checkSearchInput(input) {
    const regrex = /^[a-zA-Z\s]+$/;
    if(!search.value.trim()) {
        showError(search, message, 'Require city or country name 😞');

    } else {
        if(!regrex.test(search.value.trim())) {
            showError(search, message, 'Should contain only letters 😞')
            search.classList.add('input-error');

        } else {
            fetchWeather(search.value.trim());
            success(message);
            form.reset();
            search.focus();
        }
    }
}

form.addEventListener('submit', function(e){
    e.preventDefault();

    checkSearchInput(search)

});

function fetchWeather(country) {
    const key = 'f891314b7c99f80260016ee48ccc5621';
    let endpoint = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${key}&unit=metric`;
    fetch(endpoint)
    .then(response =>  {
        if(response.ok){
            return response;
        } else {
            var error = new Error(response.status + ' ' + response.statusText);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errrorMess = new Error(error);
        throw errrorMess;
    })
    .then(response => response.json())
    .then(data => WeatherCart.addWeather(data))
    .catch((error) => {
        console.log(error);
        message.innerHTML = "Please search for a valid city 😩";
        message.className = 'errorDisplay';
    });
}

function updateWeatherUI() {
    list.innerHTML = '';
    currentWeather.weathers.forEach(element => {
        const li = document.createElement('li');
        const name =  element.name;
        const sys = element.sys.country;
        const temp = Math.round(element.main.temp);

        const icon = `https://openweathermap.org/img/wn/${element.weather[0]["icon"]}@2x.png`;

      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys}">
          <span>${name}</span>
          <sup>${sys}</sup>
        </h2>
        <div class="city-temp">${temp}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src=${icon} alt=${element.weather[0]["main"]}>
          <figcaption>${element.weather[0]["description"]}</figcaption>
        </figure>
      `;

        li.innerHTML = markup;
        list.appendChild(li);
        
    });
    
}

function WeatherCart() {
    this.weathers = new Array()
}

var currentWeather = null;
currentWeather = JSON.parse(localStorage.getItem('weatherCart'));

if(!currentWeather) {
    createEmptyCart();
}

WeatherCart.addWeather = function(data) {
    currentWeather.weathers.unshift(data);
    localStorage.setItem('weatherCart', JSON.stringify(currentWeather));

    updateWeatherUI();
}

function createEmptyCart() {
    localStorage.clear();
    localStorage.setItem("weatherCart", JSON.stringify(new WeatherCart()));
    currentWeather = JSON.p
    arse(localStorage.getItem("weatherCart"));
}


updateWeatherUI();




    


