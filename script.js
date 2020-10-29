var configuration = [null, 'left', 'left', 'left'];
var inProgress = false;
var position = 'h0 v0';
var toFlip = [];
var buttons = [];
var ball = document.getElementById('ball');

function flipper(n) {
  return function() {
    if(inProgress) return;

    if(configuration[n] == 'left')
      configuration[n] = 'right'
    else /* configuration[n] == 'right' */
      configuration[n] = 'left';
    var el = document.getElementById('x' + n);
    el.className = 'paddle ' + configuration[n];
  }
}
for(var i = 1; i <= 3; i++) {
  var el = document.getElementById('flip' + i);
  el.addEventListener('click', flipper(i));
  buttons.push(el);
}

var el;
el = document.getElementById('a');
el.addEventListener('click', function() { drop('a') });
buttons.push(el);
el = document.getElementById('b');
el.addEventListener('click', function() { drop('b') });
buttons.push(el);

function drop(letter) {
  if(inProgress) return;
  inProgress = true;
  disableButtons()
  if(letter === 'a') position = 'h1 v2';
  if(letter === 'b') position = 'h1 v4';
  ball.className = "instant " + position;
  magic({propertyName: 'top'});
}

function go(n, l, r) {
  if(configuration[n] === 'left')
    position = l;
  else /* configuration[n] === 'right' */
    position = r;
  toFlip.push(n);
}

for(var i = 1; i <= 3; i++) {
  var el = document.getElementById('x' + i);
  el.addEventListener('transitionend', updateConfig);
  el.addEventListener('webkitTransitionEnd', updateConfig);
}

function updateConfig() {
  for(var i = 1; i <= 3; i++) {
    var el = document.getElementById('x' + i);
    configuration[i] = el.className.split(' ')[1];
  }
}

function flip(dir) {
  if(dir === 'left') return 'right';
  if(dir === 'right') return 'left';
}

function flipAway() {
  var n;
  while(n = toFlip.pop()) {
    var el = document.getElementById('x' + n);
    el.className = 'paddle ' + flip(configuration[n]);
  }
}

ball.addEventListener('transitionend', magic, true);
ball.addEventListener('webkitTransitionEnd', magic, true);

function magic(evt) {
  if(evt.propertyName !== 'top') return;
  flipAway();
  switch(position) {
  // start
  case 'h1 v2':
    position = 'h2 v2';
  break;
  case 'h1 v4':
    position = 'h2 v4';
  break;

  // x1 x3
  case 'h2 v2':
    go(1, 'h3 v1', 'h3 v3');
  break;
  case 'h2 v4':
    go(3, 'h3 v3', 'h3 v5');
  break;

  // x2 + corners
  case 'h3 v1':
    position = 'h4 v2';
  break;
  case 'h3 v3':
    go(2, 'h4 v2', 'h4 v4');
  break;
  case 'h3 v5':
    position = 'h4 v4';
  break;

  // final fall
  case 'h4 v2':
    position = 'h5 v2';
  break;
  case 'h4 v4':
    position = 'h5 v4';
  break;

  // end
  case 'h5 v2':
  case 'h5 v4':
    inProgress = false;
    enableButtons();
    // making the ball fade?
  break;
  }
  window.setTimeout(function(){ball.className = position}, 100);
}

function enableButtons() {
  for(var i = 0, len = buttons.length; i < len; i++) {
    buttons[i].className = 'button enabled';
  }
}

function disableButtons() {
  for(var i = 0, len = buttons.length; i < len; i++) {
    buttons[i].className = 'button disabled';
  }
}
