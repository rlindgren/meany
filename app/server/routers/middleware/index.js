
// Authorization
exports.authorization = {
	requiresLogin: function (req, res, next) {
		if (!req.user) {
			return res.send(401, 'User is not authorized');
		}
		next();
	},
	isMe: function (req, res, next) {
		if (req.params.id !== req.user.id) {
			return res.send(401, 'User is not authorized');
		}
		next();
	}
};