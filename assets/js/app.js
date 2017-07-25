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

  $(document).ready(function() {

    $('#start').on('click', function() {
      var name = $('#name').val();

      var userListRef = firebase.database().ref("USERS_ONLINE");
      var myUserRef = userListRef.push();

      // var presenceObject = {user: myUserObject, status: myStatus};
      // myUserRef.set(presenceObject);

      // Monitor connection state on browser tab
      firebase.database().ref(".info/connected")
        .on(
          "value", function (snap) {
            if (snap.val()) {
              // if we lose network then remove this user from the list
              myUserRef.onDisconnect()
                       .remove();
              // set user's online status
              setUserStatus("online");
            } else {
              // client has lost network
              setUserStatus("offline");
            }
          }
        );

        firebase.database().ref().child("USERS_ONLINE").on("value", function(snapshot) {
          console.log("There are "+snapshot.numChildren()+" messages");
          if (snapshot.numChildren() == 1){
            $('#top').html('<h3>Welcome '+ name + ' you are player 1');
            console.log("time to play");
            console.log(snapshot.numChildren());

          } else if (snapshot.numChildren() ==2){
            $('#top').html('<h3>Welcome '+ name + ' you are player 2');
            console.log(snapshot.numChildren());
          }
        });


        function setUserStatus(status) {
          // Set our status in the list of online users.
          currentStatus = status;
          myUserRef.set({ name: name, status: status });
        }
    });

  });

  // var databaseURL =  "https://rps-multi-player-633b8.firebaseio.com";
  //
  // var listRef = firebase( databaseURL +"/presence/");
  // var userRef = listRef.push();
  //
  // // Add ourselves to presence list when online.
  // var presenceRef = new firebase( databaseURL +"/.info/connected");
  // presenceRef.on("value", function(snap) {
  //   if (snap.val()) {
  //     // Remove ourselves when we disconnect.
  //     userRef.onDisconnect().remove();
  //
  //     userRef.set(true);
  //   }
  // });
  // Number of online users is the number of objects in the presence list.
  // listRef.on("value", function(snap) {
  //   console.log("# of online users = " + snap.numChildren());
  // });
