

var paid_state = false;

var edit = false;
var edited_book_id = -1;

var room_id = -1;


function page_content() {

  if( !is_login() ){
    param = encodeURIComponent(window.location.search)
    window.location.href = 'sign_up.html?r=' + 'booking.html' + param;
  }

  let par = new URLSearchParams( window.location.search );
  // let ret_url = par.get('r');


  let room = par.get('arrivalDate');
  let arrivalDate = par.get('arrivalDate');
  let departureDate = par.get('departureDate');
  let additionalDay = par.get('additionalDay');
  let personCount = par.get('personCount');
  let book_id = par.get('book_id');
  room_id = par.get('room');

  if( room_id != undefined ){
    change_room_title( room_id );
  }


  if( book_id != undefined ){
    edit = true;
    edited_book_id = book_id;
    let url = baseurl + 'bookings';
    axios.get( url, {
      headers: {
          'Authorization':'Token ' + localStorage.getItem('token')
      }
    }).then(function(r){
      console.log(r);
      if( r.status == 200 ){
        if( r['data']['status_code'] == 200 ){
          for( let i = 0; i < r['data']['data'].length; i++ ){
            if( r['data']['data'][i]['id'] == edited_book_id ){

              arrivalDate = r['data']['data'][i]['arrivalDate'];
              departureDate = r['data']['data'][i]['departureDate'];
              additionalDay = r['data']['data'][i]['dateApproach'] == '1';
              personCount = r['data']['data'][i]['adultCount'];
              room_id = r['data']['data'][i]['room'];
              if( r['data']['data'][i]['isPaid'] ){
                paid();
              }

              document.getElementById('start_date').value = arrivalDate;
              document.getElementById('end_date').value = departureDate;
              document.getElementById('guaranteed_booking').checked = additionalDay;
              document.getElementById('person_count').value = personCount;
              change_room_title( room_id );

            }
          }
        }
      }else{
        throw {
          name: 'NetworkError',
          message: 'A network error occurred.'
        }
      }
    }).catch( e => network_error(e) );
  }

  if( arrivalDate != undefined ){
    document.getElementById('start_date').value = arrivalDate;
  }
  if( departureDate != undefined ){
    document.getElementById('end_date').value = departureDate;
  }
  if( additionalDay != undefined ){
    document.getElementById('guaranteed_booking').checked = additionalDay;
  }
  if( personCount != undefined ){
    document.getElementById('person_count').value = personCount;
  }


}


function change_room_title( id ) {
  let url = baseurl + 'room/' + id;
    axios.get(url).then(function(r){
    if( r['status'] == 200 ){
      if( r['data']['status_code'] == 200 ){
        document.getElementById('room').value = r['data']['data']['title'];
        document.getElementById('person_count').setAttribute('max',r['data']['data']['capacity']);
      }
    }else{
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );

}




function select_room() {

  url = baseurl + 'rooms'
  room = document.getElementById('room');
  room.style.display = 'none';
  axios.get( baseurl + 'rooms' ).then( function(r){
    if( r.status == 200 ){
      if( r['data']['status_code'] == 200 ){

        room = document.getElementById('room');
        room.style.display = 'none';
        short_room_list = document.createElement('div');
        short_room_list.setAttribute('class','items-center flex flex-col border-Cyan rounded border-solid');
        short_room_list.setAttribute('id','select_room');
        room.after( short_room_list );
        document.getElementById('room_head').innerHTML = "Выберете другой номер";

        for( var i = 0; i < r['data']['data'].length; i++ ){
          room = document.createElement('button');
          room.innerHTML = r['data']['data'][i]['title'];
          room.setAttribute('class','bg-Black active:bg-Cyan active:text-Black font-semibold text-Green border-Black rounded border-solid px-5 w-96 h-7');
          room.setAttribute('onclick','change_room( '+r['data']['data'][i]['id']+', \''+r['data']['data'][i]['title']+'\', \''+r['data']['data'][i]['capacity']+'\' )')
          short_room_list.appendChild( room );
        }

        //console.log( r['data']['data'].length );
      }
    }else{
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
      }
    }

  } ).catch( e => network_error(e) );

}

function change_room( _room_id, room_title, room_capacity ) {
  room_id = _room_id;
  document.getElementById('select_room').remove();
  room = document.getElementById('room');
  room.style.display = 'block';
  room.value = room_title;
  //console.log( room_id, room_title );
  document.getElementById('room_head').innerHTML = "Номер";
  //console.log(room_capacity);
  person_count = document.getElementById('person_count');
  if( person_count.value > room_capacity ){
    person_count.value = room_capacity;
  }
  person_count.setAttribute('max',room_capacity);
}


function paid() {

  if( !paid_state ){

    paid_state = true;
    let paid_button = document.getElementById('pay_state');
    paid_button.setAttribute('class', 'font-semibold text-Black border-Cyan bg-Cyan rounded border-solid px-5 w-96 h-7 mt-4');
    paid_message = document.createElement('div');
    paid_message.innerHTML = "оплата произведена";
    paid_button.after( paid_message );

  }

}



function hide_data_picker() {

  ep = document.getElementsByClassName('easepick-wrapper')[0].remove();


  //console.log(ep);
  //ep.parentNode.removeChild(ep);
  document.getElementById('start_date').style.display = "block";
  document.getElementById('start_date_head').style.display = "block";
  document.getElementById('end_date').style.display = "block";
  document.getElementById('end_date_head').style.display = "block";


}

function change_date(){

  url = baseurl + 'room/' + room_id + '/date';
  busy_dates = ''
  axios.get(url, {
    headers: {
        'Authorization':'Token ' + localStorage.getItem('token')
    }
  }).then(function(r){
    if( r['status'] == 200 ){
      if( r['data']['status_code'] == 200 ){
        busy_dates = r['data']['data']

        const DateTime = easepick.DateTime;
        const bookedDates = busy_dates.map(d => {
            if (d instanceof Array && d[2] != edited_book_id ) {
              const start = new DateTime(d[0], 'YYYY-MM-DD');
              const end = new DateTime(d[1], 'YYYY-MM-DD');
                                  return [start, end];
            }

            return new DateTime(d, 'YYYY-MM-DD');
        });
              const picker = new easepick.create({
                element: document.getElementById('start_date'),
                css: [
                  'dist/date_pick.css'
                ],
                setup(picker) {
                  picker.on('select', (e) => {
                    const { view, date, target } = e.detail;
                    hide_data_picker();
                  });
                },
                grid: 2,
                calendars: 2,
                                inline: true,
                lang: "ru-RU",
                plugins: ['RangePlugin', 'LockPlugin'],
                RangePlugin: {
                  elementEnd: "#end_date",
                  tooltipNumber(num) {
                    return num - 1;
                  },
                  locale: {
                    one: "ночь",
                    few: "ночи",
                    many: "ночей",
                    other: "ночей"
                  },
                },
                LockPlugin: {

                  minDate: new Date(),
                  minDays: 2,
                  inseparable: true,
                  filter(date, picked) {
                    if (picked.length === 1) {
                      const incl = date.isBefore(picked[0]) ? '[)' : '(]';
                      return !picked[0].isSame(date, 'day') && date.inArray(bookedDates, incl);
                    }

                    return date.inArray(bookedDates, '[)');
                  },
                }


              });
              //document.getElementById('start_date').style.display = "none";
              //document.getElementById('end_date').style.display = "none";
              ep = document.getElementsByClassName('easepick-wrapper')[0].setAttribute('class', 'easepick-wrapper py-3' );
              document.getElementById('start_date').style.display = "none";
              document.getElementById('start_date_head').style.display = "none";
              document.getElementById('end_date').style.display = "none";
              document.getElementById('end_date_head').style.display = "none";


      }
    }else{
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );



}



function next_stage() {

  let token = localStorage.getItem('token');
  let room = room_id;
  let arrivalDate = document.getElementById('start_date').value;
  let departureDate = document.getElementById('end_date').value ;
  let dateApproach = document.getElementById('guaranteed_booking').checked ? 1 : 0;
  let adultCount = document.getElementById('person_count').value;
  let childCount = 0;
  let petsCount = 0;
  let isPaid = paid_state;


  url = baseurl + 'room/'+ room +'/booking';
  if( edit ){

    axios.put( url, {
      id:edited_book_id,
      arrivalDate:arrivalDate,
      departureDate:departureDate,
      dateApproach:dateApproach,
      adultCount:adultCount,
      childCount:childCount,
      petsCount:petsCount,
      isPaid:isPaid
    }, {
      headers: {
          'Authorization':'Token ' + localStorage.getItem('token')
      }
    }).then(function(r) {
      if( r.status == 200 ){
        if( r['data']['status_code'] == 200 ){
          window.location.href = 'booking_list.html#book_' + r['data']['data']['id'];
        }else{
          document.getElementById('api_error').innerHTML = r['data']['error'];
          //error
        }
      }else{
        throw {
           name: 'NetworkError',
           message: 'A network error occurred.'
          }
      }
      }).catch( e => network_error(e) );

  }else{

    axios.post( url, {
      arrivalDate:arrivalDate,
      departureDate:departureDate,
      dateApproach:dateApproach,
      adultCount:adultCount,
      childCount:childCount,
      petsCount:petsCount,
      isPaid:isPaid
    }, {
      headers: {
          'Authorization':'Token ' + localStorage.getItem('token')
      }
    }).then(function(r) {
      if( r.status == 200 ){
        if( r['data']['status_code'] == 200 ){
          window.location.href = 'booking_list.html#book' + r['data']['data']['id'];
        }else{
          document.getElementById('api_error').innerHTML = r['data']['error'];
          //error
        }
      }else{
        throw {
           name: 'NetworkError',
           message: 'A network error occurred.'
          }
      }
      }).catch( e => network_error(e) );

  }






}
