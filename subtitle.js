
//Complete Html Page
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
  document.body.style.backgroundColor = 'green';
}

function createHiddenFile() {
  let _file = document.createElement('input');
  _file.type = "file";
  _file.id = "img";
  _file.hidden = "true";
  let body = document.getElementsByTagName("body")[0];
  body.appendChild(_file);
  //<input id="img" type="file" hidden="true"/>
}

createCanvas();
createHiddenFile();
//end html page


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

var SONGS = EMPTY;//[ [['____歌詞____'],['']] ];

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

var funcInterval;
function startRestoreInterval() {
  if (funcInterval) 
    stopActionInterval();
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
  doblank = _doblank;
  _repaint();
}

function syncListFromController() {
  let key = 'song list';
  let value = localStorage.getItem(key);
  if (!value) return;
  value = value.trim();
  if (value && value.length == 0) return;
  let array = value.split(',');
  list = array;
  SONGS = EMPTY;//[ [['____歌詞____'],['']] ];
  for(let i=0;i<list.length;i++) {
    list[i] = list[i].trim();
    if (list[i].length == 0) 
      break;
    console.log('syncList : ' + list[i]);
    SONGS[i+1] = getSong(list[i]); //flow();
    
  }
  song = SONGS.length - 1;
  phase = 0;
  line = 0;
  subtitles = SONGS[song];
  _repaint();
}

function saveListFromController() {
  let key = 'song list';
  value = '';
  for (let i=0;i<list.length;i++){
    value += list[i];
    value += ',';
  }
  localStorage.setItem(key, value);
  console.log('saveList ' + value);
}

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

function hideCanvas() {
  
  if (canvas.hidden) {
    removeBtns();
    canvas.hidden = false;
  } else {
    createBtns();
    canvas.hidden = true;
  }
}

function prepareImage() {
  img = new Image();
  img.src = imgurl;
  img.onload = function() {};
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

function printTxt(i, j, vpos) {

  let txt = subtitles[i][j];
      
  ctx.font = FONT;
  var x = canvas.width/2;
  var y = canvas.height - fontsize;//animSwh == 1?canvas.height/2:canvas.height - 100;

  
  if (dword > 0) {
    ctx.textAlign = "right";
    x = canvas.width - fontsize/2;
    y = vpos == 0?y:canvas.height - fontsize * 2;

    if (line == j) {
      ctx.fillStyle = 'rgb(0,200,0)';
      ctx.strokeStyle = 'rgb(0,200,0)';
      ctx.strokeRect (x + 4, y, canvas.width/60, canvas.height/60);
    }

  } else {
    ctx.textAlign = "center";
  }

  if (i == 0) {
    if (txt.length > 0)
      txt = '['+txt+']';
    else 
      txt = '-';
  }

  if (doblank == 1 || (i == 0 && animSwh == 0)) {
    ctx.fillStyle = COLORS_CK[2];//"rgb(0,180,0)";
    ctx.lineWidth = 1;
    ctx.fillText(txt, x, y);
    return;
  }

  ctx.strokeStyle = 'black';
  ctx.lineWidth = Math.ceil(fontsize/12.0);//ctx.lineWidth = 4;
  ctx.strokeText(txt, x, y);

  ctx.fillStyle = 'white';
  ctx.lineWidth = 1;
  ctx.fillText(txt, x, y);

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
      
      ctx.fillStyle = 'white';
      
      if (img) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = Math.ceil(fontsize/10.0);//ctx.lineWidth = 4;
        ctx.strokeText(txt, _x, _y);
      }
      
      ctx.fillText(txt, _x, _y);
      
      if (i == line && song > 0) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.strokeRect (10, _y, canvas.width/60, canvas.height/60);
      }
    }
  } else { //mode 1, 3
    let _x = canvas.width * 0.1;
    ctx.textAlign = 'left';
    for (let i=0;i<subtitles[phase].length;i++) {
      let _y = (i + 1) * gap + fontsize/2;
      let txt = subtitles[phase][i];
      if (phase == 0 && txt.length > 0) txt = '[' + txt + ']';
      ctx.fillStyle = doblank == 1?'rgb(0,240,0)':'white';

      
        ctx.strokeStyle = doblank == 1?'rgba(0,240,0, 0)':'black';
        ctx.lineWidth = Math.ceil(fontsize/10.0);//ctx.lineWidth = 4;
        ctx.strokeText(txt, _x, _y);  
      
      
      ctx.fillText(txt, _x, _y);

      
      if (i == line && song > 0) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = doblank == 1?'rgb(0,240,0)':'white';
        ctx.strokeRect (10, _y, canvas.width/60, canvas.height/60);
      }
      

    }
  } 

  
  if (song > 0 && phase > 0) {

    //ctx.fillStyle = mode == 2?'yellow':'rgb(0,240,0)';
    ctx.fillStyle = 'rgb(0,200,0)';
    
    ctx.font = fontsize/2 + "px Arial";
    ctx.fillText('['+subtitles[0][0]+ ' ' + phase + '/' + (subtitles.length - 1) +']', 
                 mode == 2?canvas.width/2:canvas.width * 0.1, 
                 fontsize/2);
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
    //ctx.fillRect((i-1) * gap, y, gap, _h);
  }

  ctx.lineWidth = 3;

  /*
  if (mode == 2) {
    ctx.strokeStyle = "rgb(100,100,200)";
  } else {
    ctx.strokeStyle = "rgb(150,150,150, 0.5)";
  }
  */

  ctx.strokeStyle = "rgba(255,255,255, 0.33)";

  ctx.strokeRect ((phase-1) * gap + (gap - _gap)/2, y, _gap, _h);

}

function combineKey(e) {
  
  switch (e.keyCode) {
    case 32: history.back(); return;
    case 189: //'-'
      fontfactor += 0.5;
      if (fontfactor > 20) 
        fontfactor = 20;
      init();
      break;
    case 187: //'='
      fontfactor -= 0.5;
      if (fontfactor < 3) 
        fontfactor = 3.0;
      init();
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
      case 113:
        if (funcInterval) {
          stopActionInterval();
          break;
        }
        startRestoreInterval();
        break;
      //case 73: //I
      //  
      //  break;
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
      case 68: dword = dword == 0?1:0; break;
      case 67: //'c' jump to coda last one phase
          phase = subtitles.length - 1;
          line = 0;
          break;
      case 80:
          if (animSwh == 0) {
            mode = (mode+1)%4;
          }
          animSwh = 0;
          break; //'p' ppt mode
      case 72: //'h 
          helpSwitch = helpSwitch == 0?1:0;
          break;
      case 76: hideCanvas(); break; //'l'
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
        case 79: phase = 0; line = 0; break;
        case 81: if (subtitles.length > 1) { phase = 1; line = 0; } break;
        case 87: if (subtitles.length > 2) { phase = 2; line = 0; } break;
        case 69: if (subtitles.length > 3) { phase = 3; line = 0; } break;
        case 82: if (subtitles.length > 4) { phase = 4; line = 0; } break;
        case 84: if (subtitles.length > 5) { phase = 5; line = 0; } break;
        case 89: if (subtitles.length > 6) { phase = 6; line = 0; } break;
        case 85: if (subtitles.length > 7) { phase = 7; line = 0; } break;
        case 73: if (subtitles.length > 8) { phase = 8; line = 0; } break;

        case 13: //'enter' 
        case 27: //'escape'
          mode = 0;
          removeBtns();
          canvas.hidden = false;
          animSwh = 0;
          animIdx = 0;
          doblank = 0;
          helpSwitch = 0;
          displayProgress = 0;
          dword = 0;
          break;
        //case 32: canvas.requestFullscreen(); break;
        default:
          //alert(e.key);
          break;
    }

    _repaint();

}

function _layer0() {
  if (mode == 0) {
    ctx.fillStyle = COLORS_CK[1];//'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (mode == 1 || mode == 3) {
    ctx.fillStyle = COLORS_CK[1];//'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (mode == 2) {
    ctx.fillStyle = COLOR_PPT;//'blue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (img) {
      ctx.drawImage(img,0,0, canvas.width, canvas.height);
    }
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

    //if (doblank == 1) return;
    
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
  
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    ctx.fillRect(0, 0, _r * 2, _r * 2);
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

  ctx.fillStyle = COLORS_CK[1];//'green'; //"rgb(0,0,255)"//ctx.fillRect(0, 0, c.width, c.height);
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
  /*
  if (mode == 0) {
    
    ctx.fillStyle = 'green'; //"rgb(0,0,255)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }
  */
  animSwh = 0;
  if (animSwh == 1 || mode == 2) {
    //ctx.globalCompositeOperation='difference';
    //ctx.filter = 'blur()';//'invert(1)';
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0, 0.5)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return;
  }

  /* 
  else {
    ctx.fillStyle = 'green'; //"rgb(0,0,255)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  */
}

init();

var input = document.getElementById('img');
// 當使用者修改內容(選擇檔案)
input.addEventListener('change', function (event) {
  var files = event.target.files;
  var file;
  if (files && files.length > 0) {
    file = files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      var _img = new Image();
      _img.onload = function() {
        img = _img;
        _repaint(); 
      }
      _img.src = e.target.result;
    }
  }    
});

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
  }
  if (e.data == 'o') { //alert(e.data);
    stopActionInterval();
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

function getSongsFromList() {
  list = getSong('LIST');
  for(let i=0;i<list.length;i++) 
    SONGS[i+1] = getSong(list[i]);
  song = 0;
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

  if (mode == 0) {
    ctx.fillStyle = COLORS_CK[1];//'green';
  } else {
    ctx.fillStyle = 'black';
  }
  
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (img) {
      ctx.drawImage(img,0,0, canvas.width, canvas.height);
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
    animIdx = (animIdx + 1)%11;
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
    for (var i = 0;i<20;i++) {
      particles[i] = newParticle_rect();
      particles[i].initial(canvas);
    }
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
      //particles[0].initial(canvas);
    } catch (e) {
      console.log("no clock obj included");
    }
  }

  if (animSwh == 0) {
    animSwh = 1;
    window.requestAnimationFrame(anim_update);
  }  

}

function newParticle_casual() {
  let p = {
    x: 0,
    y: 0,
    v:100,
    R: 0,
    G: 0,
    B: 0,
    A: 0,
    radius:10,
    dir:0,
    release: function() { },
    initial: function (c) {
      
      let short = Math.min(c.width, c.height);
      let range = short * 0.4 + (Math.random() * short * 0.1) * (Math.random() >0.5?1:-1);
      let angle = Math.random() * 360 * Math.PI/180;
      this.x = c.width/2 + range * Math.cos(angle);
      this.y = c.height/2 + range * Math.sin(angle);
      this.v = 30 + Math.random() * 30; 
      this.R = 100 + 155 * Math.random();
      this.G = 100 + 155 * Math.random();
      this.B = 100 + 155 * Math.random();
      this.A = Math.random();//0.5 + Math.random()/2.0;
      this.radius = 10 + Math.random() * 10;
      this.dir = Math.random() * 360 * Math.PI/180;

    },
    update: function (c, _ctx, dt) {

      this.x = this.x + this.v * dt * 0.001 * Math.cos(this.dir);
      this.y = this.y + this.v * dt * 0.001 * Math.sin(this.dir);
      //ctx.save();
      _ctx.fillStyle = 'rgb(' + this.R + ',' + this.G + ',' + this.B + ',' + this.A + ')'; //"rgb(0,0,200)";
      //ctx.fillRect (this.x - this.radius/2.0, this.y - this.radius/2.0, this.radius, this.radius);
      _ctx.beginPath();
      _ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
      _ctx.fill();
      _ctx.closePath();
      
      //ctx.restore();
      
      this.A = this.A - 0.3 * dt * 0.001;
      if (this.A < 0.01) {
        this.initial(c);
        this.A = 0.5 + Math.random()/2.0;
        //this.A = 0.5 + Math.random()/2.0;
      }
      //console.log(this.y + ', ' + this.x + ':' + dt);
    }
  }
  return p;
}

function newParticle_in() {
  let p = {
    x_stt: 0,
    y_stt: 0,
    x_end: 0,
    y_end: 0,
    R: 0,
    G: 0,
    B: 0,
    A: 0,
    radius:10,
    t:0,
    elapse:0,
    release: function() { },
    easein:function(_t) {
      return _t * _t * _t;
    },
    easeout:function(_t) {
      return -_t * _t + 2 * _t;
    },
    initial: function (c) {
      
      let short = Math.min(c.width, c.height);
      let long = Math.max(c.width, c.height) * 0.5;
      let range = (Math.random() * short * 0.1);
      let dir = Math.random() * 360 * Math.PI/180;
      
      this.x_stt = c.width/2 + range * Math.cos(dir);
      this.y_stt = c.height/2 + range * Math.sin(dir);
      
      this.x_end = c.width/2 + long * Math.cos(dir);
      this.y_end = c.height/2 + long * Math.sin(dir);
      
      this.R = 100 + 155 * Math.random();
      this.G = 100 + 155 * Math.random();
      this.B = 100 + 155 * Math.random();
      this.A = 1.0;//0.5 + Math.random()/2.0;

      this.radius = 20 + Math.random() * 50;
      this.elapse = 1.0 + 4.0 * (70 - this.radius) /70;
      this.t = 0;

    },
    update: function (c, _ctx, dt) {

      this.t += dt/1000.0;
      let ein = this.easein(this.t/this.elapse);
      let x = this.x_stt + (this.x_end - this.x_stt) * ein;
      let y = this.y_stt + (this.y_end - this.y_stt) * ein;
      this.A = 1.0 + (0-1.0) * ein;
      let r = 0.0 + (this.radius - 0) * ein;
      if (r < 0)
        r = this.radius;
      //ctx.save();
      _ctx.fillStyle = 'rgb(' + this.R + ',' + this.G + ',' + this.B + ',' + this.A + ')';//"rgb(0,0,200)";
      //ctx.fillRect (this.x - this.radius/2.0, this.y - this.radius/2.0, this.radius, this.radius);
      _ctx.beginPath();
      _ctx.arc(x, y, r, 0, 2 * Math.PI, true);
      _ctx.fill();
      _ctx.closePath();
      if (this.t > this.elapse) {
        this.initial(c);
      }
    }
  }
  return p;
}

function newParticle_out() {
  let p = {
    x_stt: 0,
    y_stt: 0,
    x_end: 0,
    y_end: 0,
    R: 0,
    G: 0,
    B: 0,
    A: 0,
    radius:10,
    t:0,
    elapse:0,
    release: function() { },
    easein:function(_t) {
      return _t * _t * _t;
    },
    easeout:function(_t) {
      return -_t * _t + 2 * _t;
    },
    initial: function (c) {
      
      let short = Math.min(c.width, c.height);
      let long = Math.max(c.width, c.height) * 0.5;
      let range = (Math.random() * short * 0.1);
      let dir = Math.random() * 360 * Math.PI/180;
      
      this.x_end = c.width/2 + range * Math.cos(dir);
      this.y_end = c.height/2 + range * Math.sin(dir);
      
      this.x_stt = c.width/2 + long * Math.cos(dir);
      this.y_stt = c.height/2 + long * Math.sin(dir);
      
      this.R = 100 + 155 * Math.random();
      this.G = 100 + 155 * Math.random();
      this.B = 100 + 155 * Math.random();
      this.A = 1.0;//0.5 + Math.random()/2.0;

      this.radius = 20 + Math.random() * 50;
      this.elapse = 1.0 + 4.0 * (70 - this.radius) /70;
      this.t = 0;

    },
    update: function (c, _ctx, dt) {

      this.t += dt/1000.0;
      let ein = this.easeout(this.t/this.elapse);
      let x = this.x_stt + (this.x_end - this.x_stt) * ein;
      let y = this.y_stt + (this.y_end - this.y_stt) * ein;
      this.A = 0 + (1.0 - 0) * ein;
      let r = this.radius + (0 - this.radius) * ein;
      if (r < 0)
        r = this.radius;
      //ctx.save();
      _ctx.fillStyle = 'rgb(' + this.R + ',' + this.G + ',' + this.B + ',' + this.A + ')';//"rgb(0,0,200)";
      //ctx.fillRect (this.x - this.radius/2.0, this.y - this.radius/2.0, this.radius, this.radius);
      _ctx.beginPath();
      _ctx.arc(x, y, r, 0, 2 * Math.PI, true);
      _ctx.fill();
      _ctx.closePath();
      if (this.t > this.elapse) {
        this.initial(c);
      }
    }
  }
  return p;
}

function newParticle_ring() {
  let p = {
    type:  0,
    x_stt: 0,
    y_stt: 0,
    x_end: 0,
    y_end: 0,
    R: 0,
    G: 0,
    B: 0,
    A: 0,
    radius:10,
    t:0,
    elapse:0,
    release: function() { },
    easein:function(_t) {
      return _t * _t * _t;
    },
    easeout:function(_t) {
      return -_t * _t + 2 * _t;
    },
    initial: function (c) {
      
      let short = Math.min(c.width, c.height);
      let long = Math.max(c.width, c.height) * 0.5;
      let range = (Math.random() * short * 0.1);
      let dir = Math.random() * 360 * Math.PI/180;
      
      if (this.type == 0) {
        this.x_stt = c.width/2 + (short * 0.05 + range) * Math.cos(dir);
        this.y_stt = c.height/2 + (short * 0.05 + range) * Math.sin(dir);
      
        this.x_end = c.width/2 + long * Math.cos(dir);
        this.y_end = c.height/2 + long * Math.sin(dir);  
        
      } else {

        this.x_end = c.width/2 + (short * 0.05 + range) * Math.cos(dir);
        this.y_end = c.height/2 + (short * 0.05 + range) * Math.sin(dir);
      
        this.x_stt = c.width/2 + long * Math.cos(dir);
        this.y_stt = c.height/2 + long * Math.sin(dir);
      }
      
      this.R = 100 + 155 * Math.random();
      this.G = 100 + 155 * Math.random();
      this.B = 100 + 155 * Math.random();
      this.A = 1.0;//0.5 + Math.random()/2.0;

      this.radius = 20 + Math.random() * 50;
      this.elapse = 1.0;//1.0 + 4.0 * (70 - this.radius) /70;
      this.t = 0;

    },
    update: function (c, _ctx, dt) {

      this.t += dt/1000.0;
      let ein = this.type == 0?this.easein(this.t/this.elapse):this.easeout(this.t/this.elapse);
      let x = this.x_stt + (this.x_end - this.x_stt) * ein;
      let y = this.y_stt + (this.y_end - this.y_stt) * ein;
      if (this.type == 0)
        this.A = 1.0 + (0-1.0) * ein;
      else 
        this.A = 0.0 + (1.0 - 0) * ein;
      let r = 0.0 + (this.radius - 0) * ein;
      if (this.type == 1)
        r = this.radius + (0 - this.radius) * ein;
      if (r < 0) r = 0;
      //ctx.save();
      _ctx.fillStyle = 'rgb(' + this.R + ',' + this.G + ',' + this.B + ',' + this.A + ')';//"rgb(0,0,200)";
      //ctx.fillRect (this.x - this.radius/2.0, this.y - this.radius/2.0, this.radius, this.radius);
      _ctx.beginPath();
      _ctx.arc(x, y, r, 0, 2 * Math.PI, true);
      _ctx.fill();
      _ctx.closePath();
      if (this.t > this.elapse) {
        this.type = this.type == 0?1:0;
        this.initial(c);
      }

    }
  }
  return p;
}

function newParticle_firework_particle() {
  let p = {
    x_stt: 0,
    y_stt: 0,
    x_end: 0,
    y_end: 0,
    R: 0,
    G: 0,
    B: 0,
    A: 0,
    radius:10,
    t:0,
    elapse:0,
    easein:function(_t) {
      return _t * _t * _t;
    },
    easeout:function(_t) {
      return -_t * _t + 2 * _t;
    },
    easeinout:function(_t) {
      //console.log('sin('+ _t * Math.PI+(') = '+Math.sin(_t * Math.PI)));
      return Math.sin(_t * Math.PI);
    },
    release: function() { },
    colorDis: function(idx) {
      let r0 = 155 * Math.random();
      let r1 = 155 * Math.random();
      let rc0 = 200 + 55 * Math.random();
      let rc1 = 200 + 55 * Math.random();
      switch(idx) {
        case 0: this.R = rc0; this.G =  r0; this.B =  r1;  break;
        case 1: this.R =  r0; this.G = rc0; this.B =  r1;  break;
        case 2: this.R =  r0; this.G =  r1; this.B = rc0;  break;
        case 3: this.R =  r0; this.G = rc0; this.B = rc1;  break;
        case 4: this.R = rc0; this.G =  r0; this.B = rc1;  break;
        case 5: this.R = rc0; this.G = rc1; this.B =  r0;  break;
      }
    },
    initial: function (c, _x, _y, _range, _elapse, idx) {
      
      let r0 = Math.random();
      while (Math.random() > r0/2.0) r0 = Math.random();
      let range = r0 * _range;

      let dir = Math.random() * 360 * Math.PI/180;
      
      this.x_stt = _x;// + (short * 0.05 + range) * Math.cos(dir);
      this.y_stt = _y;//c.height/2;// + (short * 0.05 + range) * Math.sin(dir);
      
      this.x_end = this.x_stt + range * Math.cos(dir);
      this.y_end = this.y_stt + range * Math.sin(dir);
      
      this.colorDis(idx);
      
      this.A = 1.0;//0.5 + Math.random()/2.0;
      
      this.radius = 6 + 4 * (1- range/_range);// + Math.random() * 50;
      this.elapse = _elapse;
      this.t = 0;

    },
    update: function (c, _ctx, dt) {

      this.t += dt/1000.0;
      let eout = this.easeout(this.t/this.elapse);
      let x = this.x_stt + (this.x_end - this.x_stt) * eout;
      let y = this.y_stt + (this.y_end - this.y_stt) * eout;
      //console.log('t:' + this.t/this.elapse);
      this.A = this.easeinout(this.t/this.elapse);
      let r = 0.0 + (this.radius - 0) * eout;
      if (r < 0) r = 0;
      //ctx.save();
      _ctx.fillStyle = 'rgb(' + this.R + ',' + this.G + ',' + this.B + ',' + this.A + ')';//"rgb(0,0,200)";
      //ctx.fillRect (this.x - this.radius/2.0, this.y - this.radius/2.0, this.radius, this.radius);
      _ctx.beginPath();
      _ctx.arc(x, y, r, 0, 2 * Math.PI, true);
      _ctx.fill();
      _ctx.closePath();
      if (this.t > this.elapse) {
        this.t = this.elapse;
      }
    }
  }
  return p;
}

function newParticle_firework() {
  let p = {
    particles:[],
    
    t:0,
    elapse:0,
    initial: function (c) {
      
      let x = c.width * (0.2 + Math.random() * 0.6);// + (short * 0.05 + range) * Math.cos(dir);
      let y = c.height * (0.2 + Math.random() * 0.6);
      let range = Math.max(c.width, c.height) * 0.2 * (0.5 + Math.random()/2.0);

      this.elapse = 0.7 + Math.random()/2.0;//1.0 + 4.0 * (70 - this.radius) /70;
      this.t = 0;

      if (this.particles.length < 1) {
        for (var i = 0;i<80;i++) {
          this.particles[i] = newParticle_firework_particle();
        }
      }

      let idx = Math.floor(Math.random() * 6);
      
      for (var i = 0;i<this.particles.length;i++) {
        this.particles[i].initial(c, x, y, range, this.elapse, idx);
      }

    },
    release: function() {
      this.particles.length = 0;
      this.particles = [];
    },
    update: function (c, _ctx, dt) {

      this.t += dt/1000.0;

      for (var i = 0;i<this.particles.length;i++) {
        this.particles[i].update(c, _ctx, dt);
      }

      if (this.t > this.elapse) {
        this.initial(c);
      }
    }
  }
  return p;
}

function newParticle_rect() {
  let p = {
    x: 0,
    y: 0,
    v: 0,
    R: 0,
    G: 0,
    B: 0,
    A: 0,
    radius:10,
    release: function() { },
    initial: function (c) {
                  
      this.x = c.width * (0.2 + Math.random() * 0.6);
      this.y = c.height * (0.5 + Math.random() * 0.5);
      this.v = 0.2 + Math.random() * 0.5; 
      this.R = 155 * Math.random();
      this.G = 155 * Math.random();
      this.B = 155 * Math.random();
      this.A = 0.5 + Math.random() * 0.2;
      this.radius = 100 + Math.random() * 100;

    },
    update: function (c, _ctx, dt) {
      
      _ctx.fillStyle = 'rgb(' + this.R + ',' + this.G + ',' + this.B + ',' + this.A + ')'; //"rgb(0,0,200)";
      _ctx.fillRect (this.x - this.radius * 0.7, this.y - this.radius/2.0, this.radius * 1.4, this.radius);
      
      
      this.A = this.A - this.v * dt * 0.001;
      if (this.A < 0.01) {
        this.initial(c);
      }
      //console.log(this.y + ', ' + this.x + ':' + dt);
    }
  }
  return p;
}

function newParticle_snow() {
  let p = {
    x: 0,
    y: 0,
    v: 100,
    R: 0,
    G: 0,
    B: 0,
    A: 0,
    radius:10,
    release: function() { },
    initial: function (c) {
      
      let short = Math.min(c.width, c.height);
      let range = short * 0.4 + (Math.random() * short * 0.1) * (Math.random() >0.5?1:-1);
      let angle = Math.random() * 360 * Math.PI/180;
      this.x = c.width * (0.1 + Math.random() * 0.8);// + range * Math.cos(angle);
      this.y = -Math.random() * c.height * 0.2;
      let gray = 155 + 100 * Math.random();
      this.R = gray;
      this.G = gray;
      this.B = gray;
      this.A = 0.5 + Math.random() * 0.5;//0.3 - 1.0 
      this.radius = 0.02 * c.width * ((1 - this.A) + 0.1); //0.7 - 0
      this.v = 20 * this.radius;

    },
    update: function (c, _ctx, dt) {

      this.x = this.x + (-0.15 + Math.random() * 0.3) * dt;
      this.y = this.y + 0.001 * this.v * dt;
      //ctx.save();
      _ctx.fillStyle = 'rgb(' + this.R + ',' + this.G + ',' + this.B + ',' + this.A + ')'; //"rgb(0,0,200)";
      //ctx.fillRect (this.x - this.radius/2.0, this.y - this.radius/2.0, this.radius, this.radius);
      _ctx.beginPath();
      _ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
      _ctx.fill();
      _ctx.closePath();

      //ctx.restore();
      this.A = this.A - dt * 0.0002;

      if (this.A < 0.01) {
        this.initial(c);
      }
    }
  }
  return p;
}

/*
 * Skylight
 */
function newParticle_skylight_background() {
  let p = {
    initial: function (c) { },
    release: function() { },
    update: function (c, _ctx, dt) {

      var grd = _ctx.createLinearGradient(0, 0, c.width, c.height);
      grd.addColorStop(0, 'rgb(200, 128, 0,1.0)');
      grd.addColorStop(1, 'rgb(0,0,0,1.0)');

      // Fill with gradient
      _ctx.fillStyle = grd;
      _ctx.fillRect(0, 0, c.width, c.height);
    }
  };
  return p
}

function newParticle_skylight() {
  let p = {
    x_stt: 0,
    y_stt: 0,
    x_end: 0,
    y_end: 0,
    R: 0,
    G: 0,
    B: 0,
    A: 0,
    radius:10,
    t:0,
    elapse:0,
    background: function() {

    },
    release: function() { },
    easein:function(_t) {
      return _t * _t * _t;
    },
    easeout:function(_t) {
      return -_t * _t + 2 * _t;
    },
    initial: function (c) {
      
      let short = Math.min(c.width, c.height);
      let long = Math.max(c.width, c.height);
      let range = (Math.random() * short * 0.1);
      let dir = (10 + Math.random() * 70) * Math.PI/180;
      
      this.x_stt = -2 * range + range * Math.cos(dir);
      this.y_stt = -2 * range + range * Math.sin(dir);
      
      this.x_end = -range + long * Math.cos(dir);
      this.y_end = -range + long * Math.sin(dir);
      
      this.R = 200 + 55 * Math.random();
      this.G = 50 + 100 * Math.random();
      this.B = 0;
      this.A = 1.0;//0.5 + Math.random()/2.0;

      this.radius = 10 + Math.random() * 10;
      this.elapse = 10 + (1-this.radius/20) * 10.0;
      this.t = Math.random() * this.elapse ;

    },
    update: function (c, _ctx, dt) {

      if (dt > 1000) dt = 16;

      this.t += dt/1000.0;
      let ein = this.t/this.elapse;
      let x = this.x_stt + (this.x_end - this.x_stt) * ein;
      let y = this.y_stt + (this.y_end - this.y_stt) * ein;
      this.A = 1.0 + (0-1.0) * ein;
      let r = this.radius/2 * (1 + ein);
      //if (r < 0) r = this.radius;
      //ctx.save();
      _ctx.fillStyle = 'rgb(' + this.R + ',' + this.G + ',' + this.B + ',' + this.A + ')';//"rgb(0,0,200)";
      //ctx.fillRect (this.x - this.radius/2.0, this.y - this.radius/2.0, this.radius, this.radius);
      _ctx.beginPath();
      _ctx.arc(x, y, r, 0, 2 * Math.PI, true);
      _ctx.fill();
      _ctx.closePath();
      if (this.t > this.elapse) {
        this.initial(c);
        this.t = 0;
      }
    }
  }
  return p;
}

/*
 * Sunrise
 */
 function newParticle_sunrise_background() {
  let p = {
    initial: function (c) { },
    release: function() { },
    update: function (c, _ctx, dt) {

      var grd = _ctx.createLinearGradient(0, c.height/2, 0, 0);
      grd.addColorStop(0, 'rgb(255, 128, 0,1.0)');
      grd.addColorStop(1, 'rgb(0,0,0,1.0)');

      // Fill with gradient
      _ctx.fillStyle = grd;
      _ctx.fillRect(0, 0, c.width, c.height/2);

      grd = _ctx.createLinearGradient(0, c.height/2, 0, c.height);
      grd.addColorStop(0, 'rgb(255, 128, 0,1.0)');
      grd.addColorStop(1, 'rgb(0,0,0,1.0)');

      // Fill with gradient
      _ctx.fillStyle = grd;
      _ctx.fillRect(0, c.height/2 -1, c.width, c.height);

    }
  };
  return p
}

function newParticle_sunrise() {
  let p = {
    x_stt: 0,
    y_stt: 0,
    x_end: 0,
    y_end: 0,
    R: 0,
    G: 0,
    B: 0,
    A: 0,
    radius:10,
    t:0,
    elapse:0,
    release: function() { },
    easein:function(_t) {
      return _t * _t * _t;
    },
    easeout:function(_t) {
      return -_t * _t + 2 * _t;
    },
    initial: function (c) {
    
      this.x_stt = c.width * (0.2 + Math.random() * 0.6);
      if (Math.random() > 0.5) {

        this.y_stt = c.height/2 + (Math.random() * c.height * 0.01);

        this.x_end = -c.width * 0.2 + c.width * 1.4 * this.x_stt/c.width;
        this.y_end = this.y_stt + c.height * 0.2;

        if (Math.random > 0.4) {
          this.y_end = tthis.y_stt;
        }

      } else {

        this.y_stt = c.height/2 - (Math.random() * c.height * 0.01);

        this.x_end = -c.width * 0.2 + c.width * 1.4 * this.x_stt/c.width;
        this.y_end = this.y_stt - c.height * 0.2;

        if (Math.random > 0.4) {
          this.y_end = tthis.y_stt;
        }

      }
      
    
      this.R = 255;
      this.G = 128;
      this.B = 0;
      this.A = 1.0;//0.5 + Math.random()/2.0;

      this.radius = 1 + Math.random() * 2;
      this.elapse = 1 + Math.random() * 2;//1.0 + 4.0 * (70 - this.radius) /70;
      this.t = 0;

    },
    update: function (c, _ctx, dt) {

      

      if (dt > 1000) dt = 16;

      this.t += dt/1000.0;
      let ein = this.easein(this.t/this.elapse);
      let x = this.x_stt + (this.x_end - this.x_stt) * ein;
      let y = this.y_stt + (this.y_end - this.y_stt) * ein;
      this.A = 1.0 + (0 - 1.0) * ein;
      this.radius = this.radius + 0.002 * dt;
      //if (this.radius < 0) this.radius = 0;
      //ctx.save();
      _ctx.fillStyle = 'rgb(' + this.R + ',' + this.G + ',' + this.B + ',' + this.A + ')';//"rgb(0,0,200)";
      //ctx.fillRect (this.x - this.radius/2.0, this.y - this.radius/2.0, this.radius, this.radius);
      _ctx.beginPath();
      _ctx.arc(x, y, this.radius, 0, 2 * Math.PI, true);
      _ctx.fill();
      _ctx.closePath();
      if (this.t > this.elapse) {
        this.initial(c);
        this.elapse = 3 + Math.random();
      }
    }
  }
  return p;
}

function newBlank() {
  let p = {
    release: function() { },
    initial: function (c) {

    },
    update: function (c, _ctx, dt) {

    }
  }
  return p;
}

class ClockObj {

  fontColor = "rgb(180, 180, 180)";
  bgColor = "rgba(0, 0, 0, 0.5)";
  frequence = -1;

  hourColor = "rgb(0, 200, 200)";
  minColor = "rgb(255, 255, 50)";
  secColor = "rgb(255, 50, 50)";

  constructor() {

  }

  release() { }
  initial(c) { }

  changeFreq() {
    switch(this.frequence) {
      case -1: this.frequence = 5; break;
      case 5:  this.frequence = 4; break;
      case 4:  this.frequence = 3; break;
      case 3:  this.frequence = 0.5; break;
      case 0.5: this.frequence = -1; break;
    }
  }

  update(c, _ctx) {    

    let x = c.width/2.0;
    let y = c.height/2.0;
    let len = c.height/5.0;
    let lw = c.height/22;

    let date = new Date();

    let h = date.getHours();
    let min = date.getMinutes();
    let s = date.getSeconds();
    let ms = date.getMilliseconds();

    _ctx.strokeStyle = this.fontColor;
    _ctx.fillStyle =  this.bgColor;
    _ctx.lineWidth = lw;
    _ctx.beginPath();
    _ctx.arc(x, y, 2 * len + 10, 0, 2 * Math.PI, true);
    _ctx.fill();
    _ctx.stroke();
    _ctx.closePath();

    _ctx.fillStyle = this.fontColor;
    for (let i = 0;i<12;i++) {
      let angle = (90 - i * 360.0/12.0) * Math.PI/180;
      let dx = 2 * len * Math.cos(angle);
      let dy = -2 * len * Math.sin(angle);
      _ctx.beginPath();
      _ctx.arc(x + dx, y + dy, lw/1.5, 0, 2 * Math.PI, true);
      _ctx.fill();
      _ctx.closePath();
    }

    _ctx.lineCap = "round";

    /*
     * HOUR
     */
    h = h % 12;
    let angle = (90 - (h + min/60.0) * 360.0/12.0) * Math.PI/180;
    let dx = 0.8 * len * Math.cos(angle);
    let dy = -0.8 * len * Math.sin(angle);
    
    _ctx.beginPath();
    _ctx.moveTo(x, y);
    _ctx.lineTo(x + dx, y + dy);
    _ctx.lineWidth = lw * 1.6;
    _ctx.strokeStyle = this.hourColor;
    _ctx.stroke();
    _ctx.closePath();
    
    /*
     * MINUTE
     */
    angle = (90 - (min + s/60.0) * 360.0/60.0) * Math.PI/180;
    dx = 1.5 * len * Math.cos(angle);
    dy = -1.5 * len * Math.sin(angle);

    _ctx.beginPath();
    _ctx.moveTo(x, y);
    _ctx.lineTo(x + dx, y + dy);
    _ctx.lineWidth = lw;
    _ctx.strokeStyle = this.minColor;
    _ctx.stroke();
    _ctx.closePath();

    /*
     * SECOND -1, 0.5, 3, 4 , 5
     */
    angle = Math.PI/180;
    if (this.frequence < 0) {
      angle = (90 - (s + ms/1000.0) * 6.0) * angle;//360.0/60.0
    } else {
      let hz = this.frequence * 2;
      var gap = Math.floor(ms/(1000/hz));
      angle = (90 - (s + gap/hz) * 6.0) * angle;
    }
  
    //
    _ctx.lineWidth = lw * 0.5;
    dx = 1.7 * len * Math.cos(angle);
    dy = -1.7 * len * Math.sin(angle);
    _ctx.beginPath();
    _ctx.moveTo(x + dx, y + dy);
    dx = 0.4 * len * Math.cos(angle + Math.PI);
    dy = -0.4 * len * Math.sin(angle + Math.PI);
    _ctx.lineTo(x + dx, y + dy);
    
    _ctx.strokeStyle = this.secColor;
    _ctx.stroke();
    _ctx.closePath();

    /*
    _ctx.moveTo(x, y);
    _ctx.lineTo(x + dx, y + dy);
    _ctx.lineWidth = 10;
    _ctx.strokeStyle = "rgb(255, 50, 50)";
    _ctx.stroke();
    */
    
    _ctx.beginPath();
    _ctx.fillStyle = this.secColor;
    _ctx.arc(x, y, lw, 0, 2 * Math.PI, true);
    _ctx.fill();
    _ctx.closePath();

    _ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    _ctx.fillRect(0, 0, c.width, c.height);
    
  }

  printDatetime(c, _ctx) {

    let x = c.width/2.0;
    let y = c.height/2.0;
    let len = c.height/5.0;
    let lw = c.height/22;
    
    let date = new Date();
    
    let h = date.getHours();
    let min = date.getMinutes();
    let s = date.getSeconds();
    //let ms = date.getMilliseconds();
  
    let _time = (h<10?'0'+h:h) + ':' + 
                (min<10?'0'+min:min) +':' + 
                (s<10?'0'+s:s);
    let _date = date.getFullYear() + '/' + 
                (date.getMonth() + 1) +'/' + 
                date.getDate();
          
    let fs = c.width/16;
    _ctx.font = fs + "px Monospace";
    
    _ctx.fillStyle = 'rgb(0,64,0)';
    
    _ctx.lineWidth = Math.ceil(fs/14.0);
    _ctx.strokeStyle = this.fontColor;
    
    _ctx.strokeText(_time, fs, fs);      
    _ctx.fillText(_time, fs, fs);
    
    _ctx.font = (fs/1.5) + "px Monospace";
    
    _ctx.strokeText(_date, fs, fs + fs/1.5);
    _ctx.fillText(  _date, fs, fs + fs/1.5);
  
  }

}
