/*
* Author: Denys Dovhan <email@denysdovhan.com>
* Date: 06.05.2014
* Version: 1.0.0
* Last modified: 07.05.2014
*
* Purpose: Ping-pong on JavaScript.
* Known Bugs: not yet seen
*/


/**
 * Initializes variables.
 * Run the function drawing playing field
 *
 * @return {void}
 */
function init() {	
	canvas             = document.getElementById('game') // Get canvas
	canvas.width       = window.innerWidth  // Width field
	canvas.height      = window.innerHeight - 45 // Height field
	context            = canvas.getContext('2d') // Initializes 2D
	canvas.onmousemove = playerMove

	// The object of playing field
	game    = new rect('#333', 0, 0, canvas.width, canvas.height)
	// Rackets of players
	ai      = new rect('#fff', 10, game.height/2 - 40, 20, 80)
	player  = new rect('#fff', game.width - 30, game.height/2 - 40, 20, 80)
	// Ball
	ball    = new rect("#fff", 40, game.height / 2 - 10, 20, 20)
	ball.vX = 7
	ball.vY = 7

	ai.scores     = 0 // AI points
	player.scores = 0 // Player points

	setInterval(play, 1000/70) // Set refresh interval
}


/**
 * Method for drawing playing field
 *
 * @return {void}
 */
function draw() {
	 // Draw playing field
	game.draw()
	context.font = 'bold 128px courier';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = '#ccc';
    context.fillText(ai.scores, 100, 0);
    context.fillText(player.scores, game.width - 100, 0);
	// Draw rackets of players
	ai.draw()
	player.draw()
	// Draw ball
	ball.draw()
}


/**
 * Class for drawing rectangle
 * 
 * @param  {string} color  Rectangle color
 * @param  {int} 	x      Coordinate Х-axis
 * @param  {int}	y      Coordinate Y-axis
 * @param  {int} 	width  Rectangle width
 * @param  {int} 	height Rectangle height
 * 
 * @method 			draw   for drawing playing field
 *
 * @return {void}
 */
function rect(color, x, y, width, height) {
	this.color  = color
	this.x      = x
	this.y      = y
	this.width  = width
	this.height = height
	this.draw   = function() {
		// Draw playing object
		context.fillStyle = this.color
		context.fillRect(this.x, this.y, this.width, this.height)
	}
}


/**
 * Method for move racket player
 * @param  {object} e EventObject
 * 
 * @return {void}
 */
function playerMove(e) {
	var y = e.pageY
	if (player.height/2 + 10 < y && y < game.height - player.height/2 - 10) {
		player.y = y - player.height/2
	}
}


/**
 * Changing ball coordinates
 * 
 * @return {void}
 */
function update() {
	aiMove()
	// --- Moving along Y-axis ---
	if (ball.y < 0 || ball.y+ball.height > game.height) {
		// Beat with a "flooring" or "ceiling" of playing field
		ball.vY = -ball.vY
	}

	// --- Moving along X-axis ---
	if (ball.x < 0) {
		// Beat with a left wall
		ball.vX = -ball.vX
		player.scores++
	}

	if (ball.x+ball.width > game.width) {
		// Beat with a right wall
		ball.vX = -ball.vX
		ai.scores++
	}

	// Beat with a racket
	if ((collision(ai, ball)     && ball.vX<0) ||
		(collision(player, ball) && ball.vX>0)) {
		ball.vX = -ball.vX
	}

	// Increasing coordinates
	ball.x += ball.vX
	ball.y += ball.vY
}


/**
 * Gameplay method
 * 
 * @return {void}
 */
function play() {
	draw()
	update()
}


/**
 * Analyzes objects collision
 * 
 * @param  {object} A Object1
 * @param  {object} B Object2
 * 
 * @return {void}
 */
function collision(A, B) {
	if (A.x+A.width  > B.x &&
		A.x          < B.x+B.width &&
		A.y+A.height > B.y &&
		A.y 		 < B.y+B.height) {
			return true
	} else{
		return false
	}
}


/**
 * Method for movement AI-player.
 * Racket moves depending on movement of the ball, with a small delay.
 * 
 * @return {void} 
 */
function aiMove() {
	var y
	var vY = Math.abs(ball.vY) - 0.75

    if (ball.y < ai.y + ai.height / 2) {
        y = ai.y - vY
    }
    if (ball.y > ai.y + ai.height / 2) {
        y = ai.y + vY
    }
    if (10 < y && y < game.height - ai.height - 10) {
        ai.y = y
    }
}

// Calling to initialize method
init()