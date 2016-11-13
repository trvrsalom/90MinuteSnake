var BOARD_WIDTH = 20;
var BOARD_HEIGHT = 30;
var CELL_SIZE = 15;
var REFRESH_RATE_MILLIS = 350;
var GAME_LOOP = null;
var FOOD_CHANCE = 0.1;
var MAX_FOOD = 10;
var MIN_FOOD = 1;
var SNAKE_DIR = {
	NORTH : 0,
	EAST : 1,
	SOUTH : 2,
	WEST : 3
};

var snakeDelta = 0;
var snakeDir = 0;
var snake = [
	{x: BOARD_WIDTH/2, y: BOARD_HEIGHT/2}
];
var food = [
	{x: BOARD_WIDTH/2, y: 10},
	{x: 15, y: 20}
];

var genGrid = function() {
	$(".losescreen").hide();
	$(".screen").height((BOARD_HEIGHT*CELL_SIZE) + "px");
	$(".screen").width((BOARD_WIDTH*CELL_SIZE) + "px");
	var grid = $(".grid");
	for(var r = 0; r < BOARD_HEIGHT; r++) {
		var tr = $(".grid").append("<tr id='ROW_" + r + "'></tr>");
		for(var c = 0; c < BOARD_WIDTH; c++) {
			$("#ROW_" + r).append("<td class='gamecell' cellspacing='0' cellpadding='0' id='ROW_" + r + "_COL_" + c + "'></td>");
		}
	}
	$(".gamecell").css("width", CELL_SIZE + "px");
	$(".gamecell").css("height", CELL_SIZE + "px");
};

var resetBoard = function() {
	$(".gamecell").css("background-color", "#34495e");
};

var placeFood = function() {
	var foodChance = Math.random();
	if((foodChance < FOOD_CHANCE && food.length < MAX_FOOD) || food.length < MIN_FOOD) {
		food.push({
			x: Math.floor(Math.random() * BOARD_WIDTH),
			y: Math.floor(Math.random() * BOARD_HEIGHT)
		});
	}
};

var paintBoard = function() {
	for(var i = 0; i < food.length; i++) {
		$("#ROW_" + food[i].y + "_COL_" + food[i].x).css("background-color", "#e67e22");
	}
	for(i = 0; i < snake.length; i++) {
		$("#ROW_" + snake[i].y + "_COL_" + snake[i].x).css("background-color", "#2ecc71");
	}
};

var lose = function() {
	clearInterval(GAME_LOOP);
	$(".scorebox").html("Score: " + (snake.length * 50));
	$(".losescreen").fadeIn(1500);
	$(".cover").fadeIn(1000);
};

var checkLose = function() {
	if(snake[0].x < 0 || snake[0].x > BOARD_WIDTH || snake[0].y < 0 || snake[0].y > BOARD_HEIGHT) lose();
	for(var i = 1; i < snake.length; i++) if(snake[0].x == snake[i].x && snake[0].y == snake[i].y) lose();
};

var update = function() {
	resetBoard();
	paintBoard();
	placeFood();
	checkLose();
	var snakeHead = {x: snake[0].x, y: snake[0].y};
	for(var i = 0; i < food.length; i++) {
		if(food[i].x == snakeHead.x && food[i].y == snakeHead.y) {
			snakeDelta++;
			food.splice(i, 1);
		}
	}
	switch(snakeDir) {
		case SNAKE_DIR.NORTH:
			snakeHead.y--;
			break;
		case SNAKE_DIR.SOUTH:
			snakeHead.y++;
			break;
		case SNAKE_DIR.EAST:
			snakeHead.x++;
			break;
		case SNAKE_DIR.WEST:
			snakeHead.x--;
			break;
		default:
			break;
	}
	while(snakeDelta > 0) {
		snake.push({x: 0, y: 0});
		snakeDelta--;
	}
	for(i = snake.length - 1; i >= 1 && i !== 0; i--) {
		snake[i] = snake[i-1];
	}
	snake[0] = {x: snakeHead.x, y: snakeHead.y};
};

$('html').keydown(function(e) {
	switch(e.which) {
		case 38:
			if(snakeDir == SNAKE_DIR.SOUTH) break;
			snakeDir = SNAKE_DIR.NORTH;
			break;
		case 40:
			if(snakeDir == SNAKE_DIR.NORTH) break;
			snakeDir = SNAKE_DIR.SOUTH;
			break;
		case 39:
			if(snakeDir == SNAKE_DIR.WEST) break;
			snakeDir = SNAKE_DIR.EAST;
			break;
		case 37:
			if(snakeDir == SNAKE_DIR.EAST) break;
			snakeDir = SNAKE_DIR.WEST;
			break;
		default: break;
	}
});
genGrid();
GAME_LOOP = setInterval(update, REFRESH_RATE_MILLIS);
