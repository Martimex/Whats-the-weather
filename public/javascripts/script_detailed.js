const city = 'Kraków';

let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=d10be5670d0e6307831a8eccb6cee0ef`;

let limit = 10;

let isFirstBlockDay; // is the first block representing day?

const mediaQueryList = window.matchMedia('(max-width: 900px) and (orientation: landscape)');  // condition for mobile devices - horizontal screen
const mediaQueryPortrait = window.matchMedia(`(max-height: 900px) and (orientation: portrait)`); // for vertical screens
const mediaQueryPortraitHugeScreens = window.matchMedia(`(min-height: 901px) and (orinetation: portrait)`); // for huge vertical screens

// trzeba 10 razy fetch'ować dane

function first() {

    const all = document.querySelector('.all');
    const grid = all.querySelector('.grid-container');

    for(let y=0; y<limit; y++) {
        let date = document.createElement('p');
        date.classList.add('date');
        grid.appendChild(date);
    }

    for(let y=0; y<limit; y++) {
        let visual = document.createElement('div');
        visual.classList.add('visual');
        grid.appendChild(visual);
    }

    for(let y=0; y<limit; y++) {

        for (let x=0; x<41; x++) {  // tworzy 41 divów do animacji - pierwsza najbliższa rejestracja pogody to zawsze 21. div, a pozostałe zależą od tego 1.
            let s = document.createElement('div');
            document.querySelector(`.visual:nth-of-type(${y+1})`).appendChild(s);
        }
    }
    

    for(let y=0; y<limit; y++) {
        let temper = document.createElement('span');
        temper.classList.add('temper');
        grid.appendChild(temper);
    }

    for(let y=0; y<limit; y++) {
        let icon = document.createElement('img');
        icon.classList.add('icon');
        grid.appendChild(icon);
    }

}

function last() {

    for(let iter=0; iter<limit; iter++) {

        fetch(url)  
            .then(res => res.json())
            .then((data) => {
                
                let fullDate = data.list[(iter*4)+1].dt_txt;
                if(mediaQueryPortrait.matches) {
                    fullDate = fullDate.substring(5, 16);
                }

                // For first operation in the loop
                dayOrNight(fullDate, iter);

                (iter === 0)? separateDays(fullDate) : ''; // ta funkcja wykonana w pętli 10 razy, jest ASYNC !

                const value = dayOrNight(fullDate);

                let temp = Math.floor(data.list[(iter*4)+1].main.temp)+'°C';
                let iconCode = data.list[(iter*4)+1].weather[0].icon;
                let iconurl = `http://openweathermap.org/img/w/${iconCode}.png`;
               // console.log(fullDate);

                let num = Math.floor(data.list[(iter*4)+1].main.temp);
                let baseNum = Math.floor(data.list[(0*4)+1].main.temp); // to bazowa temperatura dla itera-0

                //console.log(temp);
    
                document.querySelector(`.grid-container .date:nth-of-type(${iter+1})`).textContent = fullDate;
    
                let visual = document.querySelector(`.grid-container .visual:nth-of-type(${iter+1})`);
                
                //visual.style.background = `linear-gradient(to bottom, #ebe, #58c)`;

                let temper1 = document.querySelector(`.grid-container .temper:nth-of-type(${iter+1})`);
                temper1.innerText = temp;
                //let x = document.querySelector(`.temp:nth-of-type(${iter+1})`).innerText = 'x';
                
    
               //let icon = document.querySelector(`.grid-container .icon:nth-of-type(${iter+1})`); 
               //console.log(icon);
                //icon.setAttribute('src', iconurl);

                
                if(iter === 0) { //work on this function Please !!!
                    let tempArr = [];
                    for(let r=1; r<limit; r++) {
                       let temp = Math.floor(data.list[(r*4)+1].main.temp);
                       tempArr.push(temp);
                    }
                    setBaseVisual(iter, visual, num, baseNum, value, tempArr);
                }  

                // Append img to upper div

                let newImg = visual.querySelector(`div:nth-last-child(-n+${(num - baseNum) + 21 + 4})`);
                let img = document.createElement('img');
        
                img.setAttribute('src', iconurl);
                newImg.appendChild(img);

            })
    }


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

function firstDetailed() {  // create some HTML blocks

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

    for(let iter=0; iter<limit; iter++) { // iter<=0 bo na razie testujemy 1 blok

        fetch(url)
            .then(res => res.json())
            .then((details) => {

                let fullDate = details.list[(iter*4)+1].dt_txt;

                //console.log('fullDate: '+fullDate);

                let iconCode = details.list[(iter*4)+1].weather[0].icon;
                let iconurl = `http://openweathermap.org/img/w/${iconCode}.png`; // this one will be appended to img tag
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

first();
last();
firstDetailed();
lastDetailed();

function setBaseVisual(iter, visual, num, baseNum, value, tempArr) {

    // iter = która to iteracja
    // visual = bloczek grid, na którym wykonujemy operację
    // num = temperatura dla bloczku, który teraz omawiamy
    // baseNum = temperatura bloczku 1, który zawsze wynosi 21 divów - pozostała ilość bloczków to już różnica temperatur

    console.log('baseNum:   ' + baseNum); // to wartość temperatury dla pierwszego visual !!!
    console.log('num:   ' +num); // to jest wartość temperatury dla omawianego visual !!!
    console.log(tempArr); 

    if(iter == 0) {

        let allVisuals = document.querySelectorAll(`.grid-container .visual:not(:nth-of-type(1))`); //-n+21
        console.log(allVisuals);

        if(isFirstBlockDay) {

            visual.querySelectorAll(`div:nth-last-child(-n+21)`).forEach(div => { 
                div.style.background = `linear-gradient(135deg, #56cd, #6add)`; // light
            })

            allVisuals.forEach((visual, index) => {
                for(let b=0; b<tempArr.length; b++) {

                    if(index % 2) {
                        visual.querySelectorAll(`div:nth-last-child(-n+${(tempArr[index] - baseNum) + 21})`) // all divs, but we actually need 21
                        .forEach(elem =>  {elem.style.background = `linear-gradient(135deg, #56cd, #6add)`}) // light
                    }
                    else {
                        visual.querySelectorAll(`div:nth-last-child(-n+${(tempArr[index] - baseNum) + 21})`) // all divs, but we actually need 21
                        .forEach(elem =>  {elem.style.background = `linear-gradient(135deg, #75dd, #349d)`}) // dark 
                    }
                   
                }
            })
        }

        else{

            visual.querySelectorAll(`div:nth-last-child(-n+21)`).forEach(div => {
                div.style.background = `linear-gradient(135deg, #75dd, #349d)`;
            })

            allVisuals.forEach((visual, index) => {
                for(let b=0; b<tempArr.length; b++) {

                    if(index % 2) {
                        visual.querySelectorAll(`div:nth-last-child(-n+${(tempArr[index] - baseNum) + 21})`) // all divs, but we actually need 21
                        .forEach(elem =>  {elem.style.background = `linear-gradient(135deg, #75dd, #349d)`}) // dark 
                    }
                    else {
                        visual.querySelectorAll(`div:nth-last-child(-n+${(tempArr[index] - baseNum) + 21})`) // all divs, but we actually need 21
                        .forEach(elem =>  {elem.style.background = `linear-gradient(135deg, #56cd, #6add)`}) // light
                    }
                }
                
            })
        }
    }

}

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

function dayOrNight(firstDate, iter) {
    //console.log(firstDate);

    if(iter !== 0) {
        return false;
    }

    const dayValues = [9, 12, 15, 18];
    //const nightValues = [21, 0, 3, 6];

    const Monthday = firstDate.substring(11,13);
    console.log(Monthday);

    if(dayValues.includes(parseInt(Monthday)))  { // czy Monthday to g. 9, 12, 15, a może 18?
        document.querySelectorAll(`.grid-container .date:nth-child(even)`).forEach(el => //tak
        el.style.cssText = `background: #75d5; border-top: .3em solid #75d5; border-left: .3em solid #75d5; `);
        isFirstBlockDay = true;
        //
       // document.querySelectorAll(`.detailed-info .detail-box:nth-child(even) .nextdate, .nextdate ~ div`).forEach(gridItem => // yes
        //gridItem.style.cssText = `background: #75d5; border-top: .3em solid #75d5;`); 
        return true;
    } 

    else {
        document.querySelectorAll(`.grid-container .date:nth-child(odd)`).forEach(el => //nie
        el.style.cssText = `background: #75d5; border-top: .3em solid #75d5; border-left: .3em solid #75d5;`);
        isFirstBlockDay = false;
        //
        //document.querySelectorAll(`.detailed-info .detail-box:nth-child(odd) .nextdate, .nextdate ~ div`).forEach(gridItem => //yes 
        //gridItem.style.cssText = `background: #75d5; border-top: .3em solid #75d5;`);
        return false;
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



window.onscroll = function() {keepItTop(legendGrid, handler, catched); footerAnimate(footer);}


function keepItTop (legendGrid) {

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