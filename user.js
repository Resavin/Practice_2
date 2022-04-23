baseurl = 'http://130.162.173.167/api/'

function is_user(){

  var token = localStorage.getItem('token');
  var name = localStorage.getItem('name');
  //console.log( token );
  if( token == null ){
    // var u = document.getElementById('user');
    // var login = document.createElement("a");
    var login = document.getElementById('user');
    login.setAttribute('href','sign_in.html');
    // console.log( u );
    login.innerHTML = "Войти или Зарегестрироваться";
    // u.appendChild( login );
  } else {
    var u = document.getElementById('user');
    var login = document.createElement("button");
    // login.setAttribute('href','#');
    login.setAttribute('onclick','logout()');
    login.innerHTML = "Выйти";
    u.appendChild( login );
  }

}





window.onload = function() {
  is_user();
  page_content();
}
