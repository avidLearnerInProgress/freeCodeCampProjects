//to set cell 
var ui = {}; //ui related methods and attributes
ui.insertAt = function(indx, symbol) {
    var board = $('.cell'); //returns array with matching queries from cell 0
    var targetCell = $(board[indx]);
    if (!targetCell.hasClass('occupied')) {
        targetCell.html(symbol);
        targetCell.css({
            color: symbol == "X" ? "green" : "red"
        });
        targetCell.addClass('occupied');
    }
};
// To store all items accessible to all functions
var globals = {};
var AIAction = function(pos) {
    // public : the position on the board that the action would put the letter on
    this.movePosition = pos;
    //public : the minimax value of the state that the action leads to when applied
    this.minimaxVal = 0;
    this.applyTo = function(state) {
        var next = new State(state);
        //put the letter on the board
        next.board[this.movePosition] = state.turn;
        if (state.turn === "O") next.oMovesCount++;
        next.advanceTurn();
        return next;
    }
};
/*
 * public static function that defines a rule for sorting AIActions in ascending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.ASCENDING = function(firstAction, secondAction) {
    if (firstAction.minimaxVal < secondAction.minimaxVal) return -1; //indicates that firstAction goes before secondAction
    else if (firstAction.minimaxVal > secondAction.minimaxVal) return 1; //indicates that secondAction goes before firstAction
    else return 0; //indicates a tie
} //end action.ASCENDING
AIAction.DESCENDING = function(firstAction, secondAction) {
    if (firstAction.minimaxVal > secondAction.minimaxVal) return -1; //indicates that firstAction goes before secondAction
    else if (firstAction.minimaxVal < secondAction.minimaxVal) return 1; //indicates that secondAction goes before firstAction
    else return 0; //indicates a tie
}
//ai player
var AI = function(level) {
    //private var level of intelligence the player has
    var levelOfIntelligence = level;
    //private var game the player is playing
    var game = {};
    //public funtion to set game which ai player will play.
    this.plays = function(_game) {
        game = _game;
    };

    function miniMax(state) { //recursive
        if (state.isTerminal()) { //base case
            if (state.result === "X-won") {
                // the x player won
                return (10 - state.oMovesCount);
            } else if (state.result === "O-won") {
                //the x player lost
                return (-10 + state.oMovesCount);
            } else {
                //it's a draw
                return 0;
            }
        } else {
            var stateScore; //stores minimax value 
            //X-> maximize initialise to val smaller than any possible score
            if (state.turn === "X") stateScore = -1000;
            else
                //O-> minimize initialise to val greater than any possible score
                stateScore = 1000;
            var availablePositions = state.emptyCells();
            //enumerate all the empty positions on board from availablePositions
            //map called recursively on all the empty cells
            var availableNextStates = availablePositions.map(function(pos) { //recursive only for depth 1
                var action = new AIAction(pos);
                var nextState = action.applyTo(state);
                return nextState;
                //var next = new State(state);   
                //next.board[pos] = state.turn;    //set "O" on the empty cell
                //next.advanceTurn();
                //return next;
            });
            //minimax val for all available next states
            availableNextStates.forEach(function(nextState) { //recursive for n-depth until base condition
                var nextScore = miniMax(nextState); //recursion 
                if (state.turn === "X") {
                    // X wants to maximize --> update stateScore iff nextScore is larger
                    if (nextScore > stateScore) stateScore = nextScore;
                } else {
                    // O wants to minimize --> update stateScore iff nextScore is smaller
                    if (nextScore < stateScore) stateScore = nextScore;
                }
            });
            return stateScore;
        } //end else  
    } //end miniMax()
    function takeABlindMove(turn) {
        var available = game.currentState.emptyCells();
        var randomCell = available[Math.floor(Math.random() * available.length)]; //select random index from the set of empty cells   
        var action = new AIAction(randomCell);
        var next = action.applyTo(game.currentState);
        ui.insertAt(randomCell, turn);
        //game.currentState.board[randomCell] = turn;
        //game.currentState.advanceTurn();
        //game.advanceTo(game.currentState);
        game.advanceTo(next);
        //console.log(game);
        //console.log(game.currentState);
    }

    function takeAMasterMove(turn) {
        var available = game.currentState.emptyCells();
        //enumerate and calculate the score for each avaialable actions to the ai player
        var availableActions = available.map(function(pos) {
            var action = new AIAction(pos); //create the action object
            var next = action.applyTo(game.currentState); //get next state by applying the action
            action.minimaxVal = miniMax(next); //calculate and set the action's minmax value
            return action;
        });
        //sort the enumerated actions list by score
        if (turn === "X")
            // X --> maximizes, hence sort list in descending order 
            //get maximum minimax at first
            availableActions.sort(AIAction.DESCENDING);
        else
            // O --> minimizes, hence sort list in descending order 
            //get minimum minimax at first
            availableActions.sort(AIAction.ASCENDING);
        var chosenAction = availableActions[0];
        var next = chosenAction.applyTo(game.currentState);
        ui.insertAt(chosenAction.movePosition, turn);
        game.advanceTo(next);
        console.log(availableActions);
    }
    //notify ai player that it is it's turn
    this.notify = function(turn) {
        switch (levelOfIntelligence) {
            case "blind":
                takeABlindMove(turn);
                break;
            case "master":
                takeAMasterMove(turn);
                break;
        }
    };
};
//class to change players
var State = function(oldState) {
    this.turn = "";
    this.board = [];
    this.oMovesCount = 0;
    //object construction
    if (typeof oldState !== "undefined") {
        // if the state is constructed using a copy of another state
        var len = oldState.board.length;
        this.board = new Array(len);
        for (var itr = 0; itr < len; itr++) {
            this.board[itr] = oldState.board[itr];
        }
        this.oMovesCount = oldState.oMovesCount;
        this.result = oldState.result;
        this.turn = oldState.turn;
    }
    this.advanceTurn = function() { //change player
        this.turn = this.turn === "X" ? "O" : "X";
    };
    this.result = "still running";
    this.isTerminal = function() { //check if goal is reached
        var B = this.board;
        /*
        0 1 2
        3 4 5 
        6 7 8
        */
        //identical rows
        for (var i = 0; i <= 6; i = i + 3) {
            if (B[i] !== "E" && B[i] === B[i + 1] && B[i + 1] == B[i + 2]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        }
        //identical columns
        for (var i = 0; i <= 2; i++) {
            if (B[i] !== "E" && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        }
        /*identical diagonals
            check the diagram
            i takes 0 for first diagonal and 2 for second diagonal
            j is initialised to 4 because for left diagonal it is incremented in steps of 4(0,4,8)
            j-2 for second diagonal as second diagonal is incremented in steps of 2(2,4,6)
        */
        for (var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
            if (B[i] !== "E" && B[i] == B[i + j] && B[i + j] === B[i + 2 * j]) {
                this.result = B[i] + "-won"; //update the state result
                return true;
            }
        };
        //check for draw
        var available = this.emptyCells();
        if (available.length == 0) {
            //the game is draw
            this.result = "draw"; //update the state result
            return true;
        } else {
            return false;
        }
    };
    this.emptyCells = function() { //returns array of empty cells
        var indxs = [];
        for (var itr = 0; itr < 9; itr++) {
            if (this.board[itr] === "E") {
                indxs.push(itr);
            }
        }
        return indxs;
    };
};
var GameManager = function(autoPlayer) {
    this.ai = autoPlayer; //which ai is playing the game
    //everytime we create an GameManager object we create an State object too.
    this.currentState = new State();
    //"E" stands for empty board cell
    this.currentState.board = ["E", "E", "E", "E", "E", "E", "E", "E", "E"];
    this.currentState.turn = "X"; //X plays first
    this.status = "beginning";
    this.start = function() {
        if (this.status = "beginning") {
            this.status = "running";
        }
    }
    this.advanceTo = function(_state) { //check if someone wins
        this.currentState = _state; //updating currentState everytime a new State() is created
        if (_state.isTerminal()) { //boolean that checks the board
            this.status = "ended"; //the game has ended
            if (_state.result === "X-won") {
                $("#test").text("X-won");
            } else if (_state.result === "O-won") {
                $("#test").text("O-won");
            } else {
                $("#test").text("it's a draw");
            }
        } else {
            //the game is still running
            if (this.currentState.turn === "X") {} else {
                //notify the AI player its turn has come up
                this.ai.notify("O");
            }
        }
    };
};
//Jquery functions for cells and start buttons
//toggle button
$(".btn-lg").each(function() {
    var $this = $(this);
    $this.click(function() {
        $('.difficultyLevel').toggleClass('difficultyLevel');
        $('.disabled').toggleClass('disabled');
        $this.toggleClass('difficultyLevel');
        $this.toggleClass('disabled');
    });
});
//catch the event once start is clicked
$(".start").click(function() {
    var selectedDifficulty = $('.difficultyLevel').attr('id');
    if (typeof selectedDifficulty !== "undefined") {
        console.log(selectedDifficulty);
        var aiPlayer = new AI(selectedDifficulty); //init ai player
        globals.game = new GameManager(aiPlayer); //start the game
        aiPlayer.plays(globals.game); //change status to running from beginning
        globals.game.start(); //use public func plays to set game
        $(this).addClass('selected');
    }
});
// for each cell catch the onclick
$(".cell").each(function() {
    var $this = $(this);
    $this.click(function() {
        if (globals.game.status === "running" && !$this.hasClass('occupied')) {
            //hasClass() - check whether the clicked cell has class occupied
            //i.e. whether the cell is already occupied
            var indx = parseInt($this.data("indx")); //gets data from class data-indx
            var next = globals.game.currentState; //creates new state for next turn
            //_this.text(next.turn);  //set X initially
            //next.board[indx] = next.turn; //assign new turn on the board
            next.board[indx] = "X";
            ui.insertAt(indx, "X");
            next.advanceTurn();
            //_this.addClass("occupied"); //set cell class as occupied     
            //changes this.turn property and then check someone wins in advanceTo()
            globals.game.advanceTo(next);
        }
    });
});
$("#restart").click(function() {
    $(".cell").each(function() {
        $(this).text("");
        $(this).removeClass('occupied');
        $(this).removeClass('selected');
    });
    globals.game.currentState.turn = "";
    globals.game.currentState.board = ["E", "E", "E", "E", "E", "E", "E", "E", "E"];
    $(".start").click();
    $("#test").remove();
});