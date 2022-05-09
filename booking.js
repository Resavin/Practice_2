

var paid_state = false;

function page_content() {

  if( !is_login() ){
    param = encodeURIComponent(window.location.search)
    window.location.href = 'sign_up.html?r=' + 'booking.html' + param;
  }

  let par = new URLSearchParams( window.location.search );
  // let ret_url = par.get('r');

  let arrivalDate = par.get('arrivalDate');
  let departureDate = par.get('departureDate');
  let additionalDay = par.get('additionalDay');
  let personCount = par.get('personCount');

  if( arrivalDate != undefined ){
    document.getElementById('start_date').value = arrivalDate;
  }
  if( departureDate != undefined ){
    document.getElementById('end_date').value = arrivalDate;
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
