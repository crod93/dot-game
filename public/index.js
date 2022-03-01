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
		this.position = [0, 0]; // this a tuple, used x,y numbers
		this.size = size;
	}

	//TODO: refactor to one position function
	setPositionX(position) {
		this.element.style.right = `${position}px`;
		this.position[0] = position;
	}

	setPositionY(position) {
		this.element.style.top = `${position}px`;
		this.position[1] = position;
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
		dot.setPositionX(randPosition);

		dot.element.addEventListener('click', this.dotClicked.bind(this));
		return dot;
	}

	moveDots() {
		const oldDots = this.dots;
		const newDots = [];

		oldDots.forEach((dot) => {
			const {
				position: [, currentY],
			} = dot;

			const newY = currentY + (this.PX_SPEED * this.speed) / 60;
			dot.setPositionY(newY);

			if (newY <= this.gameBoard.height - dot.size / 2) {
				newDots.push(dot);
			}
		});

		this.animateRef = requestAnimationFrame(this.moveDots.bind(this));
		return newDots;
	}

	dotClicked(event) {
		const { target } = event;

		// delete node from DOM and state
		target.remove();
		const newDots = this.dots.filter((dot) => {
			if (dot.id === target.id) {
				//do this if this is the dot clicked, otherwise update dot state without clicked dot
				this.updateScore(dot);
			}

			return dot.id !== target.id;
		});

		this.dots = newDots;
	}

	updateScore(dot) {
		const { size } = dot;
		const newScore = this.MAX_DOT_SIZE - size;

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
