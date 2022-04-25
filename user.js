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
    login.innerHTML = "Вход";
    // u.appendChild( login );

    var reg = document.getElementById('user2');
    reg.setAttribute('href','sign_up.html');
    reg.innerHTML = "Регистрация";

  } else {
    var change = document.getElementById('change');
    change.innerHTML = '<div class="text-blue"> <img class="mx-24" src="walrusPurple.png" height="164"> \
            <div class="text-3xl text-Purple">  Гостиница "Клык моржа"  </div> \
            <div class="italic mt-5  flex flex-col items-center text-Purple"> Добро пожаловать сюда, </div> \
            <div class="italic  flex flex-col items-center text-Purple"> фиолетовый ' + name + '</div> </div>';
    var u = document.getElementById('user');
    // var user = document.createElement('a');
    var login = document.getElementById('user2');

    u.setAttribute('href','user.html?user_login=' + name);
    u.innerHTML = "Профиль";
    login.setAttribute('onclick','logout()');
    login.innerHTML = "Выход";
    // u.appendChild( user );
    // u.appendChild( document.createElement('br') );
  }

}
window.onload = function() {
  is_user();
  page_content();
}
