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

/*
  list : (list)
  mode : (mode)
  fontfactor: (fontfactor)
  master : 1 
 */
function json2List(fileContent) {

  const jsonData = JSON.parse(fileContent);
  // 進行 JSON 資料的處理

  if (!jsonData.list || jsonData.list.length == 0) {
    if (jsonData.master && jsonData.master == 1) 
      saveListFromController();
  } else {
    getSongsFromList(jsonData.list);
    if (!funcInterval) 
      if (jsonData.master && jsonData.master == 1) 
        saveListFromController();
  }

  if (jsonData.mode) mode = jsonData.mode;
  if (jsonData.fontfactor) setFontFactor(jsonData.fontfactor);
  if (jsonData.fontColorType) fontColorType = jsonData.fontColorType;

  _repaint();
  //console.log(jsonData.list);

}

function loadListFromJson(event) {
  var files = event.target.files;//const inputFile = document.getElementById('json');
  if (files.length > 0) {
    // 讀取使用者選擇的檔案
    const file = files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    // 當讀取完成時，將檔案內容轉換成 JSON 物件並進行處理
    reader.onload = function(event) {
      const fileContent = event.target.result;
      json2List(fileContent);
    }
  }
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

var list = [];

const content_help = [[
    "方向鍵  '左右'切句  '上下'切段",
    "'0-9'0-9首  '-'上一首  '='下一首", 
    "'QWERTYUI'1-8段  'O'第0段  'C'最後一段", 
    "'P'投影片模式切換  'L'即時選歌", 
    "'S'顯示進度  'A'動畫  'B'Blank",
    "shift'=-' 字大小",
    "'F2'被控方"
  ]];
  
//字型顏色設定
var fontFamily = "Monospace"; //"Arial" "cwTeXKai" '華康瘦金體' "標楷體" "Noto Serif TC";

const COLORS_CK = ["rgb(0, 110, 0)", "green", "rgb(0, 180, 0)", "rgb(0, 240, 0)"];
const COLOR_PPT = 'rgb(0,0,200)';
const COLOR_PPT_SML = 'rgb(0, 70, 0)';

function getSong(jsonid) {
  var json_elm = document.getElementById(jsonid);
  if (json_elm) {
    var obj = JSON.parse(json_elm.innerHTML);
    if (obj.content)
      return obj.content;
  }
  return [['']];
} 

const EMPTY = [ [['____歌詞____'],['']] ];

var SONGS = EMPTY.slice();//[ [['____歌詞____'],['']] ];

var song;
var subtitles;

var fontsize = 100;
var FONT = fontsize + "px " + fontFamily;
var fontfactor = 12.0;

var phase = 0;
var line = 0;
var mode = 0;
var animSwh = 0;
var animIdx = 0;

var displayProgress = 0;
var doblank = 0;
var helpSwitch = 0;
var dword = 0;

var imgurl = '';//'./Icon-1024.png';
var img;
var canvas;
var ctx;

function init() {
    canvas = document.getElementById("canvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");

    fontsize = Math.ceil(canvas.height/fontfactor);
    FONT = fontsize + "px " + fontFamily;

    //canvas.style.caretColor = "red";
}

function ajax_restore() {
  _ajax({
      "action": "restore"
  }, 
  '/restorelyrics', 
  (res)=>{
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

function ajax_sync() {
  _ajax({
      song: song,
      phase: phase,
      line: line,
      blank: doblank
  }, 
  '/synclyrics', 
  (res)=>{
      console.log(JSON.stringify(res));
  }, ()=>{
    console.log('exception');
  });
}

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
    cb(data);
  }).catch((error) => {
    // 處理錯誤
    console.log('' + error);
    errorcb();
  });
}

var funcInterval;
function startRestoreFromServerInterval() {
  if (funcInterval) stopActionInterval();
  funcInterval = window.setInterval(ajax_restore, 200);
}

function startRestoreInterval() {
  if (funcInterval) 
    stopActionInterval();
  syncListFromController();
  funcInterval = window.setInterval(restoreActionFromLocal, 200);
}

function stopActionInterval() {
  if (funcInterval) clearInterval(funcInterval);
  funcInterval = null;
  localStorage.removeItem('save progress');
}

function saveAction2Local() {
  let key = 'save progress';
  let value = song + ' ' + phase + ' ' + line + ' ' + doblank;
  localStorage.setItem(key, value);
  //ajax_sync();
}

function restoreActionFromLocal() {
  let key = 'save progress';
  let value = localStorage.getItem(key);
  if (!value) return;
  value = value.trim();
  if (value && value.length == 0) return;
  let array = value.split(' ');
  let _song = parseInt(array[0]);
  let _phase = parseInt(array[1]);
  let _line = parseInt(array[2]);
  let _doblank = parseInt(array[3]);

  if (_song == song && _phase == phase && _line == line && _doblank == doblank) return;

  if (_song >= SONGS.length) {
    syncListFromController();
    return;
  }

  song = _song;
  subtitles = SONGS[song];

  phase = _phase;
  line = _line;

  if (phase >= subtitles.length) {
    syncListFromController();
    return;
  }

  if (line >= subtitles[phase].length) {
    syncListFromController();
    return;
  }

  doblank = _doblank;
  _repaint();
}

function syncListFromController() {
  let key = 'song list';
  let value = localStorage.getItem(key);
  if (!value) return;
  var array = JSON.parse(value);
  getSongsFromList(array);
}

function saveListFromController() {
  
  let key = 'song list';
  let value = JSON.stringify(list);
  localStorage.setItem(key, value);
  //alert('saveListFromController : ' + value);
  //console.log('saveListFromController : ' + value);
}

/*
function _createEmptyBtn() {
  var button = document.createElement('button');
  //button.innerHTML = ' <br/> ';
  button.style.width = '172px'; // setting the width to 200px
  button.style.height = '25px'; // setting the height to 200px
  //button.style.background = 'teal'; // setting the background color to teal
  //button.style.color = 'white'; // setting the color to white
  button.style.fontSize = '16px'; // setting the font size to 20px
  //document.body.appendChild(button);
  return button;
}

function _createBtn(idtxt, attr) {
  var button = document.createElement('button');
  button.innerHTML = idtxt + '<br/>' + attr;// + ' ' + getSong(idtxt)[0][0];
  button.id = 'btn' + idtxt;

  button.style.width = '172px'; // setting the width to 200px
  button.style.height = '75px'; // setting the height to 200px
  //button.style.background = 'rgb(0,100,0)'; // setting the background color to teal
  //button.style.color = 'rgb(0,255,0)'; // setting the color to white
  button.style.fontSize = '16px'; // setting the font size to 20px

  button.onclick = function() {
    
    list.push(idtxt);
    saveListFromController();

    SONGS[SONGS.length] = getSong(idtxt);
    song = SONGS.length - 1;
    phase = 0;
    line = 0;
    subtitles = SONGS[song];
    //alert(idtxt + ' ' + subtitles[0][0]);
    hideCanvas();
    _repaint();
    return false;
  };
  //document.body.appendChild(button);
  return button;
}

function _songBtn(id) {
  var exist = document.getElementById(id);
  var btn;
  if (exist) {
      var attr = exist.getAttribute("name");
      if (!attr) attr = ''; 
      btn = _createBtn(id, attr);
  } else {
      btn = _createEmptyBtn();
  }
  return btn;
}

function createBtns() {

  var div = document.createElement('div');
  div.id = 'btns';
  document.body.appendChild(div);

  //'VOLUMN'
  let VOLUMN = getSong('VOLUMN');

  for (let pf = 0;pf<VOLUMN.length;pf++) {

    var span = document.createElement('span');
    span.style.color = 'rgb(0,255,0)' // apply your style
    span.appendChild(document.createTextNode(VOLUMN[pf][3]));
    div.appendChild(span);
    div.insertAdjacentHTML('beforeend', '<p></p>');

    for (var i=1;i<=VOLUMN[pf][1];i++) {
      var btn = _songBtn(VOLUMN[pf][0]+i);
      if (pf%2 == 0) {
        btn.style.background = COLORS_CK[0]; // setting the background color to teal
        btn.style.color = COLORS_CK[3];
        btn.style.borderColor = COLORS_CK[2];
      } else {
        btn.style.background = COLORS_CK[1]; // setting the background color to teal
        btn.style.color = COLORS_CK[3];
        btn.style.borderColor = COLORS_CK[2];
      }
      if (btn.innerHTML.length > 0 || VOLUMN[pf][2]) {
        div.appendChild(btn);
      }
    }

    div.insertAdjacentHTML('beforeend', '<p></p>');
  }

  let EVENTS = getSong('EVENTS');

  for (let pf = 0;pf<EVENTS.length;pf++) {

    var span = document.createElement('span');
    span.style.color = 'rgb(0,255,0)' // apply your style
    span.appendChild(document.createTextNode(EVENTS[pf]));
    div.appendChild(span);
    div.insertAdjacentHTML('beforeend', '<p></p>');
    
    let toolList = getSong(EVENTS[pf]);

    for(let i = 0;i<toolList.length;i++) {
      var btn = _songBtn(toolList[i]);
      if (pf%2 == 0) {
        btn.style.background = COLORS_CK[0]; // setting the background color to teal
        btn.style.color = COLORS_CK[3];
        btn.style.borderColor = COLORS_CK[2];
      } else {
        btn.style.background = COLORS_CK[1]; // setting the background color to teal
        btn.style.color = COLORS_CK[3];
        btn.style.borderColor = COLORS_CK[2];
      }

      div.appendChild(btn);

    }

    div.insertAdjacentHTML('beforeend', '<p></p>');

  }

}

function removeBtns() {
  var buttons = document.getElementById('btns');
  if (buttons) {
    document.body.removeChild(buttons);
  }
  return;
}
*/

var selector = null;
function openSelector() {
  closeSelector();
  selector = window.open("subtitle_list.html", "_blank", 'width=800, height=600, left=100, top=100');
}

function closeSelector() {
  if (selector) 
    selector.close();
  selector = null;
}

/*
function hideCanvas() {  
  if (canvas.hidden) {
    removeBtns();
    canvas.hidden = false;
  } else {
    createBtns();
    canvas.hidden = true;
  }
}
*/

function prepareImage() {
  img = new Image();
  img.src = imgurl;
  img.onload = function() {};
}

function drawIdxHint(x, y) {
  ctx.lineWidth = 1;
  if (mode == 2)
    ctx.strokeStyle = 'white';
  else 
    ctx.strokeStyle = 'rgb(0, 200, 0)';
  ctx.strokeRect (x, y, canvas.width/60, canvas.height/60);
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

  ctx.lineWidth = Math.ceil(fontsize/12.0);

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
    if (line%2 == 0) {
      if (line + 1 <= subtitles[phase].length-1) {
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

  let txt = subtitles[i][j];
      
  ctx.font = FONT;
  var x = canvas.width/2;
  var y = canvas.height - fontsize;//animSwh == 1?canvas.height/2:canvas.height - 100;

  
  if (dword > 0) {
    ctx.textAlign = "right";
    x = canvas.width - fontsize/2;
    y = vpos == 0?y:canvas.height - fontsize * 2;

    if (line == j) drawIdxHint(x + 4, y);
    

  } else {
    ctx.textAlign = "center";
  }

  if (i == 0) {
    if (txt.length > 0)
      txt = '['+txt+']';
    else 
      txt = '-';
  }

    
  if (doblank == 1 || (i == 0 && animSwh == 0)) { //單行綠色標題
      ctx.fillStyle = COLORS_CK[2];//"rgb(0,180,0)";
      ctx.fillText(txt, x, y);
      return;
  }  
  

  txtRendering(txt, x, y);

}

function printFullChart() {
   
  let margin = 36;
  let fsize = fontsize/4;
  ctx.font = fsize + "px Arial";
  ctx.textAlign = 'left';
  ctx.strokeStyle = "rgb(0,240,0)";
  ctx.lineWidth = 1;

  for (var i = 0;i < subtitles.length;i++) {
    var txt = '';
    for (var j = 0;j < subtitles[i].length;j++) {
      let tmp = i == 0?'[' + subtitles[i][j] + ']':' ' + subtitles[i][j] + ' ';
      if (i > 0 && i == phase && j == line) {
        ctx.strokeRect(margin + ctx.measureText(txt).width, margin + i * fsize + 4, ctx.measureText(tmp).width, -fsize);
      }
      txt += tmp;
    }
    if (i%2 == 0) {
      ctx.fillStyle = COLORS_CK[2];//"rgb(0,160,0)";
    } else {
      ctx.fillStyle = COLORS_CK[3];//"rgb(0,200,0)";
    }
    ctx.fillText(txt, margin, margin + i * fsize);
  }
}

function printChart() {
  
  if (animSwh > 0) return;
  printFullChart();

  if (phase == 0) return;
  
  let all = 0;
  
  for (let i = 1;i < subtitles.length;i++) {
    all += subtitles[i].length;
  }
  
  if (all == 0) return;

  let gap = canvas.width/all;
  let _h = 20;
  let y = canvas.height - _h * 2;

  let _step = 0;
  
  for (let i = 1;i <subtitles.length;i++) {
    if (i%2 == 0) {
      ctx.fillStyle = COLORS_CK[0];//"rgb(0,115,0)";
    } else {
      ctx.fillStyle = COLORS_CK[2];//"rgb(0,160,0)";
    }
    //let len = subtitles[i].length * gap;
    ctx.fillRect (_step * gap, y, subtitles[i].length * gap, _h);
    _step += subtitles[i].length;
  }
  
  var idx = line;
  for (let i = 1;i < phase;i++) {
    idx += subtitles[i].length;
  }

  ctx.lineWidth = 3;
  ctx.strokeStyle = COLORS_CK[1];//'green';
  
  for (var i = 0;i < all;i++) {
    ctx.strokeRect (i * gap, y, gap, _h);
  }

  ctx.strokeStyle = COLORS_CK[3];//"rgb(0,220,0)";
  ctx.strokeRect (idx * gap, y, gap, _h);

}

function printPhase() {

  ctx.font = FONT;

  var gap = canvas.height/Math.max(3, (subtitles[phase].length + 1));
  
  if (mode == 2) {
    let _x = canvas.width/2;
    ctx.textAlign = 'center';
    for (let i=0;i<subtitles[phase].length;i++) {
      let _y = (i + 1) * gap + fontsize/2;
      let txt = subtitles[phase][i];
      if (phase == 0 && txt.length > 0) txt = '[' + txt + ']';
      
      txtRendering(txt, _x, _y);
      
      if (i == line && song > 0) drawIdxHint(10, _y);
      
    }

    if (song > 0 && phase > 0) {
      ctx.fillStyle = 'rgb(0,200,0)';      
      ctx.font = fontsize/2 + "px Arial";
      ctx.fillText('['+subtitles[0][0]+ ' ' + phase + '/' + (subtitles.length - 1) +']', 
                   _x, fontsize/2);
    }


  } else { //mode 1, 3
    let _x = mode == 1?canvas.width * 0.05:canvas.width * 0.95;
    ctx.textAlign = mode == 1?'left':'right';
    for (let i=0;i<subtitles[phase].length;i++) {
      let _y = (i + 1) * gap + fontsize/2;
      let txt = subtitles[phase][i];
      if (phase == 0 && txt.length > 0) txt = '[' + txt + ']';
      if (doblank == 1) {
        ctx.fillStyle = doblank == 1?'rgb(0,240,0)':'white';
        ctx.strokeStyle = doblank == 1?'rgba(0,240,0, 0)':'black';
        ctx.fillText(txt, _x, _y);
      } else {
        txtRendering(txt, _x, _y);
      }
      
      if (i == line && song > 0) drawIdxHint(10, _y);
    
    }

    if (song > 0 && phase > 0) {

      //ctx.fillStyle = mode == 2?'yellow':'rgb(0,240,0)';
      ctx.fillStyle = 'rgb(0,200,0)';
      
      ctx.font = fontsize/2 + "px Arial";
      ctx.fillText('['+subtitles[0][0]+ ' ' + phase + '/' + (subtitles.length - 1) +']', 
                   _x, fontsize/2);
    }

  } 

}

function printPhaseChart() {

  if (phase == 0) return;

  let gap = canvas.width/(subtitles.length - 1);
  let _gap = Math.min(canvas.width/4, gap);
  let _h = 20;
  let y = canvas.height - _h * 2;

  for (let i = 1;i <subtitles.length;i++) {
    if (i%2 == 0) {
      /*
      if (mode == 2) {
        ctx.fillStyle = "rgb(0,0,128)";
      } else {
        ctx.fillStyle = "rgb(50,50,50, 0.5)";
      }
      */
      ctx.fillStyle = "rgba(0,0,0, 0.1)";
    } else {
      /*
      if (mode == 2) {
        ctx.fillStyle = "rgb(0,0,200)";
      } else {
        ctx.fillStyle = "rgb(100,100,100, 0.5)";
      }
      */
      ctx.fillStyle = "rgba(0,0,0, 0.2)";
    }
    ctx.fillRect((i-1) * gap + (gap - _gap)/2, y, _gap, _h);
  }

  ctx.lineWidth = 3;

  ctx.strokeStyle = "rgba(255,255,255, 0.33)";

  ctx.strokeRect ((phase-1) * gap + (gap - _gap)/2, y, _gap, _h);

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
  
  switch (e.keyCode) {
    case 32: history.back(); return;
    case 189: //'-'
      setFontFactor(fontfactor + 0.5);
      break;
    case 187: //'='
      setFontFactor(fontfactor - 0.5);    
      break;
  }
  _repaint();
}

function keyboard(e) {

    //alert(e.keyCode);
    if (e.keyCode == 16) {// || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 91) {
      keylock = false;
      _repaint();
      return;
    }
    
    if (keylock) {
      if (!canvas.hidden)
        combineKey(e);
      return;
    }

    /*
    if (doblank == 1) {
      doblank = 0;
      _repaint();
      return;
    }
    */
    
    switch (e.keyCode) {
      //case 113: //F2
      case 13: //Enter
        if (funcInterval) {
          stopActionInterval();
          break;
        }
        startRestoreInterval();
        break;
      /*
      case 114:
        if (funcInterval) {
          stopActionInterval();
          break;
        }
        startRestoreFromServerInterval();
        break;
      */
      case 66: //'b'
        doblank = doblank == 0?1:0;
        break;
      case 33: //'page up'
        if (mode == 0) {
          keyboard({keyCode : 37}); //left
        } else { //ppt mode
          if (phase > 0) { //normal
            keyboard({keyCode : 38}); //up
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
      case 34: //'page down'
        if (mode == 0) { 
          keyboard({keyCode : 39}); //right
        } else {
          if (phase < subtitles.length - 1) {
            keyboard({keyCode : 40}); //down
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
      case 65: //'A'
          if (mode == 1) break;
          if (mode == 3) break;
          if (animSwh == 0) {
            initAnim(animIdx);
          } else {
            initAnim(-1);
          }
          break;
      case 83: displayProgress = displayProgress == 1?0:1; break; //'s'
      case 68: dword = dword == 0?1:0; break; //'D'
      case 67: fontColorType = (fontColorType + 1)%4; break; //'c'
      case 90: makeTransparent = !makeTransparent; break; //'z'
      //case 67: phase = subtitles.length - 1; line = 0; break; //'c' jump to coda last one phase
      case 80:
          if (animSwh == 0) mode = (mode+1)%4;
          animSwh = 0;
          if (mode == 0 || mode == 1 || mode == 3) fontColorType = 1;
          if (mode == 2) fontColorType = 0;
          break; //'p' ppt mode
      case 72: //'h 
          helpSwitch = helpSwitch == 0?1:0;
          break;
      //case 76: hideCanvas(); break; //'l'
      case 76: openSelector(); break; //'l'
      case 38: //'ArrowUp'
          if (phase > 0) {
            phase = phase - 1;  
          }
          line = 0;
          break; 
      case 40: //'ArrowDown':
          if (phase < subtitles.length -1) {
            phase = phase + 1;
            line = 0;
          }
          break;
      case 37: //'ArrowLeft'
          line = line - 1;
          if (line < 0) {
            phase = phase - 1;
            if (phase < 0) {
                phase = 0;
                line = 0;
            } else {
                line = subtitles[phase].length -1;
            }
          }          
          break; 
        case 39: //'ArrowRight'
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
        case 48:    case 49:  case 50:  case 51:  case 52:  case 53:  case 54:  case 55:  case 56:  case 57:
        //case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
          let value = e.keyCode - 48;
          if (value < SONGS.length) {
            song = value;
            subtitles = SONGS[song];
            phase = 0;
            line = 0;
          }
          break;

        case 189: //'-'
          if (song > 0) {
            song = song - 1;
            subtitles = SONGS[song];
            phase = 0;
            line = 0;
          }
          break;
        case 187: //'='
          if (song < SONGS.length -1) {
            song = song + 1;
            subtitles = SONGS[song];
            phase = 0;
            line = 0;
          }
          break;
        //oqwertyui
        case 77:
          img = null;
          document.getElementById('img').click();
          break;
        case 74: document.getElementById('json').click(); break;
        case 79: phase = 0; line = 0; break;
        case 81: if (subtitles.length > 1) { phase = 1; line = 0; } break;
        case 87: if (subtitles.length > 2) { phase = 2; line = 0; } break;
        case 69: if (subtitles.length > 3) { phase = 3; line = 0; } break;
        case 82: if (subtitles.length > 4) { phase = 4; line = 0; } break;
        case 84: if (subtitles.length > 5) { phase = 5; line = 0; } break;
        case 89: if (subtitles.length > 6) { phase = 6; line = 0; } break;
        case 85: if (subtitles.length > 7) { phase = 7; line = 0; } break;
        case 73: if (subtitles.length > 8) { phase = 8; line = 0; } break;

        //case 13: //'enter' 
        case 27: //'escape'
          mode = 0;
          //removeBtns();
          canvas.hidden = false;
          animSwh = 0;
          animIdx = 0;
          doblank = 0;
          helpSwitch = 0;
          displayProgress = 0;
          fontColorType = 0;
          dword = 0;
          break;
        //case 32: canvas.requestFullscreen(); break;
        default:
          //alert(e.key);
          break;
    }

    _repaint();

}

var makeTransparent = false;

function _layer0() {
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (makeTransparent) return;

  if (mode == 0) {
    ctx.fillStyle = COLORS_CK[1];//'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (mode == 1 || mode == 3) {
    ctx.fillStyle = COLORS_CK[1];//'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (mode == 2) {
    ctx.fillStyle = COLOR_PPT;//'blue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (img) ctx.drawImage(img,0,0, canvas.width, canvas.height);
    
  } 
}

function _layer1() {
  if (mode == 0) {
    if (displayProgress == 1) 
      printChart();
    printSubtitle();
  } else if (mode == 1 || mode == 3) {

    /*
    a	c	e
    b	d	f
    0	0	1
    ctx.transform(a,b,c,d,e,f);
                  xscale, xskew, yscale, yskew, xoffset, yoffset
    ctx.resetTransform
    */

    if ( mode == 1 && displayProgress == 1) 
      printFullChart();

    let _scale = mode == 1?0.5:1.0;
    let _gap = 0; //canvas.width/100;

    ctx.transform(_scale, 
                  0, 
                          0,      
                          _scale, 
                                    _gap, 
                                    (1-_scale) * canvas.height - _gap);

    if (doblank == 1) {
      ctx.fillStyle = 'green';
    } else {
      ctx.fillStyle = COLOR_PPT_SML;
    }
  
    printPhase();

    //if (displayProgress == 1) printPhaseChart();

    ctx.resetTransform();

  } else if (mode == 2) {
    if (displayProgress == 1) printPhaseChart();
    printPhase();
  }

}

function _layer2() {

  if (funcInterval) {
    ctx.fillStyle = COLORS_CK[2];
    let _r = 4;
    ctx.fillRect(0, 0, _r * 2, fontsize/2);
  }

  if (helpSwitch == 1) 
    userhelp(); 
  
  if (doblank == 1) 
    blank();
  
}

function _repaint() {
  if (!funcInterval) saveAction2Local();
  _layer0();
  _layer1();
  _layer2();
}

function userhelp() {

  ctx.fillStyle = COLORS_CK[1];//'green';
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontsize/2 + "px Arial";
  ctx.textAlign = "left";

  let gap = canvas.height/(content_help[0].length + 1);
  for (let i=0;i<content_help[0].length;i++) {
    let x = 20;
    let y = (i + 1) * gap;
    ctx.lineWidth = 1;
    ctx.fillStyle = COLORS_CK[2];
    ctx.fillText(content_help[0][i], x, y);
  }
}

function blank() {
  animSwh = 0;
  if (animSwh == 1 || mode == 2) {
    //ctx.globalCompositeOperation='difference';
    //ctx.filter = 'blur()';//'invert(1)';
    ctx.fillStyle = "rgba(0,0,0, 0.5)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }
}

function toObj() {
  let obj = {};
  obj['mode'] = mode;
  obj['fontfactor'] = fontfactor;
  obj['list'] = list;
  obj['fontColorType'] = fontColorType;
  return obj;
}

//generate HTML
createCanvas();
createBGHiddenFile();
createListHiddenFile();
//end html page

init();

var keylock = false;

/*
window.addEventListener('keyup', function(e) {
  //e.preventDefault();
  //e.stopPropagation();
  keyboard(e);
}, false);
*/

function receiveMessage(e) {
  /*
  // 來源網址（e.origin）不是指定的網域時
  if(e.origin !== 'https://xxxxxxx.tw') {
    alert('資料來源錯誤');
    return false;
  }
    // 來源網址是指定的網域時
  */

  if (e.data == 'x') { //alert(e.data);
    startRestoreInterval();
  } else if (e.data == 'o') { //alert(e.data);
    stopActionInterval();
  } else {
    console.log('Message received! ' + e.data);
    console.trace();
    json2List(e.data);
  }
  _repaint();
}
 
// 監聽 message 事件
window.addEventListener('message', receiveMessage, false);

window.addEventListener('keyup', keyboard, false);
window.addEventListener('keydown', function(e) {

  //e.preventDefault();
  //e.stopPropagation();

  if (e.keyCode == 16) {// || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 91) {
    keylock = true;
  }

}, false);
window.addEventListener('resize', function() {
  init();
  _repaint();
});

window.addEventListener('beforeunload', function (e) {
  closeSelector();
});

/*
canvas.addEventListener('mousemove', e => {
  if (mode != 0) return;
  if (canvas.hidden) return;
  if (animSwh != 0) return;
  _repaint();
  ctx.strokeStyle = 'rgb(0,255,0)';
  ctx.strokeRect (e.x - 5, e.y - 5, 10, 10);
  //doblank = 0; helpSwitch = 0; displayProgress = 0;
});
*/

/*
function getSongsFromJson(jsonData) {

  if (jsonData.content.length == 0) return;
    
  getSongsFromList(jsonData.content);

}
*/

function getSongsFromList(_list) {

  if (_list) 
    list = _list;
  else 
    list = getSong('LIST');
  
  SONGS = EMPTY.slice();
  
  for(let i=0;i<list.length;i++) { //SONGS[i+1] = getSong(list[i]);
    if (typeof list[i] === 'string') {
      SONGS[i+1] = getSong(list[i]);
    } else {
      SONGS[i+1] = list[i];
    }
  }

  song = 0;
  phase = 0;
  line = 0;

  subtitles = SONGS[song];

  _repaint();
}

getSongsFromList();

/*
fetch('https://jkpan.github.io/browsertools/list.json')
    .then((response) => {
        return response.json();
    })
    .then( (json) => {
        console.log(json);//http://localhost/list.json
        list = json.list;
        getSongsFromList();
    })
    .catch((error) => {
        console.log(`Error: ${error}`);
        getSongsFromList();
    });
*/

//<!-- Animation -->

var pre = 0;
var particles = [];

function anim_update(elapse) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!makeTransparent) {
    if (mode == 0) {
      ctx.fillStyle = COLORS_CK[1];//'green';
    } else {
      ctx.fillStyle = 'black';
    }
    
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    if (img) {
      ctx.drawImage(img,0,0, canvas.width, canvas.height);
    }
  }

  let dt = elapse - pre;
  pre = elapse;
  
  for (var i = 0;i<particles.length;i++) {
    particles[i].update(canvas, ctx, dt);
  }

  _layer1();
  _layer2();

  if (animSwh == 1) 
    window.requestAnimationFrame(anim_update);
  else
    _repaint();

}

//function randomPickAnim() { let idx = Math.floor(Math.random() * 5); initAnim(idx);}

function initAnim(idx) {
  
  if (particles.length >= 1) {
    for (var i = 0;i<particles.length;i++) {
      particles[i].release();
    }
  }

  particles.length = 0;
  particles = [];

  if (idx < 0) {
    animIdx = (animIdx + 1)%12;
    idx = animIdx;
  }

  if (idx == 0) {
    particles[0] = newBlank();
    particles[0].initial(canvas);
  } else if (idx == 1) {
    for (var i = 0;i<150;i++) {
      particles[i] = newParticle_casual();
      particles[i].initial(canvas);
    }
  } else if (idx == 2) {
    for (var i = 0;i<150;i++) {
      particles[i] = newParticle_in();
      particles[i].initial(canvas);
    }
  } else if (idx == 3) {
    for (var i = 0;i<150;i++) {
      particles[i] = newParticle_out();
      particles[i].initial(canvas);
    }
  } else if (idx == 4) {
    for (var i = 0;i<150;i++) {
      particles[i] = newParticle_ring();
      particles[i].initial(canvas);
    }
  } else if (idx == 5) {
    for (var i = 0;i<100;i++) {
      particles[i] = newParticle_snow();
      particles[i].initial(canvas);
    }
  } else if (idx == 6) {
    for (var i = 0;i<3;i++) {
      particles[i] = newParticle_firework();
      particles[i].initial(canvas);
    }
  } else if (idx == 7) {
    particles[0] = new SpotLightObj(1);
    particles[1] = new SpotLightObj(2);
    particles[2] = new SpotLightObj(3);
    particles[3] = new SpotLightObj(4);
    particles[4] = new SpotLightObj(5);
    /*
    for (var i = 0;i<20;i++) {
      particles[i] = newParticle_rect();
      particles[i].initial(canvas);
    }
    */
  } else if (idx == 8) {
    particles[0] = newParticle_skylight_background();
    for (var i = 1;i<100;i++) {
      particles[i] = newParticle_skylight();//newParticle_snow();
      particles[i].initial(canvas);
    }
  } else if (idx == 9) {
    particles[0] = newParticle_sunrise_background();
    for (var i = 1;i<100;i++) {
      particles[i] = newParticle_sunrise();//();
      particles[i].initial(canvas);
    }
  } else if (idx == 10) {
    try {
      
      particles[0] = new ClockObj();//newClock();
      particles[0].setDarkmask();
      
    } catch (e) {
      console.log("no clock obj included");
    }
  } else if (idx == 11) {
    particles[0] = newParticle_led();
    particles[0].initial(canvas);
  }

  if (animSwh == 0) {
    animSwh = 1;
    window.requestAnimationFrame(anim_update);
  }  

}

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