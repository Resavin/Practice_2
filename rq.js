baseurl = 'http://130.162.173.167/api/'

url = baseurl + 'rooms'

axios
  .get( url )
  .then(response => console.log( response ))
  .catch(error => console.log(error));
