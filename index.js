const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////
//SERVER
// Create server
// each time a request hits our server,
// the hello from server callback function will be called

// lets get the data synchronously one time when the browser loads
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// parse the data to an object
const dataObj = JSON.parse(data);
// console.log('dataObj:',dataObj);
// console.log(slugify('Fresh Avocados', {lower: true})); // prints fresh-avocados

const slugs = dataObj.map(el=> slugify(el.productName, {lower: true}));
console.log(slugs);

const server = http.createServer((req, res)=>{
  console.log('req.url: ', req.url);
  console.log(url.parse(req.url, true));
  const {pathname} = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {'Content-type' : 'text/html'});
    // loop through dataObj array and replace them as placeholders in the template
    // join to convert the array into a string
    const cardsHtml = dataObj.map(el=> replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

  // Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, {'Content-type' : 'text/html'});
    console.log('Entered product')
    let params = new URLSearchParams(req.url);
    console.log('params:', params);
    let idLong = params.get("/product?");
    let id = idLong.substring(idLong.lastIndexOf('=') + 1)
    console.log('id:', id);

    const product = dataObj[id];
    console.log('product:', product);
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

  // API
  } else if (pathname === '/api'){
    res.writeHead(200, {'Content-type' : 'application/json'});
    res.end(data);

  // Not found
    //
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