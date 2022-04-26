baseurl = 'http://130.162.173.167/api/'

function login(){
  var login = document.getElementById('login').value;
  var passw = document.getElementById('passw').value;
  var params = {}
  params['username'] = login;
  params['password'] = passw;

  //console.log(baseurl + 'auth/login');
  axios.post(baseurl + 'auth/login', params).then(function(r) {
    //console.log(r);
    if( r.status == 200 ){
      if( r['data'].status_code == 200 ){
        localStorage.setItem( 'token', r['data']['data']['token'] );
        localStorage.setItem( 'name', r['data']['data']['user']['username'] );
        //localStorage.setItem( 'id', r['data']['data']['user']['id'] );
        window.location.href = 'test.html';
      }else{
        document.getElementById('err_api').innerHTML = r['data']['error'];
      }

    }
    //code here
});
}


function logout(){

  config = {}
  console.log("logout");
  axios.post(baseurl + 'auth/logout',{
    headers: {
        'Authorization':'Token ' + localStorage.getItem('token')
    }
  }).then(function(r){
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    //localStorage.removeItem('id');
    window.location.href = 'test.html';
  });

}
