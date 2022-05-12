

function page_content() {

  if( !is_login() ){
    window.location.href = 'sign_up.html';
  }

  let url = baseurl + 'bookings/';
  console.log(url);
  axios.get( url, {
    headers: {
        'Authorization':'Token ' + localStorage.getItem('token')
    }
  }).then(function(r){
    console.log(r);
    if( r.status == 200 ){
      if( r['data']['status_code'] == 200 ){
        book_list = document.getElementById('book_list');
        for( let i = 0; i < r['data']['data'].length; i++ ){

          let _book_id = r['data']['data'][i]['id'];
          let _room_id = r['data']['data'][i]['room'];
          let _arrivalDate = r['data']['data'][i]['arrivalDate'];
          let _departureDate = r['data']['data'][i]['departureDate'];
          let _additionalDay = r['data']['data'][i]['dateApproach'] == '1';
          let _personCount = r['data']['data'][i]['adultCount'];
          let _paid_status = r['data']['data'][i]['isPaid'];

          let book = document.createElement('div');

          let room = document.createElement('div');
          let arrivalDate = document.createElement('div');
          let departureDate = document.createElement('div');
          let additionalDay = document.createElement('div');
          let personCount = document.createElement('div');
          let paid_status = document.createElement('div');

          let update_book = document.createElement('button');
          let delete_book = document.createElement('button');

          room.innerHTML = "Номер "; change_room_title( _room_id, room );
          arrivalDate.innerHTML = "Дата прибытия " + _arrivalDate;
          departureDate.innerHTML = "Дата выезда " + _departureDate;
          additionalDay.innerHTML = "Доп. день на въезд  " + ( _additionalDay ? '✅':'❌' );
          personCount.innerHTML = "Количество персон " + _personCount;
          paid_status.innerHTML = "Статус оплаты " + ( _paid_status ? '✅':'❌' );
          update_book.innerHTML = "Изменить бронирование";
          update_book.setAttribute('class','mt-3 bg-Black active:bg-Cyan active:text-Black font-semibold text-Green rounded px-5 py-1 border-Cyan');
          update_book.setAttribute('onclick','window.location.href=\'booking.html?book_id='+_book_id+'\';');
          delete_book.innerHTML = "Удалить бронирование";
          delete_book.setAttribute('class','m-3 bg-Black active:bg-Cyan active:text-Black font-semibold text-Green rounded px-5 py-1 border-Cyan');
          delete_book.setAttribute('onclick','delete_book_dialog('+_book_id+')');
          delete_book.setAttribute('id','delete_book_'+_book_id);



          book.appendChild(room);
          book.appendChild(arrivalDate);
          book.appendChild(departureDate);
          book.appendChild(additionalDay);
          book.appendChild(personCount);
          book.appendChild(paid_status);

          if( isNotInThePast(new Date(_departureDate)) ){
            book.appendChild(update_book);
            book.appendChild(delete_book);
          }


          book.setAttribute('class', 'border-Cyan rounded border-solid px-4 mt-10 items-center flex flex-col');
          book.setAttribute('id','book_'+_book_id);

          book_list.appendChild( book );

        }
      }
    }else{
      //console.log('buh');
      throw {
        name: 'NetworkError',
        message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );

}

function change_room_title( room_id, element ) {
  let url = baseurl + 'room/' + room_id;
    axios.get(url).then(function(r){
    if( r['status'] == 200 ){
      if( r['data']['status_code'] == 200 ){
        let content = element.innerHTML;
        element.innerHTML = content + r['data']['data']['title'];
      }
    }else{
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );

}

function isNotInThePast(date) {
  const today = new Date();

  return date >= today;
}


function delete_book_dialog( book_id ) {
  del_button = document.getElementById('delete_book_'+book_id);
  del_button.style.display = 'none';
  confirm_dialog = document.createElement('p');
  cancel_button = document.createElement('button');
  confirm_button = document.createElement('button');
  cancel_button.setAttribute('class', 'bg-Black active:bg-Cyan active:text-Black font-semibold text-Green rounded px-5 py-1 border-Cyan');
  confirm_button.setAttribute('class', 'm-3 bg-Red active:bg-Cyan active:text-Black font-semibold text-Black rounded px-5 py-1 border-Red');
  confirm_dialog.innerHTML = "Вы уверены, что хотите <br> удалить бронирование? ";
  cancel_button.innerHTML = "Нет, не удалять бронь";
  confirm_button.innerHTML = "Да удалить бронь";

  confirm_dialog.setAttribute('id','delete_book_'+book_id+'_dialog');
  cancel_button.setAttribute('id','delete_book_'+book_id+'_cancel');
  confirm_button.setAttribute('id','delete_book_'+book_id+'_confirm');
  cancel_button.setAttribute('onclick','cancel_delete_book_dialog('+book_id+')');
  confirm_button.setAttribute('onclick','delete_book('+book_id+')');

  del_button.after( confirm_button );
  del_button.after( cancel_button );
  del_button.after( confirm_dialog );
}


function cancel_delete_book_dialog( book_id ) {

  document.getElementById('delete_book_'+book_id+'_dialog').remove();
  document.getElementById('delete_book_'+book_id+'_cancel').remove();
  document.getElementById('delete_book_'+book_id+'_confirm').remove();
  del_button = document.getElementById('delete_book_'+book_id);
  del_button.style.display = 'block';

}


function delete_book( book_id ) {

  let url = baseurl + 'bookings/';

  axios.delete(url,{
    data:{
      id:book_id
    },
    headers: {
      'Authorization':'Token ' + localStorage.getItem('token')
    },
  }).then(function(r){
    if( r.status == 200 ){
      if( r['data']['status_code'] ){
        window.location.reload();
      }
    }else{
      throw {
        name: 'NetworkError',
        message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );

}
