const fs = require('fs');
const http = require('http');
const url = require('url');

////////////////////////////
//SERVER
// Create server
// each time a request hits our server,
// the hello from server callback function will be called
// lets get the data synchronously one time when the browser loads
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// parse the data to an object
const dataObj = JSON.parse(data);

const server = http.createServer((req, res)=>{
  console.log('req.url: ', req.url);
  const pathName = req.url;

  if (pathName === '/' || pathName === '/overview') {
    res.end('This is the overview');
  } else if (pathName === '/product') {
    res.end('This is the product');
  } else if (pathName === '/api'){
    res.writeHead(200, {'Content-type' : 'application/json'});
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type' : 'text/html',
      'my-own-header' : 'hello-world'
    });
    res.end('<h1>Page not found</h1>');
  }
})

// Start server.
// 8000 port is what we listen to.
// it is a sub address on a certain host.
// can define a local host (current computer)
// The default standard ip address is 127.0.0.1.
server.listen(8000, '127.0.0.1', () =>{
  console.log('Listening to requests on port 8000');
})