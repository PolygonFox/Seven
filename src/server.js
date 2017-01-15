var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var THREE = require('three/build/three.js');
var _ = require('underscore');

var Player = require('./server/Player');

var playerList = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

function getUnusedId() {
	var id = undefined;
	for(var i = 0; i < 32; i ++)
	{
		var found = false;
		for(var j = 0; j < playerList.length; j++)
		{
			if(playerList[j].id === i) {
				found = true;
				break;
			}
		}
		if(found === false) {
			id = i;
			break;
		}
	}
	return id;
}

io.on('connection', function(socket){

	var id = getUnusedId();
	console.log('Player' + id + ' connected from ip: ' + socket.handshake.address);

	var player = new Player(id, socket.id, new THREE.Vector3(0, 0, 0), 0);

	playerList.push(player);
	socket.player = player;

	socket.emit('spawn', { player: player });
	socket.on('client_input', function(data){
		socket.player.position.set(data.pos.x, data.pos.y, data.pos.z);
    socket.player.velocity.set(data.v.x, data.v.y, data.v.z);
		socket.player.rotation.set(data.rot[0], data.rot[1], data.rot[2]);
	});

	socket.on('disconnect', function(){

		for(var i = 0; i < playerList.length; i++)
		{
			if(playerList[i].socketId === socket.id) {
				playerList.splice(i, 1);
			}
		}

		console.log('Player' + socket.player.id + ' disconnected.');
	});
});

var generateSnapshot = function() {
	var snapshot = [];

	for(var i = 0; i < playerList.length; i ++)
	{
		snapshot.push([
			playerList[i].id,
			playerList[i].position.x, playerList[i].position.y, playerList[i].position.z,
			playerList[i].velocity.x, playerList[i].velocity.y, playerList[i].velocity.z,
			playerList[i].rotation.x, playerList[i].rotation.y, playerList[i].rotation.z
		]);
	}

	return snapshot;
}

setInterval(function(){
	io.emit('snapshot', generateSnapshot());
}, 50);


http.listen(7777, function(){
  console.log('listening on *:7777');
});
