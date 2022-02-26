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
		//TODO: add dot class
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

		// let frameID;
		// const getDiv = document.getElementsByClassName('frame');
		// const smoothAnimation = () => {
		// 	getDiv[0].insertAdjacentHTML('afterend', "<div class='frame'></div>");
		// 	frameID = requestAnimationFrame(smoothAnimation);
		// };

		// const onStart = () => {
		// 	frameID = requestAnimationFrame(smoothAnimation);
		// };

		// const onStop = () => {
		// 	cancelAnimationFrame(frameID);
		// };
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
			//TODO: check if these values have to be unique
			const randPosition = randomIntFromInterval(
				0,
				this.gameBoard.width - dot.size
			);
			console.log(randPosition);
			dot.setPosition(randPosition);
		});
	}

	moveDots() {}
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
