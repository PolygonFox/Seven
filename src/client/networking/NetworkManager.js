import io from 'socket.io-client';

class NetworkManager
{
	constructor(ip, port, world) {
		var _this = this;

		console.log('NetworkManager - ', ip, port);

		this.socket = io(ip + ':' + port);

		this.world = world;
		this.setupSockets();

		setInterval(function(){
			_this.tick.bind(_this)();
		}, 50);

	}

	setupSockets() {
		var _this = this;

		this.socket.on('spawn', function(playerInfo) {
			var id = playerInfo.player.id;
			var pos = playerInfo.player.position;

			var player = _this.world.createPlayer({
				id,
				position: new THREE.Vector3(0, 5, 0)
			});
		});

		this.socket.on('snapshot', function(data){

			// Update players
			for(var i = 0; i < data.length; i++)
			{

				if(data[i][0] != _this.world.getPlayer().id) {

					var character = _this.world.getCharacterById(data[i][0]);

					// FindOrNew
					if(!character) {
						character = _this.world.createCharacter({
							id: data[i][0],
							position: new CANNON.Vec3(data[i][1], data[i][2], data[i][3])
						});
					}

					// Can we set props here?
					var pos = character.getPosition();
					character.setPosition(new CANNON.Vec3(
						pos.x + (data[i][1] - pos.x) * 0.1,
						pos.y + (data[i][2] - pos.y) * 0.1,
						pos.z + (data[i][3] - pos.z ) * 0.1
					));

					var v = character.getVelocity();
					character.setVelocity(new CANNON.Vec3(
						v.x + (data[i][4] - v.x) * 0.1,
						v.y + (data[i][5] - v.y) * 0.1,
						v.z + (data[i][6] - v.z ) * 0.1
					));

					var r = character.getRotation();
						r.x = r.x + (data[i][7] - r.x) * 1;
						r.y = r.y + (data[i][8] - r.y) * 1;
						r.z = r.z + (data[i][9] - r.z ) * 1;
				}
			}
		});
	}

	tick() {

		var player = this.world.getPlayer();

		if(player) {
			var pos = player.getPosition();
			var velocity = player.getVelocity();
			var rot = player.getRotation();

			this.socket.emit('client_input', { pos: pos, v: velocity, rot: [rot.x, rot.y, rot.z] });
		}
	}


}

export default NetworkManager;
