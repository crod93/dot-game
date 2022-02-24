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
		dotElem.setAttribute('id', id.toString());
		gameBoard.appendChild(dotElem);

		this.size = size;
		this.id = id.toString();
	}
}

class Game {
	constructor(numberOfDots) {
		const [gameBoard] = document.getElementsByTagName('body');

		this.game = {
			height: gameBoard.offsetHeight,
			width: gameBoard.offsetWidth,
		};
		this.score = 0;
		this.isPlaying = false;
		this.speed = 0;
		this.NUMBER_OF_DOTS = numberOfDots;
	}

	play() {
		this.createDots();
	}

	createDots() {
		//TODO: revist and do what the comment below says
		// get .10 of the screen sizes and prevent dots from getting larger than that
		const MAX_DOT_SIZE = this.game.width * 0.1;
		const dots = [];
		let count = 0;

		while (count < this.NUMBER_OF_DOTS) {
			// create a dot with size between 100 to MAX_DOT_SIZE
			const rand = Math.random() * 1000;
			console.log(rand);
			let size = 0;
			if (MAX_DOT_SIZE < rand) {
				size = Math.floor(rand / 5);
			} else {
				size = Math.floor(rand);
			}

			dots.push(new Dot(count, size));
			count++;
		}
		console.log(dots);
	}
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
