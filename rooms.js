baseurl = 'http://130.162.173.167/api/'


function listRooms(){
  //console.log("SOME");
  var params = {};
  var start_date = document.getElementById('start_date').value;
  var end_date = document.getElementById('end_date').value;
  var dateApproach = document.getElementById('guaranteed_booking').checked;
  var people_count = document.getElementById('count').value;
  if( dateApproach ){
    params['dateApproach'] = 1;
  }else{
    params['dateApproach'] = 0;
  }

  if( start_date != '' ){
    params['arrivalDate'] = start_date;
  }
  if( end_date != '' ){
    params['departureDate'] = end_date;
  }
  if( people_count != '' ){
    params['adultCount'] = people_count;
    params['childCount'] = 0;
    params['petsCount'] = 0;
  }
  //console.log( params );
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
        var roomName = document.createElement("a");
        var capasity = document.createElement("div");
        var cost = document.createElement("div");
        var images = document.createElement("img");
        var type = document.createElement("div");
        // var roomName = document.createElement("div");

        roomName.innerHTML = '<b>' + rooms['data']['data'][i]['title'] + '</b>';
        roomName.setAttribute('href','room_detail.html?room=' + rooms['data']['data'][i]['id'] );

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

        //console.log( rooms['data']['data'][i] )
      }
    }
  }

  // console.log( rooms );
  // console.log( rooms['data'] );
}

function page_content(){

  const picker = new easepick.create({
    element: "#start_date",
    css: [
        'dist/date_pick.css'
    ],
    setup(picker) {
      picker.on('select', (e) => {
        const { view, date, target } = e.detail;
        // do something
        //console.log("BRUH");
        listRooms();
      });
    },
    zIndex: 10,
    lang: "ru-RU",
    grid: 2,
    calendars: 2,
    inline: true,
    plugins: ['RangePlugin', 'LockPlugin'],
    RangePlugin: {
        elementEnd: "#end_date",
        repick: true,
        locale: {
            zero: "ночей",
            one: "ночь",
            two: "ночи",
            few: "ночи",
            many: "ночей",
            other: "ночи"
        }
    },
    LockPlugin: {

      minDate: new Date(),
      minDays: 2,
      inseparable: true,

    }

  })
  document.getElementById('start_date').style.display = "none";
  document.getElementById('end_date').style.display = "none";
  //datapick = document.getElementById('datepicker');
  //datapick = document.getElementById('1');


  //datapick.style.display = "none";
  //document.getElementById('datepicker').style.display = "none";

}
