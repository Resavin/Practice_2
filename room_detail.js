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
  console.log(url);
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

        console.log(r['data']['data']);
      }
    }
    console.log(r);

  });

};



function calculate_cost(){

  count = document.getElementById('count').value;



};
