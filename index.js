const GO_RIGHT = "GO_RIGHT";
const GO_LEFT = "GO_LEFT";
const GO_UP = "GO_UP";
const GO_DOWN = "GO_DOWN";
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const SIZE = 10;

class SnakeBody {
  constructor({ size, posX = 50, posY = 50 }) {
    this.width = size;
    this.height = size;
    this._posX = posX;
    this._posY = posY;
    this._prevX = undefined;
    this._prevY = undefined;
  }

  getPrevPos() {
    return [this._prevX, this._prevY];
  }
  getCurrentPos() {
    return [this._posX, this._posY];
  }
  setPos(x, y) {
    this._prevX = this._posX;
    this._prevY = this._posY;
    this._posX = x;
    this._posY = y;
  }

  draw() {
    fill(51);
    stroke(255);
    rect(this._posX, this._posY, this.width, this.height);
  }
}
class Snake extends Array {
  constructor() {
    super();
    if (typeof Snake.instace === "object") {
      return Snake.instace;
    }
    Snake.instace = this;
    this.push(new SnakeBody({ size: SIZE }));
    return this;
  }

  hasHitApple(apple) {
    const head = this[this.length - 1];
    const [posX, posY] = head.getCurrentPos();
    const [applePosX, applePosY] = apple.getCurrentPos();
    if (Math.abs(posX - applePosX) < 10 && Math.abs(posY - applePosY) < 10) {
      apple.generate();
      const tail = this[0];
      const [nextPosX, nextPosY] = tail.getCurrentPos();
      this.appendBody(nextPosX, nextPosY);
    }
  }

  appendBody(posX, posY) {
    this.unshift(new SnakeBody({ size: SIZE, posX, posY }));
  }

  moveAnimal(motion) {
    const snakeBody = [...this];
    const head = snakeBody.pop();
    const [currentPosX, currentPosY] = head.getCurrentPos();
    const [posX, posY] = motion.getNextAnimalPosition(currentPosX, currentPosY);
    head.setPos(posX, posY);
    let [nextPosX, nextPosY] = head.getPrevPos();
    snakeBody.forEach((body) => {
      body.setPos(nextPosX, nextPosY);
      const [a, b] = body.getPrevPos();
      nextPosX = a;
      nextPosY = b;
    });
  }

  draw() {
    this.forEach((body) => {
      body.draw();
    });
  }
}

class Motion {
  constructor() {
    this.currentDirection = GO_RIGHT;
    this.nextDirection = undefined;
  }

  getCurrentDirection() {
    return this.currentDirection;
  }
  changeDirection(nextDirection) {
    if (
      [GO_LEFT, GO_RIGHT, GO_DOWN, GO_UP].some(
        (direction) => direction === nextDirection
      )
    ) {
      this.nextDirection = nextDirection;
    }
  }
  getNextAnimalPosition(posX, posY) {
    const options = {
      [GO_LEFT]: () => [posX - SIZE, posY],
      [GO_RIGHT]: () => [posX + SIZE, posY],
      [GO_DOWN]: () => [posX, posY + SIZE],
      [GO_UP]: () => [posX, posY - SIZE],
    };
    if (
      ([GO_LEFT, GO_RIGHT].some(
        (direction) => direction === this.currentDirection
      ) &&
        [GO_UP, GO_DOWN].some(
          (direction) => direction === this.nextDirection
        )) ||
      ([GO_UP, GO_DOWN].some(
        (direction) => direction === this.currentDirection
      ) &&
        [GO_LEFT, GO_RIGHT].some(
          (direction) => direction === this.nextDirection
        ))
    ) {
      this.currentDirection = this.nextDirection;
      return options[this.nextDirection]();
    }
    return options[this.currentDirection]();
  }
}

class Food {
  constructor() {
    if (typeof Food.instace !== "object") {
      return Food.instace;
    }
    Food.instace = this;
    this._posX = undefined;
    this._posY = undefined;
  }

  getCurrentPos() {
    return [this._posX, this._posY];
  }

  generate() {
    const cols = Math.floor(CANVAS_WIDTH / SIZE);
    const rows = Math.floor(CANVAS_HEIGHT / SIZE);
    const posX = parseInt(Math.random() * SIZE) * cols;
    const posY = parseInt(Math.random() * SIZE) * rows;
    console.log(posX, posY);
    this._posX = posX;
    this._posY = posY;
  }

  draw() {
    fill(200, 0, 0);
    rect(this._posX, this._posY, 10, 10);
  }
}
let snake = undefined;
let snakeMotion = undefined;
let apple = undefined;
let initialSpeed = 5;
let increased = false;
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  snake = new Snake();
  snakeMotion = new Motion();
  apple = new Food();
  apple.generate();
  frameRate(initialSpeed);
}

function draw() {
  background(255);
  snake.moveAnimal(snakeMotion);
  snake.draw();
  apple.draw();
  snake.hasHitApple(apple);
  if (!increased && snake.length % 5 === 0) {
    increased = true;
    initialSpeed++;
    console.log("new speed", initialSpeed);
    frameRate(initialSpeed);
  } else if (snake.length % 5 !== 0) {
    increased = false;
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    snakeMotion.changeDirection(GO_UP);
  }
  if (keyCode === DOWN_ARROW) {
    snakeMotion.changeDirection(GO_DOWN);
  }
  if (keyCode === LEFT_ARROW) {
    snakeMotion.changeDirection(GO_LEFT);
  }
  if (keyCode === RIGHT_ARROW) {
    snakeMotion.changeDirection(GO_RIGHT);
  }
}
