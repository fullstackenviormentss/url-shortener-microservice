// server.js
// where your node app starts

// init project
const express = require('express')
const mongoose = require('mongoose')
const Url = require('./url')
const randomStr = require('random-str')
const Regex = require('regex')

const app = express()

mongoose.connect('mongodb://fakey:password@ds247327.mlab.com:47327/mclint-mongo');
mongoose.Promise = global.Promise;
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/new', async function(request, response){
  let regex = new Regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
  if(regex.test(request.query.url))
  {
    let url = await Url.findOne({original_url: request.query.url});
    if(url){
      response.send(url);
    }
    else{
      let shortUrl = await generateShortUrl();
      let newUrl = {original_url: request.query.url, short_url: `${request.headers['host']}/${shortUrl}`};
      Url.create(newUrl);

      response.send(newUrl);
    }
  }
  else{
    response.status(422).send({error: 'Invalid URL provided.'});
  }
});

async function generateShortUrl(){
  let shortUrl = randomStr(4);
  let existingUrl = await Url.findOne({short_url: shortUrl});
  
  if(existingUrl)
    return generateShortUrl();
  
  else
    return shortUrl;
}

app.get('/:url', async function(request, response){
  let url = `${request.headers['host']}/${request.params.url}`;
  let existingUrl = await Url.findOne({short_url: url});
  
  if(existingUrl){
    response.redirect(existingUrl.original_url);
  }
  else{
    response.status(404).send({error: 'No existing address found'});
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
