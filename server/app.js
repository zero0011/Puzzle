var app = require('http').createServer();
var io = require('socket.io')(app);
var PORT = 8081;

// 定义用户数组
var users = [];

app.listen(PORT, () => {
	console.log('app listen at：' + PORT);
});

io.on('connection', function (socket) {
	// 是否是新用户标识
	var isNewPerson = true;
	// 当前登录用户
	var username = null;
	// 监听登录
	socket.on('login', function (data) {
		for (var i = 0; i < users.length; i++) {
			if (users[i].username === data.username) {
				isNewPerson = false;
				break;
			} else {
				isNewPerson = true;
			}
		}
		if (isNewPerson) {
			username = data.username;
			users.push({
				username: data.username
			})

			let resdata = {
				msgType: 0, // 信息类型 : 0为系统消息, 1为客户端消息
				msgDate: new Date(), // 植入服务器时间
				message: '系统消息 :' + data.username + '已加入群聊'
			}

			// 登录成功
			socket.emit('loginSuccess', { username: data.username });

			// 向所有连接的客户端广播add事件
			io.sockets.emit('receiveMessage', resdata);

			//io.sockets.emit('add',resdata);
			console.log('登录成功:', resdata)

			/*人数变更，广播给所有连接用户*/
			console.log('当前连接的用户为：', users);
			io.sockets.emit('amountChange', users.length);
		} else {
			// 登录失败
			socket.emit('loginFail', '')
		}
	})

	// 监听发送消息
	socket.on('sendMessage', function (data) {
		let resdata = {
			username: data.username, // 发送方用户名
			msgType: 1, // 消息类型 , 0 为系统消息 , 1 为客户端消息
			msgDate: new Date(), // 植入服务器时间
			message: data.message
		}

		io.sockets.emit('receiveMessage', resdata);
		console.log('接受到消息=====', resdata);
	})

	// 退出登录
	socket.on('disconnect', function () {
		//username  为13行的当前登录用户。也可前端传参进来主动触发
		let resdata = {
			msgType: 0,
			msgDate: new Date(),
			message: '系统消息:' + username + '已退出群聊'
		};

		io.sockets.emit('receiveMessage', resdata);

		console.log('退出===', username);

		// 向所有连接的客户端广播 leave 事件
		io.sockets.emit('leave', username);
		users.map(function (val, index) {
			if (val.username === username) {
				users.splice(index, 1);
			}
			// 人数变更 , 广播给所有连接用户
			console.log('当前连接的用户为:', users);
			io.sockets.emit('amountChange', users.length);
		})
	})
})

