// This needs to be refactored and turned into a sensible library

var bgrnd = [0, 0, 0];
var imgCanvas;
var image;


window.onload = function() {
  image = document.getElementsByTagName("img")[0];
  var imageRect = image.getClientRects()[0]
  imgCanvas = document.createElement("canvas");
  imgCanvas.width = image.width;
  imgCanvas.height = image.height;
  ctx = imgCanvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width=imageRect.width, height=imageRect.height)
}

function setColor(element, clusters, samples) {
  colors = colorGrab(element, clusters, samples);
  element.setAttribute('data-color1', cleanColor(colors[0]))
  element.setAttribute('data-color2', cleanColor(colors[1]))
  element.setAttribute('data-color3', cleanColor(colors[2]))
}

function findPosX(obj)
  {
    var curleft = window.screenX - pageXOffset;;
    if(obj.offsetParent)
        while(1)
        {
          curleft += obj.offsetLeft;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.x)
        curleft += obj.x;
    return curleft;
  }

  function findPosY(obj)
  // This is still broken on firefox :()
  {
    var curtop = window.screenY - pageYOffset;
    if(obj.offsetParent)
        while(1)
        {
          curtop += obj.offsetTop;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.y)
        curtop += obj.y;
    return curtop;
  }


function getColor(event) {
  x = event.screenX - findPosX(image)
  y = event.screenY - findPosY(image)
  ctx = imgCanvas.getContext('2d');
  bgrnd = ctx.getImageData(x, y, 1, 1).data;
}


function colorGrab(element, number_of_colors, samples) {
  number_of_colors = number_of_colors | 3;
  samples = samples || 100;
  canvas = document.createElement('canvas')
  canvas.width = element.width;
  canvas.height = element.height;
  ctx = canvas.getContext('2d');
  ctx.drawImage(element,0,0, width = canvas.width, height = canvas.height);
  colors = []
  for (var i = 0; i < samples; i ++) {
    x = Math.floor(Math.random() * canvas.width);
    y = Math.floor(Math.random() * canvas.height);
    colors.push(ctx.getImageData(x, y, 1,1).data.slice(0,3));
  }
  clusters = cluster(colors, number_of_colors);
  return clusters
}

function editBgrnd(event) {
  color1 = event.target.getAttribute('data-color1');
  color1 = parseColor(color1)
  bgrnd = color1;
}

function cluster(points, number_of_clusters, max_iterations){
  max_iterations = max_iterations || 10;
  // setup random cluster points
  var _clusters = []
  for (var i = 0; i < number_of_clusters; i++) {
    _clusters.push([
      // assume we're dealing with 3d, shapes in 255 cubic space
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    ])
  }
  var clusters = []
  var n = 0;
  while (!arraysEqual(clusters, _clusters) && n < max_iterations) {
    n ++;
    clusters = _clusters.slice();
    var groups = {};
    for (var i = 0; i< clusters.length; i++) {
      // setup count object
      groups[String(clusters[i])] = []
    }
    // find which cluster each datapoint is closest to
    for (var i = 0; i < points.length; i++) {
      var closest;
      var closest_distance = 8000000
      for (var ii = 0; ii < clusters.length; ii++) {

        c = clusters[ii];
        var d = getDistance(points[i], c)
        if (d < closest_distance) {
          closest = c;
          closest_distance = d;
        }
      }
      groups[String(closest)].push(points[i])
    }
    // calculate average from each group to seed next round
    // (we will stop when these cluster points sto changing on iterations)
    // (fingers crossed)
    _clusters = []
    clusters = sort_clusters(groups, clusters)
    for (var i = 0; i < number_of_clusters; i++) {
      g = groups[String(clusters[i])];
      if (g.length > 0) {
        av = getAverage(g)
        _clusters.push(av)
      } else {
        _clusters.push([
          // add a new random
          // assume we're dealing with 3d, shapes in 255 cubic space
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255)
        ])
      }
    }
  }
  return clusters;
}


function cleanColor(color) {
  return [
    Math.floor(color[0]),
    Math.floor(color[1]),
    Math.floor(color[2])
  ]
}
function getDistance(a, b) {
  // Get the dstance between two cevtor arrays
  // always put the shortest array as second argument
  // and everything should work alright XD
  var d = 0;
  for (var i = 0; i < a.length; i++ ) {
    d += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(d)
}

function getAverage(a){
  var o = []
  for (var i = 0; i < a[0].length; i++) {
    // iterate for each dimension
    t = 0;
    for (var ii = 0; ii < a.length; ii++) {
      t += a[ii][i]
    }
    o.push(t/a.length)
  }
  return o;
}

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

function parseColor(colorString) {
  r = colorString.split(',');
  return [
    Number(r[0]),
    Number(r[1]),
    Number(r[2])
  ]
}

function sort_clusters(groups, keys){
  clusters = []
  keys = keys.slice()
  while (keys.length > 1) {
    t = 0
    count = 0;
    for (var i = 0; i < keys.length; i++) {
      if (groups[String(keys[i])].length > count) {
        count = groups[String(keys[i])].length
        t = i
      }
    }
    clusters.push(keys[t]);
    keys.splice(t,1)

  }
  clusters.push(keys[0])
  return clusters
}
