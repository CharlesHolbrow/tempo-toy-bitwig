function request(method, path, body, cb) {
  var r = new XMLHttpRequest();
  r.open(method, path, true);
  
  if (typeof body === 'object') {
    r.setRequestHeader('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  r.addEventListener('error', function(){ cb(error, this.response); });
  r.addEventListener('load', function(){
    var result, error;
    try {
      result = JSON.parse(this.response);
    } catch (e){
      result = this.response;
    }
    cb(null, result)
  });

  r.send(body);
}

request('post', '/integrate', {}, (err, res)=>{
  console.log(err, res);
});
