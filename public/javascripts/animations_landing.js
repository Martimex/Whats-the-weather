
document.onreadystatechange = () => {
    if(document.readyState === 'complete') {
       
       const start = anime.timeline({
            duration: 1600,
            opacity: [0, 1],
        });
        
        start

        .add({
            targets: `.alldesc[data-float='left']`,
            keyframes: [
                {opacity: 0, translateX: -300, duration: 0},
                {opacity: 0.4, translateX: -100},
                {opacity: 0.7, translateX: -40},
                {opacity: 1, translateX: 0}
                ],
                easing: 'linear',
        })
        
        .add({
            targets: `.alldesc[data-float='right']`,
            keyframes: [
                {opacity: 0, translateX: 300, duration: 0},
                {opacity: 0.4, translateX: 100},
                {opacity: 0.7, translateX: 40},
                {opacity: 1, translateX: 0}
            ],
            easing: 'linear',
        })
    }
}

anime({
    targets: `.option[data-name='start']`,
    background: ['#f1b52a', '#f1b82a', '#f1ca2a', '#f1d62a'],
    //color: ['#adbcff', '#9cabee', '#8b9add', '#7a89cc'],
    color: ['#222', '#333', '#444', '#555'],
    direction: 'alternate',
    duration: 5000,
    easing: 'easeInOutQuad',
    loop: true,
})


