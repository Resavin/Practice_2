baseurl = 'http://130.162.173.167/api/'

var user;


function change_pass(){

  passw = document.getElementById('passw').value;
  passw_2 = document.getElementById('passw_2').value;

  if( passw_2 != '' && passw != '' && passw == passw_2 ){
    let profile = user;
    profile['password'] = passw;
    //user['password'] = passw;
    header = {
      headers: {
        'Authorization':'Token ' + localStorage.getItem('token')
      }
    }
    axios.put(url, profile, header).then(function(r){
      if( r.status == 200){

      }else{
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
        }
      }
    }).catch( e => network_error(e) );
    //console.log(passw);
  }else{
    check_pass( 1 );
  }

}

function edit_user(){

  document.getElementById('username').removeAttribute('readonly');
  document.getElementById('email').removeAttribute('readonly');
  document.getElementById('first_name').removeAttribute('readonly');
  document.getElementById('second_name').removeAttribute('readonly');
  document.getElementById('phone').removeAttribute('readonly');

  document.getElementById('save_user').style.display = "block";
  document.getElementById('edit_user').style.display = "none";

}

function save_user(){
  let url = baseurl + 'user';
  console.log(url);

  username = document.getElementById('username').value;
  email = document.getElementById('email').value;
  phone = document.getElementById('phone').value;
  first_name = document.getElementById('first_name').value;
  second_name = document.getElementById('second_name').value;

  if( username != '' && email != '' && validateEmail(email) ){
    header = {
      headers: {
        'Authorization':'Token ' + localStorage.getItem('token')
      }
    }

    console.log(user);
    data = {};
    data['username'] = username;
    data['email'] = email;
    data['first_name'] = first_name;
    data['second_name'] = second_name;
    data['phone'] = phone;

    //data['username'] = username;
    //console.log(phone);

    console.log(data);

    axios.put(url, data, header).then(function(r){
      //console.log(r);
      if( r['status'] == 200 ){
        if( r['data']['status_code'] == 200 ){
          document.getElementById('error').innerHTML = '';
          localStorage.setItem( 'name', r['data']['data']['username'] );
          window.location.href = 'user.html?user_login=' + r['data']['data']['username'];
        }else{
          document.getElementById('error').innerHTML = r['data']['error'];
          //getElementsByClassName('className')
        }
      }else{
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
        }
      }
    }).catch( e => network_error(e) );
  }else{
    check_username();
    check_email();
  }

}


function page_content(){

  document.getElementById('email').style.display = "none";
  document.getElementById('first_name').style.display = "none";
  document.getElementById('second_name').style.display = "none";
  document.getElementById('phone').style.display = "none";
  document.getElementById('password').style.display = "none";
  document.getElementById('email_head').style.display = "none";
  document.getElementById('first_name_head').style.display = "none";
  document.getElementById('second_name_head').style.display = "none";
  document.getElementById('phone_head').style.display = "none";
  document.getElementById('password_head').style.display = "none";
  document.getElementById('edit_user').style.display = "none";
  document.getElementById('save_user').style.display = "none";
  document.getElementById('password').style.display = "none";
  document.getElementById('password_head').style.display = "none";

  let par = new URLSearchParams( window.location.search );
  let user_id = par.get('user_id');
  let user_login = par.get('user_login');
  let params = {};
  if( user_id != undefined ){
    params['id'] = user_id;
  }else if (user_login != undefined ) {
    params['username'] = user_login;
  }else{
    window.location.href = 'test.html';
  }


  if( user_login == localStorage.getItem('name') ){
    document.getElementById('email').style.display = "block";
    document.getElementById('first_name').style.display = "block";
    document.getElementById('second_name').style.display = "block";
    document.getElementById('phone').style.display = "block";
    document.getElementById('password').style.display = "block";
    document.getElementById('email_head').style.display = "block";
    document.getElementById('first_name_head').style.display = "block";
    document.getElementById('second_name_head').style.display = "block";
    document.getElementById('phone_head').style.display = "block";
    document.getElementById('password_head').style.display = "block";
    document.getElementById('edit_user').style.display = "block";
  }

  url = baseurl + 'user';

  axios.get(url, {params:params,
    headers: {
        'Authorization':'Token ' + localStorage.getItem('token')
    }
  } ).then(function(r){
    if( r['status'] == 200 ){
      if( r['data']['status_code'] == 200 ){
        console.log(r);
        document.getElementById('username').value = r['data']['data']['username'];

        user = r['data']['data'];

        if( localStorage.getItem('name') == r['data']['data']['username'] ){

          // document.getElementById('email').style.display = "block";
          // document.getElementById('first_name').style.display = "block";
          // document.getElementById('second_name').style.display = "block";
          // document.getElementById('phone').style.display = "block";
          // document.getElementById('password').style.display = "block";
          // document.getElementById('email_head').style.display = "block";
          // document.getElementById('first_name_head').style.display = "block";
          // document.getElementById('second_name_head').style.display = "block";
          // document.getElementById('phone_head').style.display = "block";
          // document.getElementById('password_head').style.display = "block";
          // document.getElementById('edit_user').style.display = "block";

          document.getElementById('email').value = r['data']['data']['email'];
          document.getElementById('first_name').value = r['data']['data']['first_name'];
          document.getElementById('second_name').value = r['data']['data']['second_name'];
          document.getElementById('phone').value = r['data']['data']['phone'];

        }

        console.log(r['data']['data']);
        //console.log('123');

      }else{
        document.getElementById('username_head').style.display = "none";
        document.getElementById('username').style.display = "none";
        document.getElementById('user_info').innerHTML = r['data']['error']
        //user_info
      }
    }else{
    throw {
       name: 'NetworkError',
       message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );


  console.log(user_id);
  console.log(user_login);

}
