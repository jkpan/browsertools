var list = [];
var ALL_SONGS_JSON;

const EMPTY = [
  [
    ['____歌詞____'],
    ['']
  ]
];

let username = null

var SONGS = EMPTY.slice();//[ [['____歌詞____'],['']] ];

function getArrayDimension(arr) {
  if (Array.isArray(arr)) {
      return 1 + Math.max(...arr.map(getArrayDimension), 0);
  } else {
      return 0;
  }
}

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

//抓取預設歌庫
async function fetchData() {
  try {
    let jsonurl = './usr/guest/songbase.json';
    let result = await doChk();
    if (result.state > 0) {
      let user = result.username;
      jsonurl = `./usr/${user}/songbase.json`;
    }
    console.log('song url: ' + jsonurl);
    //const response = await fetch('./json/output.json'); // 等待 fetch 请求完成
    const response = await fetch(jsonurl);//'./json/songbase.json'); // 等待 fetch 请求完成
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    ALL_SONGS_JSON = await response.json(); // 等待 JSON 解析完成
    //console.log(JSON.stringify(ALL_SONGS_JSON)); // 处理数据
    //return data; // 如果需要同步效果，可以返回数据
  } catch (error) {
    console.error('Failed to fetch JSON:', error);
  }
  console.log('fetchData END');
}

/*
function getSong(jsonid) {
  var json_elm = document.getElementById(jsonid);
  if (json_elm) {
    var obj = JSON.parse(json_elm.innerHTML);
    if (obj.content)
      return obj.content;
  }
  return [['']];
}
*/

function getnoSong(jsonid) {
  if (!ALL_SONGS_JSON) return [['']];
  var obj = ALL_SONGS_JSON['nosong'][jsonid];//JSON.parse(json_elm.innerHTML);
  if (obj && obj["content"])
    return obj['content'];
  return [['']];
}

//從json取得一首歌
function getSong(jsonid) {
  if (!ALL_SONGS_JSON) return [['']];
  var obj = ALL_SONGS_JSON[jsonid];//JSON.parse(json_elm.innerHTML);
  if (obj && obj["content"])
    return obj['content'];
  return [['']];
}

function getSongsFromList(_list) {
  
  if (_list) list = _list;
  
  /* 
  else {
    console.log('getSong(LIST)');
    list = getSong('LIST');
    console.log('getSong(LIST) done');
  }
  */

  SONGS = EMPTY.slice();

  if (ALL_SONGS_JSON == null) {
    (async function() {
      console.log('get all songs');
      await fetchData();
      console.log('get content from list');
      getSongsFromList(_list);
    })();
    return;
  }

  for (let i = 0; i < list.length; i++) { //SONGS[i+1] = getSong(list[i]);
    if (typeof list[i] === 'string') {
      console.log('getSong(list[i]) ' + list[i]);
      SONGS[i + 1] = getSong(list[i]);
    } else {
      SONGS[i + 1] = list[i];
    }
  }

  song = 0;
  phase = 0;
  line = 0;

  subtitles = SONGS[song];

  _repaint();
}

/*
  list : (list)
  mode : (mode)
  fontfactor: (fontfactor)
  slave: 1,0
  //master : 1 
 */
function json2List(fileContent) {

  const jsonData = JSON.parse(fileContent);
  // 進行 JSON 資料的處理

  if (jsonData.list && jsonData.list.length > 0) {
    if (ALL_SONGS_JSON)
      getSongsFromList(jsonData.list);
    else
      list = jsonData.list;
  }

  if (jsonData.mode) mode = jsonData.mode;
  if (jsonData.fontfactor) setFontFactor(jsonData.fontfactor);
  if (jsonData.fontColorType) fontColorType = jsonData.fontColorType;
  if (jsonData.transparent)
    makeTransparent = true;
  else
    makeTransparent = false;

  displayProgress = 0;
  if (jsonData.progress) 
    displayProgress = 1;

  if (jsonData.imageBase64 && jsonData.imageBase64.length > 0) {
    image_base64 = jsonData.imageBase64;
    showImage();
  }

  sync_type = 0;  
  doChk().then((result)=>{
    if (result.state > 0) {
      username = result.username;
      sync_type = jsonData.syncType;
      synctrls();
    } else {
      sync_type = 0;
    }
  }).catch(error => {
    console.error('Error:', error);
  });

  if (subtitles != undefined)
    _repaint();

}

function loadListFromJson(event) {
  var files = event.target.files;//const inputFile = document.getElementById('json');
  if (files.length > 0) {
    // 讀取使用者選擇的檔案
    const file = files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    // 當讀取完成時，將檔案內容轉換成 JSON 物件並進行處理
    reader.onload = function (event) {
      const fileContent = event.target.result;
      json2List(fileContent);
    }
  }
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
            showImage();
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

function showImage() {

  makeTransparent = false;

  let div = document.getElementById("image_container");
  div.hidden = false;
  div.innerHTML = '<img class="centered" width="100%" height="100%" src="' + image_base64 + '" />';

  _repaint();

}

//Complete Html Page
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

function createListHiddenFile() {
  let _file = document.createElement('input');
  _file.type = "file";
  _file.id = "json";
  _file.hidden = "true";

  _file.accept = ".json";
  _file.onchange = loadListFromJson;//"loadListFromJson(event)"
  //_file.setAttribute("value", option.text);
  let body = document.getElementsByTagName("body")[0];
  body.appendChild(_file);
  //<input id="img" type="file" hidden="true"/>
}

const content_help = [[
  "方向鍵  '左右'切句  '上下'切段",
  "'0-9'0-9首  '-'上一首  '='下一首",
  "'QWERTYUI'1-8段",
  "'P'投影片模式切換  'L'即時選歌",
  "'S'顯示進度 'B'Blank 'Z'透空",
  "shift'=-' 字大小",
  "'Enter'切換控制模式"
]];

//字型顏色設定

const fontFamily_array = 
["Monospace", "LXGW WenKai Mono TC", "Noto Serif TC", "Shippori Antique B1", "Mochiy Pop One"]; //google fonts
//["報隸-繁", "行楷-繁", "宋體-繁", "黑體-繁"]; //mac system fonts

var fontFamily = fontFamily_array[0];//"Monospace"; //"Arial" "cwTeXKai" '華康瘦金體' "標楷體" "Noto Serif TC";

const COLORS_CK = ["rgb(0, 110, 0)", "green", "rgb(0, 180, 0)", "rgb(0, 240, 0)"];
const COLOR_PPT = 'rgb(0,0,200)';
const COLOR_PPT_SML = 'rgb(0, 70, 0)';

var song;
var subtitles;

var fontsize = 100;
var FONT = fontsize + "px " + fontFamily;
var fontfactor = 12.0;

var phase = 0;
var line = 0;
var mode = 0;

var displayProgress = 0;
var doblank = 0;
var helpSwitch = 0;
var dword = 0;

//var imgurl = '';//'./Icon-1024.png';
//var img;
var canvas;
var ctx;
var makeLED = false;

var image_base64 = null;

function init() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");

  fontsize = Math.ceil(canvas.height / fontfactor);
  FONT = fontsize + "px " + fontFamily;

  if (makeLED) {//LED init
    dots = 1;
    side = 1;
    makeRound = true;
    set2AverageColor();
    //set2PickColor();
    initLED(0, 0, canvas.width, canvas.height);
    newLEDMask();
  }

}

/*
function ajax_restore() {
  _ajax({
    "action": "restore"
  },
    '/restorelyrics',
    (res) => {
      console.log(JSON.stringify(res));
      //jump4external(res.vlm, res.chp, res.ver);
      ////
      let _song = res.song;//array[0];
      let _phase = res.phase;
      let _line = res.line;
      let _doblank = res.blank;

      if (_song == song && _phase == phase && _line == line && _doblank == doblank) return;

      song = _song;
      subtitles = SONGS[song];

      phase = _phase;
      line = _line;

      if (phase >= subtitles.length) {
        syncListFromController();
        return;
      }

      doblank = _doblank;
      _repaint();

    });
}
*/

//控方上傳目前
function ajax_sync() {

  if (username == null) return;

  _ajax({
    song: subtitles, //song,
    phase: phase,
    line: line,
    blank: doblank,
    user: username
  },
    '/synclyrics',
    (res) => {
      console.log(JSON.stringify(res));
    }, (error) => {
      console.log('exception: ' + error);
    });
}

function _ajax(json, url, cb, errorcb) {
  console.log(json);
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
    cb(data);
  }).catch((error) => {
    errorcb(error);
  });
}

var funcInterval;

/*
function startRestoreFromServerInterval() {
  if (funcInterval) stopActionInterval();
  funcInterval = window.setInterval(ajax_restore, 200);
}
*/

function startRestoreInterval() {
  if (funcInterval)
    stopActionInterval();
  //syncListFromController();
  funcInterval = window.setInterval(restoreActionFromLocal, 200);
}

function stopActionInterval() {
  if (funcInterval) clearInterval(funcInterval);
  funcInterval = null;
  localStorage.removeItem('save progress');
}

function saveAction2Local() {
  switch (sync_type) {
    case 0: return;
    case 1: break;
    case 2: ajax_sync(); return;
    case 3: ajax_sync(); break;
    default: return;
  }

  let key = 'save progress';
  //let value = song + ' ' + phase + ' ' + line + ' ' + doblank;
  let obj = {
    song: subtitles, //song,
    phase: phase,
    line: line,
    blank: doblank
  };
  let value = JSON.stringify(obj);
  localStorage.setItem(key, value);

}

function restoreActionFromLocal() {
  let key = 'save progress';
  let value = localStorage.getItem(key);
  let obj = JSON.parse(value);
  restoreFromJson(obj);
}

var selector = null;
function openSelector() {
  closeSelector();
  //selector = window.open("subtitle_list.html", '_blank');//.focus();
  selector = window.open("subtitle_list.html", "_blank", 'width=800, height=600, left=100, top=100');
}

function closeSelector() {
  if (selector)
    selector.close();
  selector = null;
}

function drawIdxHint(x, y) {
  ctx.lineWidth = 1;
  if (mode == 2)
    ctx.strokeStyle = 'white';
  else
    ctx.strokeStyle = 'rgb(0, 200, 0)';
  ctx.strokeRect(x, y, canvas.width / 60, canvas.height / 60);
}

/*
 * 0: white
 * 1: white char black edge
 * 2: black
 * 3: black char white edge
 */
var fontColorType = 0;
function txtRendering(txt, x, y) {

  //fontColorType = 3;

  ctx.lineWidth = Math.ceil(fontsize / 12.0);

  switch (fontColorType) {
    case 0:
      ctx.fillStyle = 'white';
      break;
    case 1:
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.strokeText(txt, x, y);
      break;
    case 2:
      ctx.fillStyle = 'black';
      break;
    case 3:
      ctx.fillStyle = 'black';
      ctx.strokeStyle = 'white';
      ctx.strokeText(txt, x, y);
      break;
  }

  ctx.fillText(txt, x, y);

}

function printSubtitle() {
  if (dword == 0) {
    printTxt(phase, line, 0);
  } else {
    if (line % 2 == 0) {
      if (line + 1 <= subtitles[phase].length - 1) {
        printTxt(phase, line, 1);
        printTxt(phase, line + 1, 0);
      } else {
        printTxt(phase, line, 0);
      }
    } else {
      printTxt(phase, line, 0);
      if (line - 1 >= 0) {
        printTxt(phase, line - 1, 1);
      }
    }

  }
}

function printTxt(i, j, vpos) { //subtitle mode 

  if (!subtitles) return;

  let txt = subtitles[i][j];

  ctx.font = FONT;
  var x = canvas.width / 2;
  var y = canvas.height - fontsize;


  if (dword > 0) {
    ctx.textAlign = "right";
    x = canvas.width - fontsize / 2;
    y = vpos == 0 ? y : canvas.height - fontsize * 2;

    if (line == j) drawIdxHint(x + 4, y);


  } else {
    ctx.textAlign = "center";
  }

  if (i == 0) {
    if (txt.length > 0)
      txt = '[' + txt + ']';
    else
      txt = '-';
  }

  if (doblank == 1 || i == 0) { //單行綠色標題
    ctx.fillStyle = COLORS_CK[2];//"rgb(0,180,0)";
    ctx.fillText(txt, x, y);
    return;
  }

  txtRendering(txt, x, y);

}

function printFullChart() {

  let margin = fontsize/2;
  let fsize = fontsize / 4;
  ctx.font = fsize + "px " + fontFamily;
  ctx.textAlign = 'left';
  ctx.strokeStyle = "rgb(0,240,0)";
  ctx.lineWidth = 1;

  for (var i = 0; i < subtitles.length; i++) {
    var txt = '';
    for (var j = 0; j < subtitles[i].length; j++) {
      let tmp = i == 0 ? '[' + subtitles[i][j] + ']' : ' ' + subtitles[i][j] + ' ';
      if (i > 0 && i == phase && j == line) {
        ctx.strokeRect(margin + ctx.measureText(txt).width, margin + i * fsize + 4, ctx.measureText(tmp).width, -fsize);
      }
      txt += tmp;
    }
    if (i % 2 == 0) {
      ctx.fillStyle = COLORS_CK[2];//"rgb(0,160,0)";
    } else {
      ctx.fillStyle = COLORS_CK[3];//"rgb(0,200,0)";
    }
    ctx.fillText(txt, margin, margin + i * fsize);
  }
}

function printChart() {

  printFullChart();

  if (phase == 0) return;

  let all = 0;

  for (let i = 1; i < subtitles.length; i++) {
    all += subtitles[i].length;
  }

  if (all == 0) return;

  let gap = canvas.width / all;
  let _h = fontsize/2;
  let y = canvas.height - _h * 2;

  let _step = 0;

  for (let i = 1; i < subtitles.length; i++) {
    if (i % 2 == 0) {
      ctx.fillStyle = COLORS_CK[0];//"rgb(0,115,0)";
    } else {
      ctx.fillStyle = COLORS_CK[2];//"rgb(0,160,0)";
    }
    //let len = subtitles[i].length * gap;
    ctx.fillRect(_step * gap, y, subtitles[i].length * gap, _h);
    _step += subtitles[i].length;
  }

  var idx = line;
  for (let i = 1; i < phase; i++) {
    idx += subtitles[i].length;
  }

  ctx.lineWidth = 3;
  ctx.strokeStyle = COLORS_CK[1];//'green';

  for (var i = 0; i < all; i++) {
    ctx.strokeRect(i * gap, y, gap, _h);
  }

  ctx.strokeStyle = COLORS_CK[3];//"rgb(0,220,0)";
  ctx.strokeRect(idx * gap, y, gap, _h);

}

function printPhase() {

  if (!subtitles || phase > subtitles.length - 1) return;

  ctx.font = FONT;

  var gap = canvas.height / Math.max(3, (subtitles[phase].length + 1));

  if (mode == 2) {
    let _x = canvas.width / 2;
    ctx.textAlign = 'center';
    for (let i = 0; i < subtitles[phase].length; i++) {
      let _y = (i + 1) * gap + fontsize / 2;
      let txt = subtitles[phase][i];
      if (phase == 0 && txt.length > 0) txt = '[' + txt + ']';

      txtRendering(txt, _x, _y);

      if (i == line) drawIdxHint(10, _y);

    }

    if (phase > 0) { //song > 0 && 
      ctx.fillStyle = 'rgb(0,200,0)';
      ctx.font = fontsize / 2 + "px " + fontFamily;
      ctx.fillText('[' + subtitles[0][0] + ' ' + phase + '/' + (subtitles.length - 1) + ']',
        _x, fontsize / 2);
    }

  } else { //mode 1, 3, 4
    let _x = mode == 3 ? canvas.width * 0.95 : canvas.width * 0.05;
    ctx.textAlign = mode == 3 ? 'right':'left';
    for (let i = 0; i < subtitles[phase].length; i++) {
      let _y = (i + 1) * gap + fontsize / 2;
      let txt = subtitles[phase][i];
      if (phase == 0 && txt.length > 0) txt = '[' + txt + ']';
      if (doblank == 1) {
        ctx.fillStyle = doblank == 1 ? 'rgb(0,240,0)' : 'white';
        ctx.strokeStyle = doblank == 1 ? 'rgba(0,240,0, 0)' : 'black';
        ctx.fillText(txt, _x, _y);
      } else {
        txtRendering(txt, _x, _y);
      }

      if (i == line) drawIdxHint(10, _y);

    }

    if (phase > 0) { //song > 0

      //ctx.fillStyle = mode == 2?'yellow':'rgb(0,240,0)';
      ctx.fillStyle = 'rgb(0,200,0)';
      ctx.font = fontsize / 2 + "px " + fontFamily;
      ctx.fillText('[' + subtitles[0][0] + ' ' + phase + '/' + (subtitles.length - 1) + ']',
        _x, fontsize / 2);
    }

  }

}

function printPhaseChart() {

  if (phase == 0) return;

  let gap = canvas.width / (subtitles.length - 1);
  let _gap = Math.min(canvas.width / 4, gap);
  let _h = fontsize/2;
  let y = canvas.height - _h * 2;

  for (let i = 1; i < subtitles.length; i++) {
    if (i % 2 == 0) {
      ctx.fillStyle = "rgba(0,0,0, 0.1)";
    } else {
      ctx.fillStyle = "rgba(0,0,0, 0.2)";
    }
    ctx.fillRect((i - 1) * gap + (gap - _gap) / 2, y, _gap, _h);
  }

  ctx.lineWidth = 3;

  ctx.strokeStyle = "rgba(255,255,255, 0.33)";

  ctx.strokeRect((phase - 1) * gap + (gap - _gap) / 2, y, _gap, _h);

}

function setFontFactor(ff) {
  fontfactor = ff;
  if (fontfactor > 20)
    fontfactor = 20;
  if (fontfactor < 3)
    fontfactor = 3;
  init();
}

function combineKey(e) {

  switch (e.code) {
    case 'Space': history.back(); return;
    case 'Minus': //'-'
      setFontFactor(fontfactor + 0.5);
      break;
    case 'Equal': //'='
      setFontFactor(fontfactor - 0.5);
      break;
    case 'KeyD':
      if (song == 0) break;
      SONGS.splice(song, 1);
      song = 0;
      subtitles = SONGS[song];
      phase = 0;
      line = 0;
      break;
  }
  _repaint();
}

function keyboard(e) {

  //alert(e.keyCode);
  if (e.code == 'ShiftLeft') {// || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 91) {
    keylock = false;
    _repaint();
    return;
  }

  if (keylock) {
    if (!canvas.hidden)
      combineKey(e);
    return;
  }

  switch (e.code) {
    case 'KeyF':
      for (let i=0;i<fontFamily_array.length;i++) {
        if (fontFamily == fontFamily_array[i]) {
          fontFamily = fontFamily_array[(i+1) % fontFamily_array.length];
          break;
        }
      }
      init();
      break;
    //case 113: //F2
    case 'Enter':
      createCtrlBtn();
      return;
    case 'KeyB': //'b'
      doblank = doblank == 0 ? 1 : 0;
      break;
    case 'PageUp':
      if (mode == 0) {
        keyboard({code:'ArrowLeft', keyCode: 37 }); //left
        return;
      } else { //ppt mode
        if (phase > 0) { //normal
          keyboard({code:'ArrowUp', keyCode: 38 }); //up
          return;
        } else { // top phase jump to previous song
          if (song > 0) {
            song--;
            subtitles = SONGS[song];
            phase = subtitles.length - 1;
            line = 0;
          }
        }
      }
      break;
    case 'PageDown':
      if (mode == 0) {
        keyboard({code:'ArrowRight', keyCode: 39 }); //right
        return;
      } else {
        if (phase < subtitles.length - 1) {
          keyboard({code:'ArrowDown', keyCode: 40 }); //down
          return;
        } else {
          if (song < SONGS.length - 1) {
            song++;
            subtitles = SONGS[song];
            phase = 0;
            line = 0;
          }
        }

      }
      break;
    case 'KeyS': displayProgress = displayProgress == 1 ? 0 : 1; break; //'s'
    case 'KeyD': dword = dword == 0 ? 1 : 0; break; //'D'
    case 'KeyC': fontColorType = (fontColorType + 1) % 4; break; //'c'
    case 'KeyZ': {
        makeTransparent = !makeTransparent;
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
    //case 67: phase = subtitles.length - 1; line = 0; break; //'c' jump to coda last one phase
    case 'KeyP':
      mode = (mode + 1) % 5;
      break; //'p' ppt mode
    case 'KeyH': //'h 
      helpSwitch = helpSwitch == 0 ? 1 : 0;
      break;
    //case 76: hideCanvas(); break; //'l'
    case 'KeyL': openSelector(); break; //'l'
    case 'ArrowUp':
      if (phase > 0) {
        phase = phase - 1;
      }
      line = 0;
      break;
    case 'ArrowDown':
      if (phase < subtitles.length - 1) {
        phase = phase + 1;
        line = 0;
      }
      break;
    case 'ArrowLeft':
      line = line - 1;
      if (line < 0) {
        phase = phase - 1;
        if (phase < 0) {
          phase = 0;
          line = 0;
        } else {
          line = subtitles[phase].length - 1;
        }
      }
      break;
    case 'ArrowRight':
      line = line + 1;
      if (line >= subtitles[phase].length) {
        phase = phase + 1;
        if (phase >= subtitles.length) {
          phase = subtitles.length - 1;
          line = subtitles[phase].length - 1;
        } else {
          line = 0;
        }
      }
      break;
    case 'Digit0': case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4':
    case 'Digit5': case 'Digit6': case 'Digit7': case 'Digit8': case 'Digit9':
      let value = e.keyCode - 48;
      if (value < SONGS.length) {
        song = value;
        subtitles = SONGS[song];
        phase = 0;
        line = 0;
      }
      break;
    case 'Minus': //'-'
      if (song > 0) {
        song = song - 1;
        subtitles = SONGS[song];
        phase = 1;
        line = 0;
      }
      break;
    case 'Equal': //'='
      if (song < SONGS.length - 1) {
        song = song + 1;
        subtitles = SONGS[song];
        phase = 1;
        line = 0;
      }
      break;
    //oqwertyui
    //case 77: //img = null; document.getElementById('img').click(); break;
    case 'KeyJ': document.getElementById('json').click(); break; //case 79: phase = 0; line = 0; break;
    case 'KeyQ': if (subtitles.length > 1) { phase = 1; line = 0; } break;
    case 'KeyW': if (subtitles.length > 2) { phase = 2; line = 0; } break;
    case 'KeyE': if (subtitles.length > 3) { phase = 3; line = 0; } break;
    case 'KeyR': if (subtitles.length > 4) { phase = 4; line = 0; } break;
    case 'KeyT': if (subtitles.length > 5) { phase = 5; line = 0; } break;
    case 'KeyY': if (subtitles.length > 6) { phase = 6; line = 0; } break;
    case 'KeyU': if (subtitles.length > 7) { phase = 7; line = 0; } break;
    case 'KeyI': if (subtitles.length > 8) { phase = 8; line = 0; } break;

    case 'Escape':
      
      if (document.getElementById('ctrl')) {
        removeDiv();
        break;
      }

      removeDiv();
      mode = 0;
      removeBackground();
      //removeBtns();
      canvas.hidden = false;
      doblank = 0;
      helpSwitch = 0;
      displayProgress = 0;
      fontColorType = 0;
      dword = 0;
      break;
    //case 32: canvas.requestFullscreen(); break;
    default:
      break;
  }

  _repaint();

  saveAction2Local();

}

var makeTransparent = false;

function _layer0() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (makeTransparent || image_base64) return;

  if (mode == 0) {
    ctx.fillStyle = COLORS_CK[1];//'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (mode == 1) {    
    if (supportTouch) {
      for (let x = 0;x<3;x++) {
        for (let y = 0;y<4;y++) {
          if ((x+y) %2 == 0) 
            ctx.fillStyle = COLORS_CK[1];
          else 
            ctx.fillStyle = COLORS_CK[2];
          ctx.fillRect(x * canvas.width/3, y * canvas.height/4, canvas.width/3, canvas.height/4);
        }
      }
    } else {
      ctx.fillStyle = COLORS_CK[1];//'green';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else if (mode == 3 || mode == 4) {
    ctx.fillStyle = COLORS_CK[1];//'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (mode == 2) {
    ctx.fillStyle = COLOR_PPT;//'blue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function _layer1() {
  switch(mode) {
    case 0:
      if (displayProgress == 1) printChart();
      printSubtitle();
      break;
    case 1:
      if (displayProgress == 1) printFullChart();
      let _scale = 0.5;
      let _gap = 0; 
      ctx.transform(_scale,
        0, 
        0,
        _scale,
        _gap,
        (1 - _scale) * canvas.height - _gap);
      if (doblank == 1) {
        ctx.fillStyle = 'green';
      } else {
        ctx.fillStyle = COLOR_PPT_SML;
      }
      printPhase();
      ctx.resetTransform();
      break;
    case 2:
      if (displayProgress == 1) printPhaseChart();
      printPhase();
      break;
    case 3: case 4:
      if (displayProgress == 1) {
        if (mode == 3) 
          printChart();
        else
          printPhaseChart();
      }
      if (doblank == 1) {
        ctx.fillStyle = 'green';
      } else {
        ctx.fillStyle = COLOR_PPT_SML;
      }
      printPhase();
      break;
  }
  
  /*
    a	c	e
    b	d	f
    0	0	1
    ctx.transform(a,b,c,d,e,f);
                  xscale, xskew, yscale, yskew, xoffset, yoffset
    ctx.resetTransform
    */

}

function _layer2() {

  if (funcInterval) {
    ctx.fillStyle = COLORS_CK[2];
    let _r = 4;
    ctx.fillRect(0, 0, _r * 2, fontsize / 2);
  }

  if (helpSwitch == 1)
    userhelp();

  if (doblank == 1)
    blank();

}

function _repaint() { //if (!funcInterval) saveAction2Local();
  _layer0();
  _layer1();
  _layer2();
  if (makeLED) ledAction4Still(canvas, ctx); //LED
  console.log('mode: ' + mode);
}

var sync_type = 0;
var ctrls = [];

function removeDiv() {
  var ctrl = document.getElementById('ctrl');
  if (ctrl) document.body.removeChild(ctrl);
  return;
}

function _newBtn() {

  var button = document.createElement('button');

  button.style.width = '128px'; // setting the width to 200px
  button.style.height = '32px'; // setting the height to 200px

  button.style.background = 'rgb(250,250,50)'; // setting the background color to teal
  button.style.color = 'rgb(5,5,5)';//color_pointer[1];// 'green'; // setting the color to white
  button.style.fontSize = '14px'; // setting the font size to 20px

  button.style.borderColor = 'rgb(255,255,255)';
  button.style.borderRadius = '10px';

  //button.style.border = 'none';

  return button;
}

function addBtn(caption, parent, _onclick) {
  var btn = _newBtn();
  btn.innerHTML = caption;
  btn.onclick = _onclick;
  parent.appendChild(btn);
  return btn;
}

function createCtrlBtn() {

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
  div.style.backgroundColor = 'rgba(0,0,0,0.2)';

  ctrls[0] = addBtn('none', div, ()=>{ sync_type = 0; synctrls(); return false; });// _newBtn();
  
  div.insertAdjacentHTML('beforeend', '<br/><br/>');

  ctrls[1] = addBtn('local master', div, ()=>{ sync_type = 1; synctrls(); return false; });//_newBtn();
  ctrls[2] = addBtn('ws master', div, ()=>{ sync_type = 2; synctrls(); return false; }); //_newBtn();
  ctrls[3] = addBtn('local & ws master', div, ()=>{ sync_type = 3; synctrls(); return false; });//_newBtn();
  
  div.insertAdjacentHTML('beforeend', '<br/><br/>');

  ctrls[4] = addBtn('local client', div, ()=>{ sync_type = 4; synctrls(); return false; });//_newBtn();
  ctrls[5] = addBtn('ws client', div, ()=>{ sync_type = 5; synctrls(); return false; });//_newBtn();
  
  ctrls[2].hidden = true;
  ctrls[3].hidden = true;
  ctrls[5].hidden = true;
  doChk().then((result) => {
    username = null;
    if (result.state > 0) {
      username = result.username;
      ctrls[2].hidden = false;
      ctrls[3].hidden = false;
      ctrls[5].hidden = false;
      ctrls[5].innerHTML = `'${username}' ws client`;
    }
    syntoggle();
  }).catch(error => {
    console.error('Error:', error);
    syntoggle();
  });

  div.insertAdjacentHTML('beforeend', '<br/><br/><hr />');

  ctrls[7] = addBtn('mode', div, ()=>{ keyboard({ code: 'KeyP' }); return false; });
  ctrls[8] = addBtn('char color', div, ()=> {  keyboard({ code: 'KeyC' }); return false; });
  ctrls[9] = addBtn('font', div, ()=>{keyboard({ code: 'KeyF' }); return false;});
  ctrls[10] = addBtn('show hint', div, ()=>{ keyboard({ code: 'KeyS' }); return false;});

  div.insertAdjacentHTML('beforeend', '<br/><br/>');

  ctrls[11] = addBtn('font size-', div, ()=>{ 
    setFontFactor(fontfactor + 0.5);
    _repaint();
    return false;
  });
  ctrls[12] = addBtn('font size+', div, ()=>{  
    setFontFactor(fontfactor - 0.5);
    _repaint();
    return false;
  });

  div.insertAdjacentHTML('beforeend', '<br/><br/>');

  ctrls[13] = addBtn('rm BG', div, ()=>{ removeBackground(); return false;});
}

function syntoggle() {
  if (ctrls[sync_type].hidden) sync_type = 0;
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
  }

  removeDiv();
  canvas.hidden = false;
  if (subtitles != undefined)
    _repaint();

}

function restoreFromJson(obj) {
  if (!obj) return;
  subtitles = obj.song;

  phase = obj.phase;
  line = obj.line;
  doblank = obj.blank;
  _repaint();
}

/*
 websocket .. 
 */
var ws;
var timeoutID = -1;
//
function chkWebsocket() {

  //console.log(`# ${timeoutID}`);

  if (timeoutID >= 0) window.clearTimeout(timeoutID);

  if (sync_type != 5) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      ws = null;
    }
    return;
  }

  if (ws && ws.readyState != WebSocket.OPEN) {
    console.log('WebSocket is open');
    initWebsocket();
    return;
  }

  timeoutID = setTimeout(chkWebsocket, 3000);
}

function initWebsocket() {

  let serverDomain = window.location.hostname;
  console.log('Server Domain:', serverDomain);

  //return;

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

  ws = port == 443? 
  new WebSocket(`wss://${serverDomain}/Song/${username}`): 
  new WebSocket(`ws://${serverDomain}:${port}/Song/${username}`);
  
  ws.onopen = function () {
    console.log('Connected to server');
    ws.send('Hello - from 歌詞 client');
  };
  ws.onmessage = function (event) {
    console.log('Received:', event.data);
    let obj = JSON.parse(event.data);
    if (!obj) return;
    restoreFromJson(obj);
  };
  ws.onclose = function () {
    console.log('Connection closed');
  };

  if (timeoutID >= 0) window.clearTimeout(timeoutID);
  timeoutID = setTimeout(chkWebsocket, 5000);

}

function userhelp() {

  ctx.fillStyle = COLORS_CK[1];//'green';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontsize / 2 + "px " + fontFamily;
  ctx.textAlign = "left";

  let gap = canvas.height / (content_help[0].length + 1);
  for (let i = 0; i < content_help[0].length; i++) {
    let x = 20;
    let y = (i + 1) * gap;
    ctx.lineWidth = 1;
    ctx.fillStyle = COLORS_CK[2];
    ctx.fillText(content_help[0][i], x, y);
  }
}

function blank() {
  if (mode == 2) {
    //ctx.globalCompositeOperation='difference';
    //ctx.filter = 'blur()';//'invert(1)';
    ctx.fillStyle = "rgba(0,0,0, 0.4)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }
}

function toObj() {
  let obj = {};
  obj['mode'] = mode;
  obj['fontfactor'] = fontfactor;
  obj['list'] = SONGS.slice(1);//list;
  obj['fontColorType'] = fontColorType;
  obj['transparent'] = makeTransparent ? 1 : 0;
  //obj['slave'] = funcInterval == null ? 0 : 1;
  obj['syncType'] = sync_type;
  obj['progress'] = displayProgress;
  obj['imageBase64'] = "";
  if (image_base64 && image_base64.length > 0) {
    obj['imageBase64'] = image_base64;
  }
  return obj;
}

//generate HTML
createCanvas(); //createBGHiddenFile();
createListHiddenFile();
//end html page

init();



var keylock = false;

function receiveMessage(e) {
  json2List(e.data);
}

// 監聽 message 事件
window.addEventListener('message', receiveMessage, false);
window.addEventListener('keyup', function(e) {
  e.preventDefault(); 
  e.stopPropagation();
  keyboard(e);
}, false);
window.addEventListener('keydown', function (e) {
  e.preventDefault(); 
  e.stopPropagation();
  if (e.code == 'ShiftLeft') {
    keylock = true;
  }
}, false);
window.addEventListener('resize', function () {
  init();
  _repaint();
});
window.addEventListener('beforeunload', function (e) {
  closeSelector();
});
/* 網頁切換別處切回來重繪 */
document.addEventListener('visibilitychange', function () {
  _repaint();
});

getSongsFromList();

/*
var xhr = new XMLHttpRequest();
xhr.open('GET', 'data.json', true);
xhr.onload = function() {
  if (xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    // 在页面中显示数据
    document.getElementById('data').innerHTML = JSON.stringify(data);
  }
};
xhr.send();
*/

let supportTouch = false;
if ('ontouchstart' in window || navigator.maxTouchPoints) {
  // 支持触摸事件
  supportTouch = true;
}

/*
 * 手機觸控相關... START
 */
var colState = 0;
var rowState = 0;

function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

function touchstart(evt) {
  evt.preventDefault();
  //var touches = {x:evt.changedTouches[0].clientX, y:evt.changedTouches[0].clientY};//getTouchPos(canvas, evt);
  let touchPX = evt.changedTouches[0].clientX;//touches.x;
  let touchPY = evt.changedTouches[0].clientY;//touches.y;
  //sumOffset = 0;
  colState = 0;
  rowState = 0;

  colState = 1 + Math.floor(touchPX/(canvas.width/3));
  rowState = 1 + Math.floor(touchPY/(canvas.height/4));

}

function touchend(evt) { //touchend

  evt.preventDefault();

  let touchPX = evt.changedTouches[0].clientX;//touches.x;
  let touchPY = evt.changedTouches[0].clientY;//touches.y;
  
  let _colState = 1 + Math.floor(touchPX/(canvas.width/3));
  let _rowState = 1 + Math.floor(touchPY/(canvas.height/4));

  if (_colState != colState || _rowState != rowState) return;

  if (rowState == 1) { //open sync options selection
    keyboard({code:'Enter', keyCode: 13 });
    return;
  }

  if (rowState == 2) { //open sync options selection
    keyboard({code:'KeyB', keyCode: 66 });
    return;
  }

  if (rowState == 3 && colState == 1) { //上一首
    keyboard({code:'Minus', keyCode: 189 });
    return;
  }

  if (rowState == 3 && colState == 3) { //下一首
    keyboard({code:'Equal', keyCode: 187 });
    return;
  }

  if (rowState == 3 && colState == 2) { //上
    keyboard({code:'ArrowUp', keyCode: 38 });
    return;
  }

  if (rowState == 4 && colState == 2) { //下
    keyboard({code:'ArrowDown', keyCode: 40 });
    return;
  }

  if (rowState == 4 && colState == 1) { //左
    keyboard({code:'ArrowLeft', keyCode: 37 });
    return;
  }

  if (rowState == 4 && colState == 3) { //右
    keyboard({code:'ArrowRight', keyCode: 39 });
    return;
  }

}

if (supportTouch) {
  canvas.addEventListener("touchstart", touchstart, false);
  canvas.addEventListener("touchend", touchend, false);
}

if (readParam('mode')) {
  mode = parseInt(readParam('mode'));
  _repaint();
}

if (readParam('action') === 'play') {
    
  doChk().then((result) => {
    if (result.state > 0) {
      username = result.username;
      sync_type = 5;
      synctrls();
    }
  }).catch(error => {
    console.error('Error:', error);
  });

  _repaint();

}

if (readParam('action') === 'ctrl') {

  doChk().then((result)=>{
    if (result.state > 0) {
      username = result.username;
      displayProgress = 1;
      mode = 3;
      sync_type = 3;
      synctrls();
    }
  }).catch(error => {
    console.error('Error:', error);
  });

  _repaint();

}
