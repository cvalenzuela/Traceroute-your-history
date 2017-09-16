/*
Creates a js file
*/

let input = document.getElementById('inputValue');
let p5 = require('p5');
let Mappa = require('mappa-mundi');
let key = 'pk.eyJ1IjoiY3ZhbGVuenVlbGEiLCJhIjoiY2l2ZzkweTQ3MDFuODJ5cDM2NmRnaG4wdyJ9.P_0JJXX6sD1oX2D0RQeWFA';

let options = {
  lat: 0,
  lng: 0,
  zoom: 2.1,
  style: 'mapbox://styles/cvalenzuela/cj7mv8mtj9m6g2rpaqa09v05a',
  pitch: 0
}

let mappa = new Mappa('Mapboxgl', key);
let routesMap, canvas;

let newp5 = new p5((p) => {

  p.preload = () => {
    routes = p.loadJSON('./routes.json');
  }

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    routesMap = mappa.tileMap(options);
    routesMap.overlay(canvas);

    routesMap.onChange(drawRoutes);
  }

  p.draw = () => {

  };

  let createHop = (hop, index, route) => {
    if (hop[1] && hop[2]) {
      let pos = routesMap.latLngToPixel(hop[1], hop[2]);
      let scale = routesMap.zoom();
      p.fill(250);
      p.stroke(250);
      p.ellipse(pos.x, pos.y, 10, 10);

      if (index < routes[route].hops.length - 2) {
        let nextHop = routes[route].hops[index + 1];

        if (nextHop[0] && nextHop[1]) {
          let nextPos = routesMap.latLngToPixel(nextHop[1], nextHop[2]);
          let anchorDeltaX, anchorDeltaY;

          if (pos.x != nextPos.x && pos.y != nextPos.y) {
            anchorOne = { x: pos.x - 80, y: pos.y - 10 }
            anchorTwo = { x: nextPos.x + 80, y: nextPos.y + 10 }
          } else {

            anchorOne = { x: pos.x - p.random(10, 20) * scale, y: pos.y - p.random(2, 3) * scale }
            anchorTwo = { x: nextPos.x + p.random(-20, 20) * scale, y: nextPos.y + p.random(-10, 10) * scale }
          }

          p.stroke(240);
          p.noFill();
          p.strokeWeight(scale * 0.15);
          p.bezier(pos.x, pos.y, anchorOne.x, anchorOne.y, anchorTwo.x, anchorTwo.y, nextPos.x, nextPos.y);
        }
      }
    }
  }

  let drawRoutes = () => {
    p.clear();
    let url = input.value;
    if (url) {
      routes[input.value].hops.forEach((hop, index) => {
        createHop(hop, index, input.value)
      });
    } else {
      for (let route in routes) {
        routes[route].hops.forEach((hop, index) => {
          createHop(hop, index, route)
        });
      }
    }
  }

  window.drawRoutes = drawRoutes;


}, 'dom-elem');