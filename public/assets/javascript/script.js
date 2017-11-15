
$(document).ready(function() {

// Global Variables
// ----------------------------------------------------------------------------------------------

    var wordOptions = [];
    var usedOptions = [];
    var selectedWord = [];
    var lettersInWord = [];
    var userGuess = [];
    var incorrectGuesses = [];
    var numBlanks = 0;
    var spaceChar = "<span class='space'></span>";
    var currentURL = window.location.origin;

        // game counters
        var wins = 0;
        var losses = 0;
        var guesses = 10;
        var gameOver = false;

        // map object
        var map;

        // geolocation of selected word
        var placeCoordsLat;
        var placeCoordsLng;


// Functions
// ----------------------------------------------------------------------------------------------

    // initializes google map
    var initMap = (locationLat, locationLng) => {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat:parseFloat(locationLat), lng: parseFloat(locationLng)},
            zoom: 1
        });
    }

    // gets coordinates for the selectedWord
    var getCoordinates = (place) => {

        var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + place + "&key=" + geocodeKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {

            placeCoordsLat = response.results[0].geometry.location.lat;
            placeCoordsLng = response.results[0].geometry.location.lng;
            console.log("Lat: " + placeCoordsLat + " Lng: " + placeCoordsLng);

            // initialize map with selectedWord Coords
            initMap(placeCoordsLat, placeCoordsLng);
        });
    }

    var removeSpaces = function (char) {

        if (char === spaceChar) {
        return " ";
        } else {
        return char;
        }
    }

    var setSelectedWord = () => {

        if (wordOptions.length === 0) {
            wordOptions = usedOptions;
            alert("Congratulations!!!!!!")
        }
        selectedWord = wordOptions.splice(Math.floor(Math.random() * wordOptions.length), 1)[0];
        usedOptions.push(selectedWord)

        // selectedWord = wordOptions[Math.floor(Math.random() * wordOptions.length)];
        lettersInWord = selectedWord.split("");
        numBlanks = lettersInWord.length;

        // testing/debugging
        console.log("Selected Word: " + selectedWord + "\nLetters in Word: " + lettersInWord + "\nnumber of blanks: " + numBlanks);;
    }


    var startGame = () => {

        $("#wrongGuesses").empty();
        gameOver = false;
        guesses = 10;
        incorrectGuesses = [];
        userGuess = [];

        setSelectedWord();
        

        for(i=0; i<numBlanks; i++) {
            if(lettersInWord[i] == " ") {
                userGuess.push(spaceChar);
            } else {
                userGuess.push("_");
            }
        }

        document.getElementById("guesses").innerHTML = userGuess.join(" ");
        document.getElementById("wrongGuesses").innerHTML = incorrectGuesses;
        document.getElementById("guessesLeft").innerHTML = guesses;
        
    }

    var checkLetter = (letter) => {
        var isLetterInWord = false;
        var letterAlreadyGuessed = false;
        
        for (var i = 0; i<numBlanks; i++) {
            if (selectedWord[i].toUpperCase() === letter.toUpperCase()) {
                isLetterInWord = true;
            }
        }

        if (isLetterInWord) {
            for (var j = 0; j<numBlanks; j++) {
                if(selectedWord[j].toLowerCase() === letter) {
                    userGuess[j] = selectedWord[j];
                }
            }
        } else {

            for (var k = 0; k<incorrectGuesses.length; k++) {
                if (incorrectGuesses[k] == letter) {
                    console.log("already used");
                    letterAlreadyGuessed = true;
                }  
            }

            if (!letterAlreadyGuessed) {
                guesses--;
                incorrectGuesses.push(letter);
            }  
        }
    }

    var roundComplete = () => {

        document.getElementById("guesses").innerHTML = userGuess.join(" ");
        document.getElementById("wrongGuesses").innerHTML = incorrectGuesses.join(" ");
        document.getElementById("guessesLeft").innerHTML = guesses;

        var onlyLetters = userGuess.map(removeSpaces);

        if(lettersInWord.toString() === onlyLetters.toString()) {
            wins++
            alert("you win");
            gameOver = true;
        }

        if(guessesLeft === 0) {
            losses++;
            alert("you lose");
            gameOver = true;
        }
    }


// Main Process
// ----------------------------------------------------------------------------------------------

    $.get("/options", function(data) {
            for (var i=0; i<data.length; i++) {
                console.log(data[i].countryName)
                wordOptions.push(data[i].countryName)
            }
        }).then(function() {
            startGame();
            getCoordinates(selectedWord);
    });

    document.onkeyup = (event) => {

        if(event.keyCode >= 65 && event.keyCode <= 90) {
            var letterGuessed = event.key.toLowerCase();
            checkLetter(letterGuessed);
            roundComplete();
        }
        if ((event.keyCode === 13 && gameOver) || (event.keyCode === 32 && gameOver)) {
            // guessesLeft = 10;
            startGame();
        }
    }

});