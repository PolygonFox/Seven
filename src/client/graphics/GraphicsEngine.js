class graphicsManager {

	constructor(node) {

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
		this.camera.position.set(0, 10, -10);
		this.camera.lookAt(new THREE.Vector3(0,0,0));
		this.renderer = new THREE.WebGLRenderer( {antialias: true} );
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		// Shadows
		this.renderer.shadowMap.Enabled = true;

		node.appendChild(this.renderer.domElement);

		this.renderer.setClearColor( 0x202020, 1);

		var ambientLight = new THREE.AmbientLight( 0xFFFFFF );
		this.scene.add(ambientLight);

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFShadowMap;

		var sun = new THREE.DirectionalLight( 0xCCCCCC, 0.8 );
		sun.castShadow = true;

		sun.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1, 100 ) );
		sun.shadow.bias = 0.0001;

		sun.shadow.mapSize.width = 1024;
		sun.shadow.mapSize.height = 1024;

		this.sun = sun;

		this.scene.add(sun);

		this.sun.target = this.camera;

		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );


	}

	onWindowResize() {
	    this.camera.aspect = window.innerWidth / window.innerHeight;
	    this.camera.updateProjectionMatrix();

	    this.renderer.setSize( window.innerWidth, window.innerHeight );
	}

	getDomElement() {
		return this.renderer.domElement;
	}

	tick() {

		this.sun.position.copy(this.camera.position.clone().add(new THREE.Vector3(20, 20, 20)))

		this.renderer.render(this.scene, this.camera);
	}

}

export default graphicsManager;
