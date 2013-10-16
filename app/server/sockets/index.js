module.exports = function (io) {
	io.sockets.on('connection', function (socket) {

		// welcome message
		socket.emit('new:msg', 'Welcome aboard! \nI\'m your friendly, neighborhood socket.');

		// tell clients about new messages
		socket.on('broadcast:msg', function (data) {
			socket.broadcast.emit('new:msg', data.message);
		});

	});
};