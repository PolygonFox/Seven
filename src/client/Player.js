import Camera from './Camera';
import Character from './Character';

class Player extends Character {

	constructor(props) {

		super(props);

		this.input = this.world.getInputManager();
		this.camera = new Camera(this.rootMesh, this.input, this.world.getGraphicsManager());

		this.damagePrefab = this.world.getAssetManager().createMesh(0x100100);
		this.damagePrefab.scale.setScalar(0.2);
		this.damageObjects = []; // max 32
		this.fireRate = 4;
		this.fireRateCounter = 0;
		this.muzzleFlash = this.world.getAssetManager().createMesh(0x100200);
		this.muzzleFlash.position.x = 1.5;
		this.muzzleFlash.position.z = 0.1;
		this.muzzleFlash.position.y = 0.05;
		this.muzzleFlash.visible = false;
		this.weapon.add(this.muzzleFlash);
	}

	createDamage(point, normal) {
		if(this.damageObjects.length >= 32) {
			this.world.getGraphicsManager().scene.remove(this.damageObjects[0]);
			this.damageObjects.shift();
		}
		var damage = this.damagePrefab.clone();
		damage.position.copy(normal.clone().multiplyScalar(0.01).add(point));
		damage.lookAt(normal.clone().negate().add(point));
		this.world.getGraphicsManager().scene.add(damage);
		this.damageObjects.push(damage);

		for(var i = 0; i < this.damageObjects.length; i ++)
		{
			this.damageObjects[i].renderOrder = i / 32;
			this.damageObjects[i].translateZ(0.0001);

		}

	}

	update(deltaTime) {

		super.update(deltaTime);
		this.muzzleFlash.visible = false;
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

		// Shoot
		if(this.input.isMouseDown(0) && this.fireRateCounter == 0) {
			this.muzzleFlash.visible = true;
			// Raycast
			var raycaster = new THREE.Raycaster();
			if(this.aimed) {
				raycaster.set(this.rootMesh.position, this.camera.getLookAtDirection());
			} else {
				raycaster.set(this.rootMesh.position, v);
			}

			var hits  = raycaster.intersectObjects(this.world.shootableObjects);

			if(hits[0]) {

					this.createDamage(hits[0].point, hits[0].face.normal);
			}

			this.fireRateCounter = this.fireRate;

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

		if(this.fireRateCounter > 0) {
			this.fireRateCounter--;
		}
	}

}

export default Player;
