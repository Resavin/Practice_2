

var paid_state = false;


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

  let url = baseurl + 'room/' + getAllUrlParams()['room'];
    axios.get(url).then(function(r){
    if( r['status'] == 200 ){
      if( r['data']['status_code'] == 200 ){
        document.getElementById('room').value = r['data']['data']['title'];
      }
    }else{
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );

  if( arrivalDate != undefined ){
    document.getElementById('start_date').value = arrivalDate;
  }
  if( departureDate != undefined ){
    document.getElementById('end_date').value = departureDate;
  }
  if( additionalDay != undefined ){
    document.getElementById('guaranteed_booking').checked = additionalDay == 'true';
  }
  if( personCount != undefined ){
    document.getElementById('person_count').value = personCount;
  }


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


function next_stage() {

}
