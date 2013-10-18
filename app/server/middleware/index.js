/**
 * simulate network latency
 */
module.exports.simulateLatency = function simulateLatency (duration, err) {

	duration = duration || 1000;
	var env = process.env.NODE_ENV || 'development';

	return function (req, res, next) {
		if (env === 'development' || env === 'test') {
			console.log('simulating latent connection: ' + duration/1000 + ' second' + (duration > 1000 ? 's' : ''));
			setTimeout(next, duration, err);
		} else {
			next();
		}
	};
};