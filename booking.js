

function page_content() {

  let par = new URLSearchParams( window.location.search );
  let ret_url = par.get('r');

  console.log( 'booking.html' + window.location.search );

  if( !is_login() ){
    window.location.href = 'sign_up.html?r=' + 'booking.html' + window.location.search;
  }

}
