
myCanvas = document.getElementById("galleryBackgroundCanvas");
width = myCanvas.width;
height = myCanvas.height;

var rect = new Rectangle(new Point(0,0), new Size(width, height));
backRect = new Path.Rectangle(rect);
backRect.fillColor = [0,0,0]


arrowHover = function(event) {
  this.opacity = 0.8;
  document.body.style.cursor = 'pointer';
}

arrowLeave =  function(event) {
  this.opacity = 0.5;
  document.body.style.cursor = 'default';
}

var backRect;
var r_arrow;
var l_arrow;

function init() {
  if (backRect != undefined) {
    backRect.remove();
    r_arrow.remove();
    l_arrow.remove();
  }
  width = myCanvas.width;
  height = myCanvas.height;

  var rect = new Rectangle(new Point(0,0), new Size(width, height));
  backRect = new Path.Rectangle(rect);
  backRect.fillColor = [0,0,0]


  // PAGE TURN ARROWS
  r_arrow = new Path([0,0], [1.5,1], [0,2])
  r_arrow.closed = true;
  r_arrow.scale(new Size(30, 30))
  r_arrow.translate(new Point(width  * 0.8, height/2))
  r_arrow.smooth({type:'geometric', factor: 0.2})
  r_arrow.fillColor = "#222222";
  r_arrow.strokeWidth = 2;
  r_arrow.strokeColor = '#000000'

  r_arrow.opacity = 0.5;
  r_arrow.strokeJoin = 'round';
  l_arrow = r_arrow.clone();
  l_arrow.rotate(180, new Point(width/2, height/2));
    r_arrow.onMouseEnter = arrowHover;
  r_arrow.onMouseLeave = arrowLeave
  l_arrow.onMouseEnter = arrowHover;
  l_arrow.onMouseLeave = arrowLeave
}

init()

// Run Function
function onFrame() {
  new_color = [bgrnd[0]/255, bgrnd[1]/255, bgrnd[2]/255];
  new_color = new Color(new_color);
  hue = new_color.convert('hsb').hue;
  color = backRect.fillColor.convert('hsb')
  new_hue = (color.hue + (0.01 * hue)) / 1.01;
  color.hue = new_hue;
  color.saturation = 0.4;
  color.brightness = 0.7;
  backRect.fillColor = color;
}

view.onResize = function() {
  init()
}
