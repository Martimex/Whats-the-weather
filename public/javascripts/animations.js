
/* let fadeIn = anime.timeline({
    duration: 2200,
    
});

    fadeIn
        .add({
        targets: ['.searchbar label', '#city', '.lookup'],
        translateY: '4%',
        opacity: [0.2, 1],
        delay: anime.stagger(500),
        autoplay: true,
        loop: false,
    })
        .add({
        targets: ['.update-time', '.date', '.time'],
        translateY: '7%',

        opacity: [0.1, 1],
        autoplay: true,
        loop: false,
    });


 anime({
    targets: '.lookup',
    scale: 1,
    opacity: [0.5, 1],
    duration: 3000,
    easing: 'easeInOutSine',
    direction: 'alternate',
    loop:true,
});
 */

/* let animation = anime({
   // targets: '.progress',
    width: '20%',
    duration: 1000,
    easing: 'easeInOutQuad',
    direction: 'alternate',
    delay: function(el, l, i) {
        return i * 400;
    },
    endDelay: 500,
    loop: true,
}); */

/////////////////////

//c/onst searchbox = document.querySelector('.lookup');

//searchbox.addEventListener('click', () => {

/*     anime({
        targets: '.main-container',  
        duration: 2200,
        delay: 350,
        opacity: [0, 1],
        easing: 'easeOutSine',
    })  */
   // anime({ // undone for button loading effect - same as with this bar on bottom page
      //  targets: '.lookup',
    //})
//}) //

/////////////////////




// Zrobimy odpowiednik dla translateY z CSS'a na JS

/* let weather_boxes = document.querySelector('.all');

function weatherAnime(e, icon, cityname, temp, weather, container)  {

            anime({
                targets: icon,
                translateY: '2.3em',
                duration: 900,
            })
}

function leaveWeather(e, icon, cityname, temp, weather, container) {
    anime({
        targets: icon,
        translateY: '0em',
        duration: 1100,
    })

    anime({
        targets: weather,
        translateY: '0em',
        duration: 300,
        opacity: [0, 1],
    })

    anime({
        targets: container,
        duration: 250,
        background: 'rgba(255, 255, 255, 0.1)',
    })
}

function WeatherAnimeMobile(e, icon, cityname, temp, weather, container) {

    anime({
        targets: [icon, cityname, temp],
        translateY: '2.3em',
        duration: 600,
    })

}
    
    weather_boxes.addEventListener('mouseover', (e) => {
        if(e.target.classList.contains('weather-container')) {
           
            let container = e.target;
            let icon = container.querySelector('.icon');
            let cityname = container.querySelector('.city');
            let temp = container.querySelector('.temp'); 
            let weather = container.querySelector('.weather');

            weatherAnime(e, icon, cityname, temp, weather, container);

            e.target.addEventListener('mouseleave', (e) => {
                
                leaveWeather(e, icon, cityname, temp, weather, container);
            })

        }    
    })


    weather_boxes.addEventListener('touchend', (e) => {
        if(e.target.classList.contains('weather-container')) {
           
            let container = e.target;
            let icon = container.querySelector('.icon');
            let cityname = container.querySelector('.city');
            let temp = container.querySelector('.temp'); 
            let weather = container.querySelector('.weather');

            anime({
                targets: [icon, cityname, temp],
                translateY: '2.3em',
                duration: 600,
            })

            anime({
                targets: weather,
                translateY: '5em',
                duration: 600,
            })
 
        }
    })
 */