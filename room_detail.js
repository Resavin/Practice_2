baseurl = 'http://130.162.173.167/api/'


function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}


function page_content(){

  let url = baseurl + 'room/' + getAllUrlParams()['room'];
  //console.log(url);
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
          // console.log(r['data']['data']['images'][i]);
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

        //console.log(r['data']['data']);
      }
    }
    //console.log(r);

  });



  url = baseurl + 'room/' + getAllUrlParams()['room'] + '/date';
  busy_dates = ''
  axios.get(url).then(function(r){
    if( r['status'] == 200 ){
      if( r['data']['status_code'] == 200 ){
        busy_dates = r['data']['data']
        //console.log(busy_dates);

        const DateTime = easepick.DateTime;
              const bookedDates = busy_dates.map(d => {
                  if (d instanceof Array) {
                    const start = new DateTime(d[0], 'YYYY-MM-DD');
                    const end = new DateTime(d[1], 'YYYY-MM-DD');
                    //console.log(d);
                    return [start, end];
                  }

                  return new DateTime(d, 'YYYY-MM-DD');
              });
              const picker = new easepick.create({
                element: document.getElementById('datepicker_start'),
                css: [
                  'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.1.3/dist/index.css',
                  'https://easepick.com/assets/css/demo_hotelcal.css',
                ],
                setup(picker) {
                  picker.on('select', (e) => {
                    const { view, date, target } = e.detail;
                    // do something
                    //console.log("BRUH");
                    calculate_cost();
                  });
                },
                grid: 1,
                calendars: 1,
                // documentClick: false,
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
        //console.log(r['data']['data']);
        cost.innerHTML = "Это будет стоить " + r['data']['data']['cost'] + " денег"
      }
    }
  });



};
