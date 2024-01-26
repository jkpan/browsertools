var side = 2;
var dots = 3;

var pixFunc;

var dot_none = 24;
var criteria = dot_none * 2;//dot_none/2;

var _r = 0;//dot_r;// * Math.random();
var _g = 0;//dot_g;// * Math.random();
var _b = 0;//dot_b;// * Math.random();

//verticle
var jumpLine = 0;//(side + dots) * fsize * 4;
var jumpSide = 0;//(side + dots) * 4;

var initDot = 0;

var maskWidth = 100;
var maskHeight = 100;
var gapL = 0;
var gapP = 0;

var posx;
var posy;
var mwidth;
var mheight;

var makeRound = true;

var color_reduce = 20;//filter_reduce_and_lighter
// 2 ~ 12

function initAscii(x, y, w, h) {

  side = 0;
  dots = 16;

  posx = x;
  posy = y;

  mwidth = w;
  mheight = h;

  jumpLine = (side + dots) * w * 4;
  jumpSide = (side + dots) * 4;

  initDot = (side * w + side) * 4;

  gapL = w * 4;
  gapP = 4;

}

//const ascii = [' ', '.', ':', '!', '|', '=', '+', '*', '@'];
const   ascii = [' ',' ','.','_','-','=','+','*','!','&','#','%','@'];

/*
 * for still result
 */
function asciiAction4Still(_canvas, _ctx) {

  let mask = _ctx.getImageData(posx, posy, mwidth, mheight);
  var data = mask.data;

  let wid = mwidth;

  let array = [];
  let b = Math.ceil(255/(ascii.length));

  for (let i = initDot;i < data.length;i += jumpLine) {
    
    let h = Math.floor((i/4)/wid);
    array[h/dots] = [];//'';
    let idx = 0;
    for (let k = i;;k+=jumpSide) {
      let _pix = k/4;
      let _h = Math.floor(_pix/wid);
      let _w = _pix%wid;

      if (_w > maskWidth) break;
      if (_h != h) break;
  
      pickColor(data, k, dots);
      //computeAverage(data, k, dots);
      
      array[h/dots][idx] = ascii[Math.floor(_g/b)];
      idx++;

    }
  }

  
  _ctx.fillStyle = 'rgba(50,50,50)';
  ctx.fillRect(posx, posy, mwidth, mheight);
  ctx.font = '20px Monospace';
  _ctx.fillStyle = 'rgba(255,255,255)';
  //for (let t = 0;t<array.length-1;t++) ctx.fillText(array[t], dots + posx, dots + t * dots + posy);
  
  for (let t = 0;t<array.length-1;t++) {
    for (let x = 0;x<array[t].length-1;x++) {
      ctx.fillText(array[t][x], dots + dots * x + posx, dots + t * dots + posy);
    }

  }
  //_ctx.putImageData(mask, posx, posy);
}

function initLED(x, y, w, h) {

  posx = x;
  posy = y;

  mwidth = w;
  mheight = h;

  jumpLine = (side + dots) * w * 4;
  jumpSide = (side + dots) * 4;

  initDot = (side * w + side) * 4;

  gapL = w * 4;
  gapP = 4;

}

function setPixColor(data, idx, r, g, b) {
  data[idx]     = r;
  data[idx + 1] = g;
  data[idx + 2] = b;
  data[idx + 3] = 255;
}

function generateMask(w, h, s, d) {
  
  var tempCanvas = document.createElement("canvas");
  var tempCtx = tempCanvas.getContext("2d");

  var mask = tempCtx.createImageData(w, h);
  var data = mask.data;

  let center = s + d/2.0 - 0.5;
  //let rr = d * d/4.0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {

        let idx = (y * w + x) * 4;

        data[idx + 0] = 0;//40;
        data[idx + 1] = 0;//40;
        data[idx + 2] = 0;//40;
        data[idx + 3] = 255;
        
        let _x = x%(s + d);
        let _y = y%(s + d);
        
        //if (_x >= s && _y >= s && x < maskWidth && y < maskHeight) data[idx + 3] = 0;

        //if (_x == s && _y == s) data[idx + 3] = 255;
          
        //if (_x >= s && _y >= s && x < maskWidth && y < maskHeight) data[idx + 3] = 0;
        if (_x >= s && _y >= s && x < maskWidth && y < maskHeight) { //d
          data[idx + 3] = 0;
          //if (Math.abs(_x - s - center) <= 2 && Math.abs(_y - center) <= 2) data[idx + 3] = 255;
          if (makeRound && d > 1 ) {
            //&& (Math.abs(_x - center) * Math.abs(_x - center) + Math.abs(_y - center) * Math.abs(_y - center)) > rr) {
              let dist = Math.sqrt(Math.abs(_x - center) * Math.abs(_x - center) + 
                                   Math.abs(_y - center) * Math.abs(_y - center));
              let diff = dist - d/2.0;
              if (diff > 0.5)
                data[idx + 3] = 255;
              else if (diff < -0.5) 
                data[idx + 3] = 0;
              else 
                data[idx + 3] = Math.floor(255 * (diff + 0.5));
          }
        }
    }
  }

  return mask;

}

var maskimg;

function newLEDMask() { //ledEffect() {
  
  //verticle
  //let w = fsize;
  //let h = canvas.height;

  let w = mwidth;//canvas.width;//maskWidth
  let h = mheight;//canvas.height;//maskHeight

  maskWidth = (Math.floor(w/(side + dots))) * (side + dots);
  maskHeight = (Math.floor(h/(side + dots))) * (side + dots);

  var mask = generateMask(w, h, side, dots);

  // create a temporary canvas
  var tempCanvas = document.createElement("canvas");
  var tempCtx = tempCanvas.getContext("2d");

  // set the temp canvas size == the canvas size
  tempCanvas.width = w;
  tempCanvas.height = h;

  // put the modified pixels on the temp canvas
  tempCtx.putImageData(mask, 0, 0);

  // use the tempCanvas.toDataURL to create an img object
  maskimg = new Image();
  maskimg.src = tempCanvas.toDataURL();

}

/*
 * for still result
 */
function ledAction4Still(_canvas, _ctx) {

  if (!maskimg) {
    return;
  }

  if (dots == 1) { //window.requestAnimationFrame(anim_update);
    _ctx.drawImage(maskimg, posx, posy);
    return;
  }

  let mask = _ctx.getImageData(posx, posy, mwidth, mheight);
  var data = mask.data;

  let wid = mwidth;

  for (let i = initDot;i < data.length;i += jumpLine) {
    
    let h = Math.floor((i/4)/wid);

    for (let k = i;;k+=jumpSide) {

      let _pix = k/4;
      let _h = Math.floor(_pix/wid);
      let _w = _pix%wid;

      if (_w > maskWidth) break;
      if (_h != h) break;
  
      pickColor(data, k, dots);
      //computeAverage(data, k, dots);
      fillArea(data, k, dots);

    }
  }
  _ctx.putImageData(mask, posx, posy);
  _ctx.drawImage(maskimg, posx, posy);
}

function filter_gray(coloramount) {
  let _c = (_r + _g + _g + _b)/4;
  let block = Math.ceil(255/coloramount);
  _c = Math.floor(_c/block) * block;
  _r = _c;
  _g = _c;
  _b = _c;
}

function filter_reduce_and_lighter(coloramount) {
  let block = Math.ceil(255/coloramount);
  _r = Math.min(255, Math.ceil(_r/block) * block);// * drkl/10);
  _g = Math.min(255, Math.ceil(_g/block) * block);// * drkl/10);
  _b = Math.min(255, Math.ceil(_b/block) * block);// * drkl/10);
}

/*
function filter_reduceColor(coloramount) {
  let block = Math.ceil(255/coloramount);
  //_r = Math.floor(_r/block) * block;// * (3/4);
  //_g = Math.floor(_g/block) * block;// * (3/4);
  //_b = Math.floor(_b/block) * block;// * (3/4);
  _r = Math.ceil(_r/block) * block;// * (3/4);
  _g = Math.ceil(_g/block) * block;// * (3/4);
  _b = Math.ceil(_b/block) * block;// * (3/4);
}
*/

function filter() {
  if (color_reduce < 2 || color_reduce > 19) //1 2~19 20
    return;
  filter_reduce_and_lighter(color_reduce);
  //filter_gray(16);
}

function pickColor(data, idx, _size) {
  idx = idx + Math.floor(_size/2) * gapP + Math.floor(_size/2) * gapL;
  _r = data[idx];
  _g = data[idx+1];
  _b = data[idx+2];
  
  if (side > 0 && (_r < criteria && _g < criteria && _b < criteria)) {
    _r = dot_none;
    _g = dot_none;
    _b = dot_none;
  }
}

function computeAverage(data, idx, _size) {
  
  _r = 0;
  _g = 0;
  _b = 0;

  /*
  if (_size > 2) {
    _size -= 2;
    idx += gapP + gapL;
  }
  */

  for (let i = 0;i<_size;i++) {
    for (let j = 0;j<_size;j++) {
      let __idx = idx + i * gapP + j * gapL;
      _r += data[__idx];
      _g += data[__idx+1];
      _b += data[__idx+2];
    }
  }  

  /*
  __r = Math.min(255, __r/(_size * _size * 0.9));
  __g = Math.min(255, __g/(_size * _size * 0.9));
  __b = Math.min(255, __b/(_size * _size * 0.9));
  */
  
  _r = _r/(_size * _size);
  _g = _g/(_size * _size);
  _b = _b/(_size * _size);

  filter();

  if (side > 0 && (_r < criteria && _g < criteria && _b < criteria)) {
    _r = dot_none;
    _g = dot_none;
    _b = dot_none;
  }

}

function fillArea(data, idx, _size) {
  for (let i = 0;i<_size;i++) {
    for (let j = 0;j<_size;j++) {
      let __idx = idx + i * gapP + j * gapL;
      setPixColor(data, __idx, _r, _g, _b);
    }
  }
}
