module.exports = function (app) {

	app.get('/', home);

};


function home (req, res, next) {
	res.render('index');
}