import lock from 'pointer-lock';


class InputManager {

	constructor(renderElement) {

		var _this = this;

		console.log('InputManager - initialized');

		this.mouseButtons = [];
		this.keys = [];
		this.mouseX = 0;
		this.mouseY = 0;

		this.inputX = 0;
		this.inputY = 0;
		this.inputZ = 0;

		window.addEventListener('keydown', this.onKeyDown.bind(this));
		window.addEventListener('keyup', this.onKeyUp.bind(this));
		window.addEventListener('mousemove', this.onMouseMove.bind(this));
		window.addEventListener('mousewheel', this.onScroll.bind(this));
		window.addEventListener('mousedown', this.onMouseDown.bind(this));
		window.addEventListener('mouseup', this.onMouseUp.bind(this));

		// Pointer Lock
		var pointer = lock(renderElement);
		pointer.on('attain', function(movement) {
			movement.on('data', function(move) {
				_this.inputX = move.dx / 100;
				_this.inputY = -move.dy / 100;
			});
		});
	}

	onScroll(event) {
			if(event.deltaY > 0)
				this.inputZ = 1;
			else {
				this.inputZ = -1;
			}
	}

	onMouseMove(event) {
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
	}

	onKeyDown(event) {
		this.keys[event.which] = true;
	}

	onKeyUp(event) {
		this.keys[event.which] = false;
	}

	onMouseDown(event) {
		console.log(event.button);
		this.mouseButtons[event.button] = true;
	}

	onMouseUp(event) {
		this.mouseButtons[event.button] = false;
	}

	getAxisX() {
		return this.inputX;
	}

	getAxisY() {
		return this.inputY;
	}

	getAxisZ() {
		return this.inputZ;
	}

	getMouseX() {
		return this.mouseX;
	}

	getMouseY() {
		return this.mouseY;
	}

	isKeyDown(keyCode) {
		return (this.keys[keyCode] === undefined) ? false : this.keys[keyCode];
	}

	isMouseDown(keyCode) {
		return (this.mouseButtons[keyCode] === undefined) ? false : this.mouseButtons[keyCode];
	}

	update() {
			this.inputX = 0;
			this.inputY = 0;
			this.inputZ = 0;
	}
}

export default InputManager;
