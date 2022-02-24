//TODO: create func until to uses through out
const getRandomPxSize = () => {};

class Dot {
	constructor(id, size) {
		// add dot to DOM with size
		const [gameBoard] = document.getElementsByTagName('body');

		const dotElem = document.createElement('span');
		dotElem.style.display = 'inline-block';
		dotElem.style.position = 'absolute';
		dotElem.style.height = `${size}px`;
		dotElem.style.width = `${size}px`;
		dotElem.style.margin = '0';
		dotElem.style.border = '2px solid black';
		dotElem.style.borderRadius = '50%';
		dotElem.style.top = 0;
		// dotElem.setAttribute('visibility', 'hidden'); // hide dot until shown on game board
		dotElem.setAttribute('id', id.toString());
		gameBoard.appendChild(dotElem);

		this.size = size;
		this.id = id.toString();
		this.showDot = false;
	}

	toggleDotShow() {
		this.showDot = !this.showDot;
		// TODO: check if this is correct
		// dotElem.setAttribute('visibility', 'visible');
	}
}

class Game {
	constructor(numberOfDots) {
		const [gameBoard] = document.getElementsByTagName('body');
		//TODO: double check if this is the correct way of setting values
		this.gameBoard = {
			height: gameBoard.offsetHeight,
			width: gameBoard.offsetWidth,
		};
		this.score = 0;
		this.isPlaying = false;
		this.speed = 0;
		this.NUMBER_OF_DOTS = numberOfDots;
		this.dots = [];
	}

	play() {
		this.createDots();
	}

	createDots() {
		//TODO: refactor
		// 		- Dots should vary randomly in size from 10px in diameter to 100px in diameter.
		// - A dot's value is inversely proportional to its size, with the smallest dots worth 10 points, and the largest dots worth 1 point.

		const dots = [];
		let count = 0;

		while (count < this.NUMBER_OF_DOTS) {
			// 10px in diameter to 100px in diameter.
			const randSize = Math.floor(Math.random() * 100 + 1);
			console.log(randSize);

			dots.push(new Dot(count, randSize));
			count++;
		}
		console.log(dots);
		this.dots = dots;
		this.positionDots();
		console.log(this.gameBoard);
	}

	positionDots() {}
}

const game = new Game(10);
game.play();
//TODO: refactor this
let thumb = slider.querySelector('.slider-dial');

thumb.onmousedown = function (event) {
	event.preventDefault(); // prevent selection start (browser action)

	let shiftX = event.clientX - thumb.getBoundingClientRect().left;
	// shiftY not needed, the thumb moves only horizontally

	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);

	function onMouseMove(event) {
		let newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;

		// the pointer is out of slider => lock the thumb within the bounaries
		if (newLeft < 0) {
			newLeft = 0;
		}
		let rightEdge = slider.offsetWidth - thumb.offsetWidth;
		if (newLeft > rightEdge) {
			newLeft = rightEdge;
		}

		thumb.style.left = newLeft + 'px';
	}

	function onMouseUp() {
		document.removeEventListener('mouseup', onMouseUp);
		document.removeEventListener('mousemove', onMouseMove);
	}
};

thumb.ondragstart = function () {
	return false;
};
