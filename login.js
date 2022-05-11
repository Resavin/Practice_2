baseurl = 'http://130.162.173.167/api/'





function login(){
  var login = document.getElementById('login').value;
  var passw = document.getElementById('passw').value;
  var params = {}
  params['username'] = login;
  params['password'] = passw;

  let par = new URLSearchParams( window.location.search );
  let ret_url = par.get('r');
  console.log(ret_url);
  if( ret_url == '' || ret_url == undefined ){
    ret_url = 'test.html'
  }
  console.log(ret_url);
  console.log('asd');


  if( login != '' && passw != '' ){
    document.getElementById('err_login').innerHTML = "";
    document.getElementById('err_passw').innerHTML = "";
    axios.post(baseurl + 'auth/login', params).then(function(r) {
      //console.log(r);
      if( r.status == 200 ){
        if( r['data'].status_code == 200 ){
          localStorage.setItem( 'token', r['data']['data']['token'] );
          localStorage.setItem( 'name', r['data']['data']['user']['username'] );
          //localStorage.setItem( 'id', r['data']['data']['user']['id'] );


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
    if( login == '' ){
      document.getElementById('err_login').innerHTML = "Это обязательное поле";
    }else{
      document.getElementById('err_login').innerHTML = "";
    }
    if( passw == '' ){
      document.getElementById('err_passw').innerHTML = "Это обязательное поле";
    }else{
      document.getElementById('err_passw').innerHTML = "";
    }
  }





}


function logout(){

  config = {}
  console.log("logout");

  axios.post(baseurl + 'auth/logout',{
    headers: {
        'Authorization':'Token ' + localStorage.getItem('token')
    }
  }).then(function(r){
    if( r.status == 200 ){
      if( r['data'].status_code == 200 ){
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        //localStorage.removeItem('id');
        window.location.href = 'test.html';
      }
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );


}
