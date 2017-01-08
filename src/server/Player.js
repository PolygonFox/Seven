var THREE = require('three/build/three.js');


var Player = function(id, socketId, position, facingAngle) {
	this.id = id;
	this.socketId = socketId;
	this.velocity = new THREE.Vector3();
	this.rotation = new THREE.Vector3();
	this.position = position;

}

Player.prototype = {

}

module.exports = Player;
