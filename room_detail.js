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

        description.innerHTML = r['data']['data']['description'];
        description.setAttribute( 'class', 'text-Green w-96 mt-5 border-solid border-Cyan px-3 py-2 font-bold font-sans font-base flex flex-col items-center');
        room.setAttribute('class', 'mb-1');
        amenities.setAttribute('class', '');
        title.innerHTML = r['data']['data']['title'];
        title.setAttribute( 'class', 'text-2xl italic flex flex-col items-center');
        cost.innerHTML = "Cтоит " + r['data']['data']['cost'] + " денег в день; ";
        capacity.innerHTML = "номер на " + r['data']['data']['capacity'] + " персон; ";
        type.innerHTML = "Крутость " + r['data']['data']['type'];

        for( let i = 0; i < r['data']['data']['images'].length; i++ ){
          var image = document.createElement('img');
          image.setAttribute( 'height', '100' );
          // image.setAttribute( 'class', 'text-Green font-bold font-sans font-base flex flex-col items-center');
          images.setAttribute( 'src', r['data']['data']['images'][i] );
          images.appendChild( image );
        }

        fullRoom.appendChild(title);
        fullRoom.appendChild(description);
        fullRoom.appendChild(amenities);
        fullRoom.appendChild(room);
        room.appendChild(cost);
        room.appendChild(capacity);
        room.appendChild(type);
        fullRoom.appendChild(images);

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







};



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
                cost.innerHTML = "Это будет стоить " + r['data']['data']['cost'] + " денег";

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
