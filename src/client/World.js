import Player from './Player';

class World {

	constructor(graphicsManager, inputManager, assetManager) {
		this.graphics = graphicsManager;
		this.input = inputManager;
		this.assets = assetManager;

		// Physics
		this.physicsWorld = new CANNON.World();
		this.physicsWorld.gravity.set(0, 0, -9.82);

		// House test
		

		// Ground
		var groundBody = new CANNON.Body({
			mass: 0, // Mass == 0 makes the body static
			material: new CANNON.Material({
				name: "myMaterial",
				friction: 0.0,
				restitution: 0.0
			})
		});
		var groundShape = new CANNON.Plane();
		groundBody.addShape(groundShape);
		this.physicsWorld.addBody(groundBody);

		this.player = undefined;
		this.players = [];

		var mesh = assetManager.createMesh(0x000001);
		mesh.scale.setScalar(10);
		mesh.receiveShadow = true;
		this.graphics.scene.add(mesh);

		var mesh = assetManager.createMesh(0x000002);
		mesh.scale.setScalar(2);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		this.graphics.scene.add(mesh);
	}

	setPlayer(player) {
		this.player = player;
	}

	getPlayer() {
		return this.player;
	}

	getPlayerById(id) {
		var player = undefined;
		for(var i = 0; i < this.players.length; i ++)
		{
			if(this.players[i].id === id)
			{
				player = this.players[i];
				break;
			}
		}

		return player;
	}

	createPlayer(id, position, facingAngle) {

		var player = new Player(id, position, facingAngle);
		player.setup(this.graphics, this.input, this.assets, this.physicsWorld);

		this.players.push(player);

		return player;
	}

	update(deltaTime) {

		this.physicsWorld.step(deltaTime);

		this.players.forEach((player) => {
			player.update(deltaTime);
		});

	}

}

export default World;
