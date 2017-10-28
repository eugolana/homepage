var imgCanvas;
var bgrnd = [0, 0, 0];
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

function findPosX(obj)
  {
    var curleft = 0;
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
  {
    var curtop = 0;
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
  console.log("mouse location: " + x + "," + y)
  ctx = imgCanvas.getContext('2d');
  data = ctx.getImageData(x, y, 1, 1);
  bgrnd = data.data;
  // console.log(data.data)
}
