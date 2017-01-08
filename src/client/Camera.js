
class Camera {

  constructor(target, inputManager, graphicsManager) {

    this.target = target;
    this.input = inputManager;
    this.camera = graphicsManager.camera;

    this.distance = 7;
    this.cameraAngleX = 0;
		this.cameraAngleY = 0;

    this.forwardDirection = new THREE.Vector3();
  }

  getForwardDirection() {

    return this.forwardDirection;
  }

  update(delta) {
    if(this.target) {
      			if(this.input.getAxisZ()) {
      				this.distance += this.input.getAxisZ();

      				if(this.distance > 12)
      					this.distance = 12;
      				if(this.distance < 1)
      					this.distance = 1;
      			}

      			var cameraPosition = new THREE.Vector3(
      				this.distance * Math.cos(this.cameraAngleX) * Math.sin(this.cameraAngleY),
      				Math.cos(this.cameraAngleY) * this.distance,
      				this.distance * Math.sin(this.cameraAngleX)  * Math.sin(this.cameraAngleY)
      			);

            console.log(this.forwardDirection);
      			this.forwardDirection.set(-cameraPosition.x, 0, -cameraPosition.z).normalize();

      			var offset = this.forwardDirection.clone().cross(new THREE.Vector3(0, 1, 0).multiplyScalar(2))
      			cameraPosition.add(this.target.position);
      			var lookAtPosition = this.target.position.clone().add(offset);

      			this.camera.position.copy(cameraPosition.add(offset));
      			this.camera.lookAt(lookAtPosition);

      			// Camera controls
      			if(this.input.isKeyDown(40)) {
      				this.cameraAngleY += 0.02;

      			} else if(this.input.isKeyDown(38)) {
      				this.cameraAngleY -= 0.02;
      			}

      			if(this.input.isKeyDown(37)) {
      				this.cameraAngleX += 0.02;
      			} else if(this.input.isKeyDown(39)) {
      				this.cameraAngleX -= 0.02;
      			}

      			this.cameraAngleX += this.input.getAxisX();
      			this.cameraAngleY += this.input.getAxisY();

      			if(this.cameraAngleY >= 1.5)
      				this.cameraAngleY = 1.5;

      			if(this.cameraAngleY <= 0.01)
      					this.cameraAngleY = 0.01;
    }
  }
}

export default Camera;
