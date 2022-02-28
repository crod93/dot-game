/**
 * Get a random number betwen two values
 * @constructor
 * @param {number} min - Min value
 * @param {number} max - Max value
 */

const randomIntFromInterval = (min, max) => {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
};

class Dot {
	constructor(id, size) {
		// add dot to DOM with size
		const [gameBoard] = document.getElementsByTagName('body');

		const dotElem = document.createElement('span');

		dotElem.style.height = `${size}px`;
		dotElem.style.width = `${size}px`;

		dotElem.setAttribute('id', id.toString());
		dotElem.classList.add('dot');
		gameBoard.appendChild(dotElem);

		this.element = dotElem;
		this.size = size;
		this.id = id.toString();
		this.showDot = false;
	}

	toggleDotShow() {
		this.showDot = !this.showDot;
	}

	setPosition(position) {
		this.element.style.right = `${position}px`;
	}
}

class Game {
	constructor(numberOfDots) {
		const [gameBoard] = document.getElementsByTagName('body');

		this.gameBoard = {
			height: gameBoard.offsetHeight,
			width: gameBoard.offsetWidth,
		};
		this.score = 0;
		this.isPlaying = false;
		this.speed = 10;
		this.NUMBER_OF_DOTS = numberOfDots;

		// add game DOM controllers
		const startButton = document.getElementById('start-btn');

		startButton.addEventListener('click', (event) => {
			console.log(event);
			if (!this.isPlaying) {
				startButton.textContent = 'Pause';

				this.play();
			} else {
				startButton.textContent = 'Start';
			}
			this.isPlaying = !this.isPlaying;
		});

		// speed dial
		const speedDial = slider.querySelector('.slider-dial');
		const speedDisplay = document.getElementById('speed');
		speedDisplay.textContent = this.speed;
		//TODO: refactor this
		speedDial.onmousedown = (event) => {
			event.preventDefault(); // prevent selection start (browser action)

			let shiftX = event.clientX - speedDial.getBoundingClientRect().left;

			const onMouseMove = (event) => {
				let newLeft =
					event.clientX - shiftX - slider.getBoundingClientRect().left;

				// the pointer is out of slider => lock the thumb within the bounaries
				if (newLeft < 0) {
					newLeft = 0;
				}
				let rightEdge = slider.offsetWidth - speedDial.offsetWidth;
				if (newLeft > rightEdge) {
					newLeft = rightEdge;
				}
				// TODO: get this to work correctly

				this.speed = parseInt(newLeft / 10);

				speedDisplay.textContent = this.speed;
				speedDial.style.left = newLeft + 'px';
			};

			const onMouseUp = () => {
				document.removeEventListener('mouseup', onMouseUp);
				document.removeEventListener('mousemove', onMouseMove);
			};

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		};

		speedDial.ondragstart = () => {
			return false;
		};
	}

	play() {
		const maxPos = this.gameBoard.height;

		let startPos = 0;

		const moveDotAcrossScreen = (timestamp) => {
			if (!this.isPlaying) return;
			// 10px in diameter to 100px in diameter.
			const randSize = randomIntFromInterval(10, 100);

			const dot = new Dot(Math.floor(timestamp), randSize);
			// this.positionDot(dot);
			console.log({ timestamp });

			// reset dot position
			if (startPos > maxPos) {
				startPos = 0;
			}

			startPos += this.speed;

			dot.element.style.top = `${startPos + 20}px`;
			requestAnimationFrame(moveDotAcrossScreen);
		};
		requestAnimationFrame(moveDotAcrossScreen);
	}

	positionDot(dot) {
		// place dots in random position near the top of the screen
		const randPosition = randomIntFromInterval(
			0,
			this.gameBoard.width - dot.size
		);

		dot.setPosition(randPosition);
	}
}

new Game(10);
