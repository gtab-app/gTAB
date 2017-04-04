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