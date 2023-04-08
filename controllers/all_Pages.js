exports.index = async (req, res, next) => {
   await res.render('landing_page', {title: `What's The Weather`});
};

exports.app_page = async (req, res, next) => {
   //await res.header(`Content-Security-Policy: connect-src http://api.openweathermap.org/data/2.5/; style-src https://fonts.googleapis.com;`);
   await res.render('app_page', {title:  `What's The Weather`});
};

exports.detail_page = async (req, res, next) => {
   const queryCity = await req.params.cityname;
   const queryCountryCode = await req.params.countryCode;
   const queryUnit = await req.params.unit;
   await res.render('detail_page', {title: `What's The Weather`, myCity: queryCity, myCountry: queryCountryCode, myUnit: queryUnit})
};