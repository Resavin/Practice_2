baseurl = 'http://130.162.173.167/api/'

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

function text_case( num, one, less_than_five, more_than_five ) {
  if( num > 10 && num < 20 ){
    return more_than_five;
  }
  if (num % 10 == 1){
    return one;
  }else if (num % 10 > 1 && num % 10 < 5) {
    return less_than_five;
  }else if (num % 10 > 5 ){
    return more_than_five;
  }else if (num % 10 == 0 ){
    return more_than_five;
  }else{
    return more_than_five;
  }
}

function time_since(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + text_case(Math.floor(interval), " год", " года", " лет") + " назад";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + text_case(Math.floor(interval), " месяц", " месяца", " месяцев") + " назад";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + text_case(Math.floor(interval), " день", " дня", " дней") + " назад";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + text_case(Math.floor(interval), " час", " часа", " часов") + " назад";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + text_case(Math.floor(interval), " минуту", " минуты", " минут") + " назад";
  }
  return Math.floor(seconds) + text_case(Math.floor(interval*60), " секунду", " секунды", " сенунд") + " назад";
}

function page_content(){

  let url = baseurl + 'room/' + getAllUrlParams()['room'];
    axios.get(url).then(function(r){
    if( r['status'] == 200 ){
      if( r['data']['status_code'] == 200 ){
        var fullRoom = document.getElementById('fullRoom');
        var room = document.createElement('div');
        var amenities = document.createElement('div');
        var title = document.createElement('div');
        var cost = document.createElement('span');
        var capacity = document.createElement('span');
        var type = document.createElement('span');
        var description = document.createElement('div');
        var images = document.createElement('div');
        var fullRoom2 = document.createElement('div');
        var fullRoom1 = document.createElement('div');

        fullRoom1.setAttribute( 'class', 'mt-2 grid md:grid-cols-1 lg:grid-cols-2');
        description.innerHTML = r['data']['data']['description'];
        description.setAttribute( 'class', 'w-[32rem] h-[20rem] text-Green mt-5 border-solid border-Cyan px-3 py-2 font-bold font-sans font-base flex flex-col items-center');
        fullRoom2.setAttribute( 'class', 'w-[32rem] mr-5 text-Green  mt-5 border-solid border-Cyan px-1 py-2 font-bold font-sans font-base flex flex-col items-center');
        room.setAttribute('class', 'mb-1');
        amenities.setAttribute('class', 'mt-2');
        title.innerHTML = r['data']['data']['title'];
        title.setAttribute( 'class', 'text-2xl italic flex flex-col items-center');
        cost.innerHTML = "Cтоит " + r['data']['data']['cost'] + " септимов в день; ";
        capacity.innerHTML = "номер на " + r['data']['data']['capacity'] + " персон; ";
        type.innerHTML = "Крутость " + r['data']['data']['type'];
        if(r['data']['data']['images'].length > 1)
          images.setAttribute( 'class', 'grid grid-cols-2' );
        if(r['data']['data']['images'].length == 1)
          images.setAttribute( 'class', 'grid grid-cols-1' );

        for( let i = 0; i < r['data']['data']['images'].length; i++ ){
          var image = document.createElement('img');
          image.setAttribute( 'width', '240' );
          image.setAttribute( 'class', 'rounded-lg' );
          // image.setAttribute( 'width', '250' );
          // image.setAttribute( 'class', 'text-Green font-bold font-sans font-base flex flex-col items-center');
          image.setAttribute( 'src', r['data']['data']['images'][i] );
          if(i%2 != 0)
            image.setAttribute( 'class', 'ml-2 rounded-lg' );
          images.appendChild( image );
        }

        fullRoom.appendChild(title);
        fullRoom.appendChild(fullRoom1);
        fullRoom1.appendChild(fullRoom2);
        fullRoom1.appendChild(description);
        fullRoom2.appendChild(images);
        fullRoom2.appendChild(amenities);
        fullRoom2.appendChild(room);
        room.appendChild(cost);
        room.appendChild(capacity);
        room.appendChild(type);

        amenities.innerHTML = "Удобства";
        for( let i = 0; i < r['data']['data']['amenities'].length; i++ ){
          amenity = document.createElement('div');
          amenity.innerHTML = r['data']['data']['amenities'][i]['text'];
          amenity.setAttribute( 'class', 'text-Cyan');
          amenities.setAttribute( 'class', 'text-Green mt-2 mb-2 font-bold font-sans font-base flex flex-col items-center');
          amenities.appendChild(amenity);
        }



              }
    }else{
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );



  url = baseurl + 'room/' + getAllUrlParams()['room'] + '/date';
  busy_dates = ''
  axios.get(url).then(function(r){
    if( r['status'] == 200 ){
      if( r['data']['status_code'] == 200 ){
        busy_dates = r['data']['data']

        const DateTime = easepick.DateTime;
              const bookedDates = busy_dates.map(d => {
                  if (d instanceof Array) {
                    const start = new DateTime(d[0], 'YYYY-MM-DD');
                    const end = new DateTime(d[1], 'YYYY-MM-DD');
                                        return [start, end];
                  }

                  return new DateTime(d, 'YYYY-MM-DD');
              });
              const picker = new easepick.create({
                element: document.getElementById('start_date'),
                css: [
                  'dist/date_pick.css'
                ],
                setup(picker) {
                  picker.on('select', (e) => {
                    const { view, date, target } = e.detail;
                    calculate_cost();
                  });
                },
                grid: 2,
                calendars: 2,
                                inline: true,
                lang: "ru-RU",
                plugins: ['RangePlugin', 'LockPlugin'],
                RangePlugin: {
                  elementEnd: "#end_date",
                  tooltipNumber(num) {
                    return num - 1;
                  },
                  locale: {
                    one: "ночь",
                    few: "ночи",
                    many: "ночей",
                    other: "ночей"
                  },
                },
                LockPlugin: {

                  minDate: new Date(),
                  minDays: 2,
                  inseparable: true,
                  filter(date, picked) {
                    if (picked.length === 1) {
                      const incl = date.isBefore(picked[0]) ? '[)' : '(]';
                      return !picked[0].isSame(date, 'day') && date.inArray(bookedDates, incl);
                    }

                    return date.inArray(bookedDates, '[)');
                  },
                }


              });
              document.getElementById('start_date').style.display = "none";
              document.getElementById('end_date').style.display = "none";


      }
    }else{
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );

  // добавление комментов

  url = baseurl + 'room/' + getAllUrlParams()['room'] + '/comments';

  if( is_login() ){
    header = {
        'Authorization':'Token ' + localStorage.getItem('token')
    }
  }else{
    header = {}
  }

  axios.get(url,{headers:header} ).then(function(r){
    if( r.status == 200 ){
        if( r['data']['status_code'] == 200 ){
          console.log( r['data']['data']);
          if( r['data']['data']['can_comment'] ){
            comments_field = document.getElementById('comments_field');
            comments_field.setAttribute('class','items-center flex flex-col w-full text-center block');

            input_textbox = document.createElement('input');
            input_textbox.setAttribute('type','text');
            input_textbox.setAttribute('placeholder','оставьте здесь своё мнение об этом номере');
            input_textbox.setAttribute('id','input_textbox');
            input_error = document.createElement('div');
            input_error.setAttribute('id','input_error');
            input_button = document.createElement('button');
            input_button.innerHTML = "Отправить";
            input_button.setAttribute('onclick','post_comment()');
            input_button.setAttribute('id','input_button');

            input_textbox.setAttribute('class','w-2/5 text-center block flex m-3 bg-Black font-semibold text-Green rounded px-5 py-1 border-Cyan');
            //input_error.setAttribute('class','m-3 bg-Black font-semibold text-Green rounded px-5 py-1 border-Cyan');
            input_button.setAttribute('class','m-3 bg-Green active:bg-Green active:text-Black font-semibold text-Black rounded px-5 py-1 border-Green ');


            comments_field.appendChild( input_textbox );
            comments_field.appendChild( input_error );
            comments_field.appendChild( input_button );


          }

          comments_list = document.getElementById('comments_list');
          if(r['data']['data']['comments'].length >= 3)
            comments_list.setAttribute('class', 'grid md:grid-cols-3  mr-5')
          if(r['data']['data']['comments'].length == 2)
            comments_list.setAttribute('class', 'grid md:grid-cols-2  mr-5')
          if(r['data']['data']['comments'].length == 1)
            comments_list.setAttribute('class', 'grid md:grid-cols-1  mr-5')

          for( var i = 0; i < r['data']['data']['comments'].length; i++ ){
            let comment_data = r['data']['data']['comments'][i];
            let comment_author = comment_data['author'];
            let comment_date = Date.parse(comment_data['created_date']);
            let comment_text = comment_data['text'];
            let comment_id = comment_data['id'];

            comment = document.createElement('div');

            author = document.createElement('a');
            date = document.createElement('div');
            text = document.createElement('div');

            comment.setAttribute('class','w-96 ml-5 border-Cyan text-md border-solid rounded focus:font-bold mt-3 font-medium py-4 px-4 rounded');

            author.innerHTML = comment_author['username'];
            author.setAttribute('href','user.html?user_login='+comment_author['username'] );
            author.setAttribute('class','rounded active:text-Black flex-col flex text-Blue font-extrabold no-underline grayscale-[30%] hover:grayscale-0 mt-2');

            date.innerHTML = time_since(comment_date);
            date.setAttribute("id","date_"+comment_id+"_comment");
            date.setAttribute("class","text-Grey italic");

            text.innerHTML = comment_text;
            text.setAttribute("id","text_"+comment_id+"_comment");
            text.setAttribute("class","font-bold");


            comment.appendChild(author);


            if( is_login() ){
              if( comment_author['username'] == localStorage.getItem('name') ){
                console.log('123123');
                edit_button = document.createElement('button');
                delete_button = document.createElement('button');

                //edit_button.setAttribute("name", "Изменить коммент");
                //delete_button.setAttribute("name", "Удалить коммент");
                edit_button.innerHTML = "Изменить коммент";
                delete_button.innerHTML = "Удалить коммент";

                edit_button.setAttribute("onclick","edit_comment("+comment_id+")" );
                delete_button.setAttribute("onclick","delete_comment_dialog("+comment_id+")" );

                edit_button.setAttribute("class","m-3 bg-Black active:bg-Cyan active:text-Black font-semibold text-Green rounded px-5 py-1 border-Cyan");
                delete_button.setAttribute("class","m-3 bg-Black active:bg-Cyan active:text-Black font-semibold text-Green rounded px-5 py-1 border-Cyan");

                edit_button.setAttribute("id","edit_"+comment_id+"_comment_button");
                delete_button.setAttribute("id","delete_"+comment_id+"_comment_button");

                comment.appendChild(edit_button);
                comment.appendChild(delete_button);
              }
            }

            comment.appendChild(date);
            comment.appendChild(text);

            comments_list.appendChild(comment);

          }
        }
    }else{
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
      }
    }
  }).catch( e => network_error(e) );

};

function edit_comment( comment_id ) {
  edit_button = document.getElementById("edit_"+comment_id+"_comment_button");
  delete_button = document.getElementById("delete_"+comment_id+"_comment_button");
  date = document.getElementById("date_"+comment_id+"_comment");
  text = document.getElementById("text_"+comment_id+"_comment");
  edit_button.style.display = 'none';
  delete_button.style.display = 'none';
  date.style.display = 'none';
  text.style.display = 'none';

  comments_field = document.getElementById('comments_field');

  input_textbox = document.createElement('input');
  input_textbox.setAttribute('type','text');
  input_textbox.setAttribute('placeholder','оставьте здесь свое мнение об этом номере');
  input_textbox.value = text.innerHTML;
  input_textbox.setAttribute('id','edit_input_textbox');
  input_error = document.createElement('div');
  input_error.setAttribute('id','edit_input_error');
  input_button = document.createElement('button');
  input_button.innerHTML = "Изменить";
  input_button.setAttribute('onclick','change_comment('+comment_id+')');
  input_button.setAttribute('id','edit_input_button');

  input_textbox.setAttribute('class','w-9/10 text-center block flex m-3 bg-Black font-semibold text-Green rounded px-5 py-1 border-Cyan');
  //input_error.setAttribute('class','m-3 bg-Black font-semibold text-Green rounded px-5 py-1 border-Cyan');
  input_button.setAttribute('class','m-3 bg-Green active:bg-Green active:text-Black font-semibold text-Black rounded px-5 py-1 border-Green ');

  text.after(input_button);
  text.after(input_error);
  text.after(input_textbox);
}



function delete_comment_dialog( comment_id ) {
  edit_button = document.getElementById("edit_"+comment_id+"_comment_button");
  delete_button = document.getElementById("delete_"+comment_id+"_comment_button");
  date = document.getElementById("date_"+comment_id+"_comment");
  text = document.getElementById("text_"+comment_id+"_comment");
  edit_button.style.display = 'none';
  delete_button.style.display = 'none';

  confirm_dialog = document.createElement('p');
  cancel_button = document.createElement('button');
  confirm_button = document.createElement('button');
  cancel_button.setAttribute('class', 'bg-Black active:bg-Cyan active:text-Black font-semibold text-Green rounded px-5 py-1 border-Cyan');
  confirm_button.setAttribute('class', 'm-3 bg-Red active:bg-Cyan active:text-Black font-semibold text-Black rounded px-5 py-1 border-Red');
  confirm_dialog.innerHTML = "Вы уверены, что хотите <br> удалить комментарий? ";
  cancel_button.innerHTML = "Нет, не удалять комментарий";
  confirm_button.innerHTML = "Да удалить комментарий";


  cancel_button.style.display = 'block';
  confirm_button.style.display = 'block';

  confirm_dialog.setAttribute('id','delete_comment_'+comment_id+'_dialog');
  confirm_dialog.setAttribute('class','text-Cyan');
  cancel_button.setAttribute('id','delete_comment_'+comment_id+'_cancel');
  confirm_button.setAttribute('id','delete_comment_'+comment_id+'_confirm');
  cancel_button.setAttribute('onclick','cancel_delete_comment_dialog('+comment_id+')');
  confirm_button.setAttribute('onclick','delete_comment('+comment_id+')');

  text.after( confirm_button );
  text.after( cancel_button );
  text.after( confirm_dialog );
}

function cancel_delete_comment_dialog( comment_id ) {
  document.getElementById('delete_comment_'+comment_id+'_dialog').remove();
  document.getElementById('delete_comment_'+comment_id+'_cancel').remove();
  document.getElementById('delete_comment_'+comment_id+'_confirm').remove();
  edit_button = document.getElementById("edit_"+comment_id+"_comment_button");
  delete_button = document.getElementById("delete_"+comment_id+"_comment_button");
  edit_button.style.display = 'inline';
  delete_button.style.display = 'inline';
}

function delete_comment( comment_id ) {

  if( is_login() ){
    header = {
        'Authorization':'Token ' + localStorage.getItem('token')
    }
  }else{
    header = {}
  }


  url = baseurl + 'room/' + getAllUrlParams()['room'] + '/comments';

  axios.delete(url,{headers:header,data:{id:comment_id}} ).then(function(r){
    if( r.status == 200 ){
        if( r['data']['status_code'] == 200 ){
          console.log( r['data']['data']);
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

function change_comment( comment_id ) {

  text = document.getElementById('edit_input_textbox').value;
  error = document.getElementById('edit_input_error');
  if( text == "" ){

    error.innerHTML = "Комментарий не может быть пустым";
  }else{
    error.innerHTML = "";
    if( is_login() ){
      header = {
          'Authorization':'Token ' + localStorage.getItem('token')
      }
    }else{
      header = {}
    }

    data = {
      id:comment_id,
      text:text
    }
    url = baseurl + 'room/' + getAllUrlParams()['room'] + '/comments';

    axios.put(url,data,{headers:header} ).then(function(r){
      if( r.status == 200 ){
          if( r['data']['status_code'] == 200 ){
            console.log( r['data']['data']);
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

}

function post_comment() {

  text = document.getElementById('input_textbox').value;
  error = document.getElementById('input_error');
  if( text == "" ){

    error.innerHTML = "Комментарий не может быть пустым";
  }else{
    error.innerHTML = "";
    if( is_login() ){
      header = {
          'Authorization':'Token ' + localStorage.getItem('token')
      }
    }else{
      header = {}
    }

    data = {
      text:text
    }
    url = baseurl + 'room/' + getAllUrlParams()['room'] + '/comments';

    axios.post(url,data,{headers:header} ).then(function(r){
      if( r.status == 200 ){
          if( r['data']['status_code'] == 200 ){
            console.log( r['data']['data']);
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

}


function calculate_cost(){

  let start_date = document.getElementById('start_date').value;
  let end_date = document.getElementById('end_date').value;
  let additional_day = document.getElementById('guaranteed_booking').checked;
  let person_count = document.getElementById('count').value;

  var params = {};

  if( start_date != '' ){
    params['arrivalDate'] = start_date;
  }
  if( end_date != '' ){
    params['departureDate'] = end_date;
  }

  let url = baseurl + 'room/' + getAllUrlParams()['room'] + '/cost' ;

  axios.get(url, {params:params}).then(function(r){
    if( r['status'] == 200 ){
      if( r['data']['status_code'] == 200 ){
        cost = document.getElementById('cost');
                cost.innerHTML = "Это будет стоить " + r['data']['data']['cost'] + " септимов";

        let book = document.createElement('a');

        let urlParam = '';
        let end_page = 'booking.html'

        urlParam += "?room="
        urlParam += getAllUrlParams()['room']


        if ( start_date != '' ){
          urlParam += '&';
          urlParam += 'arrivalDate=';
          urlParam +=  start_date;
        }


        if ( end_date != '' ){
          urlParam += '&';
          urlParam += 'departureDate=';
          urlParam +=  end_date;
        }


        if ( additional_day != '' ){
          urlParam += '&';
          urlParam += 'additionalDay=';
          urlParam +=( additional_day );
        }

        if ( person_count != '' ){
          urlParam += '&';
          urlParam += 'personCount='
          urlParam +=  person_count;
        }

        if( !is_login() ){
          //param = window.location.search.replace('&','\&amp;\g').replace('?','\&qu;\g');
          param = encodeURIComponent(urlParam)
          urlParam = '?r=' + 'booking.html' + param;
          end_page = 'sign_up.html'
        }

        book.setAttribute('href',end_page + urlParam );
        book.setAttribute('class', 'px-2 flex-col items-center hover:bg-Grey/[.3] \
              hover:shadow-md hover:shadow-Cyan rounded active:text-Cyan  text-Blue \
              no-underline hover:grayscale-0 mt-10 ml-2' );
        book.innerHTML = " Забронировать";

        cost.appendChild(book);
      }
    }else{
      throw {
         name: 'NetworkError',
         message: 'A network error occurred.'
        }
      }
    }).catch( e => network_error(e) );

};
