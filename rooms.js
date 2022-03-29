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
        var roomName = document.createElement("h5");
        roomName.innerHTML = rooms['data']['data'][i]['title'];
        room.appendChild( roomName );
        root.appendChild( room );
        console.log( rooms['data']['data'][i] )
      }
    }
  }

  // console.log( rooms );
  // console.log( rooms['data'] );
}
