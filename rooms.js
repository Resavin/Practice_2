baseurl = 'http://130.162.173.167/api/'


function listRooms(){
  var params = {};
  var start_date = document.getElementById('start').value;
  var end_date = document.getElementById('end').value;
  var people_count = document.getElementById('count').value;
  if( start_date != '' ){
    params['arrivalDate'] = start_date;
  }
  if( end_date != '' ){
    params['departureDate'] = end_date;
  }
  if( start_date != '' ){
    params['arrivalDate'] = start_date;
  }
  if( people_count != '' ){
    params['adultCount'] = people_count;
    params['childCount'] = 0;
    params['petsCount'] = 0;
  }
  console.log( params );
  axios.get( baseurl + 'rooms', {params:params} )
  .then(response => addRooms( response ));

}

function addRooms(rooms){
  if( rooms['status'] == 200 ){
    if( rooms['data']['status_code'] == 200 ){
      var root = document.getElementById('roomList');
      root.innerHTML = '';
      for( var i = 0; i < rooms['data']['data'].length; i++ ){

        var room = document.createElement("li");
        var roomName = document.createElement("div");
        var capasity = document.createElement("div");
        var cost = document.createElement("div");
        var images = document.createElement("img");
        var type = document.createElement("div");
        // var roomName = document.createElement("div");

        roomName.innerHTML = '<b>' + rooms['data']['data'][i]['title'] + '</b>';
        cost.innerHTML = 'Стоимость ' + rooms['data']['data'][i]['cost'];
        images.setAttribute( 'height', '100' );
        images.setAttribute( 'src', rooms['data']['data'][i]['images'] );
        type.innerHTML = 'Крутость ' + rooms['data']['data'][i]['type'];
        capasity.innerHTML = 'Вместимость ' + rooms['data']['data'][i]['capacity'];


        room.appendChild( roomName );
        room.appendChild( cost );
        room.appendChild( type );
        room.appendChild( capasity );
        room.appendChild( images );

        root.appendChild( room );

        console.log( rooms['data']['data'][i] )
      }
    }
  }

  // console.log( rooms );
  // console.log( rooms['data'] );
}
