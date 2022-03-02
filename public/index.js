class Dot {
	constructor(id, size, color = 'white') {
		// add dot to DOM with size
		const dotElem = document.createElement('span');

		dotElem.style.height = `${size}px`;
		dotElem.style.width = `${size}px`;
		dotElem.style.backgroundColor = color;

		dotElem.setAttribute('id', id.toString());
		dotElem.setAttribute('data-size', size);
		dotElem.setAttribute('data-value', id);
		dotElem.classList.add('dot');

		this.id = id.toString();
		this.position = [0, 0]; // this a tuple, used x,y numbers
		this.size = size;
		this.dotElem = dotElem;
	}

	//TODO: refactor to one position function
	setPositionX(position) {
		this.dotElem.style.right = `${position}px`;
		this.position[0] = position;
	}

	setPositionY(position) {
		this.dotElem.style.top = `${position}px`;
		this.position[1] = position;
	}
}

class Game {
	constructor() {
		const gameBoard = document.getElementById('game-playground');

		this.gameBoard = {
			height: gameBoard.offsetHeight,
			width: gameBoard.offsetWidth,
		};
		this.score = 0;
		this.isPlaying = false;
		this.dots = [];
		this.speed = 10;
		this.DOT_COLORS = ['#694dff', '#FEC0ED', '#F9897C', '##D3FEEF'];
		this.DOT_SPAWN_RATE = 1000;
		this.MAX_DOT_SIZE = 100;
		this.PX_SPEED = 10;
		this.intervalRef = null;
		this.animateRef = null;

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
		this.intervalRef = setInterval(
			this.spawnDots.bind(this),
			this.DOT_SPAWN_RATE
		);

		this.animateRef = requestAnimationFrame(this.moveDots.bind(this));
	}

	render() {
		const startButton = document.getElementById('start-btn');

		startButton.addEventListener('click', (event) => {
			event.stopPropagation();
			if (!this.isPlaying) {
				startButton.textContent = 'Pause';

				this.play();
			} else {
				startButton.textContent = 'Start';
				this.stop();
			}
			this.isPlaying = !this.isPlaying;
		});
	}

	stop() {
		clearInterval(this.intervalRef);
		cancelAnimationFrame(this.animateRef);
	}

	spawnDots() {
		this.dots = [...this.dots, this.createDot()];
	}

	createDot() {
		// 10px in diameter to 100px in diameter.
		const randSize = this.randomIntFromInterval(10, 100);
		const randPosition = this.randomIntFromInterval(
			0,
			this.gameBoard.width - randSize
		);
		const colorIndex = this.randomIntFromInterval(0, this.DOT_COLORS.length);
		const dot = new Dot(randPosition, randSize, this.DOT_COLORS[colorIndex]);

		document.getElementById('game-playground').appendChild(dot.dotElem);
		dot.setPositionX(randPosition);

		dot.dotElem.addEventListener('click', (event) => {
			this.onDotClick(event);
		});

		return dot;
	}

	moveDots() {
		const oldDots = this.dots;
		const newDots = [];
		const FRAMES_PER_SECOND = 60;

		oldDots.forEach((dot) => {
			const {
				position: [, currentY],
				size,
				dotElem,
			} = dot;

			//TODO: double check
			const newY = currentY + (this.PX_SPEED * this.speed) / FRAMES_PER_SECOND;
			dot.setPositionY(newY);

			// if dot is in screen, move otherwise delete
			if (newY <= this.gameBoard.height - size) {
				// console.log(this.dots, newY);
				newDots.push(dot);
			} else {
				this.removeDot(dotElem);
			}
		});

		this.animateRef = requestAnimationFrame(this.moveDots.bind(this));
		return newDots;
	}

	onDotClick(event) {
		const { target } = event;
		const dotSize = target.getAttribute('data-size');

		if (this.isPlaying) {
			this.removeDot(target);
			this.updateScore(dotSize);
		}
	}

	removeDot(dotElem) {
		const dotId = dotElem.getAttribute('data-value');
		// delete node from DOM and state
		dotElem.remove();

		const newDots = this.dots.filter((dot) => dotId !== dot.id);

		this.dots = newDots;
	}

	updateScore(dotSize) {
		const newScore = this.MAX_DOT_SIZE - dotSize;

		this.score += newScore;

		const scoreBoard = document.getElementById('points');

		scoreBoard.textContent = this.score;
	}

	randomIntFromInterval(min, max) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}

const game = new Game();
game.render();
