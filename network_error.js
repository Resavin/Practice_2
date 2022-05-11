function network_error(error) {
  body = document.getElementsByTagName("BODY")[0];
  body.innerHTML = "";
  error_div = document.createElement('div');
  error_div.setAttribute('class','flex flex-col items-center font-sans text-xl text-Green font-bold');
  error_div.innerHTML = 'Ошибка сети, проверте своё подключегие к сети и перезагрузите страницу';
  body.appendChild( error_div );
}

/*
axios.post(baseurl + 'auth/logout',{
  headers: {
      'Authorization':'Token ' + localStorage.getItem('token')
  }
}).then(function(r){
  if( r.status == 200 ){
    *****
    }else{
    throw {
       name: 'NetworkError',
       message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );

*/
