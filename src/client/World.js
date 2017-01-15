import Player from './Player';
import Character from './Character';

class World {

	constructor(graphicsManager, inputManager, assetManager) {
		this.graphics = graphicsManager;
		this.input = inputManager;
		this.assets = assetManager;

		this.shootableObjects = [];

		// Physics
		this.physicsWorld = new CANNON.World();
		this.physicsWorld.gravity.set(0, 0, -9.82);

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
		this.characters = [];

		var mesh = assetManager.createMesh(0x000001);
		mesh.scale.setScalar(10);
		mesh.receiveShadow = true;
		this.graphics.scene.add(mesh);
		this.shootableObjects.push(mesh);

		var mesh = assetManager.createMesh(0x000002);
		mesh.position.set(5, 0, 0);
		mesh.scale.setScalar(2);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		this.graphics.scene.add(mesh);
		this.shootableObjects.push(mesh);

		var mesh = assetManager.createMesh(0x000002);
		mesh.position.set(-7.5, 0, 0);
		mesh.scale.setScalar(3);
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		this.graphics.scene.add(mesh);
		this.shootableObjects.push(mesh);
	}

	getPlayer() {
		return this.player;
	}

	getGraphicsManager() {
		return this.graphics;
	}

	getPhysicsWorld() {
		return this.physicsWorld;
	}

	getAssetManager() {
		return this.assets;
	}

	getInputManager() {
		return this.input;
	}

	getCharacterById(id) {
		var character = undefined;
		for(var i = 0; i < this.characters.length; i ++)
		{
			if(this.characters[i].id === id)
			{
				character = this.characters[i];
				break;
			}
		}

		return character;
	}

	createPlayer(props) {

		props.world = this;
		this.player = new Player(props);

		return this.player;
	}

	createCharacter(props) {

		props.world = this;
		var character = new Character(props);
		this.characters.push(character);

		return character;
	}

	update(deltaTime) {
		this.physicsWorld.step(deltaTime);

		if(this.player) {
			this.player.update(deltaTime);
		}

		this.characters.forEach((character) => {
			character.update(deltaTime);
		});
	}

}

export default World;
