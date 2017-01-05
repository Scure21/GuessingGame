function newGame(){
    return new Game();
}

function generateWinningNumber(min,max){
    var min = 1,
    max = 100;
    return Math.floor(Math.random()*(max-min + 1))+min;
}

function shuffle(array){
    var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber.call(this);
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}
Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber;
}
Game.prototype.playersGuessSubmission = function(num){
    if(typeof num != 'number' || num <1 || num > 100){throw "That is an invalid guess."}
    this.playersGuess = num;
    return Game.prototype.checkGuess.call(this);
}
Game.prototype.checkGuess = function(guess){
    var guess = 0;
        if(this.pastGuesses.includes(this.playersGuess)){
            return "You have already guessed that number.";
        }
        if(this.playersGuess === this.winningNumber){
            $("hint", "submit").prop("disabled", true);
            $("subtitle").text("Press the Reset button to play again!");
            return 'You Win!';
        }else{
            this.pastGuesses.push(this.playersGuess);
            $('#guesses li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length === 5){
                $("#hint, #submit").prop("disabled", true);
                $("#subtitle").text("Press the Reset button to play again!");
                return 'You Lose.';
            }else {
                var diff = this.difference();
                if(this.isLower()){
                    $("#subtitle").text("Guess higher!");
                }else{
                    $("#subtitle").text("Guess lower!");
                }
                if(diff < 10) return'You\'re burning up!';
                else if(diff < 25) return'You\'re lukewarm.';
                else if(diff < 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
Game.prototype.provideHint = function(){
    var array = [this.winningNumber,generateWinningNumber(),generateWinningNumber()];
    return shuffle(array);
}

//event handler
function makeAGuess(newGame){
    var guess = $("#player-input").val();
    $("#player-input").val("");
    var output = newGame.playersGuessSubmission(parseInt(guess,10));
    $("#title").text(output);
}
$("document").ready(function(){
    var newGame = new Game();

     $('#submit').click(function(e) {
       makeAGuess(newGame);
    })

    $("#player-input").keypress(function(event){
        if(event.which == 13){
            makeAGuess(newGame);
        }
    });
    $('#hint').click(function(){
        var hints = newGame.provideHint();
        $('#title').text('The winning number may be one of these: '+hints[0]+', '+hints[1]+', '+hints[2]);
    });
     $('#reset').click(function() {
        
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);
        newGame = new Game();
    })
});