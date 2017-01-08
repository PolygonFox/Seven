import Camera from './Camera';

class Player {

	constructor(id, position, facingAngle) {

		this.id = id;

		this.controllable = false;

		this.movementSpeed = 1;
		this.cameraSpeed = 1;

		this.camera = null;
		this.aimed = false;
		this.startPosition = position;
	}

	getPosition() {
		return this.body.position;
	}

	setPosition(pos) {
		return this.body.position = pos;
	}

	getVelocity() {
		return this.body.velocity;
	}

	setVelocity(v) {
		this.body.velocity = v;
	}

	getRotation() {
		return this.rootMesh.rotation;
	}

	setControllable(value) {

		if(value == true) {
			this.camera = new Camera(this.rootMesh, this.input, this.graphics);
		}

		this.controllable = value;
	}

	setup(graphicsManager, inputManager, assetManager, physicsWorld) {

		this.input = inputManager;
		this.graphics = graphicsManager;
		this.physicsWorld = physicsWorld;

		// Create physics body.
		this.body = new CANNON.Body({
			mass: 5, // kg
			position: new CANNON.Vec3(this.startPosition.x,this.startPosition.z,this.startPosition.y), // M
			shape: new CANNON.Cylinder(1, 1, 2, 8),
			material: new CANNON.Material({
				name: "myMaterial",
				friction: 0.0,
				restitution: 0.0
			})
		});

		this.physicsWorld.addBody(this.body);

		// Setup root and mesh
		var mat = assetManager.getMaterial(0x000000);
		var geo = assetManager.getGeometry(0x000000);

		this.rootMesh = new THREE.Object3D();

		this.mesh = new THREE.SkinnedMesh(geo, mat);
		this.mesh.scale.setScalar(0.6);
		this.mesh.position.y = -.9;
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;

		// Weapon
		var weapon = assetManager.createMesh(0x100000);
		this.mesh.skeleton.bones[10].add(weapon);

		var materials = this.mesh.material.materials;
	  // Setup animations
    for (var k in materials) {
        materials[k].skinning = true;
    	materials[k].morphTargets = true;
    }

		this.mixer = new THREE.AnimationMixer( this.mesh );
		this.action = this.mixer.clipAction(this.mesh.geometry.animations[1]);

		this.action.setLoop(THREE.LoopRepeat);
		this.action.clampWhenFinished = true;
		this.action.play();

		this.waitAction = this.mixer.clipAction(this.mesh.geometry.animations[0]);
		this.waitAction.clampWhenFinished = true;

		this.rootMesh.add(this.mesh);
		graphicsManager.scene.add(this.rootMesh);
	}

	update(deltaTime) {


		// Update forward direction
		// Raycast
		// var raycaster = new THREE.Raycaster();
		// raycaster.setFromCamera(new THREE.Vector3(( this.input.getMouseX() / window.innerWidth ) * 2 - 1, - (  this.input.getMouseY()  / window.innerHeight ) * 2 + 1), this.camera);
		// var intersects = raycaster.intersectObjects(this.graphics.scene.children);
		// if(intersects.length && intersects[0].point) {
		//
		// }

		// Update camera
		if(this.camera) {
			this.camera.update(deltaTime);
		}

		// Animation
		this.mixer.update(deltaTime);
		var v = new THREE.Vector3();

		if(this.controllable) {

			// Movement
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
		}

		// Root mesh rotation
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

		if(this.body.velocity.length() < 0.01) {
			this.action.stop();
			this.waitAction.play();
		}
		else if(this.action.time == 0)
		{
			this.waitAction.stop();
			this.action.play();
		}

		this.action.timeScale = this.body.velocity.length() / 2.5;

		// Freeze the rotation of the body.
		this.body.quaternion.setFromEuler(0, 0, 0);

		// Sync rootMesh position with body position.
		this.rootMesh.position.set(this.body.position.x, this.body.position.z, this.body.position.y);
	}

}

export default Player;
