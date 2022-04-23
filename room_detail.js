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
        var room = document.getElementById('room');

        var title = document.createElement('div');
        var cost = document.createElement('div');
        var capacity = document.createElement('div');
        var description = document.createElement('div');
        var type = document.createElement('div');
        var images = document.createElement('div');
        var amenities = document.createElement('div');

        title.innerHTML = r['data']['data']['title'];
        cost.innerHTML = "Стоимость " + r['data']['data']['cost'] + " денег в день";
        capacity.innerHTML = "номер на " + r['data']['data']['capacity'] + " персон";
        description.innerHTML = r['data']['data']['description'];
        type.innerHTML = "Крутость " + r['data']['data']['type'];

        for( let i = 0; i < r['data']['data']['images'].length; i++ ){
          var image = document.createElement('img');
          image.setAttribute( 'height', '100' );
          image.setAttribute( 'src', r['data']['data']['images'][i] );
          images.appendChild( image );
        }

        amenities.innerHTML = "Удобства<br/>";
        for( let i = 0; i < r['data']['data']['amenities'].length; i++ ){
          amenity = document.createElement('div');
          amenity.innerHTML = r['data']['data']['amenities'][i]['text'];
          amenities.appendChild(amenity);
        }

        room.appendChild(title);
        room.appendChild(cost);
        room.appendChild(capacity);
        room.appendChild(description);
        room.appendChild(type);
        room.appendChild(images);
        room.appendChild(amenities);

              }
    }

  });



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
                element: document.getElementById('datepicker_start'),
                css: [
                  "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.1.5/dist/index.css"
                ],
                setup(picker) {
                  picker.on('select', (e) => {
                    const { view, date, target } = e.detail;
                                                            calculate_cost();
                  });
                },
                grid: 1,
                calendars: 1,
                                inline: true,
                lang: "ru-RU",
                plugins: ['RangePlugin', 'LockPlugin'],
                RangePlugin: {
                  elementEnd: "#datepicker_end",
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
              document.getElementById('datepicker_start').style.display = "none";
              document.getElementById('datepicker_end').style.display = "none";








      }
    }
  });







};



function calculate_cost(){

  let start_date = document.getElementById('datepicker_start').value;
  let end_date = document.getElementById('datepicker_end').value;
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
                cost.innerHTML = "Это будет стоить " + r['data']['data']['cost'] + " денег"
      }
    }
  });



};
