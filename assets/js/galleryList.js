myCanvas = document.getElementById("galleryBackgroundCanvas");
width = myCanvas.width;
height = myCanvas.height;
var rect = new Rectangle(new Point(0,0), new Size(width, height));
backRect = new Path.Rectangle(rect);
backRect.fillColor = bgrnd


function onFrame() {
  c = backRect.fillColor;
  _c = bgrnd
  backRect.fillColor = new Color(
    (0.99 * c.red + 0.01 * (_c[0]/255)) ,
    (0.99 * c.green + 0.01 * (_c[1]/255)),
    (0.99 * c.blue + 0.01 * (_c[2]/255))
  )
}
