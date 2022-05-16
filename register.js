baseurl = 'http://130.162.173.167/api/'


function is_login(){
  var token = localStorage.getItem('token');
  var name = localStorage.getItem('name');
  if( token == null || token == '' ){
    return false
  }else{
    let url = baseurl + 'user';
    axios.get(url,{
      headers: {
        'Authorization':'Token ' + localStorage.getItem('token')
      }
    }).then(function(r){
      if( r.status == 200 ){
        if( r['data'].status_code == 200 ){
          // console.log( r );
          if( r['data']['username'] == name ){
            return true;
          }
        }else{
          return false;
        }
      }else{
        return false;
      }
    });
  }

}


function getAllUrlParams(url) {

  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  var obj = {};

  if (queryString) {

    queryString = queryString.split('#')[0];

        var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
            var a = arr[i].split('=');

            var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            if (paramName.match(/\[(\d+)?\]$/)) {

                var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

                if (paramName.match(/\[\d+\]$/)) {
                    var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
                    obj[key].push(paramValue);
        }
      } else {
                if (!obj[paramName]) {
                    obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                    obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
                    obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

const validateEmail = (email) => {
return String(email)
  .toLowerCase()
  .match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

function check_pass( r = 0 ){
  passw = document.getElementById('passw').value;
  passw_2 = document.getElementById('passw_2').value;
  if( passw != '' && passw_2 != '' ){
    //console.log(passw == passw_2);
    if( passw != passw_2 ){
      document.getElementById('passw').setCustomValidity('Пароли должны совпадать');
      document.getElementById('passw_2').setCustomValidity('Пароли должны совпадать');
      document.getElementById('err_passw_2').innerHTML = "<div class='mt-1 mb-1 font-sans font-bold text-Purple'> Пароли должны совпадать</div>";
    }else{
      document.getElementById('passw').setCustomValidity('');
      document.getElementById('passw_2').setCustomValidity('');
      document.getElementById('err_passw_2').innerHTML = "";
    }
  }else{
    if( r != 0 ){
      if( passw == '' ){
        document.getElementById('passw').setCustomValidity('Пароль это обязательное поле');
      }
      if( passw_2 == '' ){
        document.getElementById('passw_2').setCustomValidity('Пароль это обязательное поле');
      }
      document.getElementById('err_passw_2').innerHTML = "<div class='mt-1 mb-1 font-sans font-bold text-Purple'> Пароль это обязательное поле </div>";
    }

  }
}

function check_email(){

  email = document.getElementById('email').value;

  if( email != '' ){
    if( validateEmail(email) ){
      document.getElementById('email').setCustomValidity('');
      document.getElementById('err_email').innerHTML = "";
    }else{
      document.getElementById('email').setCustomValidity('Введите корректный email');
      document.getElementById('err_email').innerHTML = "<div class='mt-1 mb-1 font-sans font-bold text-Purple'> Введите корректный email </div>";
    }
  }else{
    document.getElementById('email').setCustomValidity('Почта это обязательное поле');
    document.getElementById('err_email').innerHTML = "<div class='mt-1 mb-1 font-sans font-bold text-Purple'> Почта это обязательное поле </div>";
  }
}

function check_login() {
  login = document.getElementById('login').value;
  if( login == '' ){
    document.getElementById('login').setCustomValidity('Логин это обязательное поле');
    document.getElementById('err_login').innerHTML = "<div class='mt-1 mb-1 font-sans font-bold text-Purple'> Логин это обязательное поле </div>";
  }else{
    document.getElementById('login').setCustomValidity('');
    document.getElementById('err_login').innerHTML = "";
  }
}

function check_username() {
  login = document.getElementById('username').value;
  if( login == '' ){
    document.getElementById('username').setCustomValidity('Логин это обязательное поле');
    document.getElementById('err_username').innerHTML = "<div class='mt-1 mb-1 font-sans font-bold text-Purple'> Логин это обязательное поле </div>";
  }else{
    document.getElementById('username').setCustomValidity('');
    document.getElementById('err_username').innerHTML = "";
  }
}



function reg(){
  login = document.getElementById('login').value;
  passw = document.getElementById('passw').value;
  passw_2 = document.getElementById('passw_2').value;
  email = document.getElementById('email').value;
  phone = document.getElementById('phone').value;
  first_name = document.getElementById('first_name').value;
  second_name = document.getElementById('second_name').value;
  if( login != '' && passw != '' && passw_2 != '' && passw == passw_2 && email != '' && validateEmail(email) ){
    check_login();
    check_pass( 1 );
    check_email();
    param = {};
    param['username'] = login;
    param['email'] = email;
    param['password'] = passw;
    if ( phone!= '' ){
      param['phone'] = phone;
    }
    if( first_name != '' ){
      param['first_name'] = first_name;
    }
    if( second_name != '' ){
      param['second_name'] = second_name;
    }
    let url = baseurl + 'auth/register'
    axios.post( url , param).then( function(r){
      //console.log("BRUH FOR TEST");
      //console.log(r);
      if( r.status == 200 ){
        if( r['data'].status_code == 200 ){
          localStorage.setItem( 'token', r['data']['data']['token'] );
          localStorage.setItem( 'name', r['data']['data']['users']['username'] );
          //localStorage.setItem( 'id', r['data']['data']['users']['id'] );
          let par = new URLSearchParams( window.location.search );
          let ret_url = par.get('r');
          console.log(ret_url);
          if( ret_url == '' || ret_url == undefined ){
            ret_url = 'test.html'
          }
          //console.log(ret_url);
          window.location.href = ret_url;
        }else{
          document.getElementById('err_api').innerHTML = r['data']['error'];
        }
      }else{
        throw {
           name: 'NetworkError',
           message: 'A network error occurred.'
        }
      }
    }).catch( e => network_error(e) );

  }else{

    check_login();
    check_pass( 1 );
    check_email();
  }

}

window.onload = function() {
  let url = 'sign_in.html' + window.location.search;
  a = document.getElementById('to_log');
  a.setAttribute('href', url);
}
