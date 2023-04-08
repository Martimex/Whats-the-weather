class Weather {
    constructor(data) {
        this.id = data.id;
        this.city = data.name;
        this.country = data.sys.country;
        this.weather_now = data.weather[0].main;
        this.weather_icon = data.weather[0].icon;
        this.temp = Math.round(data.main.temp);
    }
    getTemperature(unit) {
        if(unit === 'metric') return `${this.temp} °C`;
        if(unit === 'imperial') return `${Math.round(this.temp * 1.8) + 32} F`;
        if(unit === 'standard') return `${this.temp + 273} K`;
        return ' - ';
    }
}

const weatherArray = [];
let temperatureUnit = 'metric'
const weatherIconCodes = ['11d', '09d', '10d', '13d', '50d', '01d', '01n', '02d', '02n', '03d', '03n', '04d', '04n'];
const initialArr = randomize(weatherArray, 6)
    .then((resultArr) => last(resultArr))
    .catch(err => console.error(err));

document.querySelector('.app-content').addEventListener('click', (e) =>  {
    const dataOnClick = e.target.dataset['onclick'];
    if(!dataOnClick) return;
    switch(dataOnClick) {
        case 'addCity': { addCity(weatherArray); break;}
        case 'convertTemp': { convertTemp(e.target); break;} 
    }
})

function last(citiesArr) {

    for(let i=0; i<citiesArr.length; i++) {
        // To search Dublin (Ireland), type = Dublin, ie
        // To search Dublin (USA), type = Dublin, us
        let main = document.querySelector(`.main-container > section:nth-child(${i+1}) > a > .weather-container`);
        main.querySelector('.weather-icon').setAttribute('src', `https://openweathermap.org/img/w/${citiesArr[i].weather_icon}.png`);
        main.querySelector('.country-icon').setAttribute('src', `../images/country-flags/svg/${citiesArr[i].country}.svg`);
        main.querySelector('.city-name').textContent = citiesArr[i].city;
        main.querySelector('.weather-description').textContent = citiesArr[i].weather_now;
        main.querySelector('.weather-temperature').textContent = citiesArr[i].getTemperature(temperatureUnit);
        main.querySelector('.weather-colored').style.background = `${hoverEffectObj[citiesArr[i].weather_icon]}`;

        //main.removeEventListener(`mouseenter`, hoverAnimate);
        //main.addEventListener(`mouseenter`, hoverAnimate);
        main.removeEventListener(`mouseleave`, hoverAnimate);
        main.addEventListener(`mouseleave`, hoverAnimate);

        if(window.matchMedia('only screen and (min-width: 300px)')) {
            main.removeEventListener('touchend', hoverAnimate);
            main.addEventListener('touchend', hoverAnimate);
        }

        function hoverAnimate(e) {
            const getWeatherColored = e.target.querySelector('.weather-colored');

            anime({
                targets: getWeatherColored,
                duration: 800,
                opacity: [1, 0],
                easing: 'easeOutExpo',
            })

            /*
                cool combination below":

                anime({
                    targets: '.something',
                    duration: 1100,
                    opacity: [0, 1],
                    scale: [0, 1],
                    rotateY: '120deg',
                    easing: 'easeOutExpo',
                })
            */
        }
    }
}

// Code for searchbox

function addCity(weatherArr) {
    const input = document.querySelector('.searchbar >  #city');
    const input_value = input.value.charAt(0).toUpperCase() + input.value.toLowerCase().slice(1);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${input_value}&units=metric&APPID=d10be5670d0e6307831a8eccb6cee0ef`;

    // Grab those in case of Warning / Error Popup message
    let notify = document.querySelector('.notification-bar');
    let icon = document.querySelector('.notification-bar .title i');
    
    fetch(url)
        .then(res => res.json())
        .then((data) => {
            const newWeatherItem = new Weather(data);

            for(let weather of weatherArr) {
                if(newWeatherItem.id === weather.id) {
                    activateNotificationBar(false, [notify, icon]);
                    
                    anime({
                        targets: notify,
                        loop: false,
                        delay: 3000,
                        duration: 3000,
                        opacity: [1, 0],
                    })

                    return;
                }  
            }
                
            // Update the Array & update the list
            updateArr(weatherArr, newWeatherItem);
            last(weatherArr);
        }) 
        .catch(err => {
            console.clear();
            activateNotificationBar(true, [notify, icon]);
            runAsync(notify);
            async function runAsync() {
                const a1 = anime({
                    targets: notify,
                    loop: false,
                    delay: 3000,
                    duration: 3000,
                    opacity: [1, 0],
                }).finished;

                await a1.then(() => {
                    notify.style.display = 'none';
                })
            } 
        });
    
}

function convertTemp(target) {
    const temperatures = {
        'celc': 'metric',
        'fahr': 'imperial',
        'kelv': 'standard',
    }
    document.querySelector(`.temp-${Object.keys(temperatures).find(key => temperatures[key] === temperatureUnit)}`).classList.remove('temp-chosen');
    temperatureUnit = temperatures[Object.keys(temperatures).find(el => target.classList.contains(`temp-${el}`))];
    document.querySelector(`.temp-${Object.keys(temperatures).find(key => temperatures[key] === temperatureUnit)}`).classList.add('temp-chosen');
    const allTempBoxes = document.querySelectorAll(`.weather-temperature`);
    fadeInAndOut();

    async function fadeInAndOut() {
        await fadeIn()
            .then(() => {
                allTempBoxes.forEach((weather_box, ind) => {
                    weather_box.textContent = weatherArray[ind].getTemperature(temperatureUnit);
                })
                anime({
                    targets: allTempBoxes,
                    duration: 300,
                    opacity: [0, 1],
                    easing: 'easeOutExpo',
                });

            })
        async function fadeIn() {
            await anime({
                targets: allTempBoxes,
                duration: 400,
                opacity: [1, 0],
                easing: 'easeOutExpo',
            }).finished;
        }
    }
}

function activateNotificationBar(isErrorType, [notification, icon]) {
    notification.style.display = 'block';
    isErrorType? notification.classList.replace('warning', 'danger') : notification.classList.replace('danger', 'warning');
    isErrorType? icon.classList.replace('icon-attention', 'icon-cancel') :  icon.classList.replace('icon-cancel', 'icon-attention');
    document.querySelector('.notification-bar .text').textContent = isErrorType?  `This city does not exist!` : `This city is already on the list!`;
}

function updateArr(weatherArr, val) {
    for(let x=weatherArr.length; x<0; x--)
    {
        weatherArr[x] = weatherArr[x-1];
    }
    weatherArr.unshift(val);
    weatherArr.pop();

    return weatherArr;
}

async function randomize(queryArray, el_limit) {
    const capitalCities_copy = [...capitalCities];
    for(let el=0; el<el_limit; el++) {
        let rand = Math.floor(Math.random()*capitalCities_copy.length);
        const getUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capitalCities_copy[rand]}&units=metric&APPID=d10be5670d0e6307831a8eccb6cee0ef`
        await fetch(getUrl).then(res => res.json()).then(data => {
            queryArray.push(new Weather(data));
            capitalCities_copy.splice(rand, 1);
            let weather_container = document.querySelector(`section.weather-box:nth-of-type(${el+1})`);
            anime({
                targets: weather_container,
                duration: (1200 + el * 200),
                opacity: [0, 1],
                easing: 'easeInQuart',
            })
        })
    }
    return queryArray;
}


// Submit the city name after clicking

document.querySelectorAll('.clickable').forEach((a, ind) => {
    a.addEventListener('click', function (e) {
        e.stopPropagation();

        let parts = this.href.split('1')[0];
        let cityText = weatherArray[ind].city; // a foolproof approach !
        let countryCode = weatherArray[ind].country;
        let countryCodeParam = ',';
        let unitParam = '&units=';
        let finalURL = parts + cityText +  countryCodeParam + countryCode + unitParam + temperatureUnit;
        this.href = finalURL;

        //  1. Save the text variable in hidden input
        //document.querySelector('form[name="search"]').textContent = `${cityText}&${temperatureUnit}`;

        // 2. Read the data from hidden input
        // 3. Use .submit() function to send the data to
        document.querySelector('form[name="search"]').submit();
    })
})
