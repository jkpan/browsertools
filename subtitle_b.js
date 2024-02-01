//import '/common.js';

class Verseobj {
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
      
  targetRect = 0;
  targetFs = 0;
  targetTransY = 0;
  
  initial(volume, c, v, level) {

    this.volume = volume;
    this.chapter = c;
    this.verse = v;
    this.setLevel(level);
    this.fs = this.targetFs;
  
  }

  set2Top(pre) {
    this.transY = - canvas.height * 0.2;
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
      
        let fs = this.fs;
  
        if (progress == -1) {
          this.fs = this.targetFs;
          this.transY = this.targetTransY;
          fs = this.fs;
        } else if (progress == -2) { 
          fs = this.targetFs;
        } else {
          let _p = animElapse == animTotal?1.0:progress/3.0;
          this.fs = this.fs + (this.targetFs - this.fs) * _p;
          fs = this.fs;
          this.transY = this.transY + (this.targetTransY - this.transY) * _p;
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
          this.frontxt = this.level == 0?' ' + this.chapter + ':' + this.verse + ' ':
                                         ' ' + this.verse;
        }
  
        if (this.level == 0) {
          this.wratio = 0.9;
          this.opacity = 1.0;
          if (this.chapter > 0 && this.verse > 0) {
            ctx.font = (fs * 0.6) + "px " + fontFamily;//FONT_SML;
            let frontGap = Math.max(0.1, ctx.measureText(this.frontxt).width/canvas.width);
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
  
        if (progress < 0) {
          this.targetRect = this.substrings.length * this.targetFs + this.targetFs * 0.5;
        }
  
        //if (this.level == 0) console.log(this.targetFs+' # '+ this.fs + ' @' + txt);
  
        if (color_selection <= 1) 
          return this.level == 0? this.substrings.length * fs + fs * 0.5:
                                  this.substrings.length * fs + fs * 0.2;
        else 
          return this.substrings.length * fs + fs * 0.5;
  }
  
  draw() {
  
        if (!this.substrings) return;
  
        ctx.textBaseline = 'top';
  
        if (this.level == 0) {
          ctx.transform(1,0,0,1,0,this.targetTransY);
            //draw hilight rectangle
            //let rectH = this.substrings.length * this.targetFs + this.targetFs * 0.5;
            drawHlight(0, this.targetRect);//rectH);
            //draw chapter verse
            if (this.chapter > 0 && this.verse > 0) {
              let fs = this.targetFs * 0.6;
              ctx.font = fs + "px " + fontFamily;//FONT_SML;
              _drawSdwtxt(' '+abbr[this.volume], 0, 0);
              _drawSdwtxt(this.frontxt, 0, this.targetFs * 0.7);
              //ctx.font = fs + "px " + fontFamily;
              //_drawSdwtxt(' ' + abbr[this.volume], 0, 0);
              //_drawSdwtxt(' ' + this.chapter, 0, fs);
              //_drawSdwtxt(' ' + this.verse, 0, fs * 2, 1.0);

            }
          ctx.resetTransform();
        }
          
        ctx.transform(1,0,0,1,0,this.transY);
        
          ctx.font = this.fs + "px " + fontFamily;
          let x = canvas.width * (1 - this.wratio);
  
          if (this.level == 0) {
            let y = this.fs * 0.25; //console.log(animElapse);
            for (let i=0;i<this.substrings.length;i++) {
              if (islastChar(this.substrings[i]) && i+1<this.substrings.length && is0Char(this.substrings[i+1])) {
                if (animElapse >= animTotal * 0.8 || animElapse == -1)
                  _drawSdwtxt(this.substrings[i]+'-', x, y);
                else
                  _drawtxt(this.substrings[i]+'-', x, y, 1.0);
              } else { 
                if (animElapse >= animTotal * 0.8 || animElapse == -1)
                  _drawSdwtxt(this.substrings[i], x, y);
                else
                  _drawtxt(this.substrings[i], x, y, 1.0);
              }
              y += this.fs;
            }
          } else {
            let y = 0;//fontsize * 0.25;
            for (let i=0;i<this.substrings.length;i++) {
              if (islastChar(this.substrings[i]) && i+1<this.substrings.length && is0Char(this.substrings[i+1])) 
                _drawtxt(this.substrings[i]+'-', x, y, this.opacity);
              else
                _drawtxt(this.substrings[i], x, y, this.opacity);
              y += this.fs;
            }
            ctx.font = this.fs * 0.7 + "px " + fontFamily;
            _drawtxt(this.frontxt, 0, 0, this.opacity);
          }
  
        ctx.resetTransform();    
  
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
  
      /*
      switch (fontColorType) {
          case 0:
          case 1:
              ctx.fillStyle = 'rgba(0, 0, 0, 0.33)';
              break;
          case 2:
          case 3:
              ctx.fillStyle = 'rgba(255, 255, 255, 0.33)';
              break;
        }
        */
        //ctx.fillStyle = 'rgba(255, 255, 255, 0.33)';
        
        ctx.fillStyle = hlight_pointer;
        ctx.fillRect(canvas.width * 0.95, 0, -(this.line) * fontsize, canvas.height);
    
  }

  draw(progress) {                

      ctx.font = (fontsize * 0.9) + "px " + fontFamily;
      ctx.textBaseline = 'top'; //'alphabetic';
      ctx.textAlign = 'right'; //'left' 'center'

      let count = progress < 0?this.txt.length:Math.ceil(this.txt.length * progress);
      let opa = progress < 0?1.0:progress;

      this.line = Math.ceil(count/(canvas.height * 0.9/fontsize)) + 1;
      
      this.drawHlight();

      const mg_x = canvas.width * 0.95;
      const mg_y = canvas.height * 0.05;
      let x = mg_x;
      let y = mg_y;

      if (this.chapter > 0 && this.verse == 0) {
          let fs = fontsize * 0.7;
          ctx.font = fs + "px " + fontFamily;
          this.txt = subtitles[0][0];
          for (let i=0;i<this.txt.length;i++) {
              _drawSdwtxt(this.txt.charAt(i), x, y, opa);
              y += fontsize;
              if (y + fontsize >= canvas.height * 0.95) {
                  x -= fontsize;
                  y = mg_y;
              }
          }
          _drawSdwtxt(''+this.chapter, x, y, opa);
      } else {
          for (let i=0;i<count;i++) {
          
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
  for (let i = 0;i<queue.length;i++) {
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
  var fontFamily = "Monospace";
                   //"Arial";
                   //"cwTeXKai";
                   //'華康瘦金體';
                   //"標楷體";
                   //"Noto Serif TC";
  var fontsize = 48;
  var FONT = fontsize + "px " + fontFamily;
  
  var fontsize_sml = 32;
  var FONT_SML = fontsize_sml + "px " + fontFamily;
  
  var fontsize_sml_sml = 24;
  var FONT_SML_SML = fontsize_sml_sml + "px " + fontFamily;
  

  var bgStyle = 'green';//"rgb(255, 255, 255, 0.5)";//"rgb(0, 0, 0, 0.5)";
  var hlightStyle = 'rgba(0, 60, 0, 0.8)';//"rgb(255, 255, 255, 0.5)";//"rgb(0, 0, 0, 0.5)"; 
  const COLORS_CK = ["rgb(0, 100, 0)", "green", "rgb(0, 180, 0)", "rgb(0, 255, 0)"];
  
  var bgStyle_green = bgStyle;
  var hlightStyle_green = hlightStyle;//'rgb(0, 0, 180)';//"rgb(255, 255, 255, 0.5)";//"rgb(0, 0, 0, 0.5)"; 
  const COLORS_green = COLORS_CK;//["rgb(80, 80, 80)", "rgb(120, 128, 128)", "rgb(180, 180, 180)", "rgb(255, 255, 255)"];

  var bgStyle_blue = 'transparent';//'blue';
  var hlightStyle_blue = 'rgba(100, 100, 100, 0.8)';//"rgb(255, 255, 255, 0.5)";//"rgb(0, 0, 0, 0.5)"; 
  const COLORS_blue = ["rgb(80, 80, 80)", "rgb(120, 128, 128)", "rgb(180, 180, 180)", "rgb(255, 255, 255)"];

  var bgStyle_black = 'black';
  var hlightStyle_black = 'rgba(100, 100, 100, 0.8)';//"rgb(255, 255, 255, 0.5)";//"rgb(0, 0, 0, 0.5)"; 
  const COLORS_black = ["rgb(80, 80, 80)", "rgb(120, 128, 128)", "rgb(180, 180, 180)", "rgb(255, 255, 255)"];//["rgb(80, 80, 80)", "rgb(0, 0, 0)", "rgb(150, 150, 150)", "rgb(200, 200, 200)"];
  
  var bgStyle_white = 'white';
  var hlightStyle_white = 'rgba(100, 100, 100, 0.8)';//"rgb(255, 255, 255, 0.5)";//"rgb(0, 0, 0, 0.5)"; 
  const COLORS_white = ["rgb(255, 255, 255)", "rgb(180, 180, 180)", "rgb(120, 128, 128)", "rgb(80, 80, 80)"];//["rgb(80, 80, 80)", "rgb(0, 0, 0)", "rgb(150, 150, 150)", "rgb(200, 200, 200)"];
  
  /////
  var bgcolor_pointer = bgStyle;
  var color_pointer = COLORS_CK;
  var hlight_pointer = hlightStyle;

  function getSong(jsonid) {
    var json_elm = document.getElementById(jsonid);
    if (json_elm) {
      var obj = JSON.parse(json_elm.innerHTML);
      return obj.content;
    }
    return [['']];
  } 
  
  var SONGS = [ [['']] ];
  
  var chineseAbbr = getSong('中文縮寫');
  var chineseFullname = getSong('中文全名');
  var engAbbr = getSong('英文縮寫');
  var engFullname = getSong('英文全名');

  var abbr = chineseAbbr;
  var fullname = chineseFullname;

  var doLanguageSwitch = false;
    
  function switchLang() {
      if (!doLanguageSwitch) return;
      if (abbr == chineseAbbr) {
        abbr = engAbbr;
        fullname = engFullname;
      } else {
        abbr = chineseAbbr;
        fullname = chineseFullname;
      }
      for(let i=1;i<abbr.length;i++) SONGS[i] = getSong(abbr[i]);
      subtitles = SONGS[song];
      _repaint();
  }
  
  const MAX_VERSES_GREEN = 2;
  const MAX_VERSES_NORMAL = 7;
  
  var song;
  var subtitles;
    
  var phase = 0;
  var line = 0;
  var mode = 0;
    
  var doblank = 0;
  var target_doblank = 0;
  var helpSwitch = 0;
  
  var imgurl = '';//'./Icon-1024.png';
  var img;
  var canvas;
  var ctx;
  
  var color_selection = 1;
  
  var uisel = 0;
  var uisel_start = 0;
  var uisel_end = 0;
  
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
    document.body.style.backgroundColor = 'transparent';
  }

  createCanvas();

  function init() {
      canvas = document.getElementById("canvas");
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext("2d");
  
      fontsize = Math.ceil(canvas.height/fontfactor);//48;
      FONT = fontsize + "px " + fontFamily;
  
      fontsize_sml = Math.ceil(fontsize * 0.66);//32;
      FONT_SML = fontsize_sml + "px " + fontFamily;
  
      fontsize_sml_sml = Math.ceil(fontsize * 0.5);
      FONT_SML_SML = fontsize_sml_sml + "px " + fontFamily;
  
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
      cb(data)
    }).catch((error) => {
      // 處理錯誤
      console.log('' + error);
      errorcb();
    });
  }
  
  function ajax_sync() {
    _ajax({
        vlm: song,
        chp: phase,
        ver: line,
        blank: target_doblank
    }, 
    '/synscripture', 
    (res)=>{
        console.log(JSON.stringify(res));
    }, ()=>{
        console.log('exception');
    });
  }

  function ajax_restore() {
    _ajax({
        "action": "restore"
    }, 
    '/restorescripture', 
    (res)=>{
        //console.log(JSON.stringify(res));
        let volume = res.vlm;
        let chapter = res.chp;
        let verse = res.ver;
        let _doblank = res.blank;

        restoreAnim(volume, chapter, verse, _doblank);

        console.log('succ: send');
        if (sync_type == 5) setTimeout(ajax_restore, 200);

    }, 
    () => {
      console.log('error: delay & re-send');
      if (sync_type == 5) setTimeout(ajax_restore, 2000);
    });
  }

  var sync_type = 0;
  
  var funcInterval;
  var fake_doblank = 0;
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
    
    if (sync_type == 2 || sync_type == 3) {
      ajax_sync();
    }
    if (sync_type == 2) return;

    _saveAction2Local();

  }

  function _saveAction2Local() {
    let key = 'save action';  //localStorage.removeItem(key);
    let value = song + ' ' + phase + ' ' + line + ' ' + target_doblank;
    localStorage.setItem(key, value);
    //console.log('saveAction2Local:' + value);
  }

  
  //判斷是不是要卷軸動畫
  function restoreAnim(volume, chapter, verse, _doblank) {

    if (volume == song && chapter == phase && verse == line && _doblank == fake_doblank) return;
    
    fake_doblank = _doblank;
    if (_doblank != doblank) {
      keyboard({keyCode : 66});
      return;
    }
  
    if (volume == song && chapter == getPreChapter(phase, line) && verse == getPreVerse(phase, line)) {
      keyboard({keyCode : 37}); //left
      return;
    }
    
    if (volume == song && chapter == getNextChapter(phase, line) && verse == getNextVerse(phase, line)) {
      keyboard({keyCode : 39}); //right
      return;
    }

    song = volume;
    subtitles = SONGS[song];
    phase = chapter;
    line = verse;

    if (display_mode == 0)
      _repaint();
    else 
      __repaint();
    
    /*
    if (display_mode == 0)
      _repaint();
    else {
      animElapse = 0;
      window.requestAnimationFrame(verse_update);
    }
    */
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
    for (var i=1;i<subtitles[phase].length;i++) {
      if (i == line) {
        txt = ' <span>[' +phase+':'+i+'] '+subtitles[phase][i]+'</span>';
      } else {
        txt = ' [' +phase+':'+i+'] '+subtitles[phase][i];
      }
      if (poetry) txt += '<br/>';
      div.innerHTML += txt;
    }
    //div.insertAdjacentHTML('beforeend', txt);
  }
  
  function _newBtn() {
  
    var button = document.createElement('button');
  
    button.style.width = '200px'; // setting the width to 200px
    button.style.height = '75px'; // setting the height to 200px
  
    button.style.background = color_pointer[2];//'rgb(0,180,0)'; // setting the background color to teal
    button.style.color = bgcolor_pointer;//color_pointer[1];// 'green'; // setting the color to white
    button.style.fontSize = '20px'; // setting the font size to 20px
  
    button.style.borderColor = color_pointer[3];
    button.style.borderRadius = '10px';
  
    //button.style.border = 'none';
    
    return button;
  }

  var ctrls = [];

  function setMsg_X() {
    sync_type = 4;
    synctrls();
  }

  function setMsg_O() {
    sync_type = 1;
    synctrls();
  }

  function setMsg_play() {
    sync_type = 5;
    synctrls();
  }

  function setMsg_ctrl() {
    sync_type = 2;
    synctrls();
  }
  
  function createCtrlBtn() {
    removeDiv();
    canvas.hidden = true;
    
    let div = document.createElement('div');
    div.id = 'ctrl';
    document.body.appendChild(div);
    div.style.backgroundColor = 'rgba(0,255,0,0.33)';

    var btn_none = _newBtn();
    btn_none.innerHTML = 'none';
    btn_none.onclick = function() {
        sync_type = 0;
        synctrls();
        return false;
    };
    div.appendChild(btn_none);
    ctrls[0] = btn_none;
    
    div.insertAdjacentHTML('beforeend',  '<br/><br/>');

    var btn_lm = _newBtn();
    btn_lm.innerHTML = 'local master';
    btn_lm.onclick = function() {
        sync_type = 1;
        synctrls();
        return false;
    };
    div.appendChild(btn_lm);
    ctrls[1] = btn_lm;

    var btn_wm = _newBtn();
    btn_wm.innerHTML = 'web master';
    btn_wm.onclick = function() {
        sync_type = 2;
        synctrls();
        return false;
    };
    div.appendChild(btn_wm);
    ctrls[2] = btn_wm;

    var btn_lwm = _newBtn();
    btn_lwm.innerHTML = 'local & web master';
    btn_lwm.onclick = function() {
        sync_type = 3;
        synctrls();
        return false;
    };
    div.appendChild(btn_lwm);
    ctrls[3] = btn_lwm;

    div.insertAdjacentHTML('beforeend',  '<br/><br/>');

    var btn_ls = _newBtn();
    btn_ls.innerHTML = 'local slave';
    btn_ls.onclick = function() {
        sync_type = 4;
        synctrls();
        return false;
    };
    div.appendChild(btn_ls);
    ctrls[4] = btn_ls;

    var btn_ws = _newBtn();
    btn_ws.innerHTML = 'web slave';
    btn_ws.onclick = function() {
        sync_type = 5;
        synctrls();
        return false;
    };
    div.appendChild(btn_ws);
    ctrls[5] = btn_ws;

    syntoggle();

  }

  function syntoggle() {
    for(let i=0;i<ctrls.length;i++) {
      //bgcolor_pointer = bgStyle;
      //color_pointer = COLORS_CK;
      //hlight_pointer = hlightStyle;
      if (sync_type == i) {
        ctrls[i].style.backgroundColor = hlight_pointer;
        ctrls[i].style.color = bgcolor_pointer;
      } else {
        ctrls[i].style.backgroundColor = bgcolor_pointer;
        ctrls[i].style.color = hlight_pointer;
      }
    }
  }

  function synctrls() {
    if (canvas.hidden) syntoggle();
    if (funcInterval) stopActionInterval();
    switch(sync_type) {
      case 0: break;
      case 1: break;
      case 2: break;
      case 3: break;
      case 4: startRestoreInterval(); break;
      case 5: startRestoreFromServerInterval(); break;
    }
    //return;
    removeDiv();
    canvas.hidden = false;
    _repaint();

  }
  
  function createBtnVolume(elmid) {
  
    let div = document.createElement('div');
    div.id = 'btns';
    document.body.appendChild(div);
  
    /*
    let div; 
    if (elmid == null) {
      div = document.createElement('div');
      div.id = 'btns';
      document.body.appendChild(div);
    } else {
      div = document.getElementById(elmid);
      div.innerHTML = "";
    }
    */
  
    for (var i=1;i<=66;i++) {
  
      if (i == 6) div.insertAdjacentHTML('beforeend',  '<br/><br/>');
      if (i == 18) div.insertAdjacentHTML('beforeend', '<br/><br/>');
      if (i == 23) div.insertAdjacentHTML('beforeend', '<br/><br/>');
      if (i == 28) div.insertAdjacentHTML('beforeend', '<br/><br/>');
      if (i == 40) div.insertAdjacentHTML('beforeend', '<br/><br/>');
      if (i == 45) div.insertAdjacentHTML('beforeend', '<br/><br/>');
      if (i == 54) div.insertAdjacentHTML('beforeend', '<br/><br/>');
      if (i == 58) div.insertAdjacentHTML('beforeend', '<br/><br/>');
  
      var button = _newBtn(); //_createVolume(i);
      button.innerHTML = SONGS[i][0][0];
      button.id = 'vol ' + i;
      button.onclick = function() {
        let idx = parseInt(this.id.substr(4, this.id.length - 4), 10);
        subtitles = SONGS[idx];
        song = idx;
        phase = 0;
        line = 0;
        removeDiv();
        createBtnChapter();
        return false;
      };
      if (i > 39) 
        button.style.color = color_pointer[3];//'rgb(0,255,0)'; // setting the color to white
      
        div.appendChild(button);
  
      if (i == 39) 
        div.insertAdjacentHTML('beforeend', '<br/>');
    }
  
  }
  
  function createBtnChapter() {
  
    var div = document.createElement('div');
    div.id = 'btns';
    document.body.appendChild(div);
  
    var len = subtitles.length;
    for (var i=1;i<=len-1;i++) {
      let button = _newBtn();//document.createElement('button');
      button.innerHTML = '第'+ i +'章';
      button.id = 'chp ' + i;
      button.onclick = function() {
        let idx = parseInt(this.id.substr(4, this.id.length - 4), 10);
        phase = idx;
        line = 0;
        removeDiv();
        createBtnVerse();
        return false;
      };
      div.appendChild(button);
    }
  
  }
  
  function createBtnVerse() {
  
    var div = document.createElement('div');
    div.id = 'btns';
    document.body.appendChild(div);
  
    var len = subtitles[phase].length;
    for (var i=1;i<=len-1;i++) {
      let button = _newBtn();//document.createElement('button');
      button.innerHTML = '第'+ i +'節';
      button.id = 'ver ' + i;
      button.onclick = function() {
        let idx = parseInt(this.id.substr(4, this.id.length - 4), 10);
        line = idx;
        removeDiv();
        canvas.hidden = false;
        _repaint();
        return false;
      };
      div.appendChild(button);
    }
  
  }
  
  function removeDiv() {
    var buttons = document.getElementById('btns');
    if (buttons) {
      document.body.removeChild(buttons);
    }
    var txt = document.getElementById('chapter');
    if (txt) {
      document.body.removeChild(txt);
    }

    var ctrl = document.getElementById('ctrl');
    if (ctrl) document.body.removeChild(ctrl);

    return;
  }
  
  function openSelection(type) {
  
    removeDiv();
  
    document.body.style.backgroundColor = bgcolor_pointer;
  
    canvas.hidden = true;
    switch(type) {
      case 0:
        createBtnVolume();
        break;
      case 1:
        if (song == 0) {
          canvas.hidden = false;
          return;
        }
        createBtnChapter();
        break;
      case 2:
        if (song == 0 || phase == 0) {
          canvas.hidden = false;
          return;
        }
        createBtnVerse();
        break;
    }
  }
  
  function prepareImage() {
    img = new Image();
    img.src = imgurl;
    img.onload = function() {};
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
    if (doblank != 1 && phase >= 1) {
        ctx.fillStyle = hlight_pointer;
        ctx.fillRect (0, yy, canvas.width, hh);
    }
  }
  
  function getTxtArray(txt, wRatio) {
    let substrings = [];
    let idx = 0;
    let mwidth = canvas.width * wRatio - fontsize/2;
    do {
        if (ctx.measureText(txt).width > mwidth) {
          let ratio = mwidth/ctx.measureText(txt).width;
          ratio = Math.ceil(txt.length * ratio) - 1; //字數
          let txt_0 = txt.substr(0, ratio);
          txt = txt.substr(ratio, txt.length - txt_0.length);
          substrings[idx] = txt_0;
          idx++;
          if (idx > 20) break;
        } else {
          substrings[idx] = txt;
          break;
        }
      } while(true);
      
    return substrings;
  }

  /*
  function isEnglishCharacter(char) {
    return !!char.match(/[A-Za-z]/);
  }
  */

  function isEnglishCharacter(char) {
    return /^[A-Za-z]$/.test(char);
  }

  function islastChar(str) {
    return isEnglishCharacter(str[str.length - 1]);
  }

  function is0Char(str) {
    return isEnglishCharacter(str[0]);
  }
  
  function blankend_update(elapse) {
  
    render(-1);
  
    ctx.fillStyle = 'rgba(0,128,0,' + (1.0 - animElapse/animTotal) + ')';//bgcolor_pointer;//'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    if (animElapse < animTotal) {
      animElapse++;
      window.requestAnimationFrame(blankend_update);
    } else {
      animElapse = 0;
      _repaint();
    }
  
  }
  
  function blank_update(elapse) {
  
    render(-1);
  
    ctx.fillStyle = 'rgba(0,128,0,' + (animElapse/animTotal) + ')';//bgcolor_pointer;//'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    if (animElapse < animTotal) {
      animElapse++;
      window.requestAnimationFrame(blank_update);
    } else {
      doblank = 1;
      animElapse = 0;
      _repaint();
    }
  
  }
  
  var display_mode = 0;
  const animTotal = 30;
  var animElapse = -1; //var savePre = 0;
  function verse_update(elapse) {
  

    //render(animElapse/animTotal);
    
    switch(display_mode) {
      case 0:
          render(animElapse/animTotal);
          break;
      case 1:
          render_vertical(animElapse/animTotal);
          break;
    }
    

    if (animElapse < animTotal) {
      animElapse++;
      window.requestAnimationFrame(verse_update);
    } else {
      animElapse = -1;
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
    let obj = queue[queue.length -1];
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
        printMain(phase, line, false); 
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
    for (let i = 0;i<queue.length;i++) {
      let obj = queue[i];
      obj.setLevel(1);
      if (obj.chapter == phase && obj.verse == line) {
        obj.setLevel(0);
        sel = i;
        //if (color_selection < 1 && i >= 2) queue[i-2].setLevel(2);
      }
    }
  
    if (color_selection <= 1) {
      for (let _sel = 2;;_sel++)
        if (sel >= _sel) queue[sel - _sel].setLevel(_sel);
        else break;
      for (let _sel = 2;;_sel++)
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
      if (display_mode == 0) animElapse = 0;
      window.requestAnimationFrame(verse_update);
    } else {
      render(-1);
      /*
      if (display_mode == 0) 
        render(-1);        
      else {
        animElapse = 0;
        window.requestAnimationFrame(verse_update);
      }
      */
    }
    
  }
  
  function render(progress) {
    _layer0();
    _render(progress);
    _layerui();
  }
  
  var queue = [];
  
  function _render(progress) {
    
    //let x = canvas.width * 0.1;
  
    let fixy = //color_selection == 0?canvas.height * 0.6:canvas.height * 0.33;
               canvas.height * 0.33;
    let offY = fixy;
  
    
    if (progress <= 0)/////
    for (let i = 0;i<queue.length;i++) {
      let obj = queue[i];
      if (obj.chapter == phase && obj.verse == line) {
  
        obj.setTargetTransY(offY);
        offY += obj.preDraw(-2);
        offY += fontsize_sml_sml/2.0;
  
        if (offY > canvas.height) { //經文超出高度 往上移
          let _gap = offY - canvas.height;
          fixy -= _gap;
          offY -= _gap;
          obj.setTargetTransY(fixy);
        }
        
        for (let k = i + 1;k<queue.length;k++) {
          let o = queue[k];
          o.setTargetTransY(offY);
          offY += o.preDraw(-2);
        }

        offY = fixy;
        for (let k = i - 1;k >= 0;k--) {
          let o = queue[k];
          offY -= o.preDraw(-2);
          o.setTargetTransY(offY);
        }
        
        break;
      }
      
    }
    /////
  
    for (let i = 0;i<queue.length;i++) {
      let obj = queue[i];
      if (obj.chapter == phase && obj.verse == line) {
        
        //obj.preDraw(progress);
        //obj.draw();

        switch(display_mode) {
          case 0:
              obj.preDraw(progress);
              obj.draw();
              break;
          case 1:
              //render_vertical(progress);//animElapse.toFixed(2)/animTotal.toFixed(2));
              if (v_vertical.volume != obj.volume || v_vertical.chapter != obj.chapter || v_vertical.verse != obj.verse) {
                  v_vertical.initial(obj.volume, obj.chapter, obj.verse);
              }
  
              //console.log(v_vertical.chapter +', '+ v_vertical.verse);
              
              v_vertical.draw(progress);
              return;
          }
        
        for (let k = i + 1;k<queue.length;k++) {
          let o = queue[k];
          //o.transY = offY;
          o.preDraw(progress);
          if (o.transY > canvas.height) continue;
          o.draw();
        }
        
        //offY = fixy; 
        for (let k = i - 1;k >= 0;k--) {
          let o = queue[k];
          o.preDraw(progress);
          o.draw();
          //offY = o.transY;
          if (o.transY < 0) break;
        }
        
        break;
      }
      
    }
  
    if (color_selection > 0 && color_selection != 4) { //print saved versus
      ctx.textBaseline = 'top';
      let fs = Math.min(fontsize_sml_sml, 24);
      ctx.fillStyle = bgcolor_pointer;//'rgb(0, 200, 0)';
      ctx.fillRect(0, 0, canvas.width, fs * 2);
      ctx.fillStyle = color_pointer[2];//'rgb(0, 200, 0)';
  
      if (color_selection > 1) 
        ctx.fillStyle = 'rgba(155, 155, 155, 0.66)';
      ctx.font = (fs * 1.2) + 'px Arial';
      ctx.fillText(subtitles[0][0], 10, 2);
      let gap = ctx.measureText(subtitles[0][0]).width + 20;
      ctx.font = (fs-4) + 'px Arial';

      //if (color_selection != 4) 
      for (let idx = 1;idx <= presetVerse.length;idx++) {
        if (presetVerse[idx%10][0].length == 0)
          continue;
        let xx = gap + (idx-1) * (canvas.width - gap)/presetVerse.length;
        ctx.fillText('['+(idx%10)+']'+presetVerse[idx%10][0], xx, 2);
        ctx.fillText('   '+presetVerse[idx%10][1]+':'+presetVerse[idx%10][2], xx, fs-1);
      }
  
      if (recognition && recognizing) {
        ctx.fillStyle = color_pointer[0];
        ctx.fillRect(0, 0, canvas.width, fs * 2);
      }

      ctx.fillStyle = color_pointer[2];
      ctx.textAlign = "right";
      ctx.fillText(recogResult, canvas.width, 2); 
      ctx.textAlign = "left";
    }
  
    if (sync_type == 4 || sync_type == 5) { //if (funcInterval) {
      ctx.fillStyle = color_pointer[2];
      let _r = 4;//fontsize_sml_sml/5;
      ctx.fillRect(0, 0, _r * 2, fontsize_sml_sml);
    }
  
    /*
    if (intervalType != 0) {
      ctx.fillStyle = color_pointer[2];
      let _r = fontsize_sml_sml/4;
      if (intervalType == 1) {
        ctx.beginPath();
        ctx.arc(canvas.width - _r, _r, _r, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
      } else { //intervalType == -1
        ctx.fillRect(canvas.width - _r * 2, 0, _r * 2, _r * 2);
      }
    }
    */
  
    ctx.textBaseline = 'alphabetic';
  
  }
  
  function printMain(chapter, verse, doanim) {
  
    queue.length = 0;
    queue = [];
  
    let i = chapter;
    let j = verse;
  
    let amount = color_selection <= 0? MAX_VERSES_GREEN : MAX_VERSES_NORMAL;
  
    for (let k = 1;k<=amount;k++) {
  
        let _i = getPreChapter(i, j);
        j = getPreVerse(i, j);
        i = _i;
  
        let obj = new Verseobj();
        if (color_selection <= 1) {
          obj.initial(song, i, j, k);
        } else {
          obj.initial(song, i, j, 1);
        }
  
        queue.unshift(obj);
    }
  
    let obj = new Verseobj();
    obj.initial(song, chapter, verse, 0);
    queue.push(obj);
  
    i = chapter;
    j = verse;
    for (let k = 1;k <= amount;k++) {
        let _i = getNextChapter(i, j);
        j = getNextVerse(i, j);
        i = _i;
  
        let obj = new Verseobj();
        if (color_selection <= 1) {
          obj.initial(song, i, j, k);
        } else {
          obj.initial(song, i, j, 1);
        }
  
        queue.push(obj);   
    }

    if (doanim) {
      window.requestAnimationFrame(verse_update);
    } else {
      _render(-1);
    } 
  
  }
  
  var fontColorType = 1;

  function _drawSdwtxt(txt, x, y) {
  
    if (doblank == 1 && color_selection == 1) {
      ctx.fillStyle = 'rgb(0, 220, 0)';//color_pointer[3];
      ctx.lineWidth = 1;
      ctx.fillText(txt, x, y);
      return;
    }

    switch (fontColorType) {
      case 0://白字黑邊
        ctx.fillStyle = 'rgb(255,255,255)';//'rgba(255,255,255,' + opa + ')';//'white';
        break;
      case 1://白字
        ctx.fillStyle = 'rgb(255,255,255)';//'rgba(255,255,255,' + opa + ')';
        ctx.strokeStyle = 'rgb(0,0,0)';//'rgba(0,0,0,' + opa + ')';
        ctx.lineWidth = Math.ceil(fontsize/12.0);
        ctx.strokeText(txt, x, y);
        break;
      case 2://黑字
        ctx.fillStyle = 'rgb(0,0,0)';//'rgba(0,0,0,' + opa + ')';
        break;
      case 3://黑字白邊
        ctx.fillStyle = 'rgb(0,0,0)';//'rgba(0,0,0,' + opa + ')';
        ctx.strokeStyle = 'rgba(255,255,255)';//'rgba(255,255,255,' + opa + ')';
        ctx.lineWidth = Math.ceil(fontsize/12.0);
        ctx.strokeText(txt, x, y);
        break;
    }

    /*
    if (doblank == 0) {
      //ctx.strokeStyle = txt_stroke;//'black';//'rgb(0, 0, 0, ' + a + ')';
      ctx.lineWidth = Math.ceil(fontsize/10.0);
      ctx.strokeText(txt, x, y);
    }
    */
  
    //ctx.fillStyle = txt_fill + 1.0 + ')';//'white';//'rgb(255, 255, 255, ' + a + ')';
    ctx.lineWidth = 1;
    ctx.fillText(txt, x, y);
  
  }
  
  function _drawtxt(txt, x, y, a) {
      
    if (doblank == 1 && color_selection == 1) {
      ctx.fillStyle = 'rgb(0, 200, 0)';//color_pointer[2];//'rgb(0, 200, 0)';
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

    ctx.lineWidth = 1;
    ctx.fillText(txt, x, y);
  
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
  
    if (song >= start && song <= end) {
      song += 1;
      if (song > end) 
        song = start;
    } else {
      song = start;   
    }
    subtitles = SONGS[song];
    phase = 0;
    line = 0;
  }
  
  function combineKey(e) {
    var jump = 10;
    switch (e.keyCode) {
        case 33: { //'ArrowLeft'
          helpSwitch = 0;
          let _phase = getPreChapter(phase, line);
          let _line = getPreVerse(phase, line);
          phase = _phase;
          line = _line;
          _repaint();
          return;
          /*
          if (_phase >= 0 && (phase != _phase || line != _line)) {
            phase = _phase;
            line = _line;
            if (mode == 0 && queue.length > 0) {
              operateQuene(2, 0);
            }
          }
          */
        }
          break;
        case 34:{ //'ArrowRight'
          helpSwitch = 0;
          let _phase = getNextChapter(phase, line);
          let _line = getNextVerse(phase, line);
          phase = _phase;
          line  = _line;
          _repaint();
          return;
          /*
          if (_phase >=0 && (phase != _phase || line != _line)) {
            phase = _phase;
            line  = _line;
            if (mode == 0 && queue.length > 0) {
              operateQuene(1, 0);
            }
          }
          */

        }
          break;
        case 65: sortjump( 1,  5); break;
        case 83: sortjump( 6, 17); break;
        case 68: sortjump(18, 22); break;
        case 70: sortjump(23, 27); break;
        case 71: sortjump(28, 39); break;
        
        case 90: sortjump(40, 44); break;
        case 88: sortjump(45, 53); break;
        case 67: sortjump(54, 57); break;
        case 86: sortjump(58, 66); break;
  
        case 8:
          phase = 0;
          line = 0;
          break;
        case 48:    case 49:  case 50:  case 51:  case 52:  case 53:  case 54:  case 55:  case 56:  case 57:
        //case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
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
        
        case 38: //'ArrowUp'
            if (canvas.hidden) break;
            if (phase >= jump) {
              phase = phase - jump;
            } else {
              phase = 0;
            }
            line = 0;
            break; 
        case 40: //'ArrowDown':
            if (canvas.hidden) break;
            if (phase == subtitles.length - 1) break;
            if (phase + jump < subtitles.length) {
              phase = phase + jump;
              line = 0;
            } else {
              phase = subtitles.length - 1;
              line = 0;
            }
            break;
        case 37: //'ArrowLeft'
            line -= jump;
            if (line < 0) 
                line = 0;
          
            break; 
        case 39:  //'ArrowRight'
            line += jump;
            if (line > subtitles[phase].length -1) 
                line = subtitles[phase].length -1; 
            break;
        case 32:
            history.back();
            return;
        case 189: //'-'
            helpSwitch = 0;
            downsizeFS();
            break;
        case 187: //'='
            helpSwitch = 0;
            enlargeFS();
            break;
        default:
          break;
    }
    
    saveAction2Local();
  
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
        content = '['+subtitles[0][0] + ' ' + phase + ':' + line + '] ' + content;
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
    jump2preset4Anim(ps);
    return;
    if (display_mode == 0) {
      jump2preset4Anim(ps);
    } else {
      for (var i = 1;i<SONGS.length;i++) {
        if (ps[0] == SONGS[i][0][0]) {
            song = i;
            subtitles = SONGS[i];//presetVerse[value][0]
            phase = ps[1];
            line =  ps[2];
            break;
        }
      }
      saveAction2Local();
      _repaint();
    }
  }

  function _targetAnim() {
    let step = 1;
    if (song != t_song) {
      //song = ;//Math.ceil(song + (t_song - song) * 0.25);
      if (Math.abs(t_song - song) >= 10) step = 10;
      if (song > t_song) { 
        song -= step;
      } else { 
        song += step;
      }
      subtitles = SONGS[song];
      //console.log('s:' + song + ', ' + phase + ', '+ line);
      _repaint();
      window.requestAnimationFrame(_targetAnim);
      return;
    }

    if (phase != t_phase) {
      if (Math.abs(t_phase - phase) >= 10) step = 10;
      if (phase > t_phase) 
        phase -= step;
      else 
        phase += step;
      //console.log('p:' + song + ', ' + phase + ', '+ line);
      _repaint();
      window.requestAnimationFrame(_targetAnim);
      return;
    } 
    
    if (line != t_line) {
      if (Math.abs(t_line - line) >= 10) step = 10;
      if (line > t_line) 
          line -= step;
        else 
          line += step;
      //console.log('l:' + song + ', ' + phase + ', '+ line);
      _repaint();
      window.requestAnimationFrame(_targetAnim);
      return;
    }
    
    saveAction2Local();
    _repaint();
  }

  var t_song = 0;
  var t_phase = 0;
  var t_line = 0;

  function jump2preset4Anim(ps) {
    for (var i = 1;i<SONGS.length;i++) {
      if (ps[0] == SONGS[i][0][0]) {
          t_song = i;
          //subtitles = SONGS[i];//presetVerse[value][0]
          t_phase = ps[1];
          t_line =  ps[2];
          break;
      }
    }

    if (song != t_song) {
      phase = 0;
      line =  0;
    } else { //song == t_song
      if (phase != t_phase) 
        line = 0;
    }

    window.requestAnimationFrame(_targetAnim);
        
  }
  
  function colorSwitch() {
    switch(color_selection) {  
      case 2:
        bgcolor_pointer = bgStyle_black;
        color_pointer = COLORS_black;
        hlight_pointer = hlightStyle_black;
        break;
      case 3:
        bgcolor_pointer = bgStyle_white;
        color_pointer = COLORS_white;
        hlight_pointer = hlightStyle_white;
        break;
      case 4:
        bgcolor_pointer = bgStyle_blue;
        color_pointer = COLORS_blue;
        hlight_pointer = hlightStyle_blue;
        break;
      case 0:
        bgcolor_pointer = 'rgba(0,0,0,0)';
        color_pointer = 'rgba(0,0,0,0)';
        hlight_pointer = 'rgba(0, 0, 0, 0.5)';//hlightStyle;
        break;
      default: //0, 1
        bgcolor_pointer = bgStyle;
        color_pointer = COLORS_CK;
        hlight_pointer = hlightStyle;
        break;
    }

  }
  
  function keyboard(e) { //key up //alert(e.keyCode);
  
      if (e.keyCode == 16) { //} || e.keyCode == 17) { //key up release lock
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
  
      //if (keylock == 2 && e.keyCode == 67) if (!canvas.hidden) copyToClickBoard();
            
      switch (e.keyCode) {
        case 78:
          switchLang();
          break;
        //case 27: //'escape'
        //  document.parentElement.focus();
        //  break;
        /*
        case 114: //F3
          if (funcInterval) {
            stopActionInterval();
            break;
          }
          startRestoreFromServerInterval();
          break;
        */
        //case 113: //F2
        case 13: //enter
          createCtrlBtn();
          break;
        //case 114: save2Local(); break; case 115: restoreLocal(); break;
        case 67: //'c'
          fontColorType = (fontColorType + 1)%4; 
          break;
        case 66: //'b'
          //console.log('b press');
          if (color_selection == 1) {
            animElapse = 0;
            if (doblank == 0) {
              target_doblank = 1;
              saveAction2Local();
              window.requestAnimationFrame(blank_update);
            } else {
              doblank = 0;
              target_doblank = 0;
              saveAction2Local();
              window.requestAnimationFrame(blankend_update);
            }
            return;
          }
          doblank = doblank == 0?1:0;
          target_doblank = doblank;
          break;
        case 88: // 'x' copy
          copyToClickBoard(); 
          break; 
        case 77: //'M' ppt mode
            helpSwitch = 0;
            if (canvas.hidden) {
                removeDiv();  
                canvas.hidden = false;
                mode = 0;
                break;
            }
            if (song == 0 || phase == 0) break;
            mode = mode == 0?1:0;
            if (mode == 1) {
              removeDiv();
              canvas.hidden = true;
              plaintxtMode();
            }
          break;
        case 76: //l
          openCtrl();
          break;
        /*
        case 75://'K'
        case 74://'J'
        */
        case 65: //a
            /*
            helpSwitch = 0;
            if (canvas.hidden) break;
            color_selection = (color_selection + 1) % 5;
            colorSwitch();
            */

            helpSwitch = 0;

            if (color_selection == 0 && display_mode == 0) {
              display_mode = 1;
              break;
            }

            if (color_selection == 1 && display_mode == 0) {
              display_mode = 1;
              break;
            }
            if (display_mode == 1) {
              display_mode = 0;
            }

            color_selection = (color_selection + 1) % 5;
            colorSwitch();

      

            break;
        case 72: //'H'
            if (canvas.hidden) {
                removeDiv();  
                canvas.hidden = false;
                jumpTo1();
            }
            helpSwitch = helpSwitch == 0?1:0;
            break; 
        case 38: //'ArrowUp'
            if (canvas.hidden) break;
            helpSwitch = 0;
            if (phase > 0) 
              phase--; 
            else  
              phase = 0;
            line = 0;
            break; 
        case 40: //'ArrowDown':
            if (canvas.hidden) break;
            helpSwitch = 0;
            if (phase == subtitles.length - 1) break;
            phase++;
            line = 0;
            break;
            //////
        case 33: //'page up'
        case 37: { //'ArrowLeft'
            
            helpSwitch = 0;
            let _phase = getPreChapter(phase, line);
            let _line = getPreVerse(phase, line);
            if (_phase >= 0 && (phase != _phase || line != _line)) {
              phase = _phase;
              line = _line;
              if (mode == 0 && queue.length > 0) {
                operateQuene(2, e.keyCode == 37?1:0);
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
        case 34: //'page down' 
        case 39: { //'ArrowRight'
            helpSwitch = 0;
            let _phase = getNextChapter(phase, line);
            let _line = getNextVerse(phase, line);
            
            if (_phase >=0 && (phase != _phase || line != _line)) {
              phase = _phase;
              line  = _line;
              if (mode == 0 && queue.length > 0) {
                operateQuene(1, e.keyCode == 39?1:0);
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
        
        case 189: //'-'
            helpSwitch = 0;
            if (canvas.hidden) break;
            if (song > 1) 
              song = song - 1;
            else 
              song = SONGS.length -1;
            subtitles = SONGS[song];
            phase = 0;
            line = 0;
            
            break;
          case 187: //'='
            helpSwitch = 0;
            if (canvas.hidden) break;
            if (song < SONGS.length -1) 
              song = song + 1;
            else 
              song = 1;
              
            subtitles = SONGS[song];
            phase = 0;
            line = 0;

            break;
          /*
          case 48:
              song = 0;
              subtitles = SONGS[song];
              phase = 0;
              line = 0;
            break;
          */
          case 48:    case 49:  case 50:  case 51:  case 52:  case 53:  case 54:  case 55:  case 56:  case 57:
          //case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
            var value = e.keyCode - 48;
            if (value > presetVerse.length -1) break;
            if (presetVerse[value][0].length == 0) break;
            jump2preset(presetVerse[value]);
            if (mode == 1) {
              removeDiv();
              canvas.hidden = true;
              plaintxtMode();
            }
            return;
          case 81: 
            presetVerse[1][0] = subtitles[0][0];
            presetVerse[1][1] = phase;
            presetVerse[1][2] = line;
            break;//Q
          case 87: 
            presetVerse[2][0] = subtitles[0][0];
            presetVerse[2][1] = phase;
            presetVerse[2][2] = line;
            break;//W
          case 69:
            presetVerse[3][0] = subtitles[0][0];
            presetVerse[3][1] = phase;
            presetVerse[3][2] = line;
            break;//E
          case 82: 
            presetVerse[4][0] = subtitles[0][0];
            presetVerse[4][1] = phase;
            presetVerse[4][2] = line;
            break;//R
          case 84: 
            presetVerse[5][0] = subtitles[0][0];
            presetVerse[5][1] = phase;
            presetVerse[5][2] = line;
            break;//T
          case 89: 
            presetVerse[6][0] = subtitles[0][0];
            presetVerse[6][1] = phase;
            presetVerse[6][2] = line;
            break;//Y
          case 85: 
            presetVerse[7][0] = subtitles[0][0];
            presetVerse[7][1] = phase;
            presetVerse[7][2] = line;
            break;//U
          case 73: 
            presetVerse[8][0] = subtitles[0][0];
            presetVerse[8][1] = phase;
            presetVerse[8][2] = line;
            break;//I
          case 79: 
            presetVerse[9][0] = subtitles[0][0];
            presetVerse[9][1] = phase;
            presetVerse[9][2] = line;
            break;//O
          case 80: //'p' ppt mode
            presetVerse[0][0] = subtitles[0][0];
            presetVerse[0][1] = phase;
            presetVerse[0][2] = line;
            break; 
          //case 32: canvas.requestFullscreen(); break;
          case 13: //'enter'
            
            break;
          case 27: //'escape'
            jumpTo1();
            mode = 0;
            removeDiv();
            canvas.hidden = false;
            doblank = 0;
            helpSwitch = 0;
            uisel = 0;
            break;
          default:
            break;
      }
  
      saveAction2Local();
  
      _repaint();
  
  }
  
  function openSelDiv() {
    helpSwitch = 0;
    if (canvas.hidden) {
      removeDiv();  
      canvas.hidden = false;
      mode = 0;
      jumpTo1();
    } else {
      openSelection(0);
    }
    _repaint();
  }
  
  function _layer0() {

    //console.log('mode : ' + color_selection);
    /*
    if (color_selection == 4) {
      //ctx.fillStyle = 'rgb(255,0,0)';//'green';
      //ctx.fillRect(0, 0, canvas.width, canvas.height); 
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = bgcolor_pointer;//'green';
      ctx.fillRect(0, 0, canvas.width, canvas.height); 
    }
    */

    ctx.clearRect(0, 0, canvas.width, canvas.height);
   
    if (color_selection == 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = bgcolor_pointer;//'green';
      ctx.fillRect(0, 0, canvas.width, canvas.height); 
    }
   

    if (img) {
        ctx.drawImage(img,0,0, canvas.width, canvas.height);
    }

    _layerBg();

  }
  
  function _phoneUi() {
    /*
    ctx.lineWidth = 2;
    ctx.strokeStyle = color_pointer[2];
    ctx.beginPath();
      ctx.moveTo(canvas.width * 0.33, canvas.height/6.0);
      ctx.lineTo(canvas.width * 0.66, canvas.height/6.0);
      ctx.stroke();
    ctx.closePath();
    */
   
    ctx.fillStyle = bgcolor_pointer;//'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx.textAlign = "center";
  
    ui_rectFill(0,                   0, canvas.width * 0.33, canvas.height * 0.25, '字小');
    ui_rectFill(canvas.width * 0.33, 0, canvas.width * 0.33, canvas.height * 0.25, '換顏色');
    ui_rectFill(canvas.width * 0.66, 0, canvas.width * 0.33, canvas.height * 0.25, '字大');
  
    ui_rectFill(0,                   canvas.height * 0.25, canvas.width * 0.33, canvas.height * 0.25, '上一卷');
    //ui_rectFill(canvas.width * 0.33, canvas.height * 0.25, canvas.width * 0.33, canvas.height * 0.25, '選經文');
    ui_rectFill(canvas.width * 0.66, canvas.height * 0.25, canvas.width * 0.33, canvas.height * 0.25, '下一卷');
  
    ui_rectFill(canvas.width * 0.33, canvas.height * 0.5,  canvas.width * 0.33, canvas.height * 0.25, '上一章');
    ui_rectFill(canvas.width * 0.33, canvas.height * 0.75, canvas.width * 0.33, canvas.height * 0.25, '下一章');
    
  
    ui_rectFill(0,                   canvas.height * 0.5, canvas.width * 0.33, canvas.height * 0.5, '上一節');
    ui_rectFill(canvas.width * 0.66, canvas.height * 0.5, canvas.width * 0.33, canvas.height * 0.5, '下一節');

      
    ui_rectFill(canvas.width * 0, 0, canvas.width/3, canvas.height, '滑動卷', 'rgba(255, 0,0,0.5)', 'rgba(255, 0,0, 1.0)');
    ui_rectFill(canvas.width * 1.0/3.0, 0, canvas.width/3, canvas.height, '滑動章', 'rgba(255, 0,0,0.5)', 'rgba(255, 0,0, 1.0)');
    ui_rectFill(canvas.width * 2.0/3.0, 0, canvas.width/3, canvas.height, '滑動節', 'rgba(255, 0,0,0.5)', 'rgba(255, 0,0, 1.0)');

    ctx.textAlign = "left";
  }
  
  function ui_rectFill(x, y, w, h, des, c2, c0) {
    ctx.fillStyle = c2?c2:color_pointer[2];
    ctx.fillRect(x + w * 0.05, y + h * 0.05, w * 0.9, h * 0.9);
    ctx.fillStyle = c0?c0:color_pointer[0];
    ctx.font = fontsize_sml + 'px '+fontFamily;
    ctx.fillText(des, x + w/2, y + h/2);
    //ctx.strokeStyle = color_pointer[3];
    //ctx.strokeRect(x, y, w, h);
  }

  function ui_rectFill2(x, y, w, h, des, c2, c0) {
    ctx.fillStyle = c2?c2:color_pointer[2];
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = c0?c0:color_pointer[0];
    ctx.font = fontsize_sml_sml + 'px '+fontFamily;
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
    ctx.fillStyle = bgcolor_pointer;//'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.font = FONT;
    let x = fontsize_sml;
    let y = canvas.height - fontsize_sml;
    ctx.font = fontsize_sml + 'px Arial';
    ctx.textBaseline = 'top';//'bottom';
    for (let i=uisel_start;i<=uisel_end;i++) {
      ctx.fillStyle = color_pointer[(i == song?3:2)];
      if (i == song) {
        ctx.strokeStyle = color_pointer[2];
        ctx.lineWidth = Math.ceil(fontsize/8.0);
        ctx.strokeText(SONGS[i][0][0], x - (i == song?fontsize_sml/2:0) , y);      
      }
      ctx.fillText(SONGS[i][0][0], x - (i == song?fontsize_sml/2:0) , y);
      y -= fontsize_sml * 1.5;
      if (y < fontsize_sml) {
        x += canvas.width/4;
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
    
    ui_block(0, 0, canvas.width/3, canvas.height/4, 0.33);
    ui_block(canvas.width/3, 0, canvas.width/3, canvas.height/4, 0.20);
    ui_block(canvas.width * 2/3, 0, canvas.width/3, canvas.height/4, 0.33);

    ui_block(0, canvas.height/4, canvas.width/3, canvas.height/4, 0.20);
    ui_block(canvas.width * 2/3, canvas.height/4, canvas.width/3, canvas.height/4, 0.20);

    ui_block(0, canvas.height/2, canvas.width/3, canvas.height/2, 0.33);
    ui_block(canvas.width * 2/3, canvas.height/2, canvas.width/3, canvas.height/2, 0.33);
    ui_block(canvas.width/3, canvas.height/2, canvas.width/3, canvas.height/4, 0.20);



  }
  
  function _repaint() {
    //ctx.globalCompositeOperation='difference';
    //ctx.filter = 'invert(1)';
    _layer0();
    //_layerBg();
    printMain(phase, line);//_layer1();//_layer2();
    _layerui();
  }

  function __repaint() {
    //ctx.globalCompositeOperation='difference';
    //ctx.filter = 'invert(1)';
    _layer0();
    //_layerBg();
    printMain(phase, line, true);//_layer1();//_layer2();
    _layerui();
  }


  function userhelp() {
    
    //let helps = getSong('help');
    //console.log(bgcolor_pointer);

    ctx.fillStyle = bgcolor_pointer;//'green'; //"rgb(0,0,255)"//ctx.fillRect(0, 0, c.width, c.height);
    //ctx.clearRect(0, 0, canvas.width/2, canvas.height/2);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx.font = fontsize_sml + "px Arial";
    ctx.textAlign = "left";
  
    let gap = canvas.height/(content_help[0].length + 1);
    for (let i=0;i<content_help[0].length;i++) {
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
    _openWin = window.open("subtitle_b_ctrl.html", "", "popup=no,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=400,top="+(screen.height-400)+",left="+(screen.width-840));
  }
  
  function closeCtrl() {
    if (_openWin) 
      _openWin.close();
    _openWin = null;
  }
  
  //canvas init
  init();
  
  /*
    color : (color_selection)
    fontfactor : (fontfactor)
    saved : (presetVerse)
    syncType : sync_type
   */
  // message 事件
  function receiveMessage(e) {
    if (e.data == 'x') { //alert(e.data);
      setMsg_X();
    } else if (e.data == 'o') { //alert(e.data);
      setMsg_O();
    } else {

      const jsonData = JSON.parse(e.data);
    
      if (jsonData.color) {
        color_selection = jsonData.color;
        colorSwitch();
      }
      if (jsonData.fontfactor) 
        setFontFactor(jsonData.fontfactor);
      if (jsonData.syncType) {
        sync_type = jsonData.syncType;
        synctrls();
      }

      if (jsonData.saved && jsonData.saved.length > 0) {
        for (let i=0;i<jsonData.saved.length;i++) {
          if (i >= 10) return;
          presetVerse[i] = jsonData.saved[i];
        }
        keyboard({keyCode : 49});
      }
    
    }
    _repaint();
  }

  window.addEventListener('message', receiveMessage, false);
  
  /*
   * 鍵盤相關... START
   */
  var keylock = 0;
  function keyupAction(e) {
    //e.preventDefault();
    //e.stopPropagation();
    if (e.keyCode == 16) {
      saveAction2Local();
    }

    if (recognition && recognizing) {
        recognition.stop();
    }
    keyboard(e);
  }
  
  window.addEventListener('keyup', keyupAction, false);
  
  function keydownAction(e) {
    
    if (e.keyCode == 16) {// || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 91) {
      keylock = 1;
      _repaint();
      return;
    }
    
    if (e.keyCode == 32) { //space
      if (recognition && !recognizing) {
        recognition.start();
      }
      return;
    }

  }
  
  window.addEventListener('keydown', keydownAction, false);
  //鍵盤相關 ... END
  
  //大小變化
  window.addEventListener('resize', function() {
    init();
    _repaint();
  });

  window.addEventListener('beforeunload', function (e) {
    closeCtrl();
  });

  // 滑鼠滾輪...
  window.addEventListener('wheel',function (event){
    //only vertical scroll
    if (event.deltaY > 4) {
      keyboard({keyCode : 34}); //right
    } else if (event.deltaY < -4) {
      keyboard({keyCode : 33}); //left
    }
  });
  
  let supportTouch = false;
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    // 支持触摸事件
    supportTouch = true;
  }

  /*
   * 手機觸控相關... START
   */  
  function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return { x: touchEvent.touches[0].clientX - rect.left,
             y: touchEvent.touches[0].clientY - rect.top};
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
    if (touchPX < canvas.width/3) 
      colState = 1;
    else if (touchPX < canvas.width * 2/3) 
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

    var touches = {x:evt.changedTouches[0].clientX, 
                   y:evt.changedTouches[0].clientY};//getTouchPos(canvas, evt);
    
    let _gw = Math.floor(touchPX/(canvas.width/3.0));
    let _gh = Math.floor(touchPY/(canvas.height/4.0));
    
    let gw = Math.floor(touches.x/(canvas.width/3.0));
    let gh = Math.floor(touches.y/(canvas.height/4.0));
    
    if (touches.y < fontsize_sml && touchPY < fontsize_sml) {
      helpSwitch = helpSwitch > 0?0:2;
      _repaint();
      return;
    }

    if (_gw != gw || _gh != gh) return;

    //font size decrease
    if (gw == 0 && gh == 0) {
      combineKey({keyCode : 189});
      return;
    }
    //color change
    if (gw == 1 && gh == 0) {
      keyboard({keyCode : 65});
      return;
    }
    //font size increase
    if (gw == 2 && gh == 0) {
      combineKey({keyCode : 187});
      return;
    }
    
    //preious volume
    if (gw == 0 && gh == 1) {
      keyboard({keyCode : 189});
      return;
    }

    /*
    //select volume
    if (gw == 1 && gh == 1) {//keyboard({keyCode : 76});
      openSelDiv();
      return;
    }
    */
    
    //next volume
    if (gw == 2 && gh == 1) {
      keyboard({keyCode : 187});
      return;
    }

    
    //up
    if (gw == 1 && gh == 2) {
      keyboard({keyCode : 38});
      return;
    }
    //down
    if (gw == 1 && gh == 3) { 
      keyboard({keyCode : 40});
      return;
    }

    //left
    if (gw == 0 && (gh == 2 || gh == 3)) {
      keyboard({keyCode : 37});
      return;
    }    
    //right
    if (gw == 2 && (gh == 2 || gh == 3)) {
      keyboard({keyCode : 39});
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
        let gap = _height/66.0;
        let _song = Math.ceil((touch.clientY - canvas.height * tb_ratio)/gap);
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
      switch(colState) {
        //case 1: keyboard({keyCode : 189}); break;
        case 2: keyboard({keyCode : 38});break;
        case 3: keyboard({keyCode : 33}); break;
      }
      touchMoveState = 1;
    } else if (sumOffset <= -touchOffset) {//往下
      sumOffset = 0;
      switch(colState) {
        //case 1: keyboard({keyCode : 187}); break;
        case 2: keyboard({keyCode : 40}); break; 
        case 3: keyboard({keyCode : 34}); break;
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
    
    drawVolume( 1,  5, 'rgba(0, 0, 255, 0.33)', 'rgba(0, 0,255, 1.0)'); 
    drawVolume( 6, 17, 'rgba(0, 0, 255, 0.22)', 'rgba(0, 0,255, 1.0)'); 
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
    let gap = _height/66.0;
    ui_rectFill2(0, canvas.height * tb_ratio + (f-1) * gap, 
                canvas.width/3, gap * (e - f + 1),  
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
  
      var touches = {x:evt.changedTouches[0].clientX, 
                     y:evt.changedTouches[0].clientY};//getTouchPos(canvas, evt);
      
      let gw = Math.floor(touches.x/(canvas.width/3.0));
      let gh = Math.floor(touches.y/(canvas.height/4.0));

      //font size decrease
      if (gw == 0 && gh == 0) {
        downsizeFS();
        _repaint();
        return;
      }
      //color change
      if (gw == 1 && gh == 0) {
        keyboard({keyCode : 65});
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
   * 語音辨識相關... START
   */
  function parseRecogResult() {
  
    console.log('parseRecogResult...' + recogResult);
  
    if (recogResult.length == 0) return;
    let result = [SONGS[song][0][0], 0, 0];
    let RecogResult = recogResult;
  
    RecogResult = RecogResult.replace('創世紀', '創世記');
    RecogResult = RecogResult.replace('列王記', '列王紀');
    RecogResult = RecogResult.replace('生命記', '申命記');
    RecogResult = RecogResult.replace('誌', '志');
    RecogResult = RecogResult.replace('約翰一', '約翰壹');
    RecogResult = RecogResult.replace('約翰二', '約翰貳');
    RecogResult = RecogResult.replace('約翰三', '約翰參');
  
    for (var i = 1;i<SONGS.length;i++) {
      if (RecogResult.startsWith(chineseFullname[i])) {
      //if (RecogResult.startsWith(fullname[i])) {
  
          result[0] = SONGS[i][0][0];
          jump2preset(result);
          _repaint();
          //window.requestAnimationFrame(_repaint);
  
          let cut = chineseFullname[i].length;
          RecogResult = RecogResult.substr(cut, RecogResult.length - cut);
          RecogResult = RecogResult.trim();
          if (RecogResult.length == 0) return;
      }
    }
  
    console.log(RecogResult);
                  
    RecogResult = RecogResult.replaceAll('一', '1');
    RecogResult = RecogResult.replaceAll('二', '2');
    RecogResult = RecogResult.replaceAll('三', '3');
    RecogResult = RecogResult.replaceAll('四', '4');
    RecogResult = RecogResult.replaceAll('五', '5');
    RecogResult = RecogResult.replaceAll('六', '6');
    RecogResult = RecogResult.replaceAll('七', '7');
    RecogResult = RecogResult.replaceAll('八', '8');
    RecogResult = RecogResult.replaceAll('九', '9');
    RecogResult = RecogResult.replaceAll('十', '10');
    RecogResult = RecogResult.replaceAll('篇', ' ');
    RecogResult = RecogResult.replaceAll('章', ' ');
    RecogResult = RecogResult.replaceAll('節', '');
    RecogResult = RecogResult.replaceAll('第', '');
    RecogResult = RecogResult.trim();
          
    console.log(RecogResult);
  
    let array = RecogResult.split(' ');
    if (array.length == 0) return;
    if (array[0].length == 0) return;
    let chapter = parseInt(array[0]);
    if (isNaN(chapter)) return;
    if (chapter < 0 || chapter >= SONGS[song].length) return;
          
    result[1] = chapter;
    jump2preset(result);
    _repaint();
  
    if (array.length == 1) return;
    if (array[1].length == 0) return;
    let verse = parseInt(array[1]);
    if (isNaN(verse)) return;
    if (verse < 0 || verse >= SONGS[song][chapter].length) return;
  
    result[2] = verse;
    jump2preset(result);
    _repaint();
  
    //recogResult = '';
  }
  
  // 檢查瀏覽器是否為 Safari
  function isSafariBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;
  }

  function toObj() {
    let obj = {};
    obj['color'] = color_selection;
    obj['fontfactor'] = fontfactor;
    obj['saved'] = presetVerse;
    obj['syncType'] = sync_type;
    return obj;
  }

  //
  var recogResult = '';
  var recognizing = false;
  var recognition;

  function initRecognition() {

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'cmn-Hant-TW';//'zh-TW';//'en-US';'en-US';'cmn-Hant-TW';
    //recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    if(navigator.userAgent.indexOf("Chrome") != -1 ) {
      var speechRecognitionList = new webkitSpeechGrammarList();
      var grammar = '#JSGF V1.0; grammar volume; public <volume> = ' + fullname.join(' | ') + ' ;';
      speechRecognitionList.addFromString(grammar, 2);
      recognition.grammars = speechRecognitionList;
    }
  
    recognition.onstart = function() {
      recognizing = true;
      console.log('info_speak_now');
      recogResult = '';
      _repaint();
    };
  
    recognition.onerror = function(event) {
  
      recogResult = '';
  
      if (event.error == 'no-speech') {
        console.log('info_no_speech');
      }
      if (event.error == 'audio-capture') {
        console.log('info_no_microphone');
      }
      if (event.error == 'not-allowed') {
        console.log('not-allowed');
      }
    };
  
    recognition.onend = function() {
      parseRecogResult();
      recognizing = false;
      recogResult = '';
      console.log('onend');
      _repaint();
    };
  
    recognition.onresult = function(event) {
      
      if (typeof(event.results) == 'undefined') {
        console.log('onresult undefined');
        recognition.onend = null;
        recognition.stop();
        return;
      }
  
      recogResult = '';
  
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          recogResult += event.results[i][0].transcript;
          console.log('onresult isfinal: ' + recogResult);
          _repaint();
        } else {
          recogResult += event.results[i][0].transcript;
          console.log('onresult not isfinal: ' + recogResult);
          _repaint();
        }
      }
      console.log('onresult: ' + recogResult);
      _repaint();
    };

  }

  if (isSafariBrowser()) {
    console.log('瀏覽器是 Safari');
  } else {
    initRecognition();
  }
  // 語音辨識相關 ... END
  
  //建構整本聖經
  for(let i=1;i<abbr.length;i++) SONGS[i] = getSong(abbr[i]);

  song = 0;
  
  jumpTo1();
  _repaint();

  setMsg_O();

  window.addEventListener("beforeunload", function() {
    _saveAction2Local();
    //obj = {"song": song, "phase": phase, "line" : line};
    //document.cookie = "last=" + JSON.stringify(obj) + "; expires=Thu, 01 Jan 2099 00:00:00 UTC; path=/";
  });

if (readParam('volume')) {
  let volume = readParam('volume');//parseInt(array[0]);//array[0];
  let chapter = readParam('chapter')?parseInt(readParam('chapter')):0;
  let verse = readParam('verse')?parseInt(readParam('verse')):0;
  //let _doblank = parseInt(array[3]);
  jump2preset4Anim([volume, chapter, verse]);
} else {
  restoreActionFromLocal();
}


  /*
  function cookieStuff() {
    const allCookies = document.cookie;
    if (allCookies == null) return;
    const cookiesArray = allCookies.split(";");
    cookiesArray.forEach(cookie => {
      const [name, value] = cookie.trim().split("=");
      if (name == 'last') {
        const v = decodeURIComponent(value);
        //cookiesObject[name] = 
        let obj = JSON.parse(v);
        console.log(obj);

        song = obj['song'];
        subtitles = SONGS[song];
        phase = obj['phase'];
        line = obj['line'];
        _repaint();
        return;
      }
    });
  }
  cookieStuff();
  */
  
  /*
  for (let v = 1;v < SONGS.length;v++) {
    let a = '[';
    for(let c = 1;c < SONGS[v].length;c++) {
      a += (SONGS[v][c].length-1) + ', ';
    }
    a += ']' ;
    console.log(a);
  }
  */
