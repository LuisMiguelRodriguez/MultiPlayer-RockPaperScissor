  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAQwcYJ5ogVeX3ksYefOvfaqDX9fU12RKM",
    authDomain: "rps-multi-player-633b8.firebaseapp.com",
    databaseURL: "https://rps-multi-player-633b8.firebaseio.com",
    projectId: "rps-multi-player-633b8",
    storageBucket: "",
    messagingSenderId: "438816216846"
  };

  firebase.initializeApp(config);

  var database = firebase.database();
  var playerNum;

  //Runs only once checking to see if there are any players in the database
  // and then assigns them a player number
  firebase.database().ref('players').once("value", function(snapshot) {
    //Console testing
    console.log(snapshot.numChildren());

      // If there are 2 players or more in the database change user input on document
      // to a message Stating game is in session
    if (snapshot.numChildren() >= 2){
      $('#top').html('<h3>Sorry there is a game in session ');

      firebase.database().ref('players/2').on("value", function(snapshot){
        console.log(snapshot.val());

        $('#player2-name').html('<h1>'+ snapshot.val().name + '</h2>');

        $('#player2-stats').html(
            '<h4>Wins: '+snapshot.val().wins+'</h4></h4>Losses: '+ snapshot.val().losses + '</h4>'
          );
      });

      // If there are 0 players give the first player a global variable
      // that marks them on as player number 1
    } else if(snapshot.numChildren() == 0){

      playerNum = 1;

      // If there are 0 players give the first player a global variable
      // that marks them on as player number 2
    }else if (snapshot.numChildren() == 1){

      playerNum = 2;
      database.ref('players/turn/').set(1);

    }
  });

  $(document).ready(function() {

    //If any players exits show there data
    firebase.database().ref('players/1').on("value", function(snapshot){
      console.log(snapshot.val());

      $('#player1-name').html('<h1>'+ snapshot.val().name + '</h2>');

      $('#player1-stats').html(
          '<h4>Wins: '+snapshot.val().wins+'</h4></h4>Losses: '+ snapshot.val().losses + '</h4>'
        );
    });


    $('#start').on('click', function() {
      //Grabs users name from input
      var name = $('#name').val();

      // Used to show presence in game
      var connectionsRef = database.ref("/players/" + playerNum);
      var connectedRef = database.ref(".info/connected");

      connectedRef.on("value", function(snap) {

        if (snap.val()) {

          connectionsRef.onDisconnect().remove();
          setUserStatus(playerNum);

        }

      });
      //
      //

      // Greets player
      firebase.database().ref('players').once("value", function(snapshot) {

        $('#top').html('<h3>Welcome '+ name + ' you are player # ' + playerNum);

      });

      game(playerNum, name);

    });
  });




      //#######################################################################
      //######################### Functions ###################################

      function setUserStatus(num) {

        database.ref("/players/"+ num).set({
          name:name,
          choice: '',
          wins: 0,
          losses: 0
        });
      }

      function game (playerNum , name){

        if(playerNum == 1 ){

          database.ref('players/1/name').set(name);

          firebase.database().ref('players/1').on("value", function(snapshot){
            console.log(snapshot.val());

            $('#player1-name').html('<h1>'+  snapshot.val().name + '</h2>');

            $('#player1-stats').html(
                '<h4>Wins: '+snapshot.val().wins+'</h4></h4>Losses: '+ snapshot.val().losses + '</h4>'
              );
          });


          firebase.database().ref('players/2').on("value", function(snapshot){

            $('#player2-name').html('<h1>'+ snapshot.val().name + '</h2>');
            $('#player2-stats').html(
                '<h4>Wins: '+snapshot.val().wins+'</h4></h4>Losses: '+ snapshot.val().losses + '</h4>'
              );

          });


          firebase.database().ref('players/turn').on("value", function(snapshot){
            if(snapshot.val() == 1){
              var div = $('<div>');
              var rock = $('<button>')
                .addClass('button')
                .html('Rock');
              var paper = $('<button>')
                .addClass('button')
                .html('Paper');
              var scissors = $('<button>')
                .addClass('button')
                .html('Scissors');
              div.append(rock, paper , scissors);
              $('#player1-center').html(div);
              $(document).on('click', '.button', function() {
                console.log($(this).text());
                database.ref('players/1/choice').set($(this).text());
                $('#player1-center').html('<h1>'+ $(this).text() + '</h1>');
                database.ref('players/turn/').set(2);
              });
            } else if(snapshot.val() == 3){
              console.log("time to restart");
              outCome();
              console.log('just ran outCome');
            }
          });

        } else {

          database.ref('players/2/name').set(name);
          firebase.database().ref('players/2').on("value", function(snapshot){

            $('#player2-name').html('<h1>'+ snapshot.val().name + '</h2>');
            $('#player2-stats').html(
                '<h4>Wins: '+snapshot.val().wins+'</h4></h4>Losses: '+ snapshot.val().losses + '</h4>'
              );

          });

          firebase.database().ref('players/1').on("value", function(snapshot){
            $('#player1-name').html('<h1>'+ snapshot.val().name + '</h2>');
            $('#player1-stats').html(
                '<h4>Wins: '+snapshot.val().wins+'</h4></h4>Losses: '+ snapshot.val().losses + '</h4>'
              );
          });

          firebase.database().ref('players/turn').on("value", function(snapshot){
            if(snapshot.val() == 2){
              var div = $('<div>');
              var rock = $('<button>')
                .addClass('button')
                .html('Rock');
              var paper = $('<button>')
                .addClass('button')
                .html('Paper');
              var scissors = $('<button>')
                .addClass('button')
                .html('Scissors');
              div.append(rock, paper , scissors);
              $('#player2-center').html(div);
              $(document).on('click', '.button', function() {
                console.log($(this).text());
                database.ref('players/2/choice').set($(this).text());
                $('#player2-center').html('<h1>'+$(this).text()+'</h1>');
                database.ref('players/turn/').set(3);
              });
            } else if(snapshot.val() == 3){
              console.log("Time to Reset");
              outCome();
              console.log('just ran outCome');
            }
          });

        }
      }


      function outCome () {
        var player1;
        var player2;
        var player1Wins;
        var player2Wins;
        var player1Losses;
        var player2Losses;


        database.ref('players/1').once('value', function(snapshot){
          player1 = snapshot.val().choice;
          player1Wins = snapshot.val().wins;
          player1Losses = snapshot.val().losses;

          database.ref('players/2').once('value', function(snapshot){
            player2 = snapshot.val().choice;
            player2Wins = snapshot.val().wins;
            player2Losses = snapshot.val().losses;
          });

          if(player1 == "Rock" && player2 == "Scissors"){
            p1Wins(player1Wins, player2Losses);

          }else if (player1 == "Rock" && player2 == "Paper"){
            p2Wins(player2Wins, player1Losses);
          }else if (player1 == "Rock" && player2 == "Rock"){
            console.log('Its a Ties');
            database.ref('players/turn/').set(1);
          }

          else if (player1 == "Scissors" && player2 == "Paper"){
            p1Wins(player1Wins, player2Losses);
          }else if (player1 == "Scissors" && player2 == "Scissors"){
            console.log('Its a Ties');
            database.ref('players/turn/').set(1);
          }else if (player1 == "Scissors" && player2 == "Rock"){
            p2Wins(player2Wins, player1Losses);
          }

          else if (player1 == "Paper" && player2 == "Paper"){
            console.log("Its a tie");
            database.ref('players/turn/').set(1);
          }else if (player1 == "Paper" && player2 == "Rock"){
            p1Wins(player1Wins, player2Losses);
          }else if (player1 == "Paper" && player2 == "Scissors"){
            p2Wins(player2Wins, player1Losses);
          }


        });
      }

      function p1Wins (player1Wins,player2Losses){
        player1Wins++;
        database.ref('players/1/wins').set(player1Wins);
        player2Losses++;
        database.ref('players/2/losses').set(player2Losses);
        $('#middle').html('<h1>Player 1 Wins</h1>');
        setTimeout(function() {
          database.ref('players/turn/').set(1);
          $('#middle').html('');
        }, 3000);
      }

      function p2Wins (player2Wins, player1Losses) {
        player2Wins++;
        database.ref('players/2/wins').set(player2Wins);
        player1Losses++;
        database.ref('players/1/losses').set(player1Losses);
        $('#middle').html('<h1>Player 2 Wins</h1>');
        setTimeout(function() {
          database.ref('players/turn/').set(1);
          $('#middle').html('');
        }, 3000);
      }
