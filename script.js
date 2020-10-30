const L = 'left';
const R = 'right';

let config = [null, L, L, L];
let inProgress = false;
let position = 'h0 v0';
let toFlip = [];
let buttons = [];
let ball = document.getElementById('ball');

let dropButtonA = document.getElementById('a');
dropButtonA.addEventListener('click', () => { drop('a') });
buttons.push(dropButtonA);

let dropButtonB = document.getElementById('b');
dropButtonB.addEventListener('click', () => { drop('b') });
buttons.push(dropButtonB);

for (let n = 1; n <= 3; n++) {
  let flipButton = document.getElementById('flip' + n);
  flipButton.addEventListener('click', () => { flipPaddle(n) });
  buttons.push(flipButton);
}

ball.addEventListener('transitionend', run, true);

for (let n = 1; n <= 3; n++) {
  let paddle = document.getElementById('x' + n);
  paddle.addEventListener('transitionend', updateConfig);
}

function drop(slot) {
  if (inProgress) {
    return;
  }

  inProgress = true;
  disableButtons();

  position = (slot === 'a') ? 'h1 v2' : 'h1 v4';

  ball.className = 'instant ' + position;
  run();
}

function flipPaddle(n) {
  if (inProgress) {
    return;
  }

  config[n] = flip(config[n]);
  let paddle = document.getElementById('x' + n);
  paddle.className = 'paddle ' + config[n];
}

function go(paddleNum, leftPos, rightPos) {
  position = (config[paddleNum] === L) ? leftPos : rightPos;
  toFlip.push(paddleNum);
}

function updateConfig() {
  for (let n = 1; n <= 3; n++) {
    let paddle = document.getElementById('x' + n);
    config[n] = paddle.className.split(' ')[1];
  }
}

function flip(dir) {
  return dir === L ? R : L;
}

function flipAway() {
  for (let n = toFlip.pop(); n != null; n = toFlip.pop()) {
    let paddle = document.getElementById('x' + n);
    paddle.className = 'paddle ' + flip(config[n]);
  }
}

function run(event) {
  if (event != null && event.propertyName !== 'top') {
    return;
  }

  flipAway();
  switch (position) {
  case 'h1 v2':
    position = 'h2 v2';
    break;
  case 'h1 v4':
    position = 'h2 v4';
    break;

  case 'h2 v2':
    go(1, 'h3 v1', 'h3 v3');
    break;
  case 'h2 v4':
    go(3, 'h3 v3', 'h3 v5');
    break;

  case 'h3 v1':
    position = 'h4 v2';
    break;
  case 'h3 v3':
    go(2, 'h4 v2', 'h4 v4');
    break;
  case 'h3 v5':
    position = 'h4 v4';
    break;

  case 'h4 v2':
    position = 'h5 v2';
    break;
  case 'h4 v4':
    position = 'h5 v4';
    break;

  case 'h5 v2':
  case 'h5 v4':
    inProgress = false;
    enableButtons();
    break;
  }

  window.setTimeout(() => { ball.className = position }, 100);
}

function enableButtons() {
  for (let button of buttons) {
    button.className = 'button enabled';
  }
}

function disableButtons() {
  for (let button of buttons) {
    button.className = 'button disabled';
  }
}
