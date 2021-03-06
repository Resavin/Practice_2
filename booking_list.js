

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
        if(r['data']['data'].length >= 3)
          book_list.setAttribute('class', '-mt-5 items-center grid grid-cols-3 flex flex-col text-Yellow drop-shadow-2xl');
        if(r['data']['data'].length == 2)
          book_list.setAttribute('class', '-mt-5 items-center grid grid-cols-2 flex flex-col text-Yellow drop-shadow-2xl');
        if(r['data']['data'].length == 1)
          book_list.setAttribute('class', '-mt-5 items-center grid grid-cols-1 flex flex-col text-Yellow drop-shadow-2xl');


        for( let i = 0; i < r['data']['data'].length; i++ ){

          let _book_id = r['data']['data'][i]['id'];
          let _room_id = r['data']['data'][i]['room'];
          let _arrivalDate = r['data']['data'][i]['arrivalDate'];
          let _departureDate = r['data']['data'][i]['departureDate'];
          let _additionalDay = r['data']['data'][i]['dateApproach'] == '1';
          let _personCount = r['data']['data'][i]['adultCount'];
          let _paid_status = r['data']['data'][i]['isPaid'];

          let book = document.createElement('div');

          let room = document.createElement('a');
          // let arrivalDate = document.createElement('span');
          let arrivalDate = document.createElement('div');
          let arrivalDate2 = document.createElement('span');
          let departureDate = document.createElement('span');
          let departureDate2 = document.createElement('span');
          let additionalDay = document.createElement('div');
          let personCount = document.createElement('span');
          let personCount2 = document.createElement('span');
          let paid_status = document.createElement('div');
          let prostoDiv = document.createElement('div');
          let horizontalLine = document.createElement('hr');
          let horizontalLine2 = document.createElement('hr');

          let update_book = document.createElement('button');
          let delete_book = document.createElement('button');

          // room.innerHTML = "?????????? ";
          room.setAttribute('href','room_detail.html?room=' + _room_id );
          room.setAttribute('class', 'no-underline text-Blue hover:bg-Grey/[.3] -px-2 -py-1\
               rounded-lg active:text-Cyan  items-center flex flex-col');
          change_room_title( _room_id, room );
          // arrivalDate.innerHTML = "???????? ????????????????: ";
          // arrivalDate2.innerHTML = _arrivalDate;
          // arrivalDate2.setAttribute('class', 'text-Cyan space-x-10');
          // // departureDate2.setAttribute('class', 'text-Purle');
          // departureDate.innerHTML = "???????? ???????????? ";
          // departureDate2.innerHTML = _departureDate;
          // departureDate.setAttribute('class', 'text-Cyan space-x-10');
          // departureDate2.setAttribute('class', 'text-Cyan space-x-10');
          arrivalDate.innerHTML = "?????????? ???????????????????? "
          arrivalDate.setAttribute('class', 'flex flex-col items-center')
          arrivalDate2.innerHTML =  _arrivalDate + " ??? " + _departureDate;
          arrivalDate2.setAttribute('class', 'text-Cyan  flex flex-col items-center')
          additionalDay.innerHTML = "??????. ???????? ???? ??????????  " + ( _additionalDay ? '???':'???' );
          // additionalDay.setAttribute('class', 'w-full')
          personCount.innerHTML = "???????????????????? ????????????  ";
          personCount2.innerHTML = _personCount;
          personCount2.setAttribute('class','text-Cyan  ');
          paid_status.innerHTML = "???????????? ???????????? " + ( _paid_status ? '???':'???' );
          update_book.innerHTML = "???????????????? ";
          update_book.setAttribute('class','mt-3 bg-Black active:bg-Cyan active:text-Black font-semibold text-Green rounded px-5 py-1 border-Cyan ');
          update_book.setAttribute('onclick','window.location.href=\'booking.html?book_id='+_book_id+'\';');
          delete_book.innerHTML = "?????????????? ";
          delete_book.setAttribute('class','m-3 bg-Black active:bg-Cyan active:text-Black font-semibold text-Green rounded px-5 py-1 border-Cyan ');
          delete_book.setAttribute('onclick','delete_book_dialog('+_book_id+')');
          delete_book.setAttribute('id','delete_book_'+_book_id);



          book.appendChild(room);
          book.appendChild(arrivalDate);
          book.appendChild(arrivalDate2);
          book.appendChild(horizontalLine);
          book.appendChild(prostoDiv);
          book.appendChild(departureDate);
          book.appendChild(departureDate2);
          book.appendChild(additionalDay);
          book.appendChild(personCount);
          book.appendChild(personCount2);
          book.appendChild(paid_status);

          if( isNotInThePast(new Date(_departureDate)) ){
            book.appendChild(update_book);
            book.appendChild(delete_book);
          }


          book.setAttribute('class', 'mr-5 border-Cyan rounded border-solid px-4 mt-10 ');
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
  confirm_dialog.innerHTML = "???? ??????????????, ?????? ???????????? <br> ?????????????? ????????????????????????? ";
  cancel_button.innerHTML = "??????, ???? ?????????????? ??????????";
  confirm_button.innerHTML = "???? ?????????????? ??????????";

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
