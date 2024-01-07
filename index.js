const fs = require('fs');
const http = require('http');
const url = require('url');

////////////////////////////
//SERVER
// Create server
// each time a request hits our server,
// the hello from server callback function will be called
const replaceTemplate = (temp, product) => {
  // trick - wrapping with /g flag makes it global and all PRODUCTNAME
  // will be replaced and not just the first one.
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }
  return output;
}
// lets get the data synchronously one time when the browser loads
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// parse the data to an object
const dataObj = JSON.parse(data);
// console.log('dataObj:',dataObj);

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
    let id = params.get("/product?=id=");
    console.log('id:', id);
    const product = dataObj['0'];
    console.log('product:', product);
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

  // API
  } else if (pathname === '/api'){
    res.writeHead(200, {'Content-type' : 'application/json'});
    res.end(data);

  // Not found
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