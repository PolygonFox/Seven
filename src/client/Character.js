
class Character {

  constructor(props) {
    this.id = props.id;

    this.movementSpeed = props.movementSpeed || 1;
    this.aimed = false;
    this.startPosition = props.position || new THREE.Vector3();

    this.world = props.world;

    this.setupPhysics();
    this.setupGraphics();

    this.activeWeapon = null;


  }

  setupPhysics() {

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

    this.world.getPhysicsWorld().addBody(this.body);
  }

  setupGraphics() {

    var assets = this.world.getAssetManager();
    this.rootMesh = new THREE.Object3D();

    // Setup root and mesh
    var mat = assets.getMaterial(0x000000);
    var geo = assets.getGeometry(0x000000);

    this.mesh = new THREE.SkinnedMesh(geo, mat);
    this.mesh.scale.setScalar(0.6);
    this.mesh.position.y = -.9;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

  // Weapon
    var weapon = assets.createMesh(0x100000);
    this.mesh.skeleton.bones[10].add(weapon);
    this.weapon = weapon;
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
    this.world.getGraphicsManager().scene.add(this.rootMesh);
  }

  update(delta) {
    // Animations
    this.mixer.update(delta);

    if(this.body.velocity.length() < 0.01) {
      this.action.stop();
      this.waitAction.play();
    }
    else if(this.action.time == 0) {
      this.waitAction.stop();
      this.action.play();
    }
    this.action.timeScale = this.body.velocity.length() / 2.5;

  }

  getPosition() {
		return this.body.position;
	}

	setPosition(pos) {
    this.body.position = pos;
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
}

export default Character;
