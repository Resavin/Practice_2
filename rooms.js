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
  .then(response => addRooms( response )).catch( e => network_error(e) );

}

function addRooms(rooms){
  if( rooms['status'] == 200 ){
    if( rooms['data']['status_code'] == 200 ){
      var root = document.getElementById('roomList');
      root.innerHTML = '';
      root.setAttribute('class','grid lg:grid-cols-2 md:grid-cols-1');
      for( var i = 0; i < rooms['data']['data'].length; i++ ){

        var room = document.createElement("div");
        var roomName = document.createElement("a");
        var capasity = document.createElement("div");
        var cost = document.createElement("div");
        var images_href = document.createElement("a");
        var images = document.createElement("img");
        var type = document.createElement("div");

        var right = document.createElement("div");
        // var roomName = document.createElement("div");

        roomName.innerHTML = '<b>' + rooms['data']['data'][i]['title'] + '</b>';
        roomName.setAttribute('href','room_detail.html?room=' + rooms['data']['data'][i]['id'] );
        images_href.setAttribute('href','room_detail.html?room=' + rooms['data']['data'][i]['id'] );
        roomName.setAttribute('class', '' );

        cost.innerHTML = 'Стоимость ' + rooms['data']['data'][i]['cost'];

        images.setAttribute( 'src', rooms['data']['data'][i]['images'] );
        images_href.appendChild(images);
        type.innerHTML = 'Крутость ' + rooms['data']['data'][i]['type'];
        capasity.innerHTML = 'Вместимость ' + rooms['data']['data'][i]['capacity'];



        roomName.setAttribute('class','no-underline hover:bg-Grey/[.3] \
              hover:shadow-md hover:shadow-Cyan rounded active:text-Cyan text-xl text-Blue \
              no-underline hover:grayscale-0 mt-10');
        // room.setAttribute('class','border-solid border-Cyan mx-2 my-2 grid grid-rows-2 grid-flow-col gap-4 py-2');
        // room.setAttribute('class','border-solid border-Cyan mx-2 my-2 grid grid-rows-2 grid-flow-col gap-4 -pl-12 pr-2 py-2');
        // images.setAttribute('class','lg:row-span-2 md:col-span-1 object-contain h-48 w-96');
        // right.setAttribute('class','lg:row-span-1 md:col-span-2 -ml-10 -mb-10');
        room.setAttribute('class','grid grid-cols-2 mt-2 border-solid rounded border-Cyan px-2 py-2 mr-2 ');
        images.setAttribute('height','150');
        images.setAttribute('class','rounded');
        right.setAttribute('class','ml-4');

        right.appendChild( roomName );
        right.appendChild( cost );
        right.appendChild( type );
        right.appendChild( capasity );

        room.appendChild( images_href );
        room.appendChild( right );

        root.appendChild( room );


        // right.setAttribute('class','center');
        // images.setAttribute('class','object-contain h-48 w-96')
        // room.setAttribute('class','flex list-none py-8');

        // images.setAttribute('class','object-contain h-48 w-96');
        // right.setAttribute('class','flex items-center 	');
        // room.setAttribute('class','w-96  list-none py-8');





        // room.setAttribute('class','grid grid-rows-2 grid-flow-col gap-4 py-8');
        // images.setAttribute('class','row-span-2 object-contain h-48 w-96');
        // right.setAttribute('class','row-span-1');


        // room.setAttribute('class','grid grid-rows-2 grid-flow-col gap-4 py-8');
        // images.setAttribute('class','col-span-1 object-contain h-48 w-96');
        // right.setAttribute('class','col-span-2');




        //console.log( rooms['data']['data'][i] )
      }
    }
  }else{
    throw {
       name: 'NetworkError',
       message: 'A network error occurred.'
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
        tooltipNumber(num) {
          return num - 1;
        },
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
  listRooms();

  //datapick.style.display = "none";
  //document.getElementById('datepicker').style.display = "none";

}
