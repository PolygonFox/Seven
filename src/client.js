import * as THREE from 'three';

import InputManager from './client/input/InputManager';
import NetworkManager from './client/networking/NetworkManager';
import GraphicsEngine from './client/graphics/GraphicsEngine';
import AssetManager from './client/AssetManager';
import World from './client/World';

import './client/ui/UIManager';

var world,
		clock,
		graphicsEngine,
		inputManager,
		networkManager,
		paused = false;

	var assetManager = new AssetManager(() => {
	graphicsEngine = new GraphicsEngine(document.getElementById('graphics_root'));
	inputManager = new InputManager(graphicsEngine.getDomElement());
	world = new World(graphicsEngine, inputManager, assetManager);
	networkManager = new NetworkManager('192.168.2.69', '7777', world);
	clock = new THREE.Clock();

	tick();
}, (assetsToLoad) => {
	console.log('AssetManager - Loading assets - ' + assetsToLoad);
});

	assetManager.load(0x000000, "./assets/characters/", "char", true);
	assetManager.load(0x000001, "./assets/scenery/", "floor");
	assetManager.load(0x000002, "./assets/scenery/buildings/", "Building");

	// Weapon assets
	assetManager.load(0x100000, "./assets/weapons/", "Pistol");

window.addEventListener('blur', function(){
	clock.stop();
	paused = true;
});

window.addEventListener('focus', function(){
	clock.start();
	paused = false;
});

// Engine tick
var tick = function() {
	requestAnimationFrame( tick.bind(this) );
	if(!paused) {
		world.update(clock.getDelta());
		graphicsEngine.tick();
		inputManager.update();
	}
}
