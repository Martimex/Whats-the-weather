exports.index = async (req, res, next) => {
   //await res.send(`If you're reading this text, that means the landing page hasn't been implemented yet. But don't worry, you can still use this app - just add '/cities' to the current URL. Sorry for inconvenience !`);
   await res.render('landing_page', {title: `What's The Weather`});
};

exports.app_page = async (req, res, next) => {
   await res.header(`Content-Security-Policy', connect-src http://api.openweathermap.org/data/2.5/`);
   await res.render('app_page', {title:  `What's The Weather`});
};

exports.detail_page = async (req, res, next) => {
    const queryCity = await req.params.cityname;
    console.log(queryCity);
    await res.render('detail_page', {title: `What's The Weather`, myCity: queryCity})
};