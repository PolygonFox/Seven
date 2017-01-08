import Camera from './Camera';
import Character from './Character';

class Player extends Character {

	constructor(props) {

		super(props);

		this.input = this.world.getInputManager();
		this.camera = new Camera(this.rootMesh, this.input, this.world.getGraphicsManager());
	}

	update(deltaTime) {

		super.update(deltaTime);

		// Update camera
		this.camera.update(deltaTime);

		// Movement
		var v = new THREE.Vector3();
		if(this.input.isKeyDown(87)) {
			v.add(this.camera.getForwardDirection().clone());
		} if(this.input.isKeyDown(83)) {
			v.add(this.camera.getForwardDirection().clone().negate());
		} if(this.input.isKeyDown(65)) {
		  v.add(this.camera.getForwardDirection().clone().cross(new THREE.Vector3(0, -1, 0)));
		} if(this.input.isKeyDown(68)) {
			v.add(this.camera.getForwardDirection().clone().cross(new THREE.Vector3(0, 1, 0)));
		}
		v.normalize().multiplyScalar(this.movementSpeed);

		// Jump
		if(this.input.isKeyDown(32)) {
			this.body.velocity.z = 5;
		}

		// Aim
		if(this.input.isMouseDown(2)) {
			this.aimed = true;
		} else {
			this.aimed = false;
		}

		// Look at
		if(v.length() && !this.aimed) {
			this.rootMesh.lookAt(this.rootMesh.position.clone().add(v));
		} else if(this.aimed) {
			this.rootMesh.lookAt(this.camera.getForwardDirection().clone().add(this.rootMesh.position));
		}

		// Apply user inputted velocity
		this.body.velocity.x += v.x;
		this.body.velocity.y += v.z;

		// Manual friction
		this.body.velocity.x *= 0.9;
		this.body.velocity.y *= 0.9;

		// Freeze the rotation of the body.
		this.body.quaternion.setFromEuler(0, 0, 0);

		// Sync rootMesh position with body position.
		this.rootMesh.position.set(this.body.position.x, this.body.position.z, this.body.position.y);
	}

}

export default Player;
