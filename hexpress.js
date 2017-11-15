"use strict";
const http = require('http');
const queryString = require('querystring');
const Handlebars = require('handlebars');
const fs = require('fs');

module.exports = function () {
  const endpoints = [];
  const middleWare = [];
  const unNamed = {};

  function getRoutesConstructor(path, callback){
    return {
      method:'GET',
      route:path,
      body: '',
      callback:callback
    }
  }
  function postRoutesConstructor(path, callback){
    return {
      method:'POST',
      route: path,
      body: {},
      callback: callback
    }
  }
  function useRoutesConstructor(routePrefix, callback){
    return {
      route:routePrefix,
      callback:callback
    }
  }

  function getParams(call,path) {
    let paramURL = call.route.split('/');
    let filledParams = path.split('/');
    let finalObj = {};
    if(paramURL.length===filledParams.length){
      for(let pos = 0; pos < paramURL.length; pos++){
        if(paramURL[pos] !== filledParams[pos]){
          if(paramURL[pos].indexOf(':') === -1) {
            return null;
          }
          finalObj[paramURL[pos].substring(1)]=filledParams[pos]
        }
      }
    }
    return finalObj;
  }

  function validRoute(call,path){
    let paramURL = call.route.split('/');
    let filledParams = path.split('/');
    if(paramURL.length===filledParams.length){
      for(let pos = 0; pos < paramURL.length; pos++){
        if(paramURL[pos] !== filledParams[pos]){
          if(paramURL[pos].indexOf(':') === -1) {
            return false;
          }
        }
      }
      return true;
    }
    return false
  }
  function fireZone(req, res) {
    const routeArray = req.url.split('?');
    const path = routeArray[0];
    var count = 0;
    if(middleWare.length !== 0){

      for(let useKey = 0; useKey < middleWare.length ; useKey++){
        console.log(routeArray[0].indexOf(middleWare[useKey].route))

        if(routeArray[0].indexOf(middleWare[useKey].route)===0){
          console.log('inside the useCall'),
          req.query = queryString.parse(routeArray[1]);

          res.send = function(string){
            res.writeHead(200, {'Content-Type': 'text/plain'})
            res.end(string);
          };

          res.json = function(obj){
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(obj));
          };

          var body = '';
          req.on('readable', function() {
            var chunk = req.read();
            if (chunk) body += chunk;
          });

          var actualKey = useKey;
          req.on('end', function() {
            // queryString is the querystring node built-in
            req.body = queryString.parse(body);
            count = count + 1;
            // console.log(middleWare.length, useKey)
            return middleWare[actualKey].callback(req,res);
          });

          // console.log('middleware 2')
          break;
        }
      }
    }else if(count === 0 && Object.keys(unNamed).length !== 0){
      unNamed[''].callback(req,res);

    }else{
      // console.log('fuckk')
      endpoints.forEach((call) =>{
        if(call.method === req.method &&  validRoute(call,path)){
          // console.log('inside the call'),
          req.query = queryString.parse(routeArray[1]);

          res.send = function(string){
            res.writeHead(200, {'Content-Type': 'text/plain'})
            res.end(string);
          };

          res.json = function(obj){
            res.writeHead(200, {'Content-Type': 'application/json'})
            res.end(JSON.stringify(obj));
          };

          res.render = function(name, options){
            res.writeHead(200, {'Content-Type': 'text/html'});
            var hbs = fs.readFileSync('./views/' + name, 'utf8');
            var template = Handlebars.compile(hbs);
            var data = options;
            res.send(template(data));
          }

          req.params = getParams(call,path);

          var body = '';
          req.on('readable', function() {
            var chunk = req.read();
            if (chunk) body += chunk;
          });

          req.on('end', function() {
            // queryString is the querystring node built-in
            req.body = queryString.parse(body);
            call.callback(req,res);
          });
        }
      })
    }

  };
  const server = http.createServer(fireZone);

  return {
    listen: function(port, callback) {
      server.listen(port, function(){
        if(callback){
          callback();
        };
      });

    },
    get: function(route, callback) {
      const path = route.split('?')[0];
      const found = endpoints.some((x) =>(x.route === path && x.method==='GET'))
      if(!found){
        endpoints.push(getRoutesConstructor(path, callback))
      }
    },
    post: function(route, callback){
      const path = route.split('?')[0];
      const found = endpoints.some((x) =>(x.route === path && x.method==='POST'))
      if(!found){
        endpoints.push(postRoutesConstructor(path, callback))
      }
    },
    use: function(routePrefix, callback) {
      // const found = middleWare.some((x) =>(x.route === path && x.method==='POST'))
      // if(!found){
      //   middleWare.push(postRoutesConstructor(path, callback))
      // }
      if(typeof routePrefix !=='string'){
        unNamed['']= useRoutesConstructor('',routePrefix)
      }else{
        middleWare.push(useRoutesConstructor(routePrefix,callback))
      }

    }
  };
};
