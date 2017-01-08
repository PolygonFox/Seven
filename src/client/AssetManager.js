
class AssetManager {

	constructor(onComplete, onProgress) {
		this.geometries = [];
		this.materials = [];

		this.assetsToLoad = 0;

		this.totalAssets = 0;

		this.onComplete = onComplete;
		this.onProgress = onProgress;
	}

	load(hex, path, fileName, isSkinned) {

		var _this = this;

		this.assetsToLoad++;

		var loader = new THREE.JSONLoader();
		loader.load(
			path + fileName + '.json',
			(geometry, materials) => {
				var mat = new THREE.MultiMaterial( materials );


				for (var k in mat.materials) {
					if(mat.materials[k].map)
			        	mat.materials[k].map.wrapS = mat.materials[k].map.wrapT = THREE.RepeatWrapping;

					if(mat.materials[k].bumpMap)
							  mat.materials[k].bumpMap.wrapS = mat.materials[k].bumpMap.wrapT = THREE.RepeatWrapping;

				}

				_this.geometries[hex] = geometry;
				_this.materials[hex] = mat;



				_this.assetsToLoad--;

				_this.onProgress(_this.assetsToLoad);

				if(_this.assetsToLoad === 0)
					_this.onComplete();
			}
		)
	}

	createMesh(geometryHex, materialHex) {
		return new THREE.Mesh(this.getGeometry(geometryHex), this.getMaterial(materialHex || geometryHex));
	}

	getGeometry(id) {
		return this.geometries[id];
	}

	getMaterial(id) {
		return this.materials[id];
	}

}

export default AssetManager;
