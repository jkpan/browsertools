var side = 2;
var dots = 3;

var dot_none = 33;
var criteria = dot_none;// * 2 / 3;//dot_none/2;

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

function initLED(x, y, w, h) {

  posx = x;
  posy = y;

  mwidth = w;
  mheight = h;

  jumpLine = (side + dots) * w * 4;
  jumpSide = (side + dots) * 4;

  switch(dots) {
    case 1:
      initDot = (side * w + side) * 4;
      break;
    case 2:
    case 3:
    case 4:
      initDot = ((side + 1) * w + (side + 1)) * 4;
      break;
    case 5:
    case 6:
      initDot = ((side + 2) * w + (side + 2)) * 4;
      break;
    case 7:
      initDot = ((side + 3) * w + (side + 3)) * 4;
      break;
  }

  gapL = w * 4;
  gapP = 4;



}

function setPix4_2(data, k) {

    if ((data[k] > criteria || data[k+1] > criteria || data[k+2] > criteria)) {
        _r = data[k];
        _g = data[k+1];
        _b = data[k+2];
    } else {
        _r = dot_none;
        _g = dot_none;
        _b = dot_none;
    }

    setPixColor(data, k,               _r, _g, _b);//中
    setPixColor(data, k - gapP,        _r, _g, _b);//左
    setPixColor(data, k - gapL,        _r, _g, _b);//上
    setPixColor(data, k - gapP - gapL, _r, _g, _b);//左上
  }

  function setPix4_3(data, k) {

    if ((data[k] > criteria || data[k+1] > criteria || data[k+2] > criteria)) {
        _r = data[k];
        _g = data[k+1];
        _b = data[k+2];
    } else {
        _r = dot_none;
        _g = dot_none;
        _b = dot_none;
    }

    if (side == 0 || !makeRound) {
      let _k = k - gapP - gapL;
      for (let i = 0;i<3;i++) {
        for (let j = 0;j<3;j++) {
          setPixColor(data, _k + i * gapP + j * gapL, _r, _g, _b);
        }
      }
      return;
    }
    
    setPixColor(data, k,               _r, _g, _b);//中
    setPixColor(data, k - gapP,        _r, _g, _b);//左
    setPixColor(data, k - gapL,        _r, _g, _b);//上
    setPixColor(data, k - gapP - gapL, _r * 2/3, _g * 2/3, _b * 2/3);//左上

    //右
    setPixColor(data, k + gapP,        _r, _g, _b);
    //右上
    setPixColor(data, k + gapP - gapL, _r * 2/3, _g * 2/3, _b * 2/3);
    //右下
    setPixColor(data, k + gapP + gapL, _r * 2/3, _g * 2/3, _b * 2/3);
    //下
    setPixColor(data, k + gapL,        _r, _g, _b);
    //左下
    setPixColor(data, k - gapP + gapL, _r * 2/3, _g * 2/3, _b * 2/3);

  }

  function setPix4_4(data, k) {   

    if ((data[k] > criteria || data[k+1] > criteria || data[k+2] > criteria)) {
        _r = data[k];
        _g = data[k+1];
        _b = data[k+2];
    } else if ((data[k + gapL + gapP] > criteria || data[k + gapL + gapP + 1] > criteria || data[k + gapL + gapP + 2] > criteria)) {
        _r = data[k + gapL + gapP];
        _g = data[k + gapL + gapP + 1];
        _b = data[k + gapL + gapP + 2];
    } else {
        
        _r = dot_none;
        _g = dot_none;
        _b = dot_none;
    }

    if (side == 0 || !makeRound) {
      let _k = k - gapP - gapL;
      for (let i = 0;i<4;i++) {
        for (let j = 0;j<4;j++) {
          setPixColor(data, _k + i * gapP + j * gapL, _r, _g, _b);
        }
      }
      return;
    }

    setPixColor(data, k,               _r, _g, _b);//中
    setPixColor(data, k - gapP,        _r, _g, _b);//左
    setPixColor(data, k - gapL,        _r, _g, _b);//上
    setPixColor(data, k - gapP - gapL, 0, 0, 0);//左上

    //右
    setPixColor(data, k + gapP,        _r, _g, _b);
    //右上
    setPixColor(data, k + gapP - gapL, _r, _g, _b);
    //右下
    setPixColor(data, k + gapP + gapL, _r, _g, _b);
    //下
    setPixColor(data, k + gapL,        _r, _g, _b);
    //左下
    setPixColor(data, k - gapP + gapL, _r, _g, _b);


    let _k = k + gapP + gapL + gapP + gapL;
    setPixColor(data, _k, 0, 0, 0);

    setPixColor(data, _k - gapL,               _r, _g, _b);
    setPixColor(data, _k - gapL - gapL,        _r, _g, _b);
    setPixColor(data, _k - gapL - gapL - gapL, 0, 0, 0);

    setPixColor(data, _k - gapP,               _r, _g, _b);
    setPixColor(data, _k - gapP - gapP,        _r, _g, _b);
    setPixColor(data, _k - gapP - gapP - gapP, 0, 0, 0);

  }

  function setPix4_5(data, k) {
    
    if ((data[k] > criteria || data[k+1] > criteria || data[k+2] > criteria)) {
        _r = data[k];
        _g = data[k+1];
        _b = data[k+2];
    } else if ((data[k + gapP] > criteria || data[k + gapP + 1] > criteria || data[k + gapP + 2] > criteria)) {
        _r = data[k + gapP];
        _g = data[k + gapP + 1];
        _b = data[k + gapP + 2];
    } else if ((data[k - gapP] > criteria || data[k - gapP + 1] > criteria || data[k - gapP + 2] > criteria)) {
        _r = data[k - gapP];
        _g = data[k - gapP + 1];
        _b = data[k - gapP + 2];
    } else if ((data[k - gapL] > criteria || data[k - gapL + 1] > criteria || data[k - gapL + 2] > criteria)) {
        _r = data[k - gapL];
        _g = data[k - gapL + 1];
        _b = data[k - gapL + 2];
    } else if ((data[k + gapL] > criteria || data[k + gapL + 1] > criteria || data[k + gapL + 2] > criteria)) {
        _r = data[k + gapL];
        _g = data[k + gapL + 1];
        _b = data[k + gapL + 2];
    } else {
        
        _r = dot_none;
        _g = dot_none;
        _b = dot_none;
    }
    
    let _k = k - 2 * gapP - 2 * gapL;
    for (let i = 0;i<5;i++) {
      for (let j = 0;j<5;j++) {
        setPixColor(data, _k + i * gapP + j * gapL, _r, _g, _b);
      }
    }

    if (side == 0 || !makeRound) return;

    setPixColor(data, _k, 0, 0, 0);
      
    setPixColor(data, _k + 4 * gapL, 0, 0, 0);
      
    setPixColor(data, _k + 4 * gapP, 0, 0, 0);
      
    setPixColor(data, _k + 4 * gapL + 4 * gapP, 0, 0, 0);
    
  }

function setPix4_6(data, k) {
  
  if ((data[k] > criteria || data[k+1] > criteria || data[k+2] > criteria)) {
      _r = data[k];
      _g = data[k+1];
      _b = data[k+2];
  } else if ((data[k + gapP] > criteria || data[k + gapP + 1] > criteria || data[k + gapP + 2] > criteria)) {
      _r = data[k + gapP];
      _g = data[k + gapP + 1];
      _b = data[k + gapP + 2];
  } else if ((data[k + gapL] > criteria || data[k + gapL + 1] > criteria || data[k + gapL + 2] > criteria)) {
      _r = data[k + gapL];
      _g = data[k + gapL + 1];
      _b = data[k + gapL + 2];
  } else if ((data[k + gapL + gapP] > criteria || data[k + gapL + gapP + 1] > criteria || data[k + gapL + gapP + 2] > criteria)) {
      _r = data[k + gapL + gapP];
      _g = data[k + gapL + gapP + 1];
      _b = data[k + gapL + gapP + 2];
  } else {
      _r = dot_none;
      _g = dot_none;
      _b = dot_none;
  }

  let _k = k - 2 * gapP - 2 * gapL;
  for (let i = 0;i<6;i++) {
    for (let j = 0;j<6;j++) {
      setPixColor(data, _k + i * gapP + j * gapL, _r, _g, _b);
    }
  }

  if (side == 0 || !makeRound) return;

  setPixColor(data, _k, 0, 0, 0);
  
  setPixColor(data, _k + 5 * gapL, 0, 0, 0);
  
  setPixColor(data, _k + 5 * gapP, 0, 0, 0);
  
  setPixColor(data, _k + 5 * gapL + 5 * gapP, 0, 0, 0);

}

function setPix4_7(data, k) {
  
  if ((data[k] > criteria || data[k+1] > criteria || data[k+2] > criteria)) {
      _r = data[k];
      _g = data[k+1];
      _b = data[k+2];
  } else if ((data[k + gapP] > criteria || data[k + gapP + 1] > criteria || data[k + gapP + 2] > criteria)) {
      _r = data[k + gapP];
      _g = data[k + gapP + 1];
      _b = data[k + gapP + 2];
  } else if ((data[k - gapP] > criteria || data[k - gapP + 1] > criteria || data[k - gapP + 2] > criteria)) {
      _r = data[k - gapP];
      _g = data[k - gapP + 1];
      _b = data[k - gapP + 2];
  } else if ((data[k - gapL] > criteria || data[k - gapL + 1] > criteria || data[k - gapL + 2] > criteria)) {
      _r = data[k - gapL];
      _g = data[k - gapL + 1];
      _b = data[k - gapL + 2];
  } else if ((data[k + gapL] > criteria || data[k + gapL + 1] > criteria || data[k + gapL + 2] > criteria)) {
      _r = data[k + gapL];
      _g = data[k + gapL + 1];
      _b = data[k + gapL + 2];
  } else {
      
      _r = dot_none;
      _g = dot_none;
      _b = dot_none;
  }

  let _k = k - 3 * gapP - 3 * gapL;

  for (let i = 0;i<7;i++) {
    for (let j = 0;j<7;j++) {
      setPixColor(data, _k + i * gapP + j * gapL, _r, _g, _b);
    }
  }

  if (side == 0 || !makeRound) return;

  setPixColor(data, _k, 0, 0, 0);
    setPixColor(data, _k + gapL, _r/2, _g/2, _b/2);
    setPixColor(data, _k + gapP, _r/2, _g/2, _b/2);
  setPixColor(data, _k + 6 * gapL, 0, 0, 0);
    setPixColor(data, _k + 5 * gapL, _r/2, _g/2, _b/2);
    setPixColor(data, _k + 6 * gapL + gapP, _r/2, _g/2, _b/2);
  setPixColor(data, _k + 6 * gapP, 0, 0, 0);
    setPixColor(data, _k + 5 * gapP, _r/2, _g/2, _b/2);
    setPixColor(data, _k + 6 * gapP + gapL, _r/2, _g/2, _b/2);
  setPixColor(data, _k + 6 * gapL + 6 * gapP, 0, 0, 0);
    setPixColor(data, _k + 5 * gapL + 6 * gapP, _r/2, _g/2, _b/2);
    setPixColor(data, _k + 6 * gapL + 5 * gapP, _r/2, _g/2, _b/2);

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

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {

        let idx = (y * w + x) * 4;

        data[idx + 0] = 0;//40;
        data[idx + 1] = 0;//40;
        data[idx + 2] = 0;//40;
        data[idx + 3] = 255;
        
        let _x = x%(s + d);
        let _y = y%(s + d);
        if (_x >= s && _y >= s && x < maskWidth && y < maskHeight) { //d
          data[idx + 3] = 0;
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

function ledAction(_canvas, _ctx) {

  if (!maskimg) {
    //console.log('maskimg not ready');
    return;
  }

  _ctx.drawImage(maskimg, posx, posy);

  if (dots == 1) { //window.requestAnimationFrame(anim_update);
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
  
      switch(dots) {
        case 2:
          setPix4_2(data, k);
          break;
        case 3:
          setPix4_3(data, k);
          break;
        case 4:
          setPix4_4(data, k);
          break;
        case 5:
          setPix4_5(data, k);
          break;
        case 6:
          setPix4_6(data, k);  
          break;
        case 7:
          setPix4_7(data, k);  
          break;
      }
    }
  }
  _ctx.putImageData(mask, posx, posy);
}

/*
 * for still result
 */
function ledAction4Still(_canvas, _ctx) {

  if (!maskimg) {
    //console.log('maskimg not ready');
    return;
  }

  _ctx.drawImage(maskimg, posx, posy);

  if (dots == 1) { //window.requestAnimationFrame(anim_update);
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
  
      switch(dots) {
        case 2:
          setPix4Still_2(data, k);
          break;
        case 3:
          setPix4Still_3(data, k);
          break;
        case 4:
          setPix4Still_4(data, k);
          break;
        case 5:
          setPix4Still_5(data, k);
          break;
        case 6:
          setPix4Still_6(data, k);  
          break;
        case 7:
          setPix4Still_7(data, k);  
          break;
      }
    }
  }
  _ctx.putImageData(mask, posx, posy);
}

function computeAverage(data, idx, _size) {
  
  let __r = 0;
  let __g = 0;
  let __b = 0;

  for (let i = 0;i<_size;i++) {
    for (let j = 0;j<_size;j++) {
      let __idx = idx + i * gapP + j * gapL;
      __r += data[__idx];
      __g += data[__idx+1];
      __b += data[__idx+2];
    }
  }

  /*
  __r = Math.min(255, __r/(_size * _size * 0.9));
  __g = Math.min(255, __g/(_size * _size * 0.9));
  __b = Math.min(255, __b/(_size * _size * 0.9));
  */
  
  __r = __r/(_size * _size);
  __g = __g/(_size * _size);
  __b = __b/(_size * _size);
  

  if ((__r < criteria && __g < criteria && __b < criteria)) {
    __r = dot_none;
    __g = dot_none;
    __b = dot_none;
  }

  for (let i = 0;i<_size;i++) {
    for (let j = 0;j<_size;j++) {
      let __idx = idx + i * gapP + j * gapL;
      setPixColor(data, __idx, __r, __g, __b);
    }
  }

}

function setPix4Still_2(data, k) {
  
  let _k = k - gapP - gapL;
  computeAverage(data, _k, 2);

}

function setPix4Still_3(data, k) {

  let _k = k - gapP - gapL;
  computeAverage(data, _k, 3);

  if (side == 0 || !makeRound) return;

  _r = data[k];
  _g = data[k+1];
  _b = data[k+2];

  //左上
  setPixColor(data, k - gapP - gapL, _r * 2/3, _g * 2/3, _b * 2/3);
  //右上
  setPixColor(data, k + gapP - gapL, _r * 2/3, _g * 2/3, _b * 2/3);
  //右下
  setPixColor(data, k + gapP + gapL, _r * 2/3, _g * 2/3, _b * 2/3);
  //左下
  setPixColor(data, k - gapP + gapL, _r * 2/3, _g * 2/3, _b * 2/3);

}

function setPix4Still_4(data, k) {   

  let _k = k - gapP - gapL;
  computeAverage(data, _k, 4);
  if (side == 0 || !makeRound) return;

  setPixColor(data, k - gapP - gapL, 0, 0, 0);//左上

  _k = k + gapP + gapL + gapP + gapL;
  setPixColor(data, _k, 0, 0, 0);

  setPixColor(data, _k - gapL - gapL - gapL, 0, 0, 0);

  setPixColor(data, _k - gapP - gapP - gapP, 0, 0, 0);

}

function setPix4Still_5(data, k) {
    
  
  let _k = k - 2 * gapP - 2 * gapL;
  computeAverage(data, _k, 5);
  if (side == 0 || !makeRound) return;

  setPixColor(data, _k, 0, 0, 0);
    
  setPixColor(data, _k + 4 * gapL, 0, 0, 0);
    
  setPixColor(data, _k + 4 * gapP, 0, 0, 0);
    
  setPixColor(data, _k + 4 * gapL + 4 * gapP, 0, 0, 0);
  
}

function setPix4Still_6(data, k) {

  let _k = k - 2 * gapP - 2 * gapL;
  computeAverage(data, _k, 6);
  if (side == 0 || !makeRound) return;

  setPixColor(data, _k, 0, 0, 0);

  setPixColor(data, _k + 5 * gapL, 0, 0, 0);

  setPixColor(data, _k + 5 * gapP, 0, 0, 0);

  setPixColor(data, _k + 5 * gapL + 5 * gapP, 0, 0, 0);

}

function setPix4Still_7(data, k) {

  let _k = k - 3 * gapP - 3 * gapL;
  computeAverage(data, _k, 7);
  if (side == 0 || !makeRound) return;

  _r = data[k];
  _g = data[k+1];
  _b = data[k+2];

  setPixColor(data, _k, 0, 0, 0);
    setPixColor(data, _k + gapL, _r/2, _g/2, _b/2);
    setPixColor(data, _k + gapP, _r/2, _g/2, _b/2);
  setPixColor(data, _k + 6 * gapL, 0, 0, 0);
    setPixColor(data, _k + 5 * gapL, _r/2, _g/2, _b/2);
    setPixColor(data, _k + 6 * gapL + gapP, _r/2, _g/2, _b/2);
  setPixColor(data, _k + 6 * gapP, 0, 0, 0);
    setPixColor(data, _k + 5 * gapP, _r/2, _g/2, _b/2);
    setPixColor(data, _k + 6 * gapP + gapL, _r/2, _g/2, _b/2);
  setPixColor(data, _k + 6 * gapL + 6 * gapP, 0, 0, 0);
    setPixColor(data, _k + 5 * gapL + 6 * gapP, _r/2, _g/2, _b/2);
    setPixColor(data, _k + 6 * gapL + 5 * gapP, _r/2, _g/2, _b/2);

}