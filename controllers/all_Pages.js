exports.index = async (req, res, next) => {
   await res.send(`Not implemented: Landing page`);
};

exports.app_page = async (req, res, next) => {
   await res.render('app_page', {title:  `What's The Weather`});
};

exports.detail_page = async (req, res, next) => {
    const queryCity = await req.path;
    await res.render('detail_page', {title: `What's The Weather`, myCity: queryCity})
};