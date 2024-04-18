var presetVerse = [

];

var images = [];

/*
function loadBgImg(event) {
    var files = event.target.files;
    var file;
    if (files && files.length > 0) {
        file = files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            var _img = new Image();
            _img.onload = function () {
                img = _img;
                startImgAnim();
                _repaint();
            }
            _img.src = e.target.result;
        }
    }
}
*/
/*
function createBGHiddenFile() {
    let _file = document.createElement('input');
    _file.type = "file";
    _file.id = "img";
    _file.hidden = "true";
    _file.accept = "image/png, image/gif, image/jpeg";
    _file.onchange = loadBgImg;
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(_file);
    //<input id="img" type="file" hidden="true"/>
}
*/

//function flow() {}

const BASE_DELAY = 1000;
//var image_base64 = null;

var doblank = 0;
var helpSwitch = 0;

var img;
var img_tmp;
var canvas;
var ctx;

var autoIdx = 0;

function dropHandler(event) {

    event.preventDefault();

    // 檢查是否有拖拉的檔案
    if (event.dataTransfer.items) {
        // 使用 DataTransferItemList 物件來檢查檔案是否是圖片
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === 'file') {
                var file = event.dataTransfer.items[i].getAsFile();
                if (file.type.startsWith('image/')) {

                    //////loadBgImg(event);
                    //img = null;
                    
                    var reader = new FileReader();
                    // 读取文件内容
                    reader.onload = function (event) {
                        var _img = new Image();
                        _img.onload = function () {
                            //img = _img;
                            //_repaint();
                            presetVerse[presetVerse.length] = ["", 12];
                            images[images.length] = _img;
                            if (img == null){
                                autoIdx = 0;
                                img = images[0];
                                startImgAnim();
                            }
                        };
                        _img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                    ////
                }
            }
        }
    }
}

function dragOverHandler(event) {
    event.preventDefault();
}

function createCanvas() {

    let _canvas = document.createElement('canvas');
    _canvas.id = "canvas";
    _canvas.width = 100;
    _canvas.height = 100;
    //_canvas.style.zIndex = 8;
    //_canvas.style.position = "absolute";
    //_canvas.style.border = "1px solid";

    let body = document.getElementsByTagName("body")[0];
    body.appendChild(_canvas);

    document.body.style.display = false;
    document.body.style.margin = 0;

    _canvas.setAttribute('ondrop', 'dropHandler(event)');
    _canvas.setAttribute('ondragover', 'dragOverHandler(event)');

    //document.body.style.backgroundColor = 'green';

}

function init() {
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
}

/*
function prepareImage() {
  img = new Image();
  img.src = imgurl;
  img.onload = function() {};
}
*/

var animType = 0;
var timeoutID = -1;

function stopAnim() {
    //animType = 0;
    window.clearTimeout(timeoutID);
}

function _playVersus() {
    jump2preset4Anim(head);
    timeoutID = setTimeout(anim1, BASE_DELAY + conutWord(SONGS[t_song][t_phase][t_line]) * WORD_DELAY);
    //背景圖
    if (head.length > 3 && head[3] && head[3].length > 0) {
        loadUrlImg(head[3]);
    }
}

function keyboard(e) { //key up

    switch (e.keyCode) {
        case 90: break;
        case 77: break;//m
        case 65: //a
            //startPlay();
            break;
        case 67: //'c'
            break;
        case 78:
            break;
        case 66: //'b'
            //console.log('b press');
            doblank = doblank == 0 ? 1 : 0;
            break;
        case 68: //d
            break;
        case 38: //'ArrowUp'
            /*
            if (images.length == 0) return;
            autoIdx--;
            if (autoIdx < 0) autoIdx = images.length - 1;
            */
            break;
        case 40: //'ArrowDown':
            if (images.length == 0) return;
            stopTimer();
            donext();
            break;
        //////
        case 33: //'page up'
        case 37:
        case 34: //'page down' 
        case 39: break;
        case 189: //'-'    
            break;
        case 187: //'='
            break;
        //0~9
        case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57:
            return;
        case 32:
            break;
        case 27: //'escape'
            break;
        default:
            break;
    }
    //_repaint();
}


var img_step = -1;//10;
var img_idx = 0;
var img_move = -1;
var pre_elapse = 0;
var elapse = 0;

const during = 8;
var _during = 0;

//var t_mask_opacity = 0;
//var mask_opacity = 0;
var opacity = 1.0;
var opacity_target = 1.0;

/*
function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
*/

function easeInOut(t) {
    const p0 = 0;
    const p1 = 0.0001;
    const p2 = 0.9999;
    const p3 = 1;

    let _t = 1 - t;

    let b = p0 * _t * _t * _t +
        p1 * 3 * t * _t * _t +
        p2 * 3 * t * t * _t +
        p3 * t * t * t;
    return b;
}

function drawHint() {

    if (img) {
        img_update(0); 
        return;
    }

    ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    // 设置虚线样式
    ctx.lineWidth = 10;
    ctx.setLineDash([15, 15]); // 设置虚线间隔为5px，实线长度为5px
    // 绘制虚线矩形
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = canvas.width/8 + 'px Arial';
    ctx.fillStyle = 'rgba(255, 0, 0, 1.0)';
    ctx.fillText("丟圖在此", canvas.width/4, canvas.height/2);

}

function drawImg(_img) {
    if (_img.width / _img.height > canvas.width / canvas.height) { //圖比較寬 佔滿canvas的高
        ctx.drawImage(_img,
            img_idx, 0,
            canvas.height * _img.width / _img.height, canvas.height);
    } else { //畫布比較寬 佔滿canvas的寬
        ctx.drawImage(_img,
            0, img_idx,
            canvas.width, canvas.width * _img.height / _img.width);
    }
}

function img_update(elapse) {

    let dt = (elapse - pre_elapse) / 1000.0;
    if (dt > 1) dt = 0.016;
    pre_elapse = elapse;

    //console.log('img_update ' + elapse);

    ctx.globalAlpha = opacity;

    if (opacity != opacity_target) {
        opacity = opacity + (opacity_target - opacity) * dt * 5;
        if (Math.abs(opacity_target - opacity) < 0.1) {
            opacity = opacity_target;
            if (opacity_target == 0) {
                opacity_target = 1.0;
                img = images[autoIdx]; //console.log('autoIdx : ' + autoIdx);
            }
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    _during += dt;
    if (_during > during) {
        _during = 0;
        img_step = -img_step;
    }

    if (img.width / img.height > canvas.width / canvas.height) { //圖比較寬 佔滿canvas的高

        let w = canvas.height * img.width / img.height;
        //let h = canvas.height;
        let range = Math.abs(w - canvas.width);

        if (img_step < 0)
            img_idx = img_step * range * easeInOut(_during / during);// += img_move * dt;
        else
            img_idx = -range + range * easeInOut(_during / during);

    } else { //畫布比較寬 佔滿canvas的寬

        //let w = canvas.width;
        let h = canvas.width * img.height / img.width;
        let range = Math.abs(h - canvas.height);

        if (img_step < 0)
            img_idx = img_step * range * easeInOut(_during / during);// += img_move * dt;
        else
            img_idx = -range + range * easeInOut(_during / during);

    }

    /*
      img w      x
    -------- = --------
      img h      c h
  
      x = c h * img w /img h
  
      img w      c w
    -------- = --------
      img h      y
  
      y = c w * img h /img w
  
      */

    //if (img_tmp) drawImg(img_tmp);

    if (img) {
        drawImg(img);
        window.requestAnimationFrame(img_update);
    }

}

function startImgAnim() {
    if (img && img_move == -1) {
        img_move = 1;
        window.requestAnimationFrame(img_update);
        timeoutID = setTimeout(donext, presetVerse[autoIdx][1] * 1000);
        console.log('requestAnimationFrame');
    }
}

function stopTimer() {
    if (timeoutID > 0)
        window.clearTimeout(timeoutID);
}

function donext() {
    autoIdx = (autoIdx + 1) % presetVerse.length;
    //img_tmp = images[autoIdx];
    opacity_target = 0;
    timeoutID = setTimeout(donext, presetVerse[autoIdx][1] * 1000);
}

var imgcount = 0;

function initAnim() {
    console.log('imgcount : ' + imgcount);
    if (imgcount == presetVerse.length) {
        console.log('imgcount : done');
        autoIdx = 0;
        img = images[0];
        img_tmp = null;

        startImgAnim();
        //timeoutID = setTimeout(donext, presetVerse[autoIdx][1] * 1000);

        return;
    }
    setTimeout(initAnim, 1000);
}

function startPlay() {
    var image = new Image();
    image.src = presetVerse[imgcount][0];
    console.log('image.src: ' + image.src);
    image.onload = function () {
        images[imgcount] = image;
        imgcount++;
        if (imgcount == presetVerse.length) {
            initAnim();
        } else {
            startPlay();
        }
    };
}

/*
function startPlay() {

    imgcount = 0;

    setTimeout(chkCount, 1000);
    
    for(let i=0;i<presetVerse.length;i++) {
        //loadUrlImg(presetVerse[i][0], i);
        var image = new Image();
        image.src = presetVerse[i][0];
        console.log('image.src: ' + image.src);
        image.onload = function () {
            images[i] = image;
            imgcount++;
            //t_mask_opacity = 0;
            //_repaint();
        };
    }
    
    //startImgAnim();
}
*/

createCanvas();
init();
if (presetVerse.length > 0) {
    startPlay();
}

drawHint();



/*
 * 鍵盤相關... START
 */
var keylock = 0;
function keyupAction(e) {
    //e.preventDefault();
    //e.stopPropagation();
    keyboard(e);
}

window.addEventListener('keyup', keyupAction, false);

function keydownAction(e) {

    /*
    if (e.keyCode == 16) {// || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 91) {
        keylock = 1;
        _repaint();
        return;
    }
    */

}

window.addEventListener('keydown', keydownAction, false);
//鍵盤相關 ... END

//大小變化
window.addEventListener('resize', function () {
    init();
    drawHint();
    //_repaint();
});
//_repaint();

  function toObj() {
    let obj = {};
    obj['saved'] = presetVerse;
    obj['during'] = during;
    /*
    for (let i = 0;i<images.length;i++) {
        let idx = 'img_' + i;
        obj[idx] = {};
        obj[idx]['delay'] = 10;
        obj[idx]['base64'] = images[i].base64;
    }
    */
    return obj;
  }

  // message 事件
  function receiveMessage(e) {
    
      const jsonData = JSON.parse(e.data);
    
      if (jsonData.during) {
        during = jsonData.during;  
      }

      if (jsonData.saved && jsonData.saved.length > 0) {
        for (let i = 0; i < jsonData.saved.length; i++) {
          if (i >= 10) return;
          presetVerse[i] = jsonData.saved[i];
        }
      }
      startPlay();      
  }
  
  // message 事件
  window.addEventListener('message', receiveMessage, false);
  
