// A global variable to hold information about the current game.
var game_global;
// We immediately call 'reset_game' to instantiate 'game_global' to its default values.
reset_game();

// This function resets 'game_global' to its default values.
var reset_game = function() {
	game_global = {
		// This is the take and break game, e.g. ."77".
		game: "",
		// This is the calculated game value up to 'game_value.length'.
		game_value: [],
		// This is an array of heaps. The value in each index is the size of the heap.
		board: [],
		// If set to true, the computer will not play.
		two_player: false,
	};
};

// This function is called when the player presses the start button.
var start = function() {
	var tb_input = document.getElementById("gameInput").value;
	var is_valid = is_valid_game(tb_input);
	var csv_str = document.getElementById("boardInput").value;
	var heaps = make_board(csv_str);
};

// Checks if the input for the game is valid, if so returns true, if not returns false.
var is_valid_game = function(tb_input) {
	// If the input is the empty string we return false.
	if (tb_input.length === 0) {
		console.error("Invalid game: empty string.");
		return false;
	}
	// Ignores leading period.
	if (tb_input[0] === '.') {
		tb_input = tb_input.substring(1);
	}
	// If the value includes anything other than numbers 0-7 or is the empty string we return false.
	if ((/[^0-7]/).test(tb_input)) {
		console.error("Invalid game: numbers greater than 7 are not supported.");
		return false;
	}
	return true;
};

// Takes a comma separated string, and turns it into an array of ints.
var make_board = function(csv_str) {
	if(csv_str.length === 0) {
		console.error("Invalid board: no board defined.");
		return false;
	}
	// Checks if the array includes any illegal characters.
	if (/[^0-9, ]/.test(csv_str)) {
		console.error("Invalid board: string contains invalid characters.");
		return false;
	}
	var heaps = csv_str.split(',');
	heaps = heaps.map(function(v) {
		v = v.trim();
		if(v.length === 0) {
			return 0;
		}
		return parseInt( v );
	});
	if(heaps.length === 0) {
		console.error("Invalid board: heaps are empty.");
		return false;
	}
	return heaps;
};