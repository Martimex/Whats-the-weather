/* (function(){throw new Error('Something wrong')})(); */

const citydiv = document.querySelector('#query-hold');
const [city, unit, countryCode] = [
    citydiv.dataset.city.match(/:.+$/)[0].replace(/[:"}]/ig, ''), 
    citydiv.dataset.unit.match(/:.+$/)[0].replace(/[:"}]/ig, ''),
    (citydiv.dataset.countrycode.match(/:.+$/)[0].replace(/[:"}]/ig, '').match(/[a-zA-Z]{2}$/)[0] ) === 'aq'?
        '' : citydiv.dataset.countrycode.match(/:.+$/)[0].replace(/[:"}]/ig, '').match(/[a-zA-Z]{2}$/)[0],
];
//console.log(city, ' = ', unit, ' = ', countryCode);

let isAnimationCompleted = true;
const temperatureUnit = getTemperatureUnit(unit);

let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&units=${unit}&appid=d10be5670d0e6307831a8eccb6cee0ef`;

const queryData = { // stores everything we got from url request (initially fired, only assigned ONCE);
    requestData: '',
    sunriseHour: '',
    sunsetHour: '',
    cityTimezone: 0,
    scala: {
        default: 16,
        unit: 0,
    },
    temperatures: {
        all_temperatures: [],
        aritmetic: 0,
        min: 0,
        max: 0,
    },
    graph: {
        page: 0,
        values: {
            date: {aritmetic: 0, min: 0, max: 0, defaultScala: 1, unit: ''}, // WE WILL NOT USE THIS ONE, BUT DO NOT REMOVE
            degrees: {aritmetic: 0, min: 0, max: 0, defaultScala: 16, unit: temperatureUnit},
            overcast: {aritmetic: 0, min: 0, max: 0, defaultScala: 50, unit: '%'},
            humidity: {aritmetic: 0, min: 0, max: 0, defaultScala: 50, unit: '%'},
            pressure: {aritmetic: 0, min: 0, max: 0, defaultScala: 12, unit: 'hPa'},
            wind: {aritmetic: 0, min: 0, max: 0, defaultScala: 15, unit: 'km/h'},
        },
    },
    table: {
        detailedTableColumns: 6,
        curr_sort: 'date',
        sort_type: 'ascending',
        graph_for: 'degrees',
    },
    listing: {
        'date': 'dt',
        'degrees': 'main.temp',
        'overcast': 'clouds.all',
        'humidity': 'main.humidity',
        'pressure': 'main.pressure',
        'wind': 'wind.speed',
    },
}; 

/* const mediaQueryList = window.matchMedia('(max-width: 900px) and (orientation: landscape)');  // condition for mobile devices - horizontal screen
const mediaQueryPortrait = window.matchMedia(`(max-height: 1000px) and (orientation: portrait)`); // for vertical screens
const mediaQueryPortraitHugeScreens = window.matchMedia(`(min-height: 901px) and (orinetation: portrait)`); // for huge vertical screens */

const graphComputedStyles = window.getComputedStyle(document.querySelector('.grid-container'))
const limit = graphComputedStyles.getPropertyValue("grid-template-columns").split(' ').length; // if a device is mobile (portrait), detailed graph will use 4 columns at once instead of 8
//console.dir(document.querySelector('.container-elem'));

const is_daylight_saving_time = true; // THIS IS IMPORTANT, SINCE IT CONTROLS THE DST FOR SUMMER / WINTER TIME. IF SET TO TRUE, A SUMMER DAYLIGHT TIME IS ENABLED

let isFirstBlockDay; // is the first block representing day?

document.querySelector('.all').addEventListener('click', (e) => {
    if(!isAnimationCompleted || !e.target.dataset['action']) return;

    switch(e.target.dataset['action']) {
        case 'toggle': {
            if(e.target.classList.contains('inactive')) return;
            document.querySelectorAll('.graph-icon').forEach(icon => icon.style.opacity = 0);
            switch(e.target.dataset['action_for']) {
                case 'prev': {
                    queryData.graph.page--;
                    fillTheGraph('back');
                    break;
                }
                case 'next': {
                    queryData.graph.page++;
                    fillTheGraph('forth');
                    break;
                }
            }
            checkButtonsBlockingCondition(e.target, queryData);
            break;
        }
        case 'sort': {
            if(e.target.dataset['action_for'] === queryData.table.curr_sort) {
                queryData.table.sort_type = (queryData.table.sort_type === 'ascending')? 'descending' : 'ascending';
            } else {
                queryData.table.curr_sort = e.target.dataset['action_for'];
                queryData.table.sort_type = 'ascending'; // When we target a new category, 'ascending' sort comes before 'descending'
            }
            updateSortingIcons(e.target.dataset['action_for']);
            sortDetailedTable(e.target.dataset['action_for']);
            break;
        }
        case 'graphdraw': {
            if(e.target.dataset['action_for'] !== queryData.table.graph_for) {
                document.querySelectorAll('.graph-icon').forEach(icon => icon.style.opacity = 0);
                queryData.table.graph_for = e.target.dataset['action_for'];
                updateGraphIcons(e.target.dataset['action_for']);
                fillTheGraph('forth');
            }
            break;
        }
        default: return;
    }
})


function last() {
    // Block graph toggle-previous button
    document.querySelector('.grid-toggle-btn.toggle-prev').classList.add('inactive');
    document.querySelector('.grid-toggle-btn.toggle-prev').style.opacity = 0;

    console.log(url);
    fetch(url)  
        .then(res => res.json())
        .then((data) => {

            // Change the wind speed from requestData field from m/s to km/h
            data.list.forEach(dataEl => dataEl.wind.speed = windSpeedKmHour(dataEl.wind.speed));

            // Assign a data to a variable initialized beforehand (it'll behave like a global storage)
            queryData.requestData = data;

            console.warn(queryData.requestData);

            //console.warn(queryData);

            // Fill in the first section (Weather box -- detailed)


            console.warn(countriesByCode);
            const main = document.querySelector('.weather-container');
            //document.querySelector('.city-name').textContent = `${data.city['name']}`;
            //main.querySelector('.country-city').textContent = `${data.city['name']}`;
            main.querySelector('.country-city').textContent =  city;
            main.querySelector('.country-icon').setAttribute('src', (data.city['country'])? `../../images/country-flags/svg/${data.city['country'].toLowerCase()}.svg` : `../../images/country-flags/svg/aq.svg`);
            main.querySelector('.city-countrycode').textContent = `${countriesByCode[data.city['country'].toLowerCase()]} - [${data.city['country']}]`;
            main.querySelector('.city-lat').textContent = `${data.city.coord['lat']}`;
            main.querySelector('.city-lon').textContent = `${data.city.coord['lon']}`;
            const utc_timezone =  +`${data.city['timezone'] / 3600}`;
            const sunrise_time = new Date(+`${data.city['sunrise']}` * 1000 + ((is_daylight_saving_time? utc_timezone - 2 : utc_timezone - 1) * 3600000)).toLocaleTimeString();
            const sunset_time = new Date(+`${data.city['sunset']}` * 1000 + ((is_daylight_saving_time? utc_timezone - 2 : utc_timezone - 1) * 3600000)).toLocaleTimeString();
            const date_now = (new Date(Date.now() + (is_daylight_saving_time? utc_timezone - 2 : utc_timezone - 1) * 3600000)).toLocaleString();
            main.querySelector('.city-timezone').textContent = `UTC${(data.city['timezone'] / 3600) >= 0 ? `+${data.city['timezone'] / 3600}` : `${data.city['timezone'] / 3600}`}`;
            main.querySelector('.city-date').textContent = date_now.replace(/.[\d]+,/, ' -- ');
            main.querySelector('.city-population').textContent =  (!+`${data.city['population']}`)? 'Unknown' : `~ ${data.city['population']}`;
            main.querySelector('.city-sunrise').textContent = sunrise_time;
            main.querySelector('.city-sunset').textContent = sunset_time;

            const [dayStartHour, dayEndHour] = [sunrise_time.match(/^[\d][\d]/)[0], sunset_time.match(/^[\d][\d]/)[0]];
/*             const allTemperatures = Array.from(data.list).map(el => Math.round(el.main.temp));
            const aritmetic_temp = allTemperatures.reduce((sum, val) => {return sum + +val}, 0) / allTemperatures.length;
            const graphScala = calcScala(queryData.temperatures.aritmetic, [queryData.temperatures.min, queryData.temperatures.max], queryData.scala.default);
            const scalaUnit = (100 / 2) / graphScala; */
            //console.log(date_now)

            queryData.cityTimezone = utc_timezone;
            queryData.sunriseHour = dayStartHour;
            queryData.sunsetHour = dayEndHour;
/*             queryData.temperatures.all_temperatures = [...allTemperatures];
            queryData.temperatures.aritmetic = aritmetic_temp;
            queryData.temperatures.min = [].concat(...allTemperatures).sort((a, b) => a - b)[0],
            queryData.temperatures.max = [].concat(...allTemperatures).sort((a, b) => a - b)[allTemperatures.length - 1]
            queryData.scala.default = graphScala;
            queryData.scala.unit = scalaUnit; */

            // Fill detailed table heading background based on the current daytime
            const isStillDay = checkIsStillDay(date_now.match(/[\d][\d]:[\d][\d]:[\d][\d]$/)[0].replace(/:[\d][\d]:[\d][\d]$/, ''), [dayStartHour, dayEndHour]) 
            document.querySelector('thead.table-legend').classList.add((isStillDay)? 'table-day' : 'table-night');

            // Fill graph possible values section based on queryData lisitng length
            const listingArr = Object.keys(queryData.listing);
            for(let listing_type_no = 0; listing_type_no < listingArr.length; listing_type_no++) {
                let listingValues = Array.from(data.list).map(el => Math.round(getProp(el, queryData.listing[`${listingArr[listing_type_no]}`])));
                queryData.graph.values[`${listingArr[listing_type_no]}`].aritmetic = listingValues.reduce((sum, val) => {return sum + +val}, 0) / listingValues.length;
                queryData.graph.values[`${listingArr[listing_type_no]}`].min = [].concat(...listingValues).sort((a, b) => a - b)[0];
                queryData.graph.values[`${listingArr[listing_type_no]}`].max = [].concat(...listingValues).sort((a, b) => b - a)[0];
            }

            //console.warn(queryData.graph.values)
            generateGraph();
            fillTheGraph('forth');

            /// ABOVE HAS TO BE FIRED ONLY DURING WEBPAGE SHOWUP

            // Now create the detailed table based on results gotten
            //console.warn(data.list)
            generateTable(data.list/* , utc_timezone */);

            weatherBoxShowUp();
            weatherGraphShowUp();
            weatherTableShowUp();

            async function weatherBoxShowUp() {
                const a1 =  anime({
                    targets: '.weather-nationality',
                    opacity: {value: [0, 1], duration: 1200, easing: 'linear'},
                    translateX: {value: ['-2rem', '0rem'], duration: 500, easing: 'easeInSine'},
                }).finished;

                const a2 = anime({
                    targets: '.content-box--city',
                    opacity: [0, 1],
                    translateY: ['-1rem', '0rem'],
                    easing: 'easeInSine',
                }).finished;

                a1.then(() => a2)
            }

            async function weatherGraphShowUp() {
                await anime({
                    targets: '.container-elem',
                    duration: 500,
                    delay: anime.stagger(90),
                    opacity: [0, 1],
                    easing: 'linear',
                }).finished;

                await anime({
                    targets: '.toggle-next',
                    duration: 500,
                    opacity: [0, 1],
                    easing: 'linear',
                }).finished;
            }

            function weatherTableShowUp() {
                anime({
                    targets: '.table-all',
                    duration: 1000,
                    opacity: [0, 1],
                    easing: 'linear',
                })
            }

        })

    return;

    if((mediaQueryList.matches) || (mediaQueryPortrait.matches) || (mediaQueryPortraitHugeScreens.matches)) { // jeżeli mamy do czynienia z telefonem

        // FOR ANIMATION PURPOSES
        const grid = document.querySelector(`.grid-container`);
        let dateBoxes = grid.querySelectorAll(`.date`); 
        let visualBoxes = grid.querySelectorAll(`.visual`);
        let temperBoxes = grid.querySelectorAll(`.temper`);
        /////////////////////////////////////////////////////////////////////////////

        // Get every textContent of legend box in order to shorten unnecessary text
        document.querySelectorAll(`.legend-box .legend-1`).forEach(box => {
            let limit = 5; //
            if(box.textContent.length > limit) {
                let text = box.textContent;
                let non = text.substr(0, limit);
                box.textContent = non + '...';
            }
        })

        let prevBtn = document.createElement('button');
        prevBtn.setAttribute('class', 'switch-btn-l');
        prevBtn.innerText = 'Back';

        let nextBtn = document.createElement('button');
        nextBtn.setAttribute('class', 'switch-btn-r');
        nextBtn.innerText = 'Next';


        let gridCont = document.querySelector('.grid-container');
        let parentElem = gridCont.parentNode;

        parentElem.insertBefore(prevBtn, gridCont);

        parentElem.insertBefore(nextBtn, gridCont);

        let firstBtn = document.querySelector(`.switch-btn-l`);
        firstBtn.style.display = 'none';

        let secBtn = document.querySelector('.switch-btn-r');
        secBtn.addEventListener('touchend', (e) => {
            console.log('Kacperek kliknął');
            
            /* It has to get query results from second half of query and display it in the box - so we need do a swapping here*/
            for(let f=0; f<5; f++) {

                let temporaryDiv = document.querySelector(`.footer .mobile-temporary-content`);

                /* DATE */

                let secondHalfQuery = document.querySelector(`.grid-container .date:nth-of-type(${(limit/2)+f+1})`); // 5, 6, 7, 8, 9, 10th elem
                let oldElem = document.querySelector(`.grid-container .date:nth-of-type(${f+1})`); // 1, 2, 3, 4, 5th elem

                temporaryDiv.textContent = oldElem.textContent; // we have stored old values in temporary div
                oldElem.textContent = secondHalfQuery.textContent; // we have changed old value to a new one
                secondHalfQuery.textContent = temporaryDiv.textContent; // so we complete the swap

                temporaryDiv.textContent = '';

                /* TEMPERATURE */

                let tempHalfQuery = document.querySelector(`.grid-container .temper:nth-of-type(${(limit/2)+f+1})`);
                let oldTemp = document.querySelector(`.grid-container .temper:nth-of-type(${f+1})`);

                temporaryDiv.textContent = oldTemp.textContent;
                oldTemp.textContent = tempHalfQuery.textContent;
                tempHalfQuery.textContent = temporaryDiv.textContent;

                temporaryDiv.textContent = ''; 

                /* VISUALS */

                const gridCont = document.querySelector(`.grid-container`);
                let visHalfQuery = gridCont.querySelector(`.visual:nth-of-type(${(limit/2)+f+1})`); // new
                let oldVisual = gridCont.querySelector(`.visual:nth-of-type(${f+1})`); // old
                
                gridCont.insertBefore(visHalfQuery, oldVisual);
            }

            onClickAnime();
            /* Hide this button; make the other one visible */
            secBtn.style.display = 'none';
            firstBtn.style.display = 'block';
        })

        firstBtn.addEventListener('touchend', (e) => {
            console.log('Piotruś kliknął');

            for(let f=0; f<5; f++) {

                let temporaryDiv = document.querySelector(`.footer .mobile-temporary-content`);

                /* DATE */

                let firstHalfQuery = document.querySelector(`.grid-container .date:nth-of-type(${(limit/2)+f+1})`); // 5, 6, 7, 8, 9, 10th elem
                let oldElem = document.querySelector(`.grid-container .date:nth-of-type(${f+1}`); // 1, 2, 3, 4, 5th elem

                temporaryDiv.textContent = oldElem.textContent; // we have stored old values in temporary div
                oldElem.textContent = firstHalfQuery.textContent; // we have changed old value to a new one
                firstHalfQuery.textContent = temporaryDiv.textContent; // so we complete the swap

                temporaryDiv.textContent = '';

                /* TEMPERATURE */

                let tempHalfQuery = document.querySelector(`.grid-container .temper:nth-of-type(${(limit/2)+f+1})`);
                let oldTemp = document.querySelector(`.grid-container .temper:nth-of-type(${f+1})`);

                temporaryDiv.textContent = oldTemp.textContent;
                oldTemp.textContent = tempHalfQuery.textContent;
                tempHalfQuery.textContent = temporaryDiv.textContent;

                temporaryDiv.textContent = '';
                
                /* VISUALS */
                
                const gridCont = document.querySelector(`.grid-container`);
                let visHalfQuery = gridCont.querySelector(`.visual:nth-of-type(${(limit/2)+f+1})`); // new
                let oldVisual = gridCont.querySelector(`.visual:nth-of-type(${f+1})`); // old

                gridCont.insertBefore(visHalfQuery, oldVisual);
                
            }

            onClickAnime();
            /* Hide this button; make the other one visible */
            firstBtn.style.display = 'none';
            secBtn.style.display = 'block';
        })

        function onClickAnime() {

            anime({
                targets: dateBoxes,
                opacity: [0, 1],
                delay: anime.stagger(120),
            }) 

            anime({
                targets: visualBoxes,
                opacity: [0, 1],
                delay: anime.stagger(120),
            })

            anime({
                targets: temperBoxes,
                opacity: [0, 1],
                delay: anime.stagger(120),
            })

        }
    }


    if(mediaQueryPortrait.matches) {

         // Get every textContent of legend box in order to shorten unnecessary text
         document.querySelectorAll(`.legend-box .legend-1`).forEach(box => {
            let limit = 5; //
            if(box.textContent.length > limit) {
                let text = box.textContent;
                let non = text.substr(0, limit);
                box.textContent = non + '...';
            }
        })

        /* shortenDate.forEach(function(date) {
            
            console.log(date);
            console.log(date.innerText);
               
            let text = date.innerText;
            let newText = text.substring(0, 16);
            console.log(`%c ${newText}`, 'color: red; background: gray;');
            text = newText; 
        }); */

    }
    // Display queried city name on the upper span

    //let citySpan = document.querySelector('.city-name');
    //citySpan.textContent = city;

    //separateDays(fullDate);
}

function fillTheTable(weather_list) {

    const tbody = document.querySelector('tbody.table-content');
    document.querySelector('.legend-unit-temp').textContent = `[ ${temperatureUnit} ]`;

    for(let weather_list_item = 0; weather_list_item < weather_list.length; weather_list_item++) {
        const wl = weather_list[weather_list_item];
        const list_values = [
            {value: wl.dt, parsers: [{name: getCorrectDate, args: [queryData.cityTimezone]}, /* {name: doNothing, args: []} */]},
            /* {value: wl.weather[0].main, parsers: [{name: doNothing, args: []}]}, */
            {value: wl.main.temp, parsers: [{name: roundTheFloat, args: [2]},  {name: addUnit, args: [temperatureUnit]}, /* {name: doNothing, args: []} */]},
            {value: wl.clouds.all, parsers: [{name: addUnit, args: ['%']}]},
            {value: wl.main.humidity, parsers: [{name: addUnit, args: ['%']}]},
            {value: wl.main.pressure, parsers: [{name: addUnit, args: ['hPa']}]},
            {value: wl.wind.speed, parsers: [{name: roundTheFloat, args: [2]},  {name: addUnit, args: ['km/h']}]},
        ];
        for(let category_no = 0; category_no < queryData.table.detailedTableColumns; category_no++) {
            let finalText = list_values[category_no].value;
            for(let parserNo = 0; parserNo < list_values[category_no].parsers.length; parserNo++) {
                finalText = list_values[category_no].parsers[parserNo].name(finalText, list_values[category_no].parsers[parserNo].args);
            }

            const currentTd = tbody.querySelector(`tr:nth-of-type(${weather_list_item + 1}) > td.table-data-item:nth-of-type(${category_no + 1})`);
            if(category_no !== 0) { currentTd.textContent = finalText; }
            else {
                currentTd.querySelector('.table-data-date').textContent = finalText.split('-')[0];
                currentTd.querySelector('.table-data-hour').textContent = finalText.split('-')[finalText.split('-').length - 1];
            }

        }
    }
}

function getTemperatureUnit(unit) {
    switch(unit) {
        case 'metric': return '°C';
        case 'imperial': return 'F';
        case 'standard': return 'K';
        default: return 'K';
    }
}

function getProp(obj, nest) {
    nest = nest.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
    const nestLevels = nest.split('.');
    for(let i = 0; i < nestLevels.length; i++) {
        let nest_level = nestLevels[i];
        if(nest_level in obj) {
            obj = obj[nest_level];
        } else return;
    }
    return obj;
}

function sortDetailedTable(category_to_sort) {
    //console.warn(category_to_sort);
    const nest =  queryData.listing[category_to_sort];
    const sortedList = [].concat(queryData.requestData.list).sort((a, b) => {
        return (queryData.table.sort_type === 'ascending')? 
            getProp(a, nest) - getProp(b, nest) :   // for ascending sort
            getProp(b, nest) - getProp(a, nest);    // for descending sort
    });
    fillTheTable(sortedList);
}

function updateSortingIcons(category_to_sort) {
    const allSortIcons = document.querySelectorAll('i[data-action="sort"]');
    // Add default sort classes for all the sorting icons
    allSortIcons.forEach(sortIcon => {
        sortIcon.classList.remove('icon-sort-number-up', 'icon-sort-number-down', 'item-btn-targeted');
        sortIcon.classList.add('icon-sort');
    })
    // Get a new class only to a targeted one
    document.querySelector(`i[data-action="sort"][data-action_for=${category_to_sort}]`).classList.add('item-btn-targeted', (queryData.table.sort_type === 'ascending')? 
        'icon-sort-number-up' : 'icon-sort-number-down');
}

function updateGraphIcons(category_to_graphdraw) {
    const allGraphIcons = document.querySelectorAll('i[data-action="graphdraw"]');
    allGraphIcons.forEach(graphIcon => {
        graphIcon.classList.remove('item-btn-targeted');
    })
    document.querySelector(`i[data-action="graphdraw"][data-action_for=${category_to_graphdraw}]`).classList.add('item-btn-targeted');
}

function getCorrectDate(num, [cityUTCtimezone]) {
    //console.log(num , cityUTCtimezone)
    //return `${(new Date(num + (is_daylight_saving_time? cityUTCtimezone - 2 : cityUTCtimezone - 1) * 3600000)).toLocaleString()}`.replace(/.[\d]+,/, ' -- ');;
    return new Date(+num * 1000 + ((is_daylight_saving_time? cityUTCtimezone - 2 : cityUTCtimezone - 1) * 3600000)).toLocaleString().replace(/.[\d]+,/, ' -- ').replace(/:\d+$/, '');
}

function roundTheFloat(num, decimal_length) {
    return num.toFixed(decimal_length);
}

function windSpeedKmHour(num) {
    // This function converts a numeric value of wind speed (m/s) to wind speed (km/h)
    return (num * 3600) / 1000;
}

function addUnit(str, [unit]) {
    return str; // TEMPORARILY CHANGE, PLEASE REMOVE THIS LINE LATER ON
    return str + ' ' + unit;
}

// This little one is to remove after completing all parsers functions
function doNothing(str, []) {
    return  str + ' ??? '
}

function generateTable(weather_list/* , utc_timezone */) {
    // AT THE BOTTOM OF THIS FUNCTION ADD A  fillTheTable() call !!!
    const tbody = document.querySelector('tbody.table-content');
    //console.log(weather_list, weather_list.timezone);
    for(let i = 0; i < weather_list.length + 1; i++) { // it's generating one extra row more, which is good, bcs it adds some cool spacing at the table bottom
        const tr = document.createElement('tr');
        tbody.appendChild(tr);
        for(let category_no = 0; category_no < queryData.table.detailedTableColumns; category_no++) {
            const td = document.createElement('td');
            td.classList.add('table-data-item');
            td.textContent = '';
            //td.textContent = list_values[category_no].value;
            tbody.querySelector('tr:last-child').appendChild(td);

            if(category_no === 0 ) {
                const div = document.createElement('div');
                const [span_date, span_hour] = [document.createElement('span'), document.createElement('span')];
                span_date.classList.add('table-data-date');
                span_hour.classList.add('table-data-hour');
                div.appendChild(span_date); 
                div.appendChild(span_hour);
                tbody.querySelector('tr:last-child td:last-child').appendChild(div);
            }
        }
    }
    // Lastly, let's fill the generated table
    fillTheTable(weather_list);
}

function generateGraph() {
    const gridContainer = document.querySelector('.grid-container');
    for(let col=0; col<limit; col++) {
        const container_elem = document.createElement('div');
        container_elem.classList.add('container-elem');
        const [div_date, div_visual, div_temperatureBox] = [document.createElement('div'), document.createElement('div'), document.createElement('div')];
        div_date.classList.add('date'); 
        div_visual.classList.add('visual');
        div_temperatureBox.classList.add('temperature-box');
        const [p_date_day, p_date_hour] = [document.createElement('p'), document.createElement('p')];
        p_date_day.classList.add('date-text', 'date-day');
        p_date_hour.classList.add('date-text', 'date-hour');
        const [visual_bar, graph_icon] = [document.createElement('div'), document.createElement('img')];
        visual_bar.classList.add('visual-bar');
        graph_icon.classList.add('graph-icon'); 
        graph_icon.alt = 'icon';
        const temper = document.createElement('span');
        temper.classList.add('temper');
        // Now append items
        container_elem.appendChild(div_date);
            div_date.appendChild(p_date_day);
            div_date.appendChild(p_date_hour);
        container_elem.appendChild(div_visual);
            div_visual.appendChild(visual_bar);
            div_visual.appendChild(graph_icon);
        container_elem.appendChild(div_temperatureBox);
            div_temperatureBox.appendChild(temper);
        // Append to main container
        gridContainer.appendChild(container_elem);
    }
}

function checkButtonsBlockingCondition(targetEl, queryData) {
    // THIS FUNCTION SURMISES, THAT THE NUMBER OF PAGES IS MORE THAN 2 (INCLUDING STARTING ONE)
    if(queryData.graph.page === 0 || queryData.graph.page >= (queryData.requestData.list.length / limit) - 1) {
        targetEl.classList.add('inactive');
        anime({
            targets: targetEl,
            duration: 400,
            opacity: [1, 0],
            easing: 'easeInSine',
        })
        return;
    }
    const inactiveGraphToggle = document.querySelector('.inactive');
    if(inactiveGraphToggle) {
        showUpToggle();
        async function showUpToggle() {
            const a1 = anime({
                targets: inactiveGraphToggle,
                duration: 400,
                opacity: [0, 1],
                easing: 'easeOutSine',
            }).finished;
            a1.then(() => {inactiveGraphToggle.classList.remove('inactive')});
        }
    }
}

function fillTheGraph(direction) {
    const graphVisualHeightArr = [];
    //console.warn(queryData.requestData)

    // Get scala for current value which graph is to represent
    const getGraphScala = calcScala(queryData.graph.values[`${queryData.table.graph_for}`].aritmetic, [queryData.graph.values[`${queryData.table.graph_for}`].min, queryData.graph.values[`${queryData.table.graph_for}`].max], queryData.graph.values[`${queryData.table.graph_for}`].defaultScala);
    const scalaUnit = (80 / 2) / getGraphScala; // not 100 (but 80), because we have to prevent weather icons from overlowing over visual boxes in graph

    for(let iter=0; iter<limit; iter++) {
        //console.log((limit * queryData.graph.page) + iter, limit, queryData.graph.page, iter);
        let fullDate = new Date(queryData.requestData.list[(limit * queryData.graph.page) + iter].dt * 1000 + ((is_daylight_saving_time? queryData.cityTimezone - 2 : queryData.cityTimezone - 1) * 3600000)).toLocaleString(0);
        //console.warn(fullDate);
        const resultHour = fullDate.match(/[\d][\d]:[\d][\d]:[\d][\d]$/)[0].replace(/:[\d][\d]:[\d][\d]$/, '');

        const isStillDay = checkIsStillDay(resultHour, [queryData.sunriseHour, queryData.sunsetHour]);
        document.querySelector(`.container-elem:nth-of-type(${iter+1})`).classList.remove('daytime', 'nighttime');
        (isStillDay)? 
            document.querySelector(`.container-elem:nth-of-type(${iter+1})`).classList.add('daytime') 
            : document.querySelector(`.container-elem:nth-of-type(${iter+1})`).classList.add('nighttime'); 

        document.querySelector(`.container-elem:nth-of-type(${iter+1}) .date-day`).textContent = (limit < 8)? fullDate.replace(/, [\d]+:[\d]+|:/g, '').replace(/[\d][\d]$/, '').replace(/.\d+$/, '') : fullDate.replace(/, [\d]+:[\d]+|:/g, '').replace(/[\d][\d]$/, '');
        document.querySelector(`.container-elem:nth-of-type(${iter+1}) .date-hour`).textContent = fullDate.replace(/^[\d.,]+/, '').replace(/:[\d]+$/, '');
        document.querySelector(`.container-elem:nth-of-type(${iter+1}) .temper`).textContent = Math.round(getProp(queryData.requestData.list[(limit*queryData.graph.page)+iter], queryData.listing[queryData.table.graph_for])) + `${queryData.graph.values[queryData.table.graph_for].unit}`; // +

        let visual = document.querySelector(`.container-elem:nth-of-type(${iter+1}) .visual`);
        //const diff_from_avg = queryData.temperatures.all_temperatures[(limit*queryData.graph.page)+iter] - queryData.temperatures.aritmetic; // +
        const diff_from_avg  = Math.round(getProp(queryData.requestData.list[(limit*queryData.graph.page)+iter], queryData.listing[queryData.table.graph_for])) - queryData.graph.values[queryData.table.graph_for].aritmetic;
        graphVisualHeightArr.push((100 / 2) + (scalaUnit * diff_from_avg)); 
        
        let img = visual.querySelector('.graph-icon');
        let iconurl = `https://openweathermap.org/img/w/${queryData.requestData.list[(limit*queryData.graph.page)+iter].weather[0].icon}.png`;
        img.setAttribute('src', iconurl);
        img.style.bottom = `${graphVisualHeightArr[graphVisualHeightArr.length - 1]}%`;
    }

    fireAsync();
    async function fireAsync() {
        const allGraphIcons = (direction === 'forth')? Array.from(document.querySelectorAll('.graph-icon')) : [].concat(Array.from(document.querySelectorAll('.graph-icon')).reverse());
        //console.warn(allGraphIcons);
        isAnimationCompleted = false;
        const a1 = anime({
            targets: '.visual-bar',
            duration: function(el, i) {return graphVisualHeightArr[i] * 20},
            height: function(el, i) {return ['0%', `${graphVisualHeightArr[i]}%`]},
            easing: 'linear',
        }).finished;

        a1.then(() => {
            const a2 = anime({
                targets: allGraphIcons,
                duration: 300,
                delay: anime.stagger(70),
                opacity: [0, 1],
                easing: 'easeInSine',
            }).finished;

            a2.then(() => isAnimationCompleted = true)
        });
    }

}

function checkIsStillDay(currentHour, [startHour, endHour]) {
    if(currentHour > startHour && currentHour <= endHour) return true;
    return false;
}


function calcScala(temp_aritmetic, [temp_min, temp_max], defaultScala) {
    if(temp_aritmetic - temp_min < defaultScala  &&  temp_max - temp_aritmetic < defaultScala) return defaultScala;
    return Math.floor((temp_aritmetic - temp_min < temp_max - temp_aritmetic)? temp_max - temp_aritmetic : temp_aritmetic - temp_min);
}

function firstDetailed() {  // create some HTML blocks
    return; // THIS WILL BE REMOVED DEFINITELY, JUST AFTER ALL THE UPDATES
    const section = document.querySelector('.detailed-info');
    //const detailbox = section.querySelector('.detail-box');

    for(let y=0; y<limit; y++) { // zamiast 2 ma być: limit

        //let detailbox = document.createElement('div'); // Na tym kończymy, ale ten blok trzeba poprawić...
        //detailbox.classList.add('detail-box');           // Posprawdzaj, ile tych iteracji jest w pętlach i logicznie je pozmieniaj
        //section.appendChild(detailbox);

        let detailbox = document.querySelector('.detailed-info .detail-box');

        let nextdate = document.createElement('div');
        nextdate.classList.add('nextdate');
        detailbox.appendChild(nextdate);
    


        let weather = document.createElement('div');
        weather.classList.add('weather');
        detailbox.appendChild(weather);

            let img = document.createElement('img');
            img.classList.add('weather-icon');

            weather.appendChild(img);



        let tempbox = document.createElement('div');
        tempbox.classList.add('temp-box');
        detailbox.appendChild(tempbox);

            let temp = document.createElement('div');
            temp.classList.add('temp');
            tempbox.appendChild(temp);

            let tempdesc = document.createElement('div');
            tempdesc.classList.add('temp-desc');
            tempbox.appendChild(tempdesc);
    


        let humidity = document.createElement('div');
        humidity.classList.add('humidity');
        detailbox.appendChild(humidity);



        let wind = document.createElement('div');
        wind.classList.add('wind');
        detailbox.appendChild(wind);

            let speed = document.createElement('div');
            speed.classList.add('speed');
            wind.appendChild(speed);

            let degree = document.createElement('div');
            degree.classList.add('degree');
            wind.appendChild(degree);



        let pressure = document.createElement('div');
        pressure.classList.add('pressure');
        detailbox.appendChild(pressure);
    }

}

function lastDetailed() {
    return; // THIS WILL BE REMOVED DEFINITELY, JUST AFTER ALL THE UPDATES
    for(let iter=0; iter<limit; iter++) { // iter<=0 bo na razie testujemy 1 blok

        fetch(url)
            .then(res => res.json())
            .then((details) => {

                let fullDate = details.list[(iter*4)+1].dt_txt;

                //console.log('fullDate: '+fullDate);

                let iconCode = details.list[(iter*4)+1].weather[0].icon;
                let iconurl = `https://openweathermap.org/img/w/${iconCode}.png`; // this one will be appended to img tag
                //console.log(iconurl);

                let temp = Math.floor(details.list[(iter*4)+1].main.temp)+'°C';  // actual temperature
                //console.log(`%c ${temp}`, 'color: black; background: #ea4;');

                let desc = details.list[(iter*4)+1].weather[0].description;
                //console.log(`%c ${desc}`, 'color: black; background: lightblue;');

                let humidity = details.list[(iter*4)+1].main.humidity+'%';
                //console.log(humidity);

                let wind_speed = details.list[(iter*4)+1].wind.speed+'m/s';

                //console.log(wind_speed);

                let wind_degree = details.list[(iter*4)+1].wind.deg+'°';
                //console.log(wind_degree);

                let pressure = details.list[(iter*4)+1].main.pressure+' hPa';
                //console.log(pressure);

               //let rainfall = details.list[(iter*4)+1]
               // console.log(rainfall);

                let box = document.querySelector(`.detail-box`); // To be continued...
                //console.log(box);
                let nextdate = box.querySelector(`.nextdate:nth-of-type(${(iter*6)+1})`); // iter * how much child divs do we have (on basic dimension) + which is the order of an element
                let YMD = fullDate.substring(0, 10);
                let hour = fullDate.substring(11, 13);

                nextdate.textContent = YMD;
                let image = box.querySelector(`.weather:nth-of-type(${(iter*6)+2}) .weather-icon`);
                image.setAttribute('src', `${iconurl}`);
                
                let temperature = box.querySelector(`.temp-box:nth-of-type(${(iter*6)+3}) .temp`);
                temperature.textContent = temp;
                let description = box.querySelector(`.temp-box:nth-of-type(${(iter*6)+3}) .temp-desc`);
                description.textContent = desc;
                let hum = box.querySelector(`.humidity:nth-of-type(${(iter*6)+4})`);
                hum.textContent = humidity;
                let wspeed = box.querySelector(`.wind:nth-of-type(${(iter*6)+5}) .speed`);
                wspeed.textContent = wind_speed;
                let wdegree = box.querySelector(`.wind:nth-of-type(${(iter*6)+5}) .degree`);
                wdegree.textContent = wind_degree;
                let pressu = box.querySelector(`.pressure:nth-of-type(${(iter*6)+6})`);
                pressu.textContent = pressure;

               if(iter === 0) {
                    let wind = box.querySelector('.wind');
                    let imagediv = box.querySelector('.weather');
                    let tempbox = box.querySelector('.temp-box');

                    let divArr = [nextdate, wind, imagediv, tempbox, hum, pressu];
                    colorGrid(hour, divArr);  
               }  
 
            })
    }
}

last();
firstDetailed();
lastDetailed();

function separateDays(firstDate) {

    const day = firstDate.substring(8,10);
    const hour = parseInt(firstDate.substring(11,13));
    console.log('Day:  ',day, '  Hour:  ',hour);

    if(hour >= 12) {
        //console.log('it is');
        document.querySelectorAll(`.grid-container .visual:nth-child(odd)`).forEach(visual => 
            visual.style.cssText = `border-right: 0.32em solid #2222;`);
    }

    else {
        //console.log('nope');
        document.querySelectorAll(`.grid-container .visual:nth-child(even)`).forEach(visual =>
            visual.style = `border-right: 0.32em solid #2222;`);
    }

}

function colorGrid(hour, divArr) {
    
    console.log(`%c ${hour}`, `background: green;`);
    
    let num = parseInt(hour);

    console.log('num  :  ' + num);
    console.log(typeof(num));
    
    let textOdd = '';
    let textEven = '';
    let txtOd = '';
    let txtEv = '';
    let iter = 0;

    if(6<num && num<21) {
        textOdd = `background: linear-gradient(135deg, #56cb, #6adb); border: .3em solid #6ad7;`;
        textEven = `background: linear-gradient(135deg, #75db, #349b); border: .3em solid #75d7;`;
        txtOd = 'Day';
        txtEv = 'Night';
    }
    else {
        textOdd = `background: linear-gradient(135deg, #75db, #349b); border: .3em solid #75d7;`; 
        textEven = `background: linear-gradient(135deg, #56cb, #6adb); border: .3em solid #6ad7;`;
        txtOd = 'Night';
        txtEv = 'Day';
    }

    let box = document.querySelector('.detail-box');
    box.querySelectorAll('.nextdate').forEach(el => {
        
        if(iter%2) {
            el.style.cssText = textEven;
            el.innerText += `\n${txtEv}`;
        } 
        else {
            el.style.cssText = textOdd;
            el.innerText += `\n${txtOd}`;
        }   // if iter%2 === 0 we receive: FALSE
        iter++;
    })
    box.querySelectorAll('.weather').forEach(el => {
        (iter%2)? el.style.cssText = textEven : el.style.cssText = textOdd;
        iter++;
    })
    box.querySelectorAll('.temp-box').forEach(el => {
        (iter%2)? el.style.cssText = textEven : el.style.cssText = textOdd;
        iter++;
    })
    box.querySelectorAll('.humidity').forEach(el => {
        (iter%2)? el.style.cssText = textEven : el.style.cssText = textOdd;
        iter++;
    })
    box.querySelectorAll('.wind').forEach(el => {
        (iter%2)? el.style.cssText = textEven : el.style.cssText = textOdd;
        iter++;
    })

    box.querySelectorAll('.pressure').forEach(el => {
        (iter%2)? el.style.cssText = textEven : el.style.cssText = textOdd;
        iter++;
    })
    
}

/* STUFF FOR DETAILED WEATHER */

function setBg(hour) {
    console.log(hour);


}

/* STICKY CRAP WHEN YOU SCROLL WAAAAY TO MUCH */

const legendGrid = document.querySelector(`.legend-box`);
const handler = document.querySelector(`#catch`);
const catched = document.querySelector(`#catched`);
let iterAnime = 0;

const footer = document.querySelector(`.footer`);
let once = 0;



//window.onscroll = function() {keepItTop(legendGrid, handler, catched); footerAnimate(footer);}
const tableLegend = document.querySelector('thead.table-legend');
const default_TL_pos = tableLegend.getBoundingClientRect().top;

//window.addEventListener('wheel', onScrollCheck);
window.addEventListener('scroll', onScrollCheck);

function onScrollCheck() {
    (window.scrollY > default_TL_pos) &&  tableLegend.classList.add('sticky')
}

function keepItTop (legendGrid) {
    console.log('ccc')
    //let sticky = legendGrid.offsetTop;
    //let catchy = catched.offsetTop;  ===== 'linear-gradient(135deg, #99d1f0, #99b0f0)
    let hand = handler.offsetTop;
    let sum = legendGrid.offsetHeight;

    if(window.pageYOffset > hand) {  
        legendGrid.classList.add('sticky');
        catched.style = `height: ${sum}px;`;
        //legendGrid.querySelectorAll('.legend-1').forEach(div => div.style = 'background-image: linear-gradient(to top, lightgrey 0%, lightgrey 1%, #e0e0e0 26%, #efefef 48%, #d9d9d9 75%, #bcbcbc 100%);');
        legendGrid.querySelectorAll('.legend-1').forEach(div => div.style = `background: #4ad;`);
        //console.log(iterAnime);
        if(iterAnime <= 0) {
            anime({
                targets: legendGrid,
                scale: [0.7, 1],
                duration: 1500,
            })
            anime({
                targets: `.legend-1`,
                duration: 3000,
                backgroundColor: '#4ad',
            })
        }
        iterAnime = 1;
    }
    else { 
        if(iterAnime > 0) {

            iterAnime = 0;
        }
        
        legendGrid.classList.remove('sticky');
        catched.style = `height: 0;`;
        legendGrid.querySelectorAll('.legend-1').forEach(div => div.style= 'background: none;');
    }

}

function footerAnimate(footer) {

    //let offset = footer.offsetTop;
    let windowH = window.innerHeight;
    //console.log(windowH);
    let positionFromTop = footer.getBoundingClientRect().top;

        if(positionFromTop - windowH <= 0 && once < 1)  {
                anime({
                    targets: footer,
                    duration: 3000,
                    opacity: [0, 1],
                    translateX: [-600, 0],
                })
                once++;
        }    
}