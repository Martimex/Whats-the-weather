exports.index = async (req, res, next) => {
   await res.send(`Not implemented: Landing page`);
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