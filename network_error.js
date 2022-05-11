function network_error(error) {
  body = document.getElementsByTagName("BODY")[0];
  body.innerHTML = "";
  error_div = document.createElement('div');
  error_div.setAttribute('class','flex flex-col items-center font-sans text-xl text-Green font-bold');
  error_div.innerHTML = 'Ошибка сети, проверте своё подключегие к сети и перезагрузите страницу';
  body.appendChild( error_div );
}
