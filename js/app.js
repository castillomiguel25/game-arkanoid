const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const $sprite = document.querySelector("#sprite");
const $bricks = document.querySelector("#bricks");

canvas.width = 448;
canvas.height = 400;

// variables de la pelota
// tamano
const ballRadius = 5;
// position ball
let x = canvas.width / 2;
let y = canvas.height - 30;

// velocidad de la pelota
let dx = 3;
let dy = -2;

// variables de la paleta

const paddleHeight = 10;
const paddleWidth = 50;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

let rightPressed = false;
let leftPressed = false;

// variables de los ladrillos

const bricksRowCount = 6;
const bricksColumnCount = 13;
const brickWidth = 32;
const brickHeight = 16;
const brickPadding = 1;
const brickOffsetTop = 80;
const brickOffsetLeft = 10;
const bricks = [];

const BRINCKS_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0,
};

for (let c = 0; c < bricksColumnCount; c++) {
  bricks[c] = []; // inicializamos con un array vacio
  for (let r = 0; r < bricksRowCount; r++) {
    // calculamos la posicion del ladrillo en la pantalla
    const bricksX = c * (brickWidth + brickPadding) + brickOffsetLeft;
    const bricksY = r * (brickHeight + brickPadding) + brickOffsetTop;
    // asignar color aleatorio al ladrillo
    const ramdom = Math.floor(Math.random() * 8);
    // guardamos la inf de cada ladrillo
    bricks[c][r] = {
      x: bricksX,
      y: bricksY,
      status: BRINCKS_STATUS.ACTIVE,
      color: ramdom,
    };
  }
}

function drawBall() {
  context.beginPath();
  context.arc(x, y, ballRadius, 0, Math.PI * 2);
  context.fillStyle = "#fff";
  context.fill();
  context.closePath();
}
function drawPaddle() {
  // context.fillStyle = "white";
  // context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

  context.drawImage(
    $sprite,
    29,
    174,
    paddleWidth,
    paddleHeight,
    paddleX,
    paddleY,
    paddleWidth,
    paddleHeight
  );
}
function drawBricks() {
  for (let c = 0; c < bricksColumnCount; c++) {
    for (let r = 0; r < bricksRowCount; r++) {
      const currentBrincks = bricks[c][r]
      if (currentBrincks.status === BRINCKS_STATUS.DESTROYED) continue;

      const clipX = currentBrincks.color * 32

      context.drawImage(
        $bricks,
        clipX,
        0,
        24.5,
        12,
        currentBrincks.x,
        currentBrincks.y,
        brickWidth,
        brickHeight
      )
      // context.fillStyle = 'red'
      // context.rect(
      //   currentBrincks.x,
      //   currentBrincks.y,
      //   brickWidth,
      //   brickHeight
      // )
      // context.strokeStyle = ('black')
      // context.stroke()
      // context.fill()
    }
  }
}
function drawScore() {}
function CollisionDetection() {
  for (let c = 0; c < bricksColumnCount; c++) {
    for (let r = 0; r < bricksRowCount; r++) {
      const currentBrincks = bricks[c][r]
      if (currentBrincks.status === BRINCKS_STATUS.DESTROYED) continue;

      const isBallSameXAsBrick =
        x > currentBrincks.x && 
        x < currentBrincks.x + brickWidth

      const isBallSameYAsBrick =
        y > currentBrincks.y && 
        y < currentBrincks.y + brickHeight
        

      if (isBallSameXAsBrick && isBallSameYAsBrick){
        dy = -dy
        currentBrincks.status = BRINCKS_STATUS.DESTROYED
      }
      
    }
  }
}
function ballMovement() {
  // rebotar la pelota en los laterales
  if (
    x + dx > canvas.width - ballRadius || //derecha
    x + dx < ballRadius // izquierda
  ) {
    dx = -dx;
  }

  // rebotar en la parte de arriba
  if (y + dy < ballRadius) {
    dy = -dy;
  }

  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;
  const isBallTouchingPaddle = y + dy > paddleY;

  // si la pelota toca la pala
  if (isBallSameXAsPaddle && isBallTouchingPaddle) {
    dy = -dy;
  }
  // si toca el suelo
  else if (y + dy > canvas.height - ballRadius) {
    console.log("game over");
    location.reload();
  }

  x += dx;
  y += dy;
}
function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function cleanCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function InitEvents() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(event) {
    const { key } = event;
    console.log(key);
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = true;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(event) {
    const { key } = event;
    console.log(key, "sasa");
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = false;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = false;
    }
  }
}

function draw() {
  // dibujar los elemtos
  cleanCanvas();
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();

  // colisiones y movimientos
  CollisionDetection();
  ballMovement();
  paddleMovement();

  window.requestAnimationFrame(draw);
}

draw();
InitEvents();
