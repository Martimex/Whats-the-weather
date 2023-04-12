/* anime({
    targets: `.city-name`,
    duration: 2000,
    translateX: '5%',
}); 
 */
const grid = document.querySelector(`.grid-container`);
let dateBoxes = grid.querySelectorAll(`.date`); 
let visualBoxes = grid.querySelectorAll(`.visual`);
let temperBoxes = grid.querySelectorAll(`.temper`);

//showGraph(dateBoxes, visualBoxes, temperBoxes);

function showGraph(date, visual, temper) {

    console.log({date, visual, temper});
    console.log(date[5]);
    
    const arrD = Array.from(date);
    const arrV = Array.from(visual);
    const arrT = Array.from(temper);

    let firstDateHalf = arrD.splice(0, 5); // this function affects the original array, so...
    let secDateHalf = arrD.splice(0, 5); // instead of splicing (5) or (5, 9) -> we splice (0,5) as a second half of this array

    let firstVisualHalf = arrV.splice(0, 5);
    let secVisualHalf = arrV.splice(0, 5);

    let firstTemperHalf = arrT.splice(0, 5);
    let secTemperHalf = arrT.splice(0, 5);

    anime({   //DON'T REMOVE THIS - for some reason opacity is not applied to all elems, this fixes the issue, so that animation look well
        targets: [secDateHalf, secVisualHalf, secTemperHalf],
        duration: 900,
        opacity: [0],
    })

    let dateTimeline = anime.timeline({
     
    })

    dateTimeline
    .add({
        targets: firstDateHalf,
        opacity: [0, 1],
        delay: anime.stagger(180),
    })
    .add({
        targets: secDateHalf,
        opacity: [0, 1],
        delay: anime.stagger(70),
    }, '-=800') // NECESSARY: the sec. param fixes the transition issue between two animation parts



    let visualTimeline = anime.timeline({

    })

    visualTimeline
    .add({
        targets: firstVisualHalf,
        opacity: [0, 1],
        delay: anime.stagger(180),      
    })
    .add({
        targets: secVisualHalf,
        opacity: [0, 1],
        delay: anime.stagger(70),
    }, '-=800') // NECESSARY: the sec. param fixes the transition issue between two animation parts


    let temperTimeline = anime.timeline({

    })

    temperTimeline
    .add({
        targets: firstTemperHalf,
        opacity: [0, 1],
        delay: anime.stagger(180),      
    })
    .add({
        targets: secTemperHalf,
        opacity: [0, 1],
        delay: anime.stagger(70),
    }, '-=800') // NECESSARY: the sec. param fixes the transition issue between two animation parts

}