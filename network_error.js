function network_error(error) {
  console.log(error);

  body = document.getElementsByTagName("BODY")[0];
  body.innerHTML = "";
  error_div = document.createElement('div');
  error_div.setAttribute('class','flex flex-col items-center font-sans text-xl text-Green font-bold');
  error_div.innerHTML = 'Ошибка сети, проверте своё подключение к сети и перезагрузите страницу';

  reload_button = document.createElement('button');
  reload_button.innerHTML = "Перезагрузить страницу";
  reload_button.setAttribute('class','bg-Black active:bg-Cyan active:text-Black font-semibold text-Green border-Cyan rounded border-solid px-5 w-96 h-7 mt-4');
  reload_button.setAttribute('onclick','window.location.reload();');
  body.appendChild( error_div );
  body.appendChild( reload_button );
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
