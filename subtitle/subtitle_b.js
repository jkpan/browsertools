
var image_base64 = null;

function readParam(param) {

  // 获取当前页面的URL
  //var currentURL = window.location.href;
  //console.log('url: ' + currentURL);
  //console.log(':' + window.location.origin);

  // 通过URLSearchParams对象解析URL参数
  var urlParams = new URLSearchParams(window.location.search);

  // 获取特定参数的值
  var parameterValue = urlParams.get(param);//'参数名');

  // 输出参数值到控制台
  console.log(param + ' 参数值为: ' + parameterValue);

  return parameterValue;
}

function dropHandler(event) {

  event.preventDefault();

  // 檢查是否有拖拉的檔案
  if (event.dataTransfer.items) {
    // 使用 DataTransferItemList 物件來檢查檔案是否是圖片
    for (var i = 0; i < event.dataTransfer.items.length; i++) {
      if (event.dataTransfer.items[i].kind === 'file') {
        var file = event.dataTransfer.items[i].getAsFile();
        if (file.type.startsWith('image/')) {
          var reader = new FileReader();
          // 读取文件内容
          reader.onload = function (event) {
            image_base64 = event.target.result;
            showImage(image_base64);
          };
          reader.readAsDataURL(file);
        } else {
          removeBackground();
        }
      }
    }
  }
}

function dragOverHandler(event) {
  event.preventDefault();
}

function removeBackground() {
  let div = document.getElementById("image_container");
  div.hidden = true;
  div.innerHTML = '';
  image_base64 = null;
  transparent = false;
  _repaint();
}

function showImage(content) {
  makeTransparent = false;
  let div = document.getElementById("image_container");
  div.hidden = false;
  div.innerHTML = '<img class="centered" width="100%" height="100%" src="' + content + '" />';
  _repaint();
}

//import '/common.js';
//let animFactor = 0.3;

class Verseobj {

  //static hilight_height = 0;

  volume = 0;
  chapter = 0;
  verse = 0;
  wratio = 0.9;
  substrings = [];
  frontxt = '';
  level = 0;

  transY = -1000;
  fs = 0;
  opacity = 1.0;

  //targetRect = 0;
  targetFs = 0;
  targetTransY = 0;

  initial(volume, c, v, level) {

    this.volume = volume;
    this.chapter = c;
    this.verse = v;
    this.setLevel(level);
    this.fs = this.targetFs;

  }

  set2Top() {
    this.transY = -canvas.height * 0.2;
  }

  set2Bottom() {
    this.transY = canvas.height * 1.1;
  }

  setLevel(level) {
    this.level = level;
    if (this.level == 0)
      this.targetFs = fontsize;
    else if (this.level == 1)
      this.targetFs = fontsize_sml;
    else if (this.level == 2)
      this.targetFs = fontsize_sml_sml;
    else
      this.targetFs = fontsize_sml_sml * 0.8;
  }

  setTargetTransY(_transY) {
    this.targetTransY = _transY;
  }

  preDraw(progress) {

    //if (progress > 0) progress = progress * progress;

    let fs = this.fs;

    if (progress == -1) {
      this.fs = this.targetFs;
      this.transY = this.targetTransY;
      fs = this.fs;
    } else if (progress == -2) {
      fs = this.targetFs;
    } else {

      if ((animElapse % 100) >= animTotal) {
        //animElapse = animElapse >= 100 ? 100 + animTotal : animTotal;
        progress = 1.0;
        this.fs = this.targetFs;
        fs = this.fs;
        this.transY = this.targetTransY;
      } else {
        this.fs += (this.targetFs - this.fs) / (animTotal - animElapse % 100);
        fs = this.fs;
        this.transY += (this.targetTransY - this.transY) / (animTotal - animElapse % 100);
      }

      /*
      let _p = (animElapse % 100) == animTotal ? 1.0 : progress * animFactor;
      this.fs = this.fs + (this.targetFs - this.fs) * _p;
      fs = this.fs;
      this.transY = this.transY + (this.targetTransY - this.transY) * _p;
      */
    }

    if (this.volume <= 0 || this.chapter < 0 || this.verse < 0) return 0;

    let txt = '';
    this.frontxt = '';

    if (this.chapter == 0) {   //print volume only
      if (this.level == 0)
        txt = subtitles[0][0];
    } else if (this.verse == 0) { //print volume with chapter
      txt = '[' + subtitles[this.chapter][0] + ']';
    } else {                     //normal verse
      txt = subtitles[this.chapter][this.verse];
      this.frontxt = this.level == 0 ? ' ' + this.chapter + ':' + this.verse + ' ' :
        ' ' + this.verse;
    }

    if (this.level == 0) {
      this.wratio = 0.9;
      this.opacity = 1.0;
      if (this.chapter > 0 && this.verse > 0) {
        ctx.font = (fs * 0.5) + "px " + fontFamily;//FONT_SML;
        let frontGap = Math.max(0.1, ctx.measureText(this.frontxt).width / canvas.width);
        this.wratio = 1.0 - frontGap;
      }
    } else if (this.level == 1) {
      this.wratio = 0.9;
      this.opacity = LEV_1_OPC;//0.85;
    } else if (this.level == 2) {
      this.wratio = 0.9;
      this.opacity = LEV_2_OPC;//0.7;
    } else {
      this.wratio = 0.9;
      this.opacity = LEV_3_OPC;//0.55;
    }

    ctx.font = fs + "px " + fontFamily;

    this.substrings.length = 0;
    this.substrings = [];
    this.substrings = getTxtArray(txt, this.wratio);

    if (fontsize_dist == 1) //if (color_selection == 0) 
      return this.level == 0 ?
        this.substrings.length * fs + fs * 0.5 :
        this.substrings.length * fs + fs * 0.2;
    //this.substrings.length * this.targetFs + this.targetFs * 0.5;
    else
      return this.substrings.length * fs + fs * 0.5;

  }

  draw() {

    if (!this.substrings) return;

    ctx.textBaseline = 'top';

    if (this.level == 0) {

      //drawHlight(this.targetTransY, 20);//Verseobj.hilight_height);
      drawHlight(HL_offset_progress, HL_H_progress);

      //if (color_selection == 0 && doblank == 0)
      //ctx.transform(1, 0, 0, 1, 0, this.transY);
      ctx.save();
      ctx.transform(1, 0, 0, 1, 0, HL_offset_progress);//this.targetTransY);

      //draw chapter verse
      if (this.chapter > 0 && this.verse > 0) {
        let fs = this.targetFs * 0.5;
        ctx.font = fs + "px " + fontFamily;
        if ((animElapse % 100) >= animTotal * 0.95 || animElapse == -1) {
          _drawSdwtxt(' ' + abbr[this.volume], 0, 0);
          _drawSdwtxt(this.frontxt, 0, this.targetFs * 0.6);
        } else {
          _drawtxt(' ' + abbr[this.volume], 0, 0, 1.0);
          _drawtxt(this.frontxt, 0, this.targetFs * 0.6, 1.0);
        }
      }
      ctx.restore();
    }

    ctx.save();

    ctx.transform(1, 0, 0, 1, 0, this.transY);

    ctx.font = this.fs + "px " + fontFamily;
    let x = canvas.width * (1 - this.wratio);

    if (this.level == 0) {
      let y = this.fs * 0.25;
      for (let i = 0; i < this.substrings.length; i++) {
        if ((animElapse % 100) >= animTotal * 0.95 || animElapse == -1)
          _drawSdwtxt(this.substrings[i], x, y);
        else
          _drawtxt(this.substrings[i], x, y, 1.0);
        y += this.fs;
      }
    } else {
      let y = this.fs * 0.25;
      for (let i = 0; i < this.substrings.length; i++) {
        _drawtxt(this.substrings[i], x, y, this.opacity);
        y += this.fs;
      }
      if (color_selection > 0) {
        ctx.font = this.fs * 0.7 + "px " + fontFamily;
        _drawtxt(this.frontxt, 0, 0, this.opacity * (animElapse < 0 ? 1 : Math.pow(estimateElapse(), 2)));
      }
    }

    //ctx.resetTransform();
    ctx.restore();

  }
}

class VerseVertical {
  volume = -1;
  chapter = -1;
  verse = -1;
  txt = '';
  line = 0;

  initial(s, c, v) {
    this.volume = s;
    this.chapter = c;
    this.verse = v;
    this.txt = subtitles[this.chapter][this.verse];
    this.line = 0;
  }

  drawHlight() {

    if (doblank == 1) return;

    ctx.fillStyle = hlight_pointer;
    ctx.fillRect(canvas.width * 0.95, 0, -(this.line) * fontsize, canvas.height);

  }

  draw(progress) {

    ctx.font = (fontsize * 0.9) + "px " + fontFamily;
    ctx.textBaseline = 'top'; //'alphabetic';
    ctx.textAlign = 'right'; //'left' 'center'

    let count = progress < 0 ? this.txt.length : Math.ceil(this.txt.length * progress);
    let opa = progress < 0 ? 1.0 : progress;

    this.line = Math.ceil(count / (canvas.height * 0.9 / fontsize)) + 1;

    this.drawHlight();

    const mg_x = canvas.width * 0.95;
    const mg_y = canvas.height * 0.05;
    let x = mg_x;
    let y = mg_y;

    if (this.chapter > 0 && this.verse == 0) {
      let fs = fontsize * 0.7;
      ctx.font = fs + "px " + fontFamily;
      this.txt = subtitles[0][0];
      for (let i = 0; i < this.txt.length; i++) {
        _drawSdwtxt(this.txt.charAt(i), x, y, opa);
        y += fontsize;
        if (y + fontsize >= canvas.height * 0.95) {
          x -= fontsize;
          y = mg_y;
        }
      }
      _drawSdwtxt('' + this.chapter, x, y, opa);
    } else {
      for (let i = 0; i < count; i++) {

        _drawSdwtxt(this.txt.charAt(i), x, y, opa);
        y += fontsize;

        if (y + fontsize >= canvas.height * 0.95) {
          x -= fontsize;
          y = mg_y;
        }
      }
    }



    ctx.textAlign = 'left';// 'center'

    if (this.chapter > 0 && this.verse > 0) {
      let fs = fontsize * 0.5;
      ctx.font = fs + "px " + fontFamily;
      x = mg_x - this.line * fontsize;
      let _abbr = abbr[song];
      _drawSdwtxt(_abbr.charAt(0), x, canvas.height - 5 * fs, opa);
      if (_abbr.length > 1)
        _drawSdwtxt(_abbr.charAt(1), x, canvas.height - 4 * fs, opa);
      _drawSdwtxt('' + this.chapter, x, canvas.height - 3 * fs, opa);
      _drawSdwtxt('' + this.verse, x, canvas.height - 2 * fs, opa);
    }

    //for (let i=0;i<this.txt.length;i++) {
    //    ctx.fillText(this.txt.charAt(i), canvas.width/2, 0);
    //}

    ctx.textBaseline = 'alphabetic';


  }
}

var v_vertical = new VerseVertical();

function render_vertical(progress) {
  _layer0();
  if (v_vertical.volume != song ||
    v_vertical.chapter != phase ||
    v_vertical.verse != line) {
    v_vertical.initial(song, phase, line);
  }
  v_vertical.draw(progress);

  /*
  for (let i = 0; i < queue.length; i++) {
    let obj = queue[i];
    if (obj.chapter == phase && obj.verse == line) {
      
      if (v_vertical.volume != obj.volume ||
        v_vertical.chapter != obj.chapter ||
        v_vertical.verse != obj.verse) {
        v_vertical.initial(obj.volume, obj.chapter, obj.verse);
      }
      v_vertical.draw(progress);
      break;
    }
  }
  */
  _layerui();
}

var presetVerse = [

  [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']

  /*
  ['', 0, 0],         //0
  ['創世記', 0, 0],    //1
  ['約書亞記', 0, 0],  //2
  ['約伯記', 0, 0],    //3
  ['以賽亞書', 0, 0],  //4
  ['何西阿書', 0, 0],  //5
  ['馬太福音', 0, 0],   //6
  ['羅馬書', 0, 0],     //7
  ['提摩太前書', 0, 0], //8
  ['希伯來書', 0, 0],   //9
  */

];

var content_help = [[
  "'左右' 上ㄧ節下ㄧ節  '上下' 上ㄧ章下ㄧ章",
  "'-'上一卷  '='下一卷",
  "'1234567890' 跳至預存  'QWERTYUIOP' 儲存1-0",
  "'L' 開啟選單 'X' 複製此節 'M'文字模式",
  "'A' 換顏色 'B' Blank 'C' 字顏色",
  "shift'ASDFG' 舊約分類  shift'ZXCV' 新約分類",
  "shift'1234567890' 選章",
  "shift'左右' 上十節下十節  shift'上下' 上十章下十章",
  "shift'=-' 字大小  'esc' 跳回預設樣式",
  "按住'space' 語音辨識(Chrome, 網路連線)",
  "'Enter'控制同步選項"
]];

//function flow() {}

const LEV_1_OPC = 0.9;
const LEV_2_OPC = 0.8;
const LEV_3_OPC = 0.7;

var fontfactor = 14.0;
const fontFamily_array = ["Monospace", "LXGW WenKai Mono TC", "Noto Serif TC", "Shippori Antique B1", "Mochiy Pop One"];
//["報隸-繁", "行楷-繁", "宋體-繁", "黑體-繁"]; //mac system fonts

var fontFamily = fontFamily_array[0];

var fontsize = 48;
var FONT = fontsize + "px " + fontFamily;

var fontsize_sml = 32;
var FONT_SML = fontsize_sml + "px " + fontFamily;

var fontsize_sml_sml = 24;
var FONT_SML_SML = fontsize_sml_sml + "px " + fontFamily;


//color stuff
var bgStyle = 'green';//"rgb(255, 255, 255, 0.5)";//"rgb(0, 0, 0, 0.5)";
const COLORS_CK = ["rgb(0, 100, 0)", "green", "rgb(0, 180, 0)", "rgb(0, 255, 0)"];

var bgStyle_green = bgStyle;
const COLORS_green = COLORS_CK;//["rgb(80, 80, 80)", "rgb(120, 128, 128)", "rgb(180, 180, 180)", "rgb(255, 255, 255)"];

var bgStyle_black = 'black';
const COLORS_black = ["rgb(80, 80, 80)", "rgb(120, 128, 128)", "rgb(180, 180, 180)", "rgb(255, 255, 255)"];//["rgb(80, 80, 80)", "rgb(0, 0, 0)", "rgb(150, 150, 150)", "rgb(200, 200, 200)"];

var bgStyle_white = 'white';
const COLORS_white = ["rgb(255, 255, 255)", "rgb(180, 180, 180)", "rgb(120, 128, 128)", "rgb(80, 80, 80)"];//["rgb(80, 80, 80)", "rgb(0, 0, 0)", "rgb(150, 150, 150)", "rgb(200, 200, 200)"];

/////
var hlightStyle_green = 'rgba(0, 70, 0, 0.7)';//"rgb(255, 255, 255, 0.5)";//"rgb(0, 0, 0, 0.5)"; 
var hlightStyle_black = 'rgba(150, 150, 150, 0.7)';//"rgb(255, 255, 255, 0.5)";//"rgb(0, 0, 0, 0.5)"; 
var hlightStyle_white = 'rgba(0, 0, 0, 0.2)';//"rgb(255, 255, 255, 0.5)";//"rgb(0, 0, 0, 0.5)"; 
var hlightStyle_none = 'rgba(0, 0, 0, 0.1)';//"rgb(255, 255, 255, 0.5)";//"rgb(0, 0, 0, 0.5)"; 
////

var bgcolor_pointer = bgStyle;
var color_pointer = COLORS_CK;
var hlight_pointer = hlightStyle_green;

var makeTransparent = false;
var fontsize_dist = 0;

var printSaved = true;

var verseCount = 4;
var fontColorType = 1;
//var print_ctx_vidx = 1;
var username = null;

function colorSwitch_hlight() {
  switch (color_selection_hlight) {
    case 0:
      hlight_pointer = hlightStyle_green;
      break;
    case 1:
      hlight_pointer = hlightStyle_black;
      break;
    case 2:
      hlight_pointer = hlightStyle_white;
      break;
    case 3:
      hlight_pointer = hlightStyle_none;
      break;
    case 4:
      //gradient background
      break;
  }
}

function colorSwitch() {
  console.log('color_selection : ' + color_selection);
  ctx.globalAlpha = 1.0;
  switch (color_selection) {
    case 0:
      //bgcolor_pointer = 'rgba(0,0,0,0)';
      //color_pointer = 'rgba(0,0,0,0)';
      //hlight_pointer = 'rgba(0, 0, 0, 0.5)';//hlightStyle;
      //break;//case 1: //default: //0, 1
      bgcolor_pointer = bgStyle;
      color_pointer = COLORS_CK;
      color_selection_hlight = 0;
      colorSwitch_hlight();
      fontColorType = 1;
      //hlight_pointer = hlightStyle;
      break;
    case 1:
      bgcolor_pointer = bgStyle_black;
      color_pointer = COLORS_black;
      color_selection_hlight = 1;
      colorSwitch_hlight();
      fontColorType = 1;
      //hlight_pointer = hlightStyle_black;
      break;
    case 2:
      bgcolor_pointer = bgStyle_white;
      color_pointer = COLORS_white;
      color_selection_hlight = 2;
      colorSwitch_hlight();
      fontColorType = 3;
      //hlight_pointer = hlightStyle_white;
      break;
  }
  _repaint();
}

function _drawSdwtxt(txt, x, y) {

  if (doblank == 1 && color_selection == 0 && animElapse < 100) { //綠幕專用
    ctx.fillStyle = 'rgb(0, 220, 0)';
    ctx.lineWidth = 1;
    ctx.fillText(txt, x, y);
    return;
  }

  switch (fontColorType) {
    case 0://白字
      ctx.fillStyle = 'rgb(255,255,255)';//'rgba(255,255,255,' + opa + ')';//'white';
      break;
    case 1://白字黑邊
      ctx.fillStyle = 'rgb(255,255,255)';//'rgba(255,255,255,' + opa + ')';
      ctx.strokeStyle = 'rgb(0,0,0)';//'rgba(0,0,0,' + opa + ')';
      ctx.lineWidth = Math.ceil(fontsize / 12.0);
      ctx.strokeText(txt, x, y);
      break;
    case 2://黑字
      ctx.fillStyle = 'rgb(0,0,0)';//'rgba(0,0,0,' + opa + ')';
      break;
    case 3://黑字白邊
      ctx.fillStyle = 'rgb(0,0,0)';//'rgba(0,0,0,' + opa + ')';
      ctx.strokeStyle = 'rgba(255,255,255, 0.7)';//'rgba(255,255,255,' + opa + ')';
      ctx.lineWidth = Math.ceil(fontsize / 16.0);
      ctx.strokeText(txt, x, y);
      break;
  }

  ctx.fillText(txt, x, y);

}

function _drawtxt(txt, x, y, a) {

  if (doblank == 1 && color_selection == 0 && animElapse < 100) { //綠幕專用
    ctx.fillStyle = 'rgb(0, 200, 0)';
    ctx.fillText(txt, x, y);
    return;
  }
  //else ctx.fillStyle = txt_fill + a + ')';

  switch (fontColorType) {
    case 0://白字
    case 1://白字
      ctx.fillStyle = 'rgba(255,255,255,' + a + ')';//'rgba(255,255,255,' + opa + ')';
      break;
    case 2://黑字
    case 3://黑字
      ctx.fillStyle = 'rgba(0,0,0, ' + a + ')';//'rgba(0,0,0,' + opa + ')';
      break;
  }

  ctx.fillText(txt, x, y);
}

function getSong(jsonid) {
  var json_elm = document.getElementById(jsonid);
  if (json_elm) {
    var obj = JSON.parse(json_elm.innerHTML);
    return obj.content;
  }
  return [['']];
}

var SONGS = [[['']]];

var chineseAbbr = getSong('中文縮寫');
var chineseFullname = getSong('中文全名');
var engAbbr = getSong('英文縮寫');
var engFullname = getSong('英文全名');

var abbr = chineseAbbr;
var fullname = chineseFullname;

var doLanguageSwitch = false;
var languageSwitch = 0; //0: Chinese和合本 1:NIV

function switchLang() {
  if (!doLanguageSwitch) return;
  if (abbr == chineseAbbr) {
    abbr = engAbbr;
    fullname = engFullname;
    languageSwitch = 1;
    switchVoice2English();
  } else {
    abbr = chineseAbbr;
    fullname = chineseFullname;
    languageSwitch = 0;
    switchVoice2Chinese();
  }
  for (let i = 1; i < abbr.length; i++) SONGS[i] = getSong(abbr[i]);
  subtitles = SONGS[song];
  _repaint();
}

//const MAX_VERSES_GREEN = 2;
//const MAX_VERSES_NORMAL = 7;

var song;
var subtitles;

var phase = 0;
var line = 0;
var mode = 0;

var doblank = 0;
var helpSwitch = 0;

var canvas;
var ctx;

var color_selection = 0;
var color_selection_hlight = 0;

var uisel = 0;
var uisel_start = 0;
var uisel_end = 0;

function createCanvas() {

  let _canvas = document.createElement('canvas');
  _canvas.id = "canvas";
  _canvas.width = 100;
  _canvas.height = 100;

  _canvas.setAttribute('ondrop', 'dropHandler(event)');
  _canvas.setAttribute('ondragover', 'dragOverHandler(event)');

  //_canvas.style.zIndex = 8;
  //_canvas.style.position = "absolute";
  //_canvas.style.border = "1px solid";

  let body = document.getElementsByTagName("body")[0];
  body.appendChild(_canvas);

  document.body.style.display = false;
  document.body.style.margin = 0;
  document.body.style.backgroundColor = 'transparent';
}

createCanvas();

function init() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");

  fontsize = Math.ceil(Math.min(canvas.width, canvas.height) / fontfactor);//48;
  FONT = fontsize + "px " + fontFamily;

  fontsize_sml = Math.ceil(fontsize * 0.66);//32;
  FONT_SML = fontsize_sml + "px " + fontFamily;

  fontsize_sml_sml = Math.ceil(fontsize * 0.5);
  FONT_SML_SML = fontsize_sml_sml + "px " + fontFamily;

}

/*
 websocket .. 
 */
var ws;
var timeoutID = -1;
//
function chkWebsocket() {

  //console.log(`B# ${timeoutID}`);

  if (timeoutID >= 0) window.clearTimeout(timeoutID);

  if (sync_type != 5) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      ws = null;
    }
    return;
  }

  if (ws && ws.readyState != WebSocket.OPEN) {
    console.log('WebSocket is not open');
    initWebsocket();
    return;
  }

  timeoutID = setTimeout(chkWebsocket, 3000);
}

function initWebsocket() {

  let serverDomain = window.location.hostname;

  console.log('window.location: ', window.location);

  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log('WebSocket is open');
    ws.close();
  } else {
    console.log('WebSocket is not open');
  }

  if (username == null) return;

  let port = 80;
  if (window.location.protocol === 'https:') {
    port = 443;
  } else {
    if (window.location.port.length > 0) {
      port = parseInt(window.location.port, 10);
    }
  }

  ws = port == 443 ?
    new WebSocket(`wss://${serverDomain}/Bible/${username}`) :
    new WebSocket(`ws://${serverDomain}:${port}/Bible/${username}`);
  //console.log('ws://' + serverDomain + ':' + port + '/Bible' + (username == 'guest'?'':'/' + username));
  ws.onopen = function () {
    console.log('Connected to server');
    ws.send('Hello - from 聖經 client');
  };
  ws.onmessage = function (event) {
    console.log('Received:', event.data);
    restoreFromJson(JSON.parse(event.data));
  };
  ws.onclose = function () {
    console.log('Connection closed');
  };

  if (timeoutID >= 0) window.clearTimeout(timeoutID);
  timeoutID = setTimeout(chkWebsocket, 5000);

}

/*
  ajax .. 
  */
function _ajax(json, url, cb, errorcb) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(json)
  }).then((response) => {
    if (response.ok) {
      return response.json(); // 解析JSON回應
    } else {
      throw new Error("請求失敗：" + response.status);
    }
  }).then((data) => {
    // 在這裡處理解析後的JSON物件 //console.log(data);
    cb(data)
  }).catch((error) => {
    // 處理錯誤
    console.log('' + error);
    errorcb();
  });
}

function ajax_sync() {
  /*
  //'http://54.169.169.141/synscripture_get',
  const url = new URL('http://192.168.0.16/synscripture_get');
  const params = {
    vlm: song,
    chp: phase,
    ver: line,
    blank: doblank
  };
  // 將參數附加到 URL
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  fetch(url).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  }).then(data => {
    console.log(data);
  }).catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
  */

  if (username == null) return;

  _ajax({
    vlm: song,
    chp: phase,
    ver: line,
    blank: doblank,
    user: username
  },
    '/synscripture',
    //'http://192.168.0.16/synscripture',
    (res) => {
      console.log(JSON.stringify(res));
    }, () => {
      console.log('exception');
    });

}

function restoreFromJson(res) {
  let volume = res.vlm;
  let chapter = res.chp;
  let verse = res.ver;
  let _doblank = res.blank;

  restoreAnim(volume, chapter, verse, _doblank);
}

function ajax_restore() {
  if (username == null) return;
  _ajax({
    "action": "restore",
    "user": username
  },
    '/restorescripture',
    (res) => {//console.log(JSON.stringify(res));
      restoreFromJson(res);
      if (sync_type == 6) setTimeout(ajax_restore, 200);
    },
    () => {
      console.log('error: delay & re-send');
      if (sync_type == 6) setTimeout(ajax_restore, 2000);
    });
}

var sync_type = 0;

var funcInterval;
//function restoreActionFromServer() {ajax_restore();}
function startRestoreFromServerInterval() {
  if (funcInterval) stopActionInterval();
  ajax_restore();
  //funcInterval = window.setInterval(ajax_restore, 200);
}
function startRestoreInterval() {
  if (funcInterval) stopActionInterval();
  funcInterval = window.setInterval(restoreActionFromLocal, 200);
}

function stopActionInterval() {
  if (funcInterval)
    clearInterval(funcInterval);
  funcInterval = null;
  localStorage.removeItem('save action');
}

function saveAction2Local() {
  //if (funcInterval) return;
  if (!(sync_type == 1 || sync_type == 2 || sync_type == 3)) return;

  if (sync_type == 2 || sync_type == 3) ajax_sync();

  if (sync_type == 2) return;

  _saveAction2Local();

}

function _saveAction2Local() {
  let key = 'save action';  //localStorage.removeItem(key);
  let value = song + ' ' + phase + ' ' + line + ' ' + doblank;
  localStorage.setItem(key, value);
}


//判斷是不是要卷軸動畫
function restoreAnim(volume, chapter, verse, _doblank) {
  if (!(volume < SONGS.length &&
    chapter < SONGS[volume].length &&
    verse < SONGS[volume][chapter].length)) {
    return;
  }

  if (volume != song) {
    chkVolDir(song, volume);
  }

  /*
  if (volume == song && chapter == phase && verse == line) {
    if (_doblank != doblank) {
      keyboard({ keyCode: 66 });
    }
    return;
  }
  */

  keylock = false;
  if (_doblank != doblank) 
    keyboard({ code: 'KeyB', keyCode: 66 });
  
  if (volume == song && chapter == getPreChapter(phase, line) && verse == getPreVerse(phase, line)) {
    keyboard({ code: 'ArrowLeft', keyCode: 37 }); //left
    return;
  }

  if (volume == song && chapter == getNextChapter(phase, line) && verse == getNextVerse(phase, line)) {
    keyboard({ code: 'ArrowRight', keyCode: 39 }); //right
    return;
  }

  if (volume == song && chapter == phase && verse == line)
    return;

  song = volume;
  subtitles = SONGS[song];
  phase = chapter;
  line = verse;

  if (display_mode != 0) {
    animElapse = 0;
    window.requestAnimationFrame(verse_update);
    //_repaint();
  } else {
    _repaint();
  }

}

function restoreActionFromLocal() {

  //ajax_restore(); return;

  let key = 'save action';
  let value = localStorage.getItem(key);
  if (!value) return;
  value = value.trim();
  if (value && value.length == 0) return;
  let array = value.split(' ');
  let volume = parseInt(array[0]);//array[0];
  let chapter = parseInt(array[1]);
  let verse = parseInt(array[2]);
  let _doblank = parseInt(array[3]);

  restoreAnim(volume, chapter, verse, _doblank);

}

/*
function save2Local() {
  for (let idx = 0;idx < presetVerse.length;idx++) {
    let key = 'save ' + idx;
    localStorage.removeItem(key);
    let value = ''; 
    if (presetVerse[idx][0].length > 0) {
      value = presetVerse[idx][0] + ' ' + presetVerse[idx][1] + ' ' + presetVerse[idx][2]; 
    }
    localStorage.setItem(key, value);
  }
}
 
function restoreLocal() {
  for (let idx = 0;idx < presetVerse.length;idx++) {
    let key = 'save ' + idx;
    let value = localStorage.getItem(key); 
    if (value && value.length > 0) {
      let array = value.split(' ');
      presetVerse[idx][0] = array[0];
      presetVerse[idx][1] = parseInt(array[1]);
      presetVerse[idx][2] = parseInt(array[2]);
    } else {
      presetVerse[idx] = [''];
    }
  }
}
*/

function plaintxtMode() {
  removeDiv();
  canvas.hidden = true;
  var div = document.createElement('div');
  div.id = 'chapter';
  document.body.appendChild(div);

  var poetry = false;
  if (song >= 18 && song <= 22) {
    poetry = true;
  }

  var txt = "";
  for (var i = 1; i < subtitles[phase].length; i++) {
    if (i == line) {
      txt = ' <span>[' + phase + ':' + i + '] ' + subtitles[phase][i] + '</span>';
    } else {
      txt = ' [' + phase + ':' + i + '] ' + subtitles[phase][i];
    }
    if (poetry) txt += '<br/>';
    div.innerHTML += txt;
  }
  //div.insertAdjacentHTML('beforeend', txt);
}

function _newBtn() {

  var button = document.createElement('button');

  button.style.width = '128px'; // setting the width to 200px
  button.style.height = 'auto';//'32px'; // setting the height to 200px

  //button.style.background = 'rgb(250,250,50)'; // setting the background color to teal
  //button.style.color = 'rgb(5,5,5)';//color_pointer[1];// 'green'; // setting the color to white
  //button.style.fontSize = '14px'; // setting the font size to 20px

  //button.style.borderColor = 'rgb(255,255,255)';
  //button.style.borderRadius = '4px';

  //button.style.border = 'none';

  return button;
}

var ctrls = [];

function setMsg_none() {
  sync_type = 0;
  synctrls();
}

function setMsg_O() {
  sync_type = 1;
  synctrls();
}

function setMsg_ctrl() {
  sync_type = 2;
  synctrls();
}

function setMsg_3() {
  sync_type = 3;
  synctrls();
}

function setMsg_X() {
  sync_type = 4;
  synctrls();
}

function setMsg_play_socket() {
  sync_type = 5;
  synctrls();
}

function setMsg_play() {
  sync_type = 6;
  synctrls();
}

function addBtn(caption, parent, _onclick) {
  var btn = _newBtn();
  btn.innerHTML = caption;
  btn.onclick = _onclick;
  parent.appendChild(btn);
  return btn;
}

function createCtrlBtn() {

  if (document.getElementById('ctrl')) {
    removeDiv();
    return;
  }

  removeDiv();

  canvas.hidden = false;

  let div = document.createElement('div');
  div.appendChild(document.createElement("br"));

  div.style.position = "fixed";
  div.style.top = "0";
  div.style.left = "0";
  div.style.width = "96%";
  div.style.height = "96%";
  div.style.margin = "2% 2% 2% 2%";

  div.id = 'ctrl';
  document.body.appendChild(div);
  div.style.backgroundColor = 'rgba(0,0,0, 0.0)';

  ctrls[0] = addBtn('單機使用', div, () => { setMsg_none(); return false; });

  div.insertAdjacentHTML('beforeend', '<br/><br/>');

  ctrls[1] = addBtn('控制本機', div, () => { setMsg_O(); return false; });
  ctrls[2] = addBtn('控制遠端', div, () => { setMsg_ctrl(); return false; });
  ctrls[3] = addBtn('控制本機和遠端', div, () => { setMsg_3(); return false; });

  div.insertAdjacentHTML('beforeend', '<br/><br/>');

  ctrls[4] = addBtn('從本機同步', div, () => { setMsg_X(); return false; });
  ctrls[5] = addBtn('從伺服器同步', div, () => { setMsg_play_socket(); return false; });

  ctrls[2].hidden = true;
  ctrls[3].hidden = true;
  ctrls[5].hidden = true;
  doChk().then((result) => { //console.log('======='); //console.log(JSON.stringify(result));
    username = null;
    if (result.state > 0) username = result.username;
    if (result.state == 1) {
      ctrls[2].hidden = false;
      ctrls[3].hidden = false;
      ctrls[5].hidden = false;
      ctrls[5].innerHTML = `${ctrls[5].innerHTML}${username}`;
    }
    syntoggle();
  }).catch(error => {
    console.error('Error:', error);
    syntoggle();
  });

  /*
  var btn_ws = _newBtn();
  btn_ws.innerHTML = 'web slave';
  btn_ws.onclick = function () {
    setMsg_play();
    return false;
  };
  div.appendChild(btn_ws);
  ctrls[6] = btn_ws;
  */

  div.insertAdjacentHTML('beforeend', '<br/><br/><hr />');

  ctrls[7] = addBtn('mode', div, () => { keyboard({ code: 'KeyA' }); return false; });
  ctrls[8] = addBtn('vertical', div, () => { keyboard({ code: 'KeyV' }); return false; });
  ctrls[9] = addBtn('char color', div, () => { keyboard({ code: 'KeyC' }); return false; });
  ctrls[10] = addBtn('font', div, () => { keyboard({ code: 'KeyF' }); return false; });
  ctrls[11] = addBtn('show saved', div, () => { keyboard({ code: 'KeyS' }); return false; });
  ctrls[12] = addBtn('Line dist.', div, () => { keyboard({ code: 'KeyD' }); return false; });

  div.insertAdjacentHTML('beforeend', '<br/><br/>');

  ctrls[13] = addBtn('font size-', div, () => {
    helpSwitch = 0;
    downsizeFS();
    _repaint();
    return false;
  });
  ctrls[14] = addBtn('font size+', div, () => {
    helpSwitch = 0;
    enlargeFS();
    _repaint();
    return false;
  });

  ctrls[15] = addBtn('Line-', div, () => {
    subLineCount();
    return false;
  });
  ctrls[16] = addBtn('Line+', div, () => {
    addLineCount();
    return false;
  });
  div.insertAdjacentHTML('beforeend', '<br/><br/>');
  ctrls[17] = addBtn('移除背景', div, () => {
    removeBackground();
    return false;
  });

  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.hidden = false;
  colorInput.id = "dynamicColorPicker";
  // 加到 body 中
  div.appendChild(colorInput);

  ctrls[18] = colorInput;

  // 加事件：選色時改變背景色
  colorInput.addEventListener("input", function () {
    ctrls[19].hidden = false;
    ctrls[20].hidden = false;
    removeBackground();
    makeTransparent = true;
    document.body.style.backgroundColor = colorInput.value;
    console.log(colorInput.value);
  });

  ctrls[19] = addBtn('不透明度-', div, () => {
    opacity--;
    if (opacity < 0) opacity = 0;
    bgopacity();
    return false;
  });
  ctrls[20] = addBtn('不透明度+', div, () => {
    opacity++;
    if (opacity > 100) opacity = 100;
    bgopacity();
    return false;
  });
  ctrls[19].hidden = true;
  ctrls[20].hidden = true;

  div.insertAdjacentHTML('beforeend', '<br/><br/>');
  ctrls[21] = addBtn('自動閱讀', div, () => { startReading(); removeDiv(); return false; });
  ctrls[22] = addBtn('停止閱讀', div, () => { stopReading(); removeDiv(); return false; });

  ctrls[23] = addBtn('圖庫', div, () => { openLib(); return false; });

}

function pushFromUpload(content) {
  if (content.startsWith('http') || content.startsWith('data:')) {
    image_base64 = content;
    showImage(content);
  }
}

var opacity = 100;

function bgopacity() {
  const colorPicker = document.getElementById('dynamicColorPicker');
  const color = colorPicker.value; // HEX format, e.g. #ff0000
  const alpha = opacity / 100; // convert to 0–1

  // 將 HEX 轉為 RGB
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  console.log(`rgba(${r}, ${g}, ${b}, ${alpha})`);
  document.body.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function syntoggle() {
  if (ctrls[sync_type].hidden) setMsg_none();
  for (let i = 0; i <= 5; i++) {
    if (sync_type == i) {
      ctrls[i].style.backgroundColor = 'rgb(255, 255, 255)';
      ctrls[i].style.color = 'rgb(0, 0, 0)';
    } else {
      ctrls[i].style.backgroundColor = 'rgb(50, 50, 50)';
      ctrls[i].style.color = 'rgb(255, 255, 255)';
    }
  }
}

function synctrls() {
  if (canvas.hidden) syntoggle();
  if (funcInterval) stopActionInterval();
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  switch (sync_type) {
    case 0: break;
    case 1: break;
    case 2: break;
    case 3: break;
    case 4: startRestoreInterval(); break;
    case 5: initWebsocket(); break;
    case 6: startRestoreFromServerInterval(); break;
  }
  //return;
  removeDiv();
  canvas.hidden = false;
  _repaint();

}

function removeDiv() {

  //var buttons = document.getElementById('btns');
  //if (buttons) document.body.removeChild(buttons);

  var txt = document.getElementById('chapter');
  if (txt) document.body.removeChild(txt);

  var ctrl = document.getElementById('ctrl');
  if (ctrl) document.body.removeChild(ctrl);

  return;
}

function printSideTxt(i, j, x, y, a) {

  let txt = "";

  if (i == 0 && j == 0) {
    txt = "";
  } else if (j == 0) {
    //txt = '['+subtitles[0][0] + ' ' + i + ']';
    txt = '[' + subtitles[i][j] + ']';
  } else {
    txt = subtitles[i][j];
    _drawtxt('   ' + j, 10, y, a);
  }

  _drawtxt(txt, x, y, a);

}

function drawHlight(yy, hh) {

  if (color_selection_hlight == 5 && doblank == 0) {
    gradientBg();
    return;
  }
  if (color_selection_hlight == 4 && doblank == 0) {
    gradientBg2(yy, hh);
    return;
  }

  if (doblank == 0 && phase >= 1) {
    ctx.fillStyle = hlight_pointer;
    ctx.fillRect(0, yy, canvas.width, hh);
    /*
    const g_gap = hh * 2;
    let grd = ctx.createLinearGradient(0, yy + hh/2, 0, yy - g_gap);
    grd.addColorStop(0, hlight_pointer);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
  
    ctx.fillStyle = grd;
    ctx.fillRect(0, yy - g_gap, canvas.width, g_gap + hh/2);  
  
    grd = ctx.createLinearGradient(0, yy + hh/2, 0, yy + hh + g_gap);
    grd.addColorStop(0, hlight_pointer);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
  
    ctx.fillStyle = grd;
    ctx.fillRect(0, yy + hh/2, canvas.width, g_gap + hh/2);
    */
  }
}

function txtArrayforChinese(txt, wRatio) {
  let substrings = [];
  let idx = 0;
  let mwidth = canvas.width * wRatio - fontsize / 2;
  do {
    if (ctx.measureText(txt).width > mwidth) {
      let ratio = mwidth / ctx.measureText(txt).width;
      ratio = Math.ceil(txt.length * ratio) - 1; //字數
      let txt_0 = txt.substr(0, ratio);
      txt = txt.substr(ratio, txt.length - txt_0.length);
      // x 如果這個行最後一個字是英文 下一行的頭是英文 if (islastChar(txt_0) && is0Char(txt)) txt_0 += '-';
      substrings[idx] = txt_0;
      idx++;
      if (idx > 20) break;
    } else {
      substrings[idx] = txt;
      break;
    }
  } while (true);
  return substrings;
}

function txtArrayforEnglish(txt, wRatio) {
  let substrings = [];
  let idx = 0;
  let mwidth = canvas.width * wRatio - fontsize / 2;
  const words = txt.split(" ");
  let line = '';
  let tmp = '';
  for (let i = 0; i < words.length; i++) {
    if (line.length == 0) { //一定要有一項
      line += words[i] + ' ';
      continue;
    }
    let _line = line + words[i] + ' ';
    if (ctx.measureText(_line).width < mwidth) {
      line = _line;
    } else {
      substrings.push(line.trim());
      line = '';
      i--;
    }
  }

  substrings.push(line.trim());

  return substrings;
}

function getTxtArray(txt, wRatio) {
  if (languageSwitch == 0) {
    return txtArrayforChinese(txt, wRatio);
  } else {
    return txtArrayforEnglish(txt, wRatio);
  }
}

function blankend_update() {

  render(-1);

  if (!makeTransparent) {
    ctx.fillStyle = 'rgba(0,128,0,' + (1.0 - estimateElapse()) + ')'; //opacity 1.0 ~ 0
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (doblank == 1) return;

  if ((animElapse % 100) < animTotal) {
    animElapse++;
    if (makeTransparent) ctx.globalAlpha = animElapse % 100/animTotal;
    window.requestAnimationFrame(blankend_update);
  } else {
    animElapse = -1;
    ctx.globalAlpha = 1.0;
    _repaint();
  }

}

function blank_update(elapse) {

  render(-1);

  if (animElapse < 100) return;

  if (!makeTransparent) {
    ctx.fillStyle = 'rgba(0,128,0,' + estimateElapse() + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (doblank == 0) return;

  if ((animElapse % 100) < animTotal) {
    animElapse++;
    if (makeTransparent) ctx.globalAlpha = (animTotal - animElapse % 100)/animTotal;
    window.requestAnimationFrame(blank_update);
  } else {
    animElapse = -1;
    if (makeTransparent) ctx.globalAlpha = 0.0;
    _repaint();
  }

}

function estimateElapse() {
  if ((animElapse % 100) > animTotal)
    return 1.0;
  return (animElapse % 100) / animTotal;
}

var display_mode = 0;
var animTotal = 30;
var animElapse = -1; //var savePre = 0;
var preT = 0;

function estimateTotal(t) {

  let diff = t - preT;
  preT = t;

  if (animElapse > 5 && animElapse < 12) {
    if (diff > 10) {
      animTotal = 24; //animFactor = 0.33;
    } else {
      animTotal = 48; //animFactor = 0.15;
    }
  }
}

function verse_update(t) {

  estimateTotal(t);

  switch (display_mode) {
    case 0:
      render(estimateElapse());
      break;
    case 1:
      render_vertical(estimateElapse());
      break;
  }

  if (animElapse == -1) return;

  /* 
    x      a
   ---- = ----   x = a * 30/60
    30     60 
   */
  if ((animElapse % 100) > animTotal) { //console.log(animElapse + '/' + animTotal);
    animElapse = Math.floor(animElapse / 2);
    window.requestAnimationFrame(verse_update);
  } else if ((animElapse % 100) < animTotal) {
    animElapse++;
    window.requestAnimationFrame(verse_update);
  } else if ((animElapse % 100) == animTotal) {
    animElapse = -1;
    _repaint();
  }

}

function getQueuePre() {
  if (queue.length == 0) return null;
  let obj = queue[0];
  let c = getPreChapter(obj.chapter, obj.verse);
  let v = getPreVerse(obj.chapter, obj.verse);
  obj = new Verseobj();
  obj.initial(song, c, v, 1);
  obj.set2Top();
  return obj;
}

function getQueueNext() {
  if (queue.length == 0) return null;
  let obj = queue[queue.length - 1];
  let c = getNextChapter(obj.chapter, obj.verse);
  let v = getNextVerse(obj.chapter, obj.verse);
  obj = new Verseobj();
  obj.initial(song, c, v, 1);
  obj.set2Bottom();
  return obj;
}

function operateQuene(queueType, doanim) {

  if (queue.length == 0) {
    queueType = 0;
  }

  //push 往後加 shift 從頭砍
  //unshift 往前加 pop 從後砍 
  switch (queueType) {
    case 0:
      printMain(phase, line);
      return;
    case 1: //move next
      queue.shift();
      queue.push(getQueueNext());
      break;
    case 2: //move previous
      queue.unshift(getQueuePre());
      queue.pop();
      break;
  }

  let sel = -1;
  for (let i = 0; i < queue.length; i++) {
    let obj = queue[i];
    obj.setLevel(1);
    if (obj.chapter == phase && obj.verse == line) {
      obj.setLevel(0);
      sel = i;
      //if (color_selection < 1 && i >= 2) queue[i-2].setLevel(2);
    }
  }

  if (fontsize_dist == 1) { //if (color_selection == 0) {
    for (let _sel = 2; ; _sel++)
      if (sel >= _sel) queue[sel - _sel].setLevel(_sel);
      else break;
    for (let _sel = 2; ; _sel++)
      if (queue.length > sel + _sel) queue[sel + _sel].setLevel(_sel);
      else break;
    /*
    if (sel >= 2)
      queue[sel - 2].setLevel(2);
    if (queue.length > sel + 2)
      queue[sel + 2].setLevel(2);
    if (sel >= 3)
      queue[sel - 3].setLevel(3);
    if (queue.length > sel + 3)
      queue[sel + 3].setLevel(3);
      */
  }

  if (doanim > 0) {
    if (animElapse < 0) {
      animElapse = 0;
      window.requestAnimationFrame(verse_update);
    } else {
      animElapse = 0;
    }

  } else {
    //render(-1);
    _repaint();
  }

}

function render(progress) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  trans_start();

  _layer0();
  _render(progress);
  _layerui();

  trans_end();
  if (skewidx > 0) {
    if (animElapse < 0) {
      window.requestAnimationFrame(_repaint);
    }
  }
}

var queue = [];
var HL_offset_target = 0;
var HL_offset_progress = 0;
var HL_H_target = 0;
var HL_H_progress = 0;

const FIX_HL = false;

function _render(progress) {

  //let x = canvas.width * 0.1;

  let fixy = FIX_HL ? canvas.height * 0.33 : HL_offset_target; //
  let offY = fixy;

  if (progress <= 0)/////
    for (let i = 0; i < queue.length; i++) {
      let obj = queue[i];
      if (obj.chapter == phase && obj.verse == line) {

        if (!FIX_HL) {
          obj.setTargetTransY(fixy);
          let offY_h = obj.preDraw(-2);// + fontsize_sml_sml / 2.0;
          let gap = (canvas.height - offY_h) / 2;
          fixy = gap;
          obj.setTargetTransY(fixy);
          offY = gap + offY_h;
          HL_offset_target = fixy;
          HL_H_target = offY_h - obj.targetFs * 0.16;
        } else {
          obj.setTargetTransY(fixy);
          offY += obj.preDraw(-2);//offY += fontsize_sml_sml / 2.0;
          if (offY > canvas.height) { //經文超出高度 往上移
            let _gap = offY - canvas.height;
            fixy -= _gap;
            offY -= _gap;
            obj.setTargetTransY(fixy);
          }
          HL_offset_target = fixy;
          HL_H_target = offY - fixy - obj.targetFs * 0.16;
        }

        ////

        for (let k = i + 1; k < queue.length; k++) {
          let o = queue[k];
          o.setTargetTransY(offY);
          offY += o.preDraw(-2);
        }

        offY = fixy;
        for (let k = i - 1; k >= 0; k--) {
          let o = queue[k];
          offY -= o.preDraw(-2);
          o.setTargetTransY(offY);
        }

        break;
      }

    }
  /////
  if (progress < 0 && color_selection == 0 && makeTransparent && doblank == 1) {
    //ctx.globalAlpha = 0;
    console.log('make alpha = 0 : ' + progress);
  }


  if (progress < 0) {
    HL_offset_progress = HL_offset_target;
    HL_H_progress = HL_H_target;
  } else if (progress >= 0) {
    //console.log(animTotal +' - ' + animElapse + '=' + (animTotal - animElapse%100));
    HL_offset_progress += (HL_offset_target - HL_offset_progress) / Math.max(1.0, (animTotal - animElapse % 100));
    HL_H_progress += (HL_H_target - HL_H_progress) / Math.max(1.0, (animTotal - animElapse % 100));
    //HL_offset_progress += (HL_offset_target - HL_offset_progress) * progress/3.0;
    //HL_H_progress += (HL_H_target - HL_H_progress) * progress/3.0;
  }

  for (let i = 0; i < queue.length; i++) {
    let obj = queue[i];
    if (obj.chapter == phase && obj.verse == line) {

      //obj.preDraw(progress);
      //obj.draw();

      switch (display_mode) {
        case 0:
          obj.preDraw(progress);
          obj.draw();
          break;
        case 1:
          if (v_vertical.volume != obj.volume || v_vertical.chapter != obj.chapter || v_vertical.verse != obj.verse) {
            v_vertical.initial(obj.volume, obj.chapter, obj.verse);
          }
          v_vertical.draw(progress);
          return;
      }

      for (let k = i + 1; k < queue.length; k++) {
        let o = queue[k];
        //o.transY = offY;
        o.preDraw(progress);
        if (o.transY > canvas.height) continue;
        if (verseCount > 0) o.draw();
      }

      //offY = fixy; 
      for (let k = i - 1; k >= 0; k--) {
        let o = queue[k];
        o.preDraw(progress);
        if (verseCount > 0) o.draw();
        //offY = o.transY;
        if (o.transY < 0) break;
      }

      break;
    }

  }

  if (printSaved && !makeTransparent) { //color_selection > 0 && color_selection != 4) { //print saved versus
    ctx.textBaseline = 'top';
    let fs = Math.min(fontsize_sml_sml, 24);
    ctx.fillStyle = bgcolor_pointer;//'rgb(0, 200, 0)';
    ctx.fillRect(0, 0, canvas.width, fs * 2);
    ctx.fillStyle = color_pointer[2];//'rgb(0, 200, 0)';

    //if (color_selection == 0) ctx.fillStyle = 'rgba(155, 155, 155, 1.0)';
    ctx.font = (fs * 1.2) + 'px ' + fontFamily;
    _drawtxt(subtitles[0][0], 10, 2, 0.5);
    let gap = ctx.measureText(subtitles[0][0]).width + 20;
    ctx.font = (fs - 4) + 'px ' + fontFamily;

    //if (color_selection != 4) 
    for (let idx = 1; idx <= presetVerse.length; idx++) {
      if (presetVerse[idx % 10][0].length == 0)
        continue;
      let xx = gap + (idx - 1) * (canvas.width - gap) / presetVerse.length;
      _drawtxt('[' + (idx % 10) + ']' + presetVerse[idx % 10][0], xx, 2, 0.5);
      _drawtxt('   ' + presetVerse[idx % 10][1] + ':' + presetVerse[idx % 10][2], xx, fs - 1, 0.5);
    }

    if (recognition && recognizing) {
      ctx.fillStyle = color_pointer[0];
      ctx.fillRect(0, 0, canvas.width, fs * 2);
    }

    ctx.fillStyle = color_pointer[2];
    ctx.textAlign = "right";
    ctx.fillText(recogResult, canvas.width, 2);
    ctx.textAlign = "left";

    if (sync_type >= 4) {
      ctx.fillStyle = color_pointer[2];
      let _r = 4;//fontsize_sml_sml/5;
      ctx.fillRect(0, 0, _r * 2, fontsize_sml_sml);
    }

  }

  ctx.textBaseline = 'alphabetic';

}

function printMain(chapter, verse) {

  queue.length = 0;
  queue = [];

  let i = chapter;
  let j = verse;

  let amount = verseCount == 0 ? 1 : verseCount;//2, 7

  //color_selection <= 0? MAX_VERSES_GREEN : MAX_VERSES_NORMAL;
  for (let k = 1; k <= amount; k++) {

    let _i = getPreChapter(i, j);
    j = getPreVerse(i, j);
    i = _i;

    let obj = new Verseobj();
    if (fontsize_dist == 1) { //if (color_selection == 0) {
      obj.initial(song, i, j, k);
    } else {
      obj.initial(song, i, j, 1);
    }
    obj.set2Top();

    queue.unshift(obj);
  }

  let obj = new Verseobj();
  obj.initial(song, chapter, verse, 0);
  queue.push(obj);

  i = chapter;
  j = verse;
  for (let k = 1; k <= amount; k++) {
    let _i = getNextChapter(i, j);
    j = getNextVerse(i, j);
    i = _i;

    let obj = new Verseobj();
    if (fontsize_dist == 1) { //if (color_selection == 0) {
      obj.initial(song, i, j, k);
    } else {
      obj.initial(song, i, j, 1);
    }
    obj.set2Bottom();

    queue.push(obj);
  }

  _render(-1);

}

function getPreChapter(chapter, verse) {
  if (chapter <= 0) return -1;
  if (verse > 0)
    return chapter;
  //if (chapter > 0)
  return chapter - 1;
  //return 0;
}

function getPreVerse(chapter, verse) {
  if (verse > 0)
    return verse - 1;
  if (chapter > 0) {
    return subtitles[chapter - 1].length - 1;
  }
  return subtitles[0].length - 1;
}

function getNextChapter(chapter, verse) {
  if (chapter == -1) return -1;
  if (verse < subtitles[chapter].length - 1)
    return chapter;
  if (chapter < subtitles.length - 1)
    return chapter + 1;
  return -1;
}

function getNextVerse(chapter, verse) {
  if (chapter == -1) return -1;
  if (verse < subtitles[chapter].length - 1)
    return verse + 1;
  if (chapter < subtitles.length - 1)
    return 0;
  return -1;
}

function jump4external(_song, _phase, _line) {
  jump2preset4Anim([fullname[_song], _phase, _line]);
  /*
  return;
  song = _song;
  subtitles = SONGS[song];
  phase = _phase;
  line = _line;
  saveAction2Local();
  _repaint();
  */
}

function sortjump(start, end) {
  if (canvas.hidden) return;
  if (uisel == 0) uisel = 1;
  uisel_start = start;
  uisel_end = end;

  let pre = song;

  if (song >= start && song <= end) {
    song += 1;
    if (song > end)
      song = start;
  } else {
    song = start;
  }
  chkVolDir(pre, song);
  subtitles = SONGS[song];
  phase = 0;
  line = 0;

}

function addLineCount() {
  if (verseCount < 10)
    verseCount++;
  _repaint();
}

function subLineCount() {
  if (verseCount > 0)
    verseCount--;
  _repaint();
}

function combineKey(e) {
  var jump = 10;
  switch (e.code) {
    /*
    case 'Tab': 
      if (stopSpeak()) {
        stopReading();
        return;
      }
      startReading(); 
      return;
    */
    case 'KeyB': //'b'
      color_selection_hlight = (color_selection_hlight + 1) % 6;
      colorSwitch_hlight();
      break;
    case 'BracketLeft': subLineCount(); return;
    case 'BracketRight': addLineCount(); return;
    case 'PageUp': { //page up
      helpSwitch = 0;
      let _phase = getPreChapter(phase, line);
      let _line = getPreVerse(phase, line);
      if (_phase >= 0 && (phase != _phase || line != _line)) {
        phase = _phase;
        line = _line;
      }
      break;
    }
    case 'PageDown': { //page down
      helpSwitch = 0;
      let _phase = getNextChapter(phase, line);
      let _line = getNextVerse(phase, line);
      if (_phase >= 0 && (phase != _phase || line != _line)) {
        phase = _phase;
        line = _line;
      }
      break;
    }
    case 'KeyA': sortjump(1, 5); break;
    case 'KeyS': sortjump(6, 17); break;
    case 'KeyD': sortjump(18, 22); break;
    case 'KeyF': sortjump(23, 27); break;
    case 'KeyG': sortjump(28, 39); break;

    case 'KeyZ': sortjump(40, 44); break;
    case 'KeyX': sortjump(45, 53); break;
    case 'KeyC': sortjump(54, 57); break;
    case 'KeyV': sortjump(58, 66); break;

    case 'Backspace':
      phase = 0;
      line = 0;
      break;
    /*
    case 'Digit0': case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4':
    case 'Digit5': case 'Digit6': case 'Digit7': case 'Digit8': case 'Digit9':
      //case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57:
      uisel = 0;
      if (song == 0) break;
      var value = e.keyCode - 48;
      var _phase = phase;
      if (phase == 0) {
        phase = value;
      } else {
        phase = phase * 10 + value;
      }
      if (phase >= subtitles.length) {
        phase = _phase;
      }
      line = 0;
      break;
    */
    case 'ArrowUp':
      if (canvas.hidden) break;
      if (phase >= jump) {
        phase = phase - jump;
      } else {
        phase = 0;
      }
      line = 0;
      saveAction2Local();
      break;
    case 'ArrowDown':
      if (canvas.hidden) break;
      if (phase == subtitles.length - 1) break;
      if (phase + jump < subtitles.length) {
        phase = phase + jump;
        line = 0;
      } else {
        phase = subtitles.length - 1;
        line = 0;
      }
      saveAction2Local();
      break;
    case 'ArrowLeft':
      line -= jump;
      if (line < 0)
        line = 0;
      saveAction2Local();
      break;
    case 'ArrowRight':
      line += jump;
      if (line > subtitles[phase].length - 1)
        line = subtitles[phase].length - 1;
      saveAction2Local();
      break;
    //case 'Space': history.back(); return;
    case 'Escape': volAnim = !volAnim; break;//'escape'
    case 'Minus': //'-'
      helpSwitch = 0;
      downsizeFS();
      break;
    case 'Equal': //'='
      helpSwitch = 0;
      enlargeFS();
      break;
    case 'KeyP': presetVerse[0] = ['']; break;
    case 'KeyQ': presetVerse[1] = ['']; break;//Q
    case 'KeyW': presetVerse[2] = ['']; break;//W
    case 'KeyE': presetVerse[3] = ['']; break;//E
    case 'KeyR': presetVerse[4] = ['']; break;//R
    case 'KeyT': presetVerse[5] = ['']; break;
    case 'KeyY': presetVerse[6] = ['']; break;
    case 'KeyU': presetVerse[7] = ['']; break;
    case 'KeyI': presetVerse[8] = ['']; break;
    case 'KeyO': presetVerse[9] = ['']; break;
    default: return;
  }

  _repaint();

}

function setFontFactor(ff) {
  fontfactor = ff;
  if (fontfactor > 40)
    fontfactor = 40;
  if (fontfactor < 4)
    fontfactor = 4;
  init();
}

function enlargeFS() {
  setFontFactor(fontfactor - 0.5);
}

function downsizeFS() {
  setFontFactor(fontfactor + 0.5);
}

function copyToClickBoard() {
  var content = subtitles[phase][line];//document.getElementById('textArea').innerHTML;
  if (phase > 0 && line > 0) {
    //content = '['+abbr[song] + ' ' + phase + ':' + line + '] ' + content;
    content = '[' + subtitles[0][0] + ' ' + phase + ':' + line + '] ' + content;
  }
  navigator.clipboard.writeText(content)
    .then(() => {
      //console.log("Text copied to clipboard...")
    }).catch(err => {
      console.log('Something went wrong', err);
    });

}

function jumpTo1() {
  if (song == 0) {
    song = 1;
    subtitles = SONGS[song];
    phase = 0;
    line = 0;
  }
}

function jump2preset(ps) {
  if (display_mode == 0) {
    jump2preset4Anim(ps);
    return;
  }

  for (var i = 1; i < SONGS.length; i++) {
    if (ps[0] == SONGS[i][0][0]) {
      song = i;
      subtitles = SONGS[i];//presetVerse[value][0]
      phase = ps[1];
      line = ps[2];
      break;
    }
  }
  saveAction2Local();
  animElapse = 0;
  window.requestAnimationFrame(verse_update);
  //_repaint();

}

function _targetAnim() {
  let step = 1;
  let pre = song;
  if (song != t_song) {
    //song = ;//Math.ceil(song + (t_song - song) * 0.25);
    if (Math.abs(t_song - song) >= 10) step = 10;
    if (song > t_song) {
      song -= step;
    } else {
      song += step;
    }
    subtitles = SONGS[song];
    chkVolDir(pre, song);
    window.requestAnimationFrame(_targetAnim);
    //saveAction2Local();
    return;
  }

  if (phase != t_phase) {
    step = 1;
    if (Math.abs(t_phase - phase) >= 10) step = 10;
    if (phase > t_phase)
      phase -= step;
    else
      phase += step;
    if (skewidx < 0) _repaint();
    window.requestAnimationFrame(_targetAnim);
    //saveAction2Local();
    return;
  }

  if (line != t_line) {
    if (Math.abs(t_line - line) >= 10) step = 10;
    if (line > t_line)
      line -= step;
    else
      line += step;
    if (skewidx < 0) _repaint();
    window.requestAnimationFrame(_targetAnim); //saveAction2Local();
    return;
  }

  saveAction2Local();
  if (skewidx < 0) _repaint();
}

var t_song = 0;
var t_phase = 0;
var t_line = 0;

function jump2preset4Anim(ps) {

  for (var i = 1; i < SONGS.length; i++) {
    if (ps[0] == SONGS[i][0][0]) {

      if (!(ps[1] < SONGS[i].length &&
        ps[2] < SONGS[i][ps[1]].length)) {
        return;
      }

      t_song = i;
      //subtitles = SONGS[i];//presetVerse[value][0]
      t_phase = ps[1];
      t_line = ps[2];
      break;
    }
  }

  if (song != t_song) {
    phase = 0;
    line = 0;
  } else { //song == t_song
    if (phase != t_phase)
      line = 0;
  }

  window.requestAnimationFrame(_targetAnim);

}

function keyboard(e) {

  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    keylock = 0;
    uisel = 0;
    _repaint();
    return;
  }

  if (keylock == 1) {
    if (!canvas.hidden)
      combineKey(e);
    return;
  }

  //alert('' + e.code);

  switch (e.code) { //switch (e.keyCode) {
    case 'KeyF':
      for (let i = 0; i < fontFamily_array.length; i++) {
        if (fontFamily == fontFamily_array[i]) {
          fontFamily = fontFamily_array[(i + 1) % fontFamily_array.length];
          break;
        }
      }
      init();
      _repaint();
      return;
    case 'KeyZ': {
      makeTransparent = !makeTransparent;
      if (!makeTransparent) ctx.globalAlpha = 1.0;
      let div = document.getElementById("image_container");
      if (image_base64) {
        if (makeTransparent) {
          div.hidden = true;
        } else {
          div.hidden = false;
        }
      }
    }
      break; //'z'
    case 'KeyN': switchLang(); break; //n
    //case 'Enter': createCtrlBtn(); return;//enter
    case 'KeyC': fontColorType = (fontColorType + 1) % 4; break;//'c'
    case 'KeyB': //'b'
      doblank = doblank == 0 ? 1 : 0;
      if (color_selection == 0) {
        //if (animElapse > 0) {
        //  animElapse = -1;
        //  break;
        //}

        //do animation
        if (doblank == 1) {
          animElapse = 100;
          window.requestAnimationFrame(blank_update);
        } else {
          animElapse = 0;
          window.requestAnimationFrame(blankend_update);
        }
        saveAction2Local();
        return;
      }
      break;
    case 'KeyX': // 'x' copy
      copyToClickBoard();
      break;
    case 'KeyM': //'M' ppt mode
      helpSwitch = 0;
      if (canvas.hidden) {
        removeDiv();
        canvas.hidden = false;
        mode = 0;
        break;
      }
      if (song == 0 || phase == 0) break;
      mode = mode == 0 ? 1 : 0;
      if (mode == 1) {
        removeDiv();
        canvas.hidden = true;
        plaintxtMode();
      }
      break;
    case 'KeyL': openCtrl(); break;//l
    case 'KeyD': fontsize_dist = fontsize_dist == 0 ? 1 : 0; break;//d
    case 'KeyS': printSaved = !printSaved; break;
    case 'KeyV':
      display_mode = (display_mode + 1) % 2;
      if (display_mode == 1) {
        animElapse = 0;
        window.requestAnimationFrame(verse_update);
        return;
      }
      break;
    case 'KeyA': //a
      helpSwitch = 0;
      color_selection = (color_selection + 1) % 3;
      colorSwitch();
      break;
    case 'KeyH': //'H'
      if (canvas.hidden) {
        removeDiv();
        canvas.hidden = false;
        jumpTo1();
      }
      helpSwitch = helpSwitch == 0 ? 1 : 0;
      break;
    case 'ArrowUp':
      if (canvas.hidden) break;
      helpSwitch = 0;
      if (phase > 0)
        phase--;
      else
        phase = 0;
      line = 0;
      break;
    case 'ArrowDown':
      if (canvas.hidden) break;
      helpSwitch = 0;
      if (phase == subtitles.length - 1) break;
      phase++;
      line = 0;
      break;
    //////
    case 'PageUp':
    case 'ArrowLeft': {

      helpSwitch = 0;
      let _phase = getPreChapter(phase, line);
      let _line = getPreVerse(phase, line);
      if (_phase >= 0 && (phase != _phase || line != _line)) {
        phase = _phase;
        line = _line;
        if (mode == 0 && queue.length > 0) {
          operateQuene(2, e.keyCode == 37 ? 1 : 0);
          saveAction2Local();
          return;
        }
      }

      if (mode == 1) {
        removeDiv();
        canvas.hidden = true;
        plaintxtMode();
      }

    }
      break;
    case 'PageDown':
    case 'ArrowRight': {
      helpSwitch = 0;
      let _phase = getNextChapter(phase, line);
      let _line = getNextVerse(phase, line);

      if (_phase >= 0 && (phase != _phase || line != _line)) {
        phase = _phase;
        line = _line;
        if (mode == 0 && queue.length > 0) {
          operateQuene(1, e.keyCode == 39 ? 1 : 0);
          saveAction2Local();
          return;
        }
      }

      if (mode == 1) {
        removeDiv();
        canvas.hidden = true;
        plaintxtMode();
      }

    }
      break;

    case 'Minus': {
      helpSwitch = 0;
      if (canvas.hidden) break;
      let oldsong = song;
      if (song > 1)
        song = song - 1;
      else
        song = SONGS.length - 1;
      subtitles = SONGS[song];
      phase = 0;
      line = 0;
      chkVolDir(oldsong, song);
    }
      break;
    case 'Equal': {
      helpSwitch = 0;
      if (canvas.hidden) break;
      let oldsong = song;
      if (song < SONGS.length - 1)
        song = song + 1;
      else
        song = 1;

      subtitles = SONGS[song];
      phase = 0;
      line = 0;
      chkVolDir(oldsong, song);
    }
      break;
    case 'Digit0': case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4':
    case 'Digit5': case 'Digit6': case 'Digit7': case 'Digit8': case 'Digit9':
      //case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
      var value = e.keyCode - 48;
      if (value > presetVerse.length - 1) break;
      if (presetVerse[value][0].length == 0) break;
      jump2preset(presetVerse[value]);
      if (mode == 1) {
        removeDiv();
        canvas.hidden = true;
        plaintxtMode();
      }
      return;
    case 'KeyQ':
      presetVerse[1][0] = subtitles[0][0];
      presetVerse[1][1] = phase;
      presetVerse[1][2] = line;
      break;//Q
    case 'KeyW':
      presetVerse[2][0] = subtitles[0][0];
      presetVerse[2][1] = phase;
      presetVerse[2][2] = line;
      break;//W
    case 'KeyE':
      presetVerse[3][0] = subtitles[0][0];
      presetVerse[3][1] = phase;
      presetVerse[3][2] = line;
      break;//E
    case 'KeyR':
      presetVerse[4][0] = subtitles[0][0];
      presetVerse[4][1] = phase;
      presetVerse[4][2] = line;
      break;//R
    case 'KeyT':
      presetVerse[5][0] = subtitles[0][0];
      presetVerse[5][1] = phase;
      presetVerse[5][2] = line;
      break;//T
    case 'KeyY':
      presetVerse[6][0] = subtitles[0][0];
      presetVerse[6][1] = phase;
      presetVerse[6][2] = line;
      break;//Y
    case 'KeyU':
      presetVerse[7][0] = subtitles[0][0];
      presetVerse[7][1] = phase;
      presetVerse[7][2] = line;
      break;//U
    case 'KeyI':
      presetVerse[8][0] = subtitles[0][0];
      presetVerse[8][1] = phase;
      presetVerse[8][2] = line;
      break;//I
    case 'KeyO':
      presetVerse[9][0] = subtitles[0][0];
      presetVerse[9][1] = phase;
      presetVerse[9][2] = line;
      break;//O
    case 'KeyP':
      presetVerse[0][0] = subtitles[0][0];
      presetVerse[0][1] = phase;
      presetVerse[0][2] = line;
      break;
    //case 32: return; //canvas.requestFullscreen(); break;
    case 'Escape':
      jumpTo1();
      mode = 0;
      removeDiv();
      canvas.hidden = false;
      doblank = 0;
      helpSwitch = 0;
      uisel = 0;
      stopReading();
      ctx.globalAlpha = 1.0;
      break;
    case 'KeyJ':
      if (sync_type == 1)
        restoreActionFromLocal();
      else if (sync_type > 1 && sync_type != 6)
        ajax_restore();
      return;
    case 'Tab':
      speakCurrent();
      return;
    default: return;
  }

  saveAction2Local();

  _repaint();

}

function gradientBg2(yy, hh) {

  const g_gap = canvas.height * 0.1;
  let grd = ctx.createLinearGradient(0, yy, 0, yy - g_gap);
  grd.addColorStop(0, hlightStyle_green);
  grd.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grd;
  ctx.fillRect(0, yy - g_gap, canvas.width, g_gap);


  ctx.fillStyle = hlightStyle_green;//hlight_pointer;
  ctx.fillRect(0, yy, canvas.width, hh);


  grd = ctx.createLinearGradient(0, yy + hh, 0, yy + hh + g_gap);
  grd.addColorStop(0, hlightStyle_green);
  grd.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grd;
  ctx.fillRect(0, yy + hh, canvas.width, g_gap);

}

function gradientBg() {
  //return;
  // 创建径向渐变
  let radius = canvas.height * 0.5;
  var gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, radius * 0.7, // 渐变圆心和起始半径
    canvas.width / 2, canvas.height / 2, radius // 渐变圆心和结束半径
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6'); // 起始颜色
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)'); // 结束颜色
  ctx.fillStyle = gradient;
  //ctx.fillRect(0,0,canvas.width, canvas.height);
  printSaved = 0;
  let _r = canvas.width / canvas.height;
  let _t = (1 - _r) * canvas.width / 2;//-canvas.width/2 * _r + canvas.width/2;
  ctx.save();
  ctx.transform(_r, 0, 0, 1, _t, 0);//canvas.width/canvas.height

  // 画圆
  ctx.beginPath();
  /*
  ctx.ellipse(canvas.width / 2, canvas.height / 2,
              canvas.width / 2, canvas.height / 2,
              0,0, 2 * Math.PI,);
  */
  ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI, false);
  //ctx.scale(1, canvas.height / canvas.width);
  ctx.fillStyle = gradient; // 使用径向渐变作为填充样式
  ctx.fill();
  ctx.closePath();
  //ctx.resetTransform();
  ctx.restore();
}

function _layer0() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!makeTransparent && image_base64 == null) {
    if (color_selection == 0) {
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = bgcolor_pointer;//'green';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  //_layerBg();

}

function _phoneUi() {

  ctx.fillStyle = bgcolor_pointer;//'green';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";

  ui_rectFill(0, 0, canvas.width * 0.33, canvas.height * 0.25, '字小');
  ui_rectFill(canvas.width * 0.33, 0, canvas.width * 0.33, canvas.height * 0.25, '換顏色');
  ui_rectFill(canvas.width * 0.66, 0, canvas.width * 0.33, canvas.height * 0.25, '字大');

  ui_rectFill(0, canvas.height * 0.25, canvas.width * 0.33, canvas.height * 0.25, '上一卷');
  ui_rectFill(canvas.width * 0.33, canvas.height * 0.25, canvas.width * 0.33, canvas.height * 0.25, '控制模式');
  ui_rectFill(canvas.width * 0.66, canvas.height * 0.25, canvas.width * 0.33, canvas.height * 0.25, '下一卷');

  ui_rectFill(canvas.width * 0.33, canvas.height * 0.5, canvas.width * 0.33, canvas.height * 0.25, '上一章');
  ui_rectFill(canvas.width * 0.33, canvas.height * 0.75, canvas.width * 0.33, canvas.height * 0.25, '下一章');


  ui_rectFill(0, canvas.height * 0.5, canvas.width * 0.33, canvas.height * 0.5, '上一節');
  ui_rectFill(canvas.width * 0.66, canvas.height * 0.5, canvas.width * 0.33, canvas.height * 0.5, '下一節');


  ui_rectFill(canvas.width * 0, 0, canvas.width / 3, canvas.height, '滑動卷', 'rgba(255, 0,0,0.5)', 'rgba(255, 0,0, 1.0)');
  ui_rectFill(canvas.width * 1.0 / 3.0, 0, canvas.width / 3, canvas.height, '滑動章', 'rgba(255, 0,0,0.5)', 'rgba(255, 0,0, 1.0)');
  ui_rectFill(canvas.width * 2.0 / 3.0, 0, canvas.width / 3, canvas.height, '滑動節', 'rgba(255, 0,0,0.5)', 'rgba(255, 0,0, 1.0)');

  ctx.textAlign = "left";
}

function ui_rectFill(x, y, w, h, des, c2, c0) {
  ctx.fillStyle = c2 ? c2 : color_pointer[2];
  ctx.fillRect(x + w * 0.05, y + h * 0.05, w * 0.9, h * 0.9);
  ctx.fillStyle = c0 ? c0 : color_pointer[0];
  ctx.font = fontsize_sml + 'px ' + fontFamily;
  ctx.fillText(des, x + w / 2, y + h / 2);
  //ctx.strokeStyle = color_pointer[3];
  //ctx.strokeRect(x, y, w, h);
}

function ui_rectFill2(x, y, w, h, des, c2, c0) {
  ctx.fillStyle = c2 ? c2 : color_pointer[2];
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = c0 ? c0 : color_pointer[0];
  ctx.font = fontsize_sml_sml + 'px ' + fontFamily;
  ctx.fillText(des, x, y);
  //ctx.strokeStyle = color_pointer[3];
  //ctx.strokeRect(x, y, w, h);
}

//function _layer1() {}//function _layer2() {}

function _layerui() {

  if (helpSwitch == 1) {
    userhelp();
  } else if (helpSwitch == 2) {
    _phoneUi();
  }

  phoneScrollVolume();

  if (uisel == 0) return;

  _layer0();

  ctx.lineWidth = 1;
  ctx.font = FONT;
  let x = fontsize_sml;
  let y = canvas.height - fontsize_sml;
  ctx.font = fontsize_sml + 'px ' + fontFamily;
  ctx.textBaseline = 'top';//'bottom';
  ctx.strokeStyle = color_pointer[2];
  for (let i = uisel_start; i <= uisel_end; i++) {
    ctx.fillStyle = color_pointer[(i == song ? 3 : 2)];
    if (i == song) {
      ctx.lineWidth = Math.ceil(fontsize / 8.0);
      ctx.strokeText(SONGS[i][0][0], x - (i == song ? fontsize_sml / 2 : 0), y);
    }
    ctx.fillText(SONGS[i][0][0], x - (i == song ? fontsize_sml / 2 : 0), y);
    y -= fontsize_sml * 1.5;
    if (y < fontsize_sml) {
      x += canvas.width / 4;
      y = canvas.height - fontsize_sml;
    }
  }
}

function ui_block(x, y, w, h, c0) {

  ctx.fillStyle = 'rgba(255, 255, 0, ' + c0 + ')';
  ctx.fillRect(x, y, w, h);
  //ctx.strokeStyle = 'rgba(255, 255, 0, ' + c0 + ')';
  //ctx.strokeRect(x, y, w, h);
  //ctx.fillStyle = c0;//?c0:color_pointer[0];
  //ctx.font = fontsize_sml + 'px '+fontFamily;
  //ctx.fillText(des, x + w/2, y + h/2);
  //ctx.strokeStyle = color_pointer[3];
  //ctx.strokeRect(x, y, w, h);
}

function _layerBg() {

  if (!supportTouch) return;

  ui_block(0, 0, canvas.width / 3, canvas.height / 4, 0.33);
  ui_block(canvas.width / 3, 0, canvas.width / 3, canvas.height / 4, 0.20);
  ui_block(canvas.width * 2 / 3, 0, canvas.width / 3, canvas.height / 4, 0.33);

  ui_block(0, canvas.height / 4, canvas.width / 3, canvas.height / 4, 0.20);
  ui_block(canvas.width * 2 / 3, canvas.height / 4, canvas.width / 3, canvas.height / 4, 0.20);

  ui_block(0, canvas.height / 2, canvas.width / 3, canvas.height / 2, 0.33);
  ui_block(canvas.width * 2 / 3, canvas.height / 2, canvas.width / 3, canvas.height / 2, 0.33);
  ui_block(canvas.width / 3, canvas.height / 2, canvas.width / 3, canvas.height / 4, 0.20);

}

function _repaint() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (uisel == 1) {
    _layerui();
    return;
  }

  if (color_selection == 0 && doblank == 1 && makeTransparent) 
    ctx.globalAlpha = 0;

  trans_start();

  _layer0();

  printMain(phase, line);//_layer1();//_layer2();

  _layerui();

  trans_end();

  if (skewidx > 0 && animElapse < 0) {
    window.requestAnimationFrame(_repaint);
  }

}

function userhelp() {

  //let helps = getSong('help');
  //console.log(bgcolor_pointer);

  ctx.fillStyle = bgcolor_pointer;//'green'; //"rgb(0,0,255)"
  //ctx.clearRect(0, 0, canvas.width/2, canvas.height/2);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontsize_sml + "px " + fontFamily;
  ctx.textAlign = "left";

  let gap = canvas.height / (content_help[0].length + 1);
  for (let i = 0; i < content_help[0].length; i++) {
    //let gap = canvas.height/(helps[0].length + 1);
    //for (let i=0;i<helps[0].length;i++) {
    let x = 20;
    let y = (i + 1) * gap;
    ctx.lineWidth = 1;
    ctx.fillStyle = color_pointer[2];//'rgb(0,180,0)';
    ctx.fillText(content_help[0][i], x, y);
  }
}

var _openWin = null;
function openCtrl() {
  closeCtrl();
  _openWin = window.open("subtitle_b_ctrl.html", "", "popup=no,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=400,top=" + (screen.height - 400) + ",left=" + (screen.width - 840));
}

function closeCtrl() {
  if (_openWin)
    _openWin.close();
  _openWin = null;
}

var liber = null;
function openLib() {
  closeLiber();
  liber = window.open("../upload.html", "_blank", 'width=800, height=600, left=100, top=100');
}

function closeLiber() {
  if (liber)
    liber.close();
  liber = null;
}

//canvas init
init();

// message 事件
function receiveMessage(e) {

  const jsonData = JSON.parse(e.data);
  if (jsonData.color) color_selection = jsonData.color; else color_selection = 0;
  if (jsonData.verticle) display_mode = 1; else display_mode = 0;
  if (jsonData.printSaved) printSaved = true; else printSaved = false;

  colorSwitch();
  if (jsonData.hlight) {
    color_selection_hlight = jsonData.hlight;
    colorSwitch_hlight();
  }

  if (jsonData.verseCount) verseCount = jsonData.verseCount;

  if (jsonData.fontfactor) setFontFactor(jsonData.fontfactor);
  if (jsonData.fontColorType) fontColorType = jsonData.fontColorType;

  if (jsonData.saved && jsonData.saved.length > 0) {
    for (let i = 0; i < jsonData.saved.length; i++) {
      if (i >= 10) return;
      presetVerse[i] = jsonData.saved[i];
    }
  }

  if (jsonData.transparent) {
    makeTransparent = true;
  } else {
    makeTransparent = false;
  }

  if (jsonData.fsizedist) {
    fontsize_dist = 1;
  } else {
    fontsize_dist = 0;
  }

  if (jsonData.imageBase64 && jsonData.imageBase64.length > 0) {
    image_base64 = jsonData.imageBase64;
    showImage(image_base64);
  }

  sync_type = 0;

  doChk().then((result) => {
    if (result.state > 0) username = result.username;
    if (result.state == 1) {
      sync_type = jsonData.syncType;
      synctrls();
    } else {
      sync_type = 0;
    }
    if (sync_type <= 3) {
      keyboard({ code: 'Digit1', keyCode: 49 });
    }
  }).catch(error => {
    console.error('Error:', error);
  });
  _repaint();
}

window.addEventListener('message', receiveMessage, false);

/*
 * 鍵盤相關... START
 */
var keylock = 0;
function keyupAction(e) {

  e.preventDefault();
  e.stopPropagation();

  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') saveAction2Local();

  if (recognition && recognizing) {
    recognition.stop();
    return;
  }

  keyboard(e);
}

window.addEventListener('keyup', keyupAction, false);

function keydownAction(e) {

  e.preventDefault();
  e.stopPropagation();

  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {// || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 91) {
    keylock = 1;
    _repaint();
    return;
  }

  if (e.code === 'Space') { //space
    if (recognition && !recognizing) {
      recognition.start();
    }
    return;
  }

}

window.addEventListener('keydown', keydownAction, false);
//鍵盤相關 ... END

//大小變化
window.addEventListener('resize', function () {
  init();
  _repaint();
});

window.addEventListener('beforeunload', function (e) {
  closeCtrl();
  closeLiber();
});

// 滑鼠滾輪...
window.addEventListener('wheel', function (event) {
  //only vertical scroll
  if (event.deltaY > 4) {
    keyboard({ code: 'PageDown', keyCode: 34 }); //right
  } else if (event.deltaY < -4) {
    keyboard({ code: 'PageUp', keyCode: 33 }); //left
  }
});

let supportTouch = false;
if ('ontouchstart' in window || navigator.maxTouchPoints) {
  // 支持触摸事件
  supportTouch = true;
}

/* 網頁切換別處切回來重繪 */
document.addEventListener('visibilitychange', function () {
  _repaint();
});

/*
 * 手機觸控相關... START
 */
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}
//canvas.addEventListener("click", function(evt) {
//document.getElementsByTagName("canvas")[0]
var touchPX;
var touchPY;
var touchMoveState = 0;
const touchOffset = 8;
var sumOffset = 0;
var colState = 0;

function touchstart(evt) {
  evt.preventDefault();
  //var touches = {x:evt.changedTouches[0].clientX, y:evt.changedTouches[0].clientY};//getTouchPos(canvas, evt);
  touchPX = evt.changedTouches[0].clientX;//touches.x;
  touchPY = evt.changedTouches[0].clientY;//touches.y;
  touchMoveState = 0;
  sumOffset = 0;
  colState = 0;
  if (touchPX < canvas.width / 3)
    colState = 1;
  else if (touchPX < canvas.width * 2 / 3)
    colState = 2;
  else
    colState = 3;

}
canvas.addEventListener("touchstart", touchstart, false);

function touchend(evt) { //touchend

  evt.preventDefault();

  sumOffset = 0;
  colState = 0;

  if (touchMoveState != 0) {
    touchMoveState = 0;
    _repaint();
    return;
  }

  touchMoveState = 0;

  var touches = {
    x: evt.changedTouches[0].clientX,
    y: evt.changedTouches[0].clientY
  };//getTouchPos(canvas, evt);

  let _gw = Math.floor(touchPX / (canvas.width / 3.0));
  let _gh = Math.floor(touchPY / (canvas.height / 4.0));

  let gw = Math.floor(touches.x / (canvas.width / 3.0));
  let gh = Math.floor(touches.y / (canvas.height / 4.0));

  if (touches.y < fontsize_sml && touchPY < fontsize_sml) {
    helpSwitch = helpSwitch > 0 ? 0 : 2;
    _repaint();
    return;
  }

  if (_gw != gw || _gh != gh) return;

  //font size decrease
  if (gw == 0 && gh == 0) {
    combineKey({ code: 'Minus', keyCode: 189 });
    return;
  }
  //color change
  if (gw == 1 && gh == 0) {
    keyboard({ code: 'KeyA', keyCode: 65 });
    return;
  }
  //font size increase
  if (gw == 2 && gh == 0) {
    combineKey({ code: 'Equal', keyCode: 187 });
    return;
  }

  //preious volume
  if (gw == 0 && gh == 1) {
    keyboard({ code: 'Minus', keyCode: 189 });
    return;
  }

  if (gw == 1 && gh == 1) {
    createCtrlBtn();
    //keyboard({ code: 'Enter', keyCode: 13 });
    return;
  }

  //next volume
  if (gw == 2 && gh == 1) {
    keyboard({ code: 'Equal', keyCode: 187 });
    return;
  }


  //up
  if (gw == 1 && gh == 2) {
    keyboard({ code: 'ArrowUp', keyCode: 38 });
    return;
  }
  //down
  if (gw == 1 && gh == 3) {
    keyboard({ code: 'ArrowDown', keyCode: 40 });
    return;
  }

  //left
  if (gw == 0 && (gh == 2 || gh == 3)) {
    keyboard({ code: 'ArrowLeft', keyCode: 37 });
    return;
  }
  //right
  if (gw == 2 && (gh == 2 || gh == 3)) {
    keyboard({ code: 'ArrowRight', keyCode: 39 });
    return;
  }

}

canvas.addEventListener("touchend", touchend, false);

const tb_ratio = 0.05;

function touchmove(evt) {
  evt.preventDefault();
  var touch = evt.touches[0];

  let dy = touch.clientY - touchPY;


  if (colState == 1) {
    sumOffset += Math.abs(dy);
    if (sumOffset >= touchOffset) {

      let _height = canvas.height * (1 - tb_ratio * 2);
      let gap = _height / 66.0;
      let _song = Math.ceil((touch.clientY - canvas.height * tb_ratio) / gap);
      if (_song < 1) _song = 1;
      if (_song > 66) _song = 66; //console.log(' : '+ _song);

      song = _song;
      subtitles = SONGS[song];
      phase = 0;
      line = 0;
      _repaint();
      touchMoveState = 1;
      saveAction2Local();
      return;
    }
  }

  sumOffset += dy;

  if (sumOffset >= touchOffset) {//往下 
    sumOffset = 0;
    switch (colState) {
      //case 1: keyboard({keyCode : 189}); break;
      case 2: keyboard({ code: 'ArrowUp', keyCode: 38 }); break;
      case 3: keyboard({ code: 'PageUp', keyCode: 33 }); break;
    }
    touchMoveState = 1;
  } else if (sumOffset <= -touchOffset) {//往下
    sumOffset = 0;
    switch (colState) {
      //case 1: keyboard({keyCode : 187}); break;
      case 2: keyboard({ code: 'ArrowDown', keyCode: 40 }); break;
      case 3: keyboard({ code: 'PageDown', keyCode: 34 }); break;
    }
    touchMoveState = 1;
  }

  touchPX = touch.clientX;
  touchPY = touch.clientY;

}

canvas.addEventListener("touchmove", touchmove, false);

function phoneScrollVolume() {

  if (touchMoveState == 0) return;
  if (colState != 1) return;

  drawVolume(1, 5, 'rgba(0, 0, 255, 0.33)', 'rgba(0, 0,255, 1.0)');
  drawVolume(6, 17, 'rgba(0, 0, 255, 0.22)', 'rgba(0, 0,255, 1.0)');
  drawVolume(18, 22, 'rgba(0, 0, 255, 0.33)', 'rgba(0, 0,255, 1.0)');
  drawVolume(23, 27, 'rgba(0, 0, 255, 0.22)', 'rgba(0, 0,255, 1.0)');
  drawVolume(28, 39, 'rgba(0, 0, 255, 0.33)', 'rgba(0, 0,255, 1.0)');

  drawVolume(40, 44, 'rgba(255, 0,0,0.22)', 'rgba(255, 0,0, 1.0)');
  drawVolume(45, 53, 'rgba(255, 0,0,0.33)', 'rgba(255, 0,0, 1.0)');
  drawVolume(54, 57, 'rgba(255, 0,0,0.22)', 'rgba(255, 0,0, 1.0)');
  drawVolume(58, 66, 'rgba(255, 0,0,0.33)', 'rgba(255, 0,0, 1.0)');

  /*
  ctx.textBaseline = 'bottom';

  let _height = canvas.height * (1 - tb_ratio * 2);
  let gap = _height/66.0;
  let _y = canvas.height * tb_ratio + gap * (song - 1);
  //let _song = Math.ceil((touch.clientY - canvas.height * tb_ratio)/gap);
  ui_rectFill2(0, _y, 
               canvas.width, fontsize * 2,  
               fullname[song], 'rgb(200, 200, 200)', 'rgb(5, 5, 5)');
    */


  ctx.textBaseline = 'alphabetic';

}

function drawVolume(f, e, c0, c1) {
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  let _height = canvas.height * (1 - tb_ratio * 2);
  let gap = _height / 66.0;
  ui_rectFill2(0, canvas.height * tb_ratio + (f - 1) * gap,
    canvas.width / 3, gap * (e - f + 1),
    SONGS[f][0][0], c0, c1);
  //ctx.textAlign = "left";

}


function removeTEvent() {
  canvas.removeEventListener('touchstart', touchstart);
  canvas.removeEventListener('touchend', touchend);
  canvas.removeEventListener('touchmove', touchmove);
}

function addFontSizeTouchEvent() {
  console.log('addFontSizeTouchEvent : ');
  canvas.addEventListener("touchend", (evt) => {

    evt.preventDefault();
    //if (touchMoveState != 0) return;

    var touches = {
      x: evt.changedTouches[0].clientX,
      y: evt.changedTouches[0].clientY
    };//getTouchPos(canvas, evt);

    let gw = Math.floor(touches.x / (canvas.width / 3.0));
    let gh = Math.floor(touches.y / (canvas.height / 4.0));

    //font size decrease
    if (gw == 0 && gh == 0) {
      downsizeFS();
      _repaint();
      return;
    }
    //color change
    if (gw == 1 && gh == 0) {
      keyboard({ code: 'KeyA', keyCode: 65 });
      return;
    }
    //font size increase
    if (gw == 2 && gh == 0) {
      enlargeFS();
      _repaint();
      return;
    }

  }, false);
}

//手機觸控相關... END

/*
  color : (color_selection)
  fontfactor : (fontfactor)
  verticle: 1,0
  printSaved: 1,0
  saved : (presetVerse)
  transparent: (makeTransparent) 1,0
  fsizedist: (fontsize_dist) 1,0
  syncType : sync_type
                0: none
                1: local master
                2: web master
                3: local & web master
                4: local slave
                5: web slave
 */
function toObj() {
  let obj = {};
  //alert('subtotle_b toobj: ' + JSON.stringify(obj));
  obj['color'] = color_selection;
  obj['hlight'] = color_selection_hlight;
  obj['verticle'] = display_mode;
  obj['fontfactor'] = fontfactor;
  obj['fontColorType'] = fontColorType;
  obj['saved'] = presetVerse;
  obj['transparent'] = makeTransparent ? 1 : 0;
  obj['printSaved'] = printSaved ? 1 : 0;
  obj['fsizedist'] = fontsize_dist;
  obj['verseCount'] = verseCount;
  obj['syncType'] = sync_type;
  obj['imageBase64'] = "";
  if (image_base64 && image_base64.length > 0) {
    obj['imageBase64'] = image_base64;
  }
  return obj;
}

//建構整本聖經
for (let i = 1; i < abbr.length; i++) SONGS[i] = getSong(abbr[i]);

song = 0;

jumpTo1();

setMsg_O(); //setMsg_none();

//_repaint();

window.addEventListener("beforeunload", function () {
  _saveAction2Local();
  //obj = {"song": song, "phase": phase, "line" : line};
  //document.cookie = "last=" + JSON.stringify(obj) + "; expires=Thu, 01 Jan 2099 00:00:00 UTC; path=/";
});

voiceChkActive();

color_selection = 1;
colorSwitch();

if (readParam('volume')) {
  let volume = readParam('volume');//parseInt(array[0]);//array[0];
  let chapter = readParam('chapter') ? parseInt(readParam('chapter')) : 0;
  let verse = readParam('verse') ? parseInt(readParam('verse')) : 0;
  jump2preset4Anim([volume, chapter, verse]);
} else {
  restoreActionFromLocal();
}

if (readParam('colorsel')) {
  color_selection = parseInt(readParam('colorsel'));
  colorSwitch();
}

if (readParam('verseCount')) {
  verseCount = parseInt(readParam('verseCount'));
}
///////
if (readParam('action') === 'play') {

  //color_selection = 1; colorSwitch();
  printSaved = false;
  fontfactor += 3;
  fontsize_dist = 1;

  doChk().then((result) => {
    if (result.state > 0) username = result.username;
    if (result.state == 1) {
      setMsg_play_socket();
    }
  }).catch(error => {
    console.error('Error:', error);
  });

  removeTEvent();
  addFontSizeTouchEvent();

  init();
  _repaint();

} else if (readParam('action') === 'ctrl') {

  //color_selection = 0; colorSwitch();
  fontfactor += 5;

  doChk().then((result) => {
    if (result.state > 0) username = result.username;
    if (result.state == 1) {
      setMsg_3();
    }
  }).catch(error => {
    console.error('Error:', error);
  });

  init();
  _repaint();

}
