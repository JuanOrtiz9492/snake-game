const GO_RIGHT = "GO_RIGHT";
const GO_LEFT = "GO_LEFT";
const GO_UP = "GO_UP";
const GO_DOWN = "GO_DOWN";

class SnakeBody {
  constructor({ width, height, posX = 50, posY = 50 }) {
    this.width = width;
    this.height = height;
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
    this.push(new SnakeBody({ width: 10, height: 10 }));
    return this;
  }

  appendBody() {
    const [nextPosX, nextPosY] = this[this.length - 1].getPrevPos();
    this.unshift(new Snake({ posX: nextPosX, posY: nextPosY }));
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
    this.draw();
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
      [GO_LEFT]: () => [--posX, posY],
      [GO_RIGHT]: () => [++posX, posY],
      [GO_DOWN]: () => [posX, ++posY],
      [GO_UP]: () => [posX, --posY],
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

function setup() {
  createCanvas(600, 600);
}
let i = 50;

const snake = new Snake();
const snakeMotion = new Motion();
function draw() {
  background(255);
  snake.moveAnimal(snakeMotion);
  //snake.updateSnake(i++, snakeHead._posY);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    debugger;
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
