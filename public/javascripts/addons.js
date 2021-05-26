// Uzupełnić to i dodać tu także tablicę ze wszystkimi stolicami
const hoverEffectObj = {
    '01d' : `linear-gradient(62deg, #FBAB7EAA, #F7CE68AA)`,
    '01n' : `linear-gradient(to right, #0f0c29aa, #302b63aa, #24243eaa)`,
    '02d' : `linear-gradient(to right, #ffafbd99, #d6ae7bbb)`,
    '02n' : `linear-gradient(to right, #bdc3c7aa, #2c3e50aa)`,
    '03d' : `linear-gradient(135deg, #8BC6ECaa, #9599E2aa)`,
    '03n' : `linear-gradient(135deg, #8BC6ECaa, #9599E2aa)`, //the same icon as above, //// linear-gradient(to right, #4e5499, #8f9499)
    '04d' : `radial-gradient(#2c3e50bb 40%, #bdc3c744 60%, #5c5e5099 100%)`,
    '04n' : `radial-gradient(#2c3e50bb 40%, #cdc5c944 60%, #5c5e5099 100%)`, // the same icon as above radial-gradient(#791a, #369b)
    '09d' : `linear-gradient(to right, #4b79a1bb, #283e51bb)`, 
    '09n' : `linear-gradient(to right, #4b79a1bb, #283e51bb)`, // the same icon as above
    '10d' : `linear-gradient(to right, #ede574bb, #3d72b4bb)`, // radial-gradient(#4288, #51b8)
    '10n' : `linear-gradient(to right, #525252bb, #3d72b4bb)`,
    '11d' : `radial-gradient(#4288, #51b8)`,
    '11n' : `radial-gradient(#4288, #51b8)`, // the same icon as above
    '13d' : `radial-gradient(rgba(80, 140, 200, 0.2), rgba(80, 140, 200, 0.2), rgba(200, 255, 255, 0.2), rgba(200, 255, 255, 0.5), rgba(200, 255, 255, 0.65))`,
    '13n' : `radial-gradient(rgba(80, 140, 200, 0.2), rgba(80, 140, 200, 0.2), rgba(200, 255, 255, 0.2), rgba(200, 255, 255, 0.5), rgba(200, 255, 255, 0.65))`, // the same icon as above
    '50d' : `linear-gradient(to right, #c9d6ffbb, #e2e2e2bb)`,
    '50n' : `linear-gradient(to right, #c9d6ffbb, #e2e2e2bb)`, // the same icon as above
}

const capitalCities = [
    `Abu Dhabi`,	
    `Abuja`,	
    `Accra`,	
    `Addis Ababa`,
    `Algiers`,	
    `Amman`,
    `Amsterdam`,
    `Andorra la Vella`,
    `Ankara`,
    `Antananarivo`,
    `Apia`,
    `Ashgabat`,
    `Asmara`,
    `Asuncion`,
    `Athens`,
    `Baghdad`,
    `Baku`,
    `Bamako`,
    `Bandar`,
    `Bangkok`,
    `Bangui`,
    `Banjul`,
    `Basseterre`,
    `Beijing`,
    `Beirut`,
    `Belfast`,
    `Belgrade`,
    `Belmopan`,
    `Berlin`,
    `Bern`,
    `Bishkek`,
    `Bissau`,
    `Bogota`,
    `Brasilia`,
    `Bratislava`,
    `Brazzaville`,
    `Bridgetown`,
    `Brussels`,
    `Bucharest`,
    `Budapest`,
    `Buenos Aires`,
    `Cairo`,
    `Canberra`,
    `Caracas`,
    `Cardiff`,
    `Castries`,
    `Chisinau`,
    `Colombo`,
    `Conakry`,
    `Copenhagen`,
    `Dakar`,
    `Damascus`,
    `Dhaka`,
    `Dili`,
    `Djibouti`,
    `Dodoma`,
    `Doha`,
    `Dublin`,
    `Dushanbe`,
    `Edinburgh`,
    `Freetown`,
    `Funafuti`,
    `Gaborone`,
    `Georgetown`,
    `Gitega`,
    `Guatemala`,
    `Hanoi`,
    `Harare`,
    `Havana`,
    `Helsinki`,
    `Honiara`,
    `Islamabad`,
    `Jakarta`,
    `Jerusalem`,
    `Juba`,
    `Kabul`,
    `Kampala`,
    `Kathmandu`,
    `Khartoum`,
    `Kiev`,
    `Kigali`,
    `Kingston`,
    `Kingstown`,
    `Kinshasa`,
    `Kuala Lumpur`,
    `Kuwait`,
    `La Paz`,
    `Libreville`,
    `Lilongwe`,
    `Lima`,
    `Lisbon`,
    `Ljubljana`,
    `Lome`,
    `London`,
    `Luanda`,
    `Lusaka`,
    `Luxembourg`,
    `Madrid`,
    `Majuro`,
    `Malabo`,
    `Male`,
    `Managua`,
    `Manama`,
    `Manila`,
    `Maputo`,
    `Maseru`,
    `Mbabana`,
    `Melekeok`,
    `Mexico`,
    `Mexico City`,	
    `Minsk`,
    `Mogadishu`,
    `Monaco`,
    `Monrovia`,
    `Montevideo`,
    `Moroni`,
    `Moscow`,
    `Muscat`,
    `N'Djamena`,
    `Nairobi`,
    `Nassau`,
    `Nay Pyi Taw`,
    `New Delhi`,
    `Niamey`,
    `Nicosia`,
    `Nauru`,
    `Nouakchott`,
    `Nuku'alofa`,
    `Nur-Sultan`,
    `Oslo`,
    `Ottawa`,
    `Ouagadougou`,
    `Palikir`,
    `Panama City`,
    `Paramaribo`,
    `Paris`,
    `Phnom Penh`,
    `Podgorica`,
    `Port au Prince`,
    `Port Louis`,
    `Port Moresby`,
    `Port of Spain`,
    `Port Vila`,
    `Porto Novo`,
    `Prague`,
    `Praia`,
    `Pretoria`,
    `Pristina`,
    `Pyongyang`,
    `Quito`,
    `Rabat`,
    `Reykjavik`,
    `Riga`,
    `Riyadh`,
    `Rome`,
    `Roseau`,
    `Saint George's`,
    `Saint John's`,
    `San Jose`,
    `San Marino`,
    `San Salvador`,
    `Sana'a`,
    `Santiago`,
    `Santo Domingo`,
    `Sao Tome`,
    `Sarajevo`,
    `Seoul`,
    `Singapore`,
    `Skopje`,
    `Sofia`,
    `Stockholm`,
    `Suva`,
    `Taipei`,
    `Tallinn`,
    `Tarawa`,
    `Tashkent`,
    `Tbilisi`,
    `Tegucigalpa`,
    `Tehran`,
    `Thimphu`,
    `Tirana`,
    `Tokyo`,
    `Tripoli`,
    `Tunis`,
    `Ulaanbaatar`,
    `Vaduz`,
    `Valletta`,
    `Vatican`,
    `Victoria`,
    `Vienna`,
    `Vientiane`,
    `Vilnius`,
    `Warsaw`,
    `Washington D.C.`,
    `Wellington`,
    `Windhoek`,
    `Yamoussoukro`,
    `Yaounde`,
    `Yerevan`,
    `Zagreb`,
]