const THEME_COLORS = ['#6246ea', '#e45858', '#D3FEEF', '#fffffe'];

class Dot {
	constructor(id, size, color = '#fffffe', position = [0, 0]) {
		// add dot to DOM with size
		const dotElem = document.createElement('span');

		dotElem.style.height = `${size}px`;
		dotElem.style.width = `${size}px`;
		dotElem.style.backgroundColor = color;
		dotElem.setAttribute('id', id.toString());
		dotElem.setAttribute('data-size', size);
		dotElem.classList.add('dot');
		dotElem.style.right = `${position[0]}px`;
		dotElem.style.top = `${position[1]}px`;

		this.id = id.toString();
		this.position = position; // this a tuple, used x,y numbers
		this.size = size;
		this.dotElem = dotElem;
	}

	setPositionY(position) {
		this.dotElem.style.top = `${position}px`;
		this.position[1] = position;
	}
}

class Game {
	constructor() {
		const gameBoard = document.getElementById('game-playground');
		const gameController = document.getElementById('controller--container');

		this.gameBoard = {
			height: gameBoard.offsetHeight,
			width: gameBoard.offsetWidth,
		};
		this.gameControllerElem = gameController;
		this.score = 0;
		this.isPlaying = false;
		this.dots = [];
		this.speed = 10;
		this.DOT_SPAWN_RATE = 1000; // in milliseconds
		this.MAX_DOT_SIZE = 100;
		this.MIN_DOT_SIZE = 10;
		this.intervalRef = null;
		this.animateRef = null;
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

		const speedDial = document.getElementById('slider-dial');
		const speedLabel = document.getElementById('speed-value');

		startButton.addEventListener('click', () => {
			if (!this.isPlaying) {
				startButton.textContent = 'Pause';

				this.play();
			} else {
				startButton.textContent = 'Start';
				this.stop();
			}

			this.isPlaying = !this.isPlaying;
			this.togglePausedDisplay();
		});

		speedDial.addEventListener('change', (event) => {
			const newSpeed = parseInt(event.target.value, 10);
			this.speed = newSpeed;
			speedLabel.textContent = newSpeed;
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
		// only get divisible by 10
		const randSize =
			this.randomIntFromInterval(
				this.MIN_DOT_SIZE / 10,
				this.MAX_DOT_SIZE / 10
			) * 10;

		const randPosition = this.randomIntFromInterval(
			0,
			this.gameBoard.width - randSize
		);
		const colorIndex = this.randomIntFromInterval(0, THEME_COLORS.length);
		const randId = this.randomIntFromInterval(0, 1000);
		// start dots half way in container element
		const initialPosition = [
			randPosition,
			this.gameControllerElem.offsetHeight / 2,
		];

		const dot = new Dot(
			randId,
			randSize,
			THEME_COLORS[colorIndex],
			initialPosition
		);

		document.getElementById('game-playground').appendChild(dot.dotElem);

		dot.dotElem.addEventListener('click', (event) => {
			this.onDotClick(event);
		});

		return dot;
	}

	moveDots() {
		const FRAMES_PER_SECOND = 60;

		this.dots.forEach((dot) => {
			const {
				position: [, currentY],
				dotElem,
			} = dot;

			//TODO: double check
			// const newY = currentY + (this.PX_SPEED * this.speed) / FRAMES_PER_SECOND;
			const newY = Math.ceil(currentY + this.speed / FRAMES_PER_SECOND);
			dot.setPositionY(newY);

			// if dot is in screen, move otherwise delete
			if (this.gameBoard.height < newY) {
				this.removeDot(dotElem);
			}
		});

		this.animateRef = requestAnimationFrame(this.moveDots.bind(this));
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
		const dotId = dotElem.id;

		// delete node from DOM and state
		dotElem.parentNode.removeChild(dotElem);

		const newDots = this.dots.filter((dot) => dotId !== dot.id);

		this.dots = newDots;
	}

	updateScore(dotSize) {
		const newScore = this.getDotValue(dotSize);

		this.score += newScore;

		const scoreBoard = document.getElementById('points');

		scoreBoard.textContent = this.score;
	}

	togglePausedDisplay() {
		const [pausedTitle] = document.getElementsByClassName('game-state--paused');
		const gameBoard = document.getElementById('game-playground');

		pausedTitle.style.display = !this.isPlaying ? 'block' : 'none';

		// toggling of paused styles
		if (!this.isPlaying) {
			gameBoard.classList.add('game-playground--paused');
		} else {
			gameBoard.classList.remove('game-playground--paused');
		}
	}

	getDotValue(size) {
		return 11 - size * 0.1;
	}

	randomIntFromInterval(min, max) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}

const game = new Game();
game.render();
