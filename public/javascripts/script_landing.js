let didYouKnowArr = [
    `The longest village name is held by the small village located in the UK. It's name is 'Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch', being exactly 58 letters long.`,
    `The most populous cities in the world are Megacities, which population is over 10 millions people. As for 2021, Tokyo is the most populous city in the world, where lives over 37 millions citizens.`,
    `The 'highest' city in the world is La Paz - also known as the second capital city of Bolivia. The average eleveation of this city is 3.869 meters.`,
    `Wellington is known as a second windiest city in the world. The average wind speeds are about 27 miles / hour. The average windy days per year is 233.`,
    `Yakutsk, located in Russia, is the coldest large city in the world. The average temperature here is about -8.8 °C. Yakutsk is also the largest city located in continuous permafrost.`,
];
const curioText =  document.querySelector(`.finish .curio .curio-text`);

const text = randomCurio(didYouKnowArr);

curioText.innerText = text;

function randomCurio(curios) {
    return curios[Math.floor(Math.random() * curios.length)];
}
