var app = angular.module("simonApp", []);

app.controller("simonController", function($scope, $interval, $timeout) {

  $scope.game = {
    score: 0,
    steps: 1,
    possMoves: ["red", "blue", "green", "yellow", "grey"],
    currentGame: [],
    playerMoves: [],
    strictMode: 'OFF',
    isActive: false,
  };

  $scope.newGame = function() {
    $scope.game.isActive = true;
    $scope.game.score = 0;
    $scope.game.steps = 1;
    $scope.game.currentGame = [];
    $scope.game.playerMoves = [];
    $scope.red = 'black';
    $scope.blue = 'black';
    $scope.green = 'black';
    $scope.yellow = 'black';
    $scope.grey = 'black';
    $scope.clearPlayer();
    $scope.generateMove();
  };

  $scope.generateMove = function() {
    $scope.game.currentGame.push($scope.game.possMoves[(Math.floor(Math.random() * 5))]);
    console.log($scope.game.currentGame);
    $scope.showMoves();
  };

  $scope.showMoves = function() {
    var i = 0;
    var moves = $interval(function() {
      $scope.playGame($scope.game.currentGame[i]);
      i++;
      if (i >= $scope.game.currentGame.length) {
        $interval.cancel(moves);
      }
    }, 1000)
    $scope.clearPlayer();
  };

  $scope.playGame = function(id) {
    $scope.playSound(id);
    if (id === "red") {
      $scope.red = 'red';
      $timeout(function() {
        $scope.red = 'black';
      }, 500);

    } else if (id === "blue") {
      $scope.blue = 'blue';
      $timeout(function() {
        $scope.blue = 'black';
      }, 500);
    } else if (id === "green") {
      $scope.green = 'green';
      $timeout(function() {
        $scope.green = 'black';
      }, 500);
    } else if (id === "yellow") {
      $scope.yellow = 'yellow';
      $timeout(function() {
        $scope.yellow = 'black';
      }, 500);
    } else if (id === "grey") {
      $scope.grey = 'grey';
      $timeout(function() {
        $scope.grey = 'black';
      }, 500);
    }

  };

  $scope.clearPlayer = function() {
    $scope.game.playerMoves = [];
  };

  $scope.addToPlayer = function(id) {
    if ($scope.game.isActive) {
      $scope.playSound(id);
      $scope.game.playerMoves.push(id);
      console.log($scope.game.playerMoves);
      $scope.playerTurn(id);
    } else {
      alert('You must press click to play first!')
    };

  };

  $scope.playerTurn = function(x) {
    if ($scope.game.playerMoves[$scope.game.playerMoves.length - 1] !== $scope.game.currentGame[$scope.game.playerMoves.length - 1]) {
      if ($scope.game.strictMode === "ON") {
        alert('Wrong move! Game over.');
        $scope.reset();
      } else {
        alert('Wrong move! Try again!');
        $scope.showMoves();
      }
    } else {
      var check = $scope.game.playerMoves.length === $scope.game.currentGame.length;
      if (check) {
        $scope.game.score++;
        console.log('Good Move!');
        if ($scope.game.score === 20) {
          alert("you won");
          $scope.game.isActive = false;
        } else {
          alert('next round');
          $scope.nextRound();
        }
      }
    }
  };

  $scope.nextRound = function() {
    $scope.game.steps++;
    $scope.generateMove();
  };

  $scope.playSound = function(id) {
    var sound = document.getElementById('audio' + id);
    sound.play();
  };

  $scope.reset = function() {
    $scope.game.isActive = false;
    $scope.game.score = 0;
    $scope.game.steps = 1;
    $scope.game.currentGame = [];
    $scope.game.playerMoves = [];
    $scope.game.strictMode = 'OFF';
    $scope.red = 'black';
    $scope.blue = 'black';
    $scope.green = 'black';
    $scope.yellow = 'black';
    $scope.grey = 'black';
    $scope.clearPlayer();
    alert("Game has been reset")
  };
  
  $scope.switchMode = function() {
    if($scope.game.isActive === false) {
      if($scope.game.strictMode === "OFF") {
        $scope.game.strictMode = "ON";
      } else if($scope.game.strictMode === "ON") {
        $scope.game.strictMode = "OFF";
      }
    } else {
      alert("You can't change the mode during the game!")
    }
  };

});