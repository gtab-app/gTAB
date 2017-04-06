// A global variable to hold information about the current game.
var game_global;

// This function resets 'game_global' to its default values.
var reset_game = function() {
	game_global = {
		// This is the take and break game, e.g. ."77".
		game: "",
		// This is the calculated game value up to 'game_value.length'.
		game_value: [],
		// This is an array of heaps. The value in each index is the size of the heap.
		board: [],
		// If set to false, the computer will not play.
		one_player: true,
	};
};

// We immediately call 'reset_game' to instantiate 'game_global' to its default values.
reset_game();

// This function is called when the player presses the start button.
var start = function() {
	var tb_input = document.getElementById("gameInput").value;
	var game = parse_game(tb_input);
	var csv_str = document.getElementById("boardInput").value;
	var board = make_board(csv_str);
	var one_player = document.getElementById("playerTwoInput").checked;
	if (game && board) {
		game_global.game = game;
		game_global.board = board;
		game_global.one_player = one_player;
		if(game_global.one_player) {
			var max_heap_size = Math.max.apply(null, board);
			if (max_heap_size) {
				var sequence = calculate_sequence(max_heap_size, game_global.game);
				if (sequence) {
					game_global.game_value = sequence;
				}
				else {
					console.error("Sequence was not defined correctly.");
					return;
				}
			}
		}
	}
	else {
		console.error("Something went wrong... please try again.");
		return;
	}
};

// Checks if the input for the game is valid, if so returns true, if not returns false.
var parse_game = function(tb_input) {
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
	return tb_input;
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

// Takes distance to calculate and the game definition and returns the sequence up to the
// largest heap value.
var calculate_sequence = function (max, tb_input) {
	// The first value in the sequence is always 0.
	var sequence = [0];
	var n = 1;

	// We only build the sequence out to the max heap size because we do not need any more.
	while (n <= max) {
		// We use a set to prevent duplicate values.
		var possible_values = new Set();
		for (var i = 0; i < tb_input.length; i++) {
			// The digit is the value in the game definition at the current index.
			var digit = parseInt(tb_input[i]);
			// k is the number of beans on which we are operating.
			var k = i + 1;

			// Whole heap.
			// We check the rightmost bit to make sure we can remove k beans from an entire heap.
			// Then we check if the current heap size is equal to k, which means we can remove the
			// entire current heap. So we add 0 as a possible value (as we take the heap to size 0)
			if (digit & 1 && n === k) {
				possible_values.add(sequence[0]);
			}

			// End of heap.
			// We check the middle bit to make sure we can remove k beans from the end of a heap.
			// Then we check if the current heap size minus k is greater than 0. If it isn't, then
			// we cannot remove from the end (which would result in a heap of negative size). We do
			// not check for equality because that is taking an entire heap. If the condition passes
			// we add the game value of the resulting heap size after removing k beans (n-k).
			if (digit & 2 && n - k > 0) {
				possible_values.add(sequence[n - k]);
			}

			// Middle of heap.
			// We check the third bit to make sure we can remove k beans from the middle of the
			// heap. We also verify that we would have at least 2 beans left over (n - k >= 2, or
			// n - k > 1 for integers).
			if (digit & 4 && n - k > 1) {
				var a, b;
				// We find all heap sizes a and b such that a + b = (n - k).
				for (var j = 1; j <= (n - k) / 2; j++) {
					a = j;
					b = (n - k) - a;
					// We XOR the nim values at sequence at a and b, and add them to the
					// possible_values set.
					possible_values.add(sequence[a] ^ sequence[b]);
				}
			}
		}

		var max;
		// We find the maximum game value in the set.
		possible_values.forEach(x => { last = x; });

		// If no max was found, the set is empty, and we add 0 to the sequence.
		if(!max) {
			sequence.push(0);
		}
		// If the max is the length of the possible_values set plus one, we know
		// we have all the natrual number from 0 to max, so we add max + 1 to 
		// our sequence.
		else if(max === possible_values.length + 1) {
			sequence.push(max + 1);
		}
		// Else we do mex by finding the smalling excluded game value and push
		// that to the sequence.
		else {
			for (var j = 0; j < max; j++) {
				if (!possible_values.has(j)) {
					sequence.push(j);
					break;
				}
			}
		}
		n++;
	}
	return sequence;
};