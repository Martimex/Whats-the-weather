//const cities1 = ['Moscow', 'Kraków', 'Suwałki', 'Warsaw', 'Paris', 'Johannesburg', 'Dehli', 'Los Angeles', 'Sao Paulo', 'Montevideo'];

console.log(Date.now());

const cities = ['Moscow', 'Kraków', 'Montevideo', 'Honolulu', 'Vien', 'Dehli'];
let queryArray = new Array();
const weatherIconCodes = ['11d', '09d', '10d', '13d', '50d', '01d', '01n', '02d', '02n', '03d', '03n', '04d', '04n'];

function first() {

    const all = document.querySelector('.all');
    let boxElem = all.querySelector('section');
    //console.log(boxElem);

    if(!boxElem) {

        maincontainer = document.createElement('div');
        maincontainer.classList.add('main-container');
   
        all.appendChild(maincontainer);
    }

    else {

        all.querySelectorAll('.weather-container')
            .forEach(box => {
                box.remove();
            })
    }

    for(let y=0; y<cities.length; y++) {

        let section = document.createElement('section');
        section.classList.add('weather-container');

        maincontainer.appendChild(section);

        let a = document.createElement('a');
           //a.setAttribute('href', 'cities/details');
           a.classList.add('link');
        section.appendChild(a);


        let city = document.createElement('div');
            city.classList.add('city');

        section.appendChild(city);

        let img = document.createElement('img');
            img.classList.add('icon');

        section.appendChild(img);

        let flextemp = document.createElement('div'); 
            flextemp.classList.add('flex-temp');

        section.appendChild(flextemp);

            let temper = document.createElement('div');
                temper.classList.add('temp');

        flextemp.appendChild(temper);

        let flexweather = document.createElement('div');
            flexweather.classList.add('flex-weather');

        section.appendChild(flexweather);

            let weatherr = document.createElement('div');
                weatherr.classList.add('weather');

        flexweather.appendChild(weatherr);
    }

}



function last() {

    for(let i=0; i<queryArray.length; i++)
    {

        let chosencity = queryArray[i];
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${chosencity}&units=metric&APPID=d10be5670d0e6307831a8eccb6cee0ef`;
        //console.log(queryArray);

        fetch(url)
            .then(res => res.json())
            .then((data) => {
            
                let icon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                let temp = Math.floor(data.main.temp)+'°C';
                let weather = data.weather[0].main;
                let iconCode = data.weather[0].icon;
                let result = '';
                
                let main = document.querySelector(`.main-container > section:nth-child(${i+1})`);

                //console.log(name);
                //let el = document.createElement('div');
                //    el.classList.add('city-name');
               // el.textContent = chosencity;
               // name.appendChild(el);

                console.log(iconCode);
            
                main.querySelector('.icon')
                    .setAttribute('src', icon);
                        main.querySelector('.city')
                            .textContent = chosencity;
                        main.querySelector('.weather')
                            .textContent = weather;
                        main.querySelector('.temp')
                            .textContent = temp;


                for(code in hoverEffectObj) {
                    if(iconCode == code) {
                        result = `${hoverEffectObj[code]}`;
                        //console.log('DONE');
                        console.log(`%c ${result}`, 'color: red;')
                        main.addEventListener(`mouseenter`, () => {
                            main.style.background = result;
                        })

                        if(window.matchMedia('only screen and (min-width: 300px)')) {
    
                            main.addEventListener('touchend', () => {
                                main.style.background = result;
                            })
                        }

                    }
                }
                    
                //getAHoverEffect(iconCode, result, main);
            }
        ) 
        .catch(err => { throw err});

    }

    // Here will be a function or code that will calculate current date (with hours), so
    // at the end we get the last update static timeframe

    try {
        let today = new Date();

        let dateArr = [`${today.getFullYear()}`, `${today.getMonth()+1}`, `${today.getDate()}`,
        `${today.getHours()}`, `${today.getMinutes()}`, `${today.getSeconds()}`];

        let finalArr = [];

        dateArr.forEach(info => {
            info = parseInt(info);
            console.log(typeof(info));
            if(info < 10) {console.log('ok'); finalArr.push(`0${info}`) ;}
            else finalArr.push(info);
        })

        let date = `${finalArr[0]} - ${finalArr[1]} - ${finalArr[2]}`;
        let time = `${finalArr[3]} : ${finalArr[4]} : ${finalArr[5]}`;

        document.querySelector('.update-time .date').textContent = date;
        document.querySelector('.update-time .time').textContent = time;

    } catch (error) {
        console.log(error);
    }

}

//first();
randomize(queryArray);  //-> to będzie losować początkowe miasta po każdorazowym odświeżeniu strony
last();

// Code for searchbox

document.querySelector('.searchbar > .lookup')
    .addEventListener('click', () => {
        checkCity();
    })

function checkCity() {
    const input = document.querySelector('.searchbar > #city');
    let input_v = input.value.toLowerCase();
    let input_value = input_v;

    input_value = input_value.charAt(0).toUpperCase() + input_value.slice(1);

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${input_value}&units=metric&APPID=d10be5670d0e6307831a8eccb6cee0ef`;

    fetch(url)
        .then(res => res.json())
        .then((data) => {

            if(!(Object.values(data).includes(404))) { // => Checking whether the -data Object contains err 404 (key = 'cod' value = '404);
              

                let displayedCityNames = [];
                document.querySelectorAll(`.weather-container > .city`)
                    .forEach(cityName => {
                        let cname = cityName.textContent;
                        displayedCityNames.push(cname);
                    })

                //console.log({displayedCityNames});

                for(cname of displayedCityNames) {
                    if(input_value === cname) {
                        console.log('Visibility change');
                        let notify = document.querySelector('.notification-bar');
                        let icon = document.querySelector('.notification-bar .title i')
                            notify.style = 'visibility: visible;';
                            if(notify.classList.contains('danger')) {
                                notify.classList.replace('danger', 'warning');
                                icon.classList.replace('icon-cancel', 'icon-attention');
                            }
                        document.querySelector('.notification-bar .text').textContent = `This city is already on the list!`;
                        
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

                let icon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                let temp = Math.floor(data.main.temp)+'°C';
                let weather = data.weather[0].main;
                    
                //let lastitem = cities[cities.length -1];
                // Update the Array
                
                updateArr(queryArray, input_value);
                //cities.shift();
                //cities.unshift(input_value);
                //console.log(cities);

                //first();
                last();

                let main = document.querySelector(`.main-container > section:nth-child(1)`);

                let name = document.querySelector(`.main-container > section:nth-child(1) > div > div`);
                //console.log(name);

                name.textContent = input_value;
            
                main.querySelector('.icon')
                    .setAttribute('src', icon);
                       // main.querySelector()
                        main.querySelector('.weather')
                            .textContent = weather;
                        main.querySelector('.temp')
                            .textContent = temp;

            }

        }) 
        .catch(err => {
            //console.log(err);
            let notify = document.querySelector('.notification-bar');
            let icon = document.querySelector('.notification-bar .title i');
                notify.style = 'visibility: visible;';
                    if(notify.classList.contains('warning')) {
                        notify.classList.replace('warning', 'danger');
                        icon.classList.replace('icon-attention', 'icon-cancel');
                    }
            document.querySelector('.notification-bar .text').textContent = `This city does not exist!`;

            anime({
                targets: notify,
                loop: false,
                delay: 3000,
                duration: 3000,
                opacity: [1, 0],
            })
        });
    
}

function updateArr(allCities, val) {

    //console.log(allCities);
    

    for(let x=allCities.length; x<0; x--)
    {
        allCities[x] = allCities[x-1];

    }

    //console.log(allCities);
    allCities.unshift(val);
    allCities.pop();

    return allCities;
}

function randomize(queryArray) {

    const limit = 6;

    fulfillArray(queryArray);

    function fulfillArray(queryArray) {

        if(queryArray.length > 1) {
            for( let x=queryArray.length-1; x>=0; x--) {
                queryArray.pop();
            }
        }

        for(let i=0; i<limit; i++) {
            let rand = Math.floor(Math.random()* capitalCities.length);
            queryArray.push(capitalCities[rand]);
        }

        let obj = {};

        for(let i of queryArray) {
            obj[i] = true;
        }

        //console.log(queryArray.length);
        
        if(Object.keys(obj).length !== limit) {fulfillArray(queryArray);}

        else {return queryArray;}
    }
    //console.log(queryArray);
    return queryArray;
}
