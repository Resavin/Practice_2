baseurl = 'http://130.162.173.167/api/'

function is_login() {
  var token = localStorage.getItem('token');
  var name = localStorage.getItem('name');
  if( token == null || name == null ){
    return false;
  }else{
    return true;
  }
}


function is_user(){

  var token = localStorage.getItem('token');
  var name = localStorage.getItem('name');
  var id = localStorage.getItem('id');
  //console.log( token );
  if( token == null ){
    // var u = document.getElementById('user');
    // var login = document.createElement("a");
    var user = document.getElementById('user');
    login = document.createElement('a');
    login.setAttribute('href','sign_in.html');
    login.setAttribute('class','px-3  hover:bg-Grey/[.3] hover:shadow-md hover:shadow-Cyan active:text-Cyan text-xl text-Green no-underline grayscale-[30%] hover:grayscale-0 ');
    login.innerHTML = "Вход";
    user.appendChild(login);
    // u.appendChild( login );

    //var reg = document.getElementById('user2');
    //reg.setAttribute('href','sign_up.html');
    //reg.innerHTML = "Регистрация";

  } else {
    var change = document.getElementById('change');
    if( change != null ){
    change.innerHTML = '<div class="text-blue"> <img class="mx-24" src="walrusPurple.png" height="164"> \
            <div class="text-3xl text-Purple">  Гостиница "Клык моржа"  </div> \
            <div class="italic mt-5  flex flex-col items-center text-Purple"> Добро пожаловать сюда, </div> \
            <div class="italic  flex flex-col items-center text-Purple"> фиолетовый ' + name + '</div> </div>';
    }


    var user = document.getElementById('user');

    user_page = document.createElement('a');

    user_page.setAttribute('class','px-3  hover:bg-Grey/[.3] hover:shadow-md hover:shadow-Cyan active:text-Cyan text-xl text-Green no-underline grayscale-[30%] hover:grayscale-0');
    user_page.setAttribute('href','user.html?user_login=' + name);
    user_page.innerHTML = "Профиль";

    exit = document.createElement('a');
    exit.setAttribute('class','px-3  hover:bg-Grey/[.3] hover:shadow-md hover:shadow-Cyan active:text-Cyan text-xl text-Green no-underline grayscale-[30%] hover:grayscale-0');
    exit.setAttribute('onclick','logout()' );
    exit.innerHTML = "Выход";

    user.appendChild(user_page);
    user.appendChild(exit);

    //var u = document.getElementById('user');
    // var user = document.createElement('a');
    //var login = document.getElementById('user2');


    //login.setAttribute('onclick','logout()');
    //login.innerHTML = "Выход";
    // u.appendChild( user );
    // u.appendChild( document.createElement('br') );
  }

}

window.onload = function() {
  is_user();
  page_content();
}
