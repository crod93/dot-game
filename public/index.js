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

		// dotElem.setAttribute('visibility', 'hidden'); // hide dot until shown on game board
		dotElem.setAttribute('id', id.toString());
		dotElem.classList.add('dot');
		gameBoard.appendChild(dotElem);

		this.size = size;
		this.id = id.toString();
		this.showDot = false;
		this.position = 0;
	}

	toggleDotShow() {
		this.showDot = !this.showDot;
		// TODO: check if this is correct
		// dotElem.setAttribute('visibility', 'visible');
	}

	setPosition(position) {
		const dotElem = document.getElementById(this.id);

		this.position = position;
		dotElem.style.right = `${position}px`;
	}
}

class Game {
	constructor(numberOfDots) {
		const [gameBoard] = document.getElementsByTagName('body');

		this.gameBoard = {
			height: gameBoard.offsetHeight,
			width: gameBoard.offsetWidth,
		};
		this.gameRef = null;
		this.score = 0;
		this.isPlaying = false;
		this.speed = 10;
		this.NUMBER_OF_DOTS = numberOfDots;
		this.dots = [];

		// add game DOM controllers
		const startButton = document.getElementById('start-btn');

		startButton.addEventListener('click', (event) => {
			console.log(event);
			if (!this.isPlaying) {
				startButton.textContent = 'Pause';

				this.play();
			} else {
				startButton.textContent = 'Start';
				this.stop();
			}
			this.isPlaying = !this.isPlaying;
		});

		// speed dial
		const speedDial = slider.querySelector('.slider-dial');
		const speedDisplay = document.getElementById('speed');
		speedDisplay.textContent = this.speed;

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
				console.log(this.speed);
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
		this.createDots();

		this.dots.forEach((dot) => {
			let dotElem = document.getElementById(dot.id);
			let startPos = 0;
			const maxPos = this.gameBoard.height;
			const moveStone = () => {
				startPos += this.speed;
				dotElem.style.top = (startPos % maxPos) + 'px';
				requestAnimationFrame(moveStone);
			};
			requestAnimationFrame(moveStone);
		});
	}

	createDots() {
		//TODO:
		// - A dot's value is inversely proportional to its size, with the smallest dots worth 10 points, and the largest dots worth 1 point.

		const dots = [];
		let count = 0;

		while (count < this.NUMBER_OF_DOTS) {
			// 10px in diameter to 100px in diameter.
			const randSize = randomIntFromInterval(10, 100);
			console.log(randSize);

			dots.push(new Dot(count, randSize));
			count++;
		}

		this.dots = dots;
		this.positionDots();
	}

	positionDots() {
		this.dots.forEach((dot) => {
			const randPosition = randomIntFromInterval(
				0,
				this.gameBoard.width - dot.size
			);

			dot.setPosition(randPosition);
		});
	}

	moveDots() {}

	stop() {
		console.log('stop game');
	}
}

new Game(10);
