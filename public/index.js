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
	constructor(id, size, color = 'white') {
		// add dot to DOM with size
		const gameBoard = document.body;

		const dotElem = document.createElement('span');

		dotElem.style.height = `${size}px`;
		dotElem.style.width = `${size}px`;
		dotElem.style.backgroundColor = color;

		dotElem.setAttribute('id', id.toString());
		dotElem.classList.add('dot');
		gameBoard.appendChild(dotElem);

		this.element = dotElem;
		this.id = id.toString();
	}

	setPosition(position) {
		this.element.style.right = `${position}px`;
	}
}

class Game {
	constructor() {
		const gameBoard = document.body;

		this.gameBoard = {
			height: gameBoard.offsetHeight,
			width: gameBoard.offsetWidth,
		};
		this.score = 0;
		this.isPlaying = false;
		this.speed = 10;
		this.DOT_COLORS = ['#694dff', '#FEC0ED', '#F9897C', '##D3FEEF'];

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
		const start = performance.now();

		const moveDotAcrossScreen = (currentTime) => {
			const elapsed = currentTime - start;
			const progress = elapsed / 1000;
			const amountToMove = progress + this.gameBoard.height;

			if (!this.isPlaying) return;

			const dot = this.createDot();

			dot.element.style.top = `${amountToMove}px`;

			requestAnimationFrame(moveDotAcrossScreen);
		};
		requestAnimationFrame(moveDotAcrossScreen);
	}

	createDot() {
		// 10px in diameter to 100px in diameter.
		const randSize = randomIntFromInterval(10, 100);
		const randPosition = randomIntFromInterval(
			0,
			document.body.clientWidth - randSize
		);
		const colorIndex = randomIntFromInterval(0, this.DOT_COLORS.length);
		const dot = new Dot(randPosition, randSize, this.DOT_COLORS[colorIndex]);
		dot.setPosition(randPosition);

		// add to score and delete node if clicked
		dot.element.addEventListener('click', () => {
			const pointElem = document.getElementById('points');
			this.score += 10;
			pointElem.textContent = this.score;
			dot.element.remove();
		});
		return dot;
	}
}

new Game();
