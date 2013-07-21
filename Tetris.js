var randomColor = new Array('#CCCC33', '#CC3333', '#33CC80', '#3380CC', '#F5B800', '#CCFF33');

var curNextBlock = new Object();
var curNextColor;
var oldColor;
window.curBlock = new Object();

var gameState = false;
var score = 0;

var tickTime = 500;
window.NextAry = new Object();
var incCounter = 0;

var init = true;

$(document).ready(function(){
	highScore = parseInt($('#highScoreText').text());
	$('#highScoreText').text(numberWithCommas(highScore));

	createMainBoard();
	createNextBoard();
	newNextBlock();
	useNextBlock();

	$('#playButton').click(function(){
		if (!init)
			restart();
		if (gameState == false)
			startGame();
		init = false;
	})
	$('#pauseButton').click(function(){
		gameState = false;
	})
	$('#restartButton').click(function(){
		restart();
	})
});

$(document).bind('keydown',function(e){
	if (gameState) {
		if(e.keyCode == 37) {
			moveLeft();
		}
		if(e.keyCode == 38) {
			flipBlock();
		}
		if(e.keyCode == 39) {
			moveRight();
		}
		if(e.keyCode == 40) {
			moveBlockDown();
		}
	}
});

//Creates the table structurefor the main game board
function createMainBoard() {
	var tableStr = '';
	$('#tableBody').empty(); 

	for (var x = 0; x < 20; x++ ) {
		tableStr += '<tr class="' + x  + '">';
		for (var y = 0; y < 10; y++ ) {
			tableStr += '<td class="' + x + y + '"></td>';
		}
		tableStr += '</td>';
	}

	$('#tableBody').html(tableStr);
}

//Creates the blank table that the next block goes into
function createNextBoard() {
	tableStr = '';
	$('#nextTable').empty();

	for (var x = 0; x < 4; x++ ) {
		tableStr += '<tr class="' + x  + '">';
		for (var y = 0; y < 5; y++ ) 
			tableStr += '<td class="' + x + y + '"></td>';
		tableStr += '</td>';
	}
	$('#nextTable').html(tableStr);	
}

//Creates a new block and places it into the next block table
function newNextBlock() {
	$('#nextTable td').css('background', 'none');

	randBlock = Math.floor(Math.random()*7)
	switch(parseInt(randBlock)) {
		case 0:
			curNextBlock['array'] = new Array({'x': 0, 'y': 0}, {'x': 0, 'y': 1}, {'x': 0, 'y': 2}, {'x': 0, 'y': 3});
			curNextBlock['index'] = 0; //I
			curNextBlock['stage'] = 0;
			break;
		case 1:
			curNextBlock['array'] = new Array({'x': 1, 'y': 3}, {'x': 0, 'y': 3}, {'x': 0, 'y': 2}, {'x': 0, 'y': 1});
			curNextBlock['index'] = 1; //J
			curNextBlock['stage'] = 0;
			break;
		case 2:
			curNextBlock['array'] = new Array({'x': 1, 'y': 1}, {'x': 0, 'y': 1}, {'x': 0, 'y': 2}, {'x': 0, 'y': 3});
			curNextBlock['index'] = 2; //L
			curNextBlock['stage'] = 0;
			break;
		case 3:
			curNextBlock['array'] = new Array({'x': 0, 'y': 1}, {'x': 0, 'y': 2}, {'x': 1, 'y': 2}, {'x': 1, 'y': 1});
			curNextBlock['index'] = 3; //O
			curNextBlock['stage'] = 0;
			break;
		case 4:
			curNextBlock['array'] = new Array({'x': 0, 'y': 1}, {'x': 0, 'y': 2}, {'x': 1, 'y': 2}, {'x': 1, 'y': 3});
			curNextBlock['index'] = 4; //Z
			curNextBlock['stage'] = 0;
			break;
		case 5:
			curNextBlock['array'] = new Array({'x': 0, 'y': 3}, {'x': 0, 'y': 2}, {'x': 1, 'y': 2}, {'x': 1, 'y': 1});
			curNextBlock['index'] = 5; //S
			curNextBlock['stage'] = 0;
			break;
		case 6:
			curNextBlock['array'] = new Array({'x': 0, 'y': 1}, {'x': 0, 'y': 2}, {'x': 0, 'y': 3}, {'x': 1, 'y': 2});
			curNextBlock['index'] = 6; //T
			curNextBlock['stage'] = 0;
			break; 
	}

	window.NextAry = curNextBlock['array'];
	oldColor = curNextColor
	curNextColor = randomColor[Math.floor(Math.random()*6)];
	for (val in window.NextAry) {
		adjustedVal = String(window.NextAry[val]['x']) + String(window.NextAry[val]['y']);
		nVal = '#nextTable td.' + adjustedVal;
		col(nVal, curNextColor);
	}
}

//Takes the block from next block table and makes it the current block
//Then calls the function to create a new block in the next table
function useNextBlock() {
	if (incCounter == 3) {
		tickTime = parseInt(0.8 * tickTime);
		console.log(tickTime)
		incCounter = 0
	}
	else
		incCounter += 1;

	jQuery.extend(curBlock,curNextBlock);
	window.curAry = window.curBlock['array'];

	completeRow();
	for (val in window.curAry) {
		adjustedVal =  String(window.curAry[val]['x']) + String(window.curAry[val]['y'] + 3);
		xPlusOne = '#mainTable td.' + String(window.curAry[val]['x'] + 1) + String(window.curAry[val]['y'] + 3);
		window.curAry[val]['y'] = window.curAry[val]['y'] + 3

		nVal = '#mainTable td.' + adjustedVal;

		if (col(xPlusOne) != 'rgba(0, 0, 0, 0)' && col(xPlusOne) != 'rgb(0, 0, 0)') {
			t = {'x': window.curAry[val]['x']+1, 'y': window.curAry[val]['y']}

			over = true;
			for (v in curAry) {
				if (t['x'] === curAry[v]['x'] && t['y'] === curAry[v]['y']) 
					over = false;
			}

			if (over)
				gameOver();
		}
		col(nVal, curNextColor);
	}
	newNextBlock();
}

//Starts a brand new game
function startGame() {
	gameState = true;
	var refreshIntervalId = setInterval(function() {
		if (gameState == false)
			clearInterval(refreshIntervalId);
		else
			moveBlockDown();
	},tickTime);
}

//With 1 paramter returns the div ids color
//With 2 parameters it sets the div id to the color
function col(divId, color) {
	if (color)
		$(divId).css('background-color', color);
	else
		return $(divId).css('background-color');
}

//Moves the block down if it pases the checkBottom() test
function moveBlockDown() {
	if (checkBottom())
		useNextBlock();

	for (val in window.curAry) {
		y = window.curAry[val]['y'];
		x = window.curAry[val]['x']

		newColorID = "#mainTable td." + String(x + 1) + String(y);
		curColorID = "#mainTable td." + String(x) + String(y);
		minusColorID = "#mainTable td." + String(x) + String(y);

		moveBlockColor = col(curColorID);
		col(curColorID, 'black');
		window.curAry[val]['x'] += 1;
	}

	for (val in window.curAry) {
		newColorID = "#mainTable td." + String(window.curAry[val]['x']) + String(window.curAry[val]['y']);
		col(newColorID, moveBlockColor);
	}
}

//Check to see if you either hit the bottom of the board or a taken square
function checkBottom() {
	returnVal = false;
	yChecks = new Array()
	yVals = new Array();

	for (val in window.curAry) {
		checkBottomVal = "#mainTable td." + String(window.curAry[val]['x'] + 1) + String(window.curAry[val]['y'])
		if (window.curAry[val]['x'] == 19)
			returnVal = true;
		if (col(checkBottomVal) != 'rgba(0, 0, 0, 0)' && col(checkBottomVal) != 'rgb(0, 0, 0)')  {
			t = {'x': window.curAry[val]['x']+1, 'y': window.curAry[val]['y']}

			okay = false;
			for (v in curAry) {
				if (t['x'] === curAry[v]['x'] && t['y'] === curAry[v]['y']) 
					okay = true;
			}
			if (!okay) 
				return true;
		}
	}
}

//Moves the block to the left if it is allowed
function moveLeft() {
	var farLeft = 9;
	var oldColor;

	for (val in window.curAry) {
		if (window.curAry[val]['y'] < farLeft)
			farLeft = window.curAry[val]['y']
	}

	for (val in window.curAry) {
		if (window.curAry[val]['y'] == farLeft) {
			tempY = "#mainTable td." + String(window.curAry[val]['x']) + String(window.curAry[val]['y'] - 1)
			if (col(tempY) != 'rgba(0, 0, 0, 0)' && col(tempY) != 'rgb(0, 0, 0)') 
				return;
		} 
	}

	if (farLeft == 0)
		return;
	else {
		for (val in window.curAry) {
			oldY = "#mainTable td." + String(window.curAry[val]['x']) + String(window.curAry[val]['y']);
			oldColor = col(oldY);
			col(oldY, 'black');
			window.curAry[val]['y'] -= 1;
		}
		for (val in window.curAry) {
			newY = "#mainTable td." + String(window.curAry[val]['x']) + String(window.curAry[val]['y']);
			col(newY, oldColor)
		}
	}
} 

//Moves the block to the right if that move is allowed
function moveRight() {
	var farRight = 0;
	var oldColor;

	for (val in window.curAry) {
		if (window.curAry[val]['y'] > farRight)
			farRight = window.curAry[val]['y']
	}

	for (val in window.curAry) {
		if (window.curAry[val]['y'] == farRight) {
			tempY = "#mainTable td." + String(window.curAry[val]['x']) + String(window.curAry[val]['y'] + 1)
			if (col(tempY) != 'rgba(0, 0, 0, 0)' && col(tempY) != 'rgb(0, 0, 0)')  {
				return;
			}
		} 
	}

	
	if (farRight >= 9)
		return;
	else {
		for (val in window.curAry) {
			oldY = "#mainTable td." + String(window.curAry[val]['x']) + String(window.curAry[val]['y']);
			oldColor = col(oldY);
			col(oldY, 'black');
			window.curAry[val]['y'] += 1;
		}
		for (val in window.curAry) {
			newY = "#mainTable td." + String(window.curAry[val]['x']) + String(window.curAry[val]['y']);
			col(newY, oldColor)
		}
	}
} 

//Update the score by adding the paramter to it
//If reset is passed then the score goesback to 0
function updateScore(p) {
	if (p != 'reset') 
		score += p;
	else
		score = 0;
	$('#scoreText').text(numberWithCommas(score));
}

//Checks to see if the bottom row in the table is full
//If it is full delete it and move the rest of the rows down 1
function completeRow() {
	delRowAry = new Array();
	for (x = 0; x < 20; x++) {
		add = true;
		for (y = 0; y < 10; y++) {
			completeTemp = "#mainTable td." + String(x) + String(y);
			if (col(completeTemp) == 'rgba(0, 0, 0, 0)' || col(completeTemp) == 'rgb(0, 0, 0)')
				add = false; 
		}
		if (add) {
			delRowAry.push(x)
			updateScore(parseInt((1/tickTime) * 1000000));
		}
	}
	
	for (val in delRowAry) {
		for (x = 0; x < 10; x++) {
			newTemp = "#mainTable td." + String(delRowAry[val]) + String(x);
			col(newTemp, 'black')
		}
	}

	rowMoveObj = new Array();
	for (x = 0; x < 20; x++)
		rowMoveObj[x] = 0
	for (val in delRowAry) {
		for (x = 19; x >= 0; x--) {
			if (delRowAry[val] > x && $.inArray(x,delRowAry) == -1)
				if (!rowMoveObj[x])
					rowMoveObj[x] = 1;
				else
					rowMoveObj[x]++;
		}
	}

	for (var x = 19; x >= 0; x--) {
		if (rowMoveObj[x] != 0) {
			for (var y = 0; y < 10; y++) {
				curCell = "#mainTable td." + String(x) + String(y);				
				nextCell = "#mainTable td." + String(x + parseInt(rowMoveObj[x])) + String(y);
				col(nextCell, col(curCell));
			}
		}
	}
}

//Checks to see if you can flip the block and if you can then perform the flip
function flipBlock() {
	for (v in window.curAry) {
		nCol = "#mainTable td." + String(window.curAry[v]['x']) + String(window.curAry[v]['y']);
		oldCol = String(col(nCol));
		col(nCol, 'black');
	}

	switch(window.curBlock['index']) {
		case 0:
			if (window.curBlock['stage'] == 0) {
				window.curAry[0]['x'] += 2; window.curAry[1]['x'] += 1; window.curAry[3]['x'] -= 1
				window.curAry[0]['y'] += 2; window.curAry[1]['y'] += 1; window.curAry[3]['y'] -= 1
				window.curBlock['stage'] = 1;
			}
			else {
				window.curAry[0]['x'] -= 2;	window.curAry[1]['x'] -= 1;	window.curAry[3]['x'] += 1;
				window.curAry[0]['y'] -= 2; window.curAry[1]['y'] -= 1;	window.curAry[3]['y'] += 1;	
				window.curBlock['stage'] = 0;	
			}
			break;
		case 1:
			if (window.curBlock['stage'] == 0) {
				window.curAry[0]['x'] -= 2;window.curAry[1]['x'] -= 1;window.curAry[3]['x'] += 1; 
				window.curAry[0]['y'] += 0;window.curAry[1]['y'] -= 1;window.curAry[3]['y'] += 1;
				window.curBlock['stage'] = 1;
			}
			else if (window.curBlock['stage'] == 1) {
				window.curAry[0]['x'] -= 0;window.curAry[1]['x'] += 1;window.curAry[3]['x'] -= 1; 
				window.curAry[0]['y'] -= 2;window.curAry[1]['y'] -= 1;window.curAry[3]['y'] += 1;
				window.curBlock['stage'] = 2;
			}
			else if (window.curBlock['stage'] == 2) {
				window.curAry[0]['x'] += 2;window.curAry[1]['x'] += 1;window.curAry[3]['x'] -= 1; 
				window.curAry[0]['y'] -= 0;window.curAry[1]['y'] += 1;window.curAry[3]['y'] -= 1;
				window.curBlock['stage'] = 3;
			}
			else if (window.curBlock['stage'] == 3) {
				window.curAry[0]['x'] += 0;window.curAry[1]['x'] -= 1;window.curAry[3]['x'] += 1; 
				window.curAry[0]['y'] += 2;window.curAry[1]['y'] += 1;window.curAry[3]['y'] -= 1;
				window.curBlock['stage'] = 0;
			}
			break	
		case 2:
			if (window.curBlock['stage'] == 0) {
				window.curAry[0]['x'] += 0;window.curAry[1]['x'] += 1;window.curAry[3]['x'] -= 1; 
				window.curAry[0]['y'] += 2;window.curAry[1]['y'] += 1;window.curAry[3]['y'] -= 1;
				window.curBlock['stage'] = 1;
			}
			else if (window.curBlock['stage'] == 1) {
				window.curAry[0]['x'] -= 2;window.curAry[1]['x'] -= 1;window.curAry[3]['x'] += 1; 
				window.curAry[0]['y'] += 0;window.curAry[1]['y'] += 1;window.curAry[3]['y'] -= 1;
				window.curBlock['stage'] = 2;
			}
			else if (window.curBlock['stage'] == 2) {
				window.curAry[0]['x'] += 0;window.curAry[1]['x'] -= 1;window.curAry[3]['x'] += 1; 
				window.curAry[0]['y'] -= 2;window.curAry[1]['y'] -= 1;window.curAry[3]['y'] += 1;
				window.curBlock['stage'] = 3;
			}
			else if (window.curBlock['stage'] == 3) {
				window.curAry[0]['x'] += 2;window.curAry[1]['x'] += 1;window.curAry[3]['x'] -= 1; 
				window.curAry[0]['y'] += 0;window.curAry[1]['y'] -= 1;window.curAry[3]['y'] += 1;
				window.curBlock['stage'] = 0;
			}
			break
		case 4:
			if (window.curBlock['stage'] == 0) {
				window.curAry[0]['x'] += 1;window.curAry[2]['x'] -= 1;window.curAry[3]['x'] -= 2; 
				window.curAry[0]['y'] += 1;window.curAry[2]['y'] += 1;window.curAry[3]['y'] += 0;
				window.curBlock['stage'] = 1;
			}
			else if (window.curBlock['stage'] == 1) {
				window.curAry[0]['x'] -= 1;window.curAry[2]['x'] -= 1;window.curAry[3]['x'] += 0; 
				window.curAry[0]['y'] += 1;window.curAry[2]['y'] -= 1;window.curAry[3]['y'] -= 2;
				window.curBlock['stage'] = 2;
			}
			else if (window.curBlock['stage'] == 2) {
				window.curAry[0]['x'] -= 1;window.curAry[2]['x'] += 1;window.curAry[3]['x'] += 2; 
				window.curAry[0]['y'] -= 1;window.curAry[2]['y'] -= 1;window.curAry[3]['y'] += 0;
				window.curBlock['stage'] = 3;
			}
			else if (window.curBlock['stage'] == 3) {
				window.curAry[0]['x'] += 1;window.curAry[2]['x'] += 1;window.curAry[3]['x'] -= 0; 
				window.curAry[0]['y'] -= 1;window.curAry[2]['y'] += 1;window.curAry[3]['y'] += 2;
				window.curBlock['stage'] = 0;
			}
			break	
		case 5:
			if (window.curBlock['stage'] == 0) {
				window.curAry[3]['x'] -= 2; 
				window.curAry[3]['y'] += 1;window.curAry[2]['y'] += 1; 
				window.curBlock['stage'] = 1;
			}
			else if (window.curBlock['stage'] == 1) {
				window.curAry[0]['x'] -= 1; window.curAry[2]['x'] -= 1; 
				window.curAry[2]['y'] -= 2;
				window.curBlock['stage'] = 2;
			}
			else if (window.curBlock['stage'] == 2) {
				window.curAry[0]['x'] += 1; window.curAry[2]['x'] += 1; 
				window.curAry[2]['y'] += 2;
				window.curBlock['stage'] = 3;
			}
			else if (window.curBlock['stage'] == 3) {
				window.curAry[3]['x'] += 2; 
				window.curAry[3]['y'] -= 1;window.curAry[2]['y'] -= 1; 
				window.curBlock['stage'] = 0;
			}
			break;
		case 6:
			if (window.curBlock['stage'] == 0) {
				window.curAry[0]['x'] += 1;window.curAry[2]['x'] -= 1;window.curAry[3]['x'] -= 1; 
				window.curAry[0]['y'] += 1;window.curAry[2]['y'] -= 1;window.curAry[3]['y'] += 1;
				window.curBlock['stage'] = 1;
			}
			else if (window.curBlock['stage'] == 1) {
				window.curAry[0]['x'] -= 1;window.curAry[2]['x'] += 1;window.curAry[3]['x'] -= 1; 
				window.curAry[0]['y'] += 1;window.curAry[2]['y'] -= 1;window.curAry[3]['y'] -= 1;
				window.curBlock['stage'] = 2;
			}
			else if (window.curBlock['stage'] == 2) {
				window.curAry[0]['x'] -= 1;window.curAry[2]['x'] += 1;window.curAry[3]['x'] += 1; 
				window.curAry[0]['y'] -= 1;window.curAry[2]['y'] += 1;window.curAry[3]['y'] -= 1;
				window.curBlock['stage'] = 3;
			}
			else if (window.curBlock['stage'] == 3) {
				window.curAry[0]['x'] += 1;window.curAry[2]['x'] -= 1;window.curAry[3]['x'] += 1; 
				window.curAry[0]['y'] -= 1;window.curAry[2]['y'] += 1;window.curAry[3]['y'] += 1;
				window.curBlock['stage'] = 0;
			}
			break

	}
	redrawBlock(oldCol);
}

//
function redrawBlock(color) {
	for (val in window.curAry) {
		newColorID = "#mainTable td." + String(window.curAry[val]['x']) + String(window.curAry[val]['y']);
		col(newColorID, color);
	}
}

//Game ended
function gameOver() {
	$('#gameOverCont').fadeIn('slow');
	gameState = false;
}

function restart() {
	gameState = false;
	updateScore('reset');
	createMainBoard();
	createNextBoard();
	newNextBlock();
	useNextBlock();	
}

//Utility function that ads commas to the number passed and returns the string
function numberWithCommas(n) {
    var parts=n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}