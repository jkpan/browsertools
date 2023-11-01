
class VerseVertical {
    volumn = -1;
    chapter = -1;
    verse = -1;
    txt = '';
    line = 0;
        
    initial(s, c, v) {
        this.volumn = s;
        this.chapter = c;
        this.verse = v;
        this.txt = subtitles[this.chapter][this.verse];
        this.line = 0;
    }

    drawHlight() {

        if (doblank == 1) return;
    
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
            if (v_vertical.volumn != obj.volumn || 
                v_vertical.chapter != obj.chapter || 
                v_vertical.verse != obj.verse) {
                v_vertical.initial(obj.volumn, obj.chapter, obj.verse);
            }
            v_vertical.draw(progress);
            break;
        }
    }
    _layerui();
}

class VerseObj {

    volumn = 0;
    chapter = 0;
    verse = 0;
    wratio = 0.95;
    substrings = [];
    //frontxt: '',
    level = 0;
    
    transY = -100;
    fs = 0;
    opacity = 1.0;

    //gap_fs: 0,
    //gap_transY : 0,
          
    initial(volumn, c, v, level) {
      this.volumn = volumn;
      this.chapter = c;
      this.verse = v;
      this.setLevel(level);
      this.fs = this.targetFs;
    }

    targetRect = 0;
    targetFs = 0;

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

      //this.o_fs = this.fs;
    }

    targetTransY = 0;
    setTargetTransY(_transY) {
      this.targetTransY = _transY;
      if (this.transY < -50) {
        this.transY = this.targetTransY;
      }
      //this.o_transY = this.transY;
    }

    preDraw(progress) {
    
      let fs = this.fs;

      if (progress == -1) {
        this.fs = this.targetFs;
        this.transY = this.targetTransY;
        fs = this.fs;
      } else if (progress == -2) { 
        fs = this.targetFs;
        //this.gap_fs =  (this.targetFs.toFixed(2) - this.fs.toFixed(2))/animTotal.toFixed(2);
      } else {
        //this.fs += this.gap_fs;//this.fs + (this.targetFs - this.fs) * progress/4.0;
        //fs = this.fs;
        //this.transY += this.gap_transY;//this.transY + (this.targetTransY - this.transY) * progress/4.0;
        let _p = animElapse == animTotal?1.0:progress/3.0;//console.log(_p);
        this.fs = this.fs + (this.targetFs - this.fs) * _p;
        fs = this.fs;
        this.transY = this.transY + (this.targetTransY - this.transY)  * _p;
      }
    
      if (this.volumn <= 0 || this.chapter < 0 || this.verse < 0) return 0;
       
      let txt = '';
      //this.frontxt = '';

      if (this.chapter == 0) {   //print volumn only
        if (this.level == 0)
          txt = subtitles[0][0];
      } else if (this.verse == 0) { //print volumn with chapter
        txt = '[' + subtitles[this.chapter][0] + ']';
      } else {                     //normal verse
        txt = subtitles[this.chapter][this.verse];
        //this.frontxt = this.level == 0?' ' + this.chapter + ':' + this.verse + ' ':'';// + this.verse;
      }

      if (this.level == 0) {
        //this.wratio = 0.9;
        this.opacity = 1.0;
        if (this.chapter > 0 && this.verse > 0) {
          ctx.font = (fs * 0.7) + "px " + fontFamily;//FONT_SML;
          //let frontGap = Math.max(0.1, ctx.measureText(this.frontxt).width/canvas.width);
          //this.wratio = 1.0 - frontGap;
        }
      } else if (this.level == 1) {
        //this.wratio = 0.9;
        this.opacity = LEV_1_OPC;//0.85;
      } else if (this.level == 2) {
        //this.wratio = 0.9;
        this.opacity = LEV_2_OPC;//0.7;
      } else {
        //this.wratio = 0.9;
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

      if (color_selection <= 1) {
        let r = this.level == 0? this.substrings.length * fs + fs * 0.5: this.substrings.length * fs + fs * 0.2
        //if (progress == -2) this.gap_transY = (r - this.transY)/animTotal.toFixed(2);
        return r;
      } else {
        let r = this.substrings.length * fs + fs * 0.5;
        //if (progress == -2) this.gap_transY = (r - this.transY)/animTotal.toFixed(2);
        return r;
      }
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
            let fsize = this.targetFs * 0.4;
            ctx.font = fsize + "px " + fontFamily;//FONT_SML;
            _drawSdwtxt((abbr[this.volumn].length==1?' ':'') + abbr[this.volumn], 0, 0, 1.0);
            _drawSdwtxt(' ' + this.chapter, 0, fsize, 1.0);
            _drawSdwtxt(' ' + this.verse, 0, fsize * 2, 1.0);
          }
        ctx.resetTransform();
      }
        
      ctx.transform(1,0,0,1,0,this.transY);
      
        ctx.font = this.fs + "px " + fontFamily;
        let x = canvas.width * (1 - this.wratio);

        if (this.level == 0) {
          let y = this.fs * 0.25;
          for (let i=0;i<this.substrings.length;i++) {
            if (islastChar(this.substrings[i]) && i+1<this.substrings.length && is0Char(this.substrings[i+1])) 
              _drawSdwtxt(this.substrings[i]+'-', x, y, 1.0);
            else 
              _drawSdwtxt(this.substrings[i], x, y, 1.0);
            y += this.fs;
          }
        } else {
          let y = 0;//fontsize * 0.25;
          if (animType == 0 || checkBetweenHeadTail([song, this.chapter, this.verse]) >= 0) {
            for (let i=0;i<this.substrings.length;i++) {
                if (islastChar(this.substrings[i]) && i+1<this.substrings.length && is0Char(this.substrings[i+1])) 
                  _drawtxt(this.substrings[i]+'-', x, y, this.opacity);
                else
                  _drawtxt(this.substrings[i], x, y, this.opacity);
                y += this.fs;
            }
            //ctx.font = this.fs * 0.7 + "px " + fontFamily;
            //_drawtxt(this.frontxt, 0, 0, this.opacity);
          }
        }

      ctx.resetTransform();    

    }
}

function loadBgImg(event) {
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
          startImgAnim();
          _repaint();
        }
        _img.src = e.target.result;
      }
    }
}
  
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

function loadUrlImg() {

    var imageUrl = 'https://cdn-news.readmoo.com/wp-content/uploads/2018/08/jerusalem-news.jpg';

    var image = new Image();
    image.src = imageUrl;

    image.onload = function() {
        img = image;
        startImgAnim();
        _repaint();
    };
}


var presetVerse = [
      
    [''], //0
    ['詩篇', 1], //2
    ['創世記', 1, 0, '創世記', 50, 26], //1
    [''], //3
    [''], //4
    [''], //5
    [''], //6
    [''], //7
    [''], //8
    [''], //9

  ];

//function flow() {}

const WORD_DELAY = 100;

const LEV_1_OPC = 0.8;
const LEV_2_OPC = 0.7;
const LEV_3_OPC = 0.6;

var fontfactor = 14.0;
var fontFamily = "Monospace";

var fontsize = 48;
var FONT = fontsize + "px " + fontFamily;

var fontsize_sml = 32;
var FONT_SML = fontsize_sml + "px " + fontFamily;

var fontsize_sml_sml = 24;
var FONT_SML_SML = fontsize_sml_sml + "px " + fontFamily;


var txt_strokeStyle = 'black';
var txt_fillStyle = 'rgba(255, 255, 255, ';

var txt_strokeStyle_white = 'rgb(255,255,255)';
var txt_fillStyle_white = 'rgba(0, 0, 0, '; 


/////
var bgcolor_pointer = "rgba(255, 255, 255, 0.33)";
var color_pointer = ["rgb(0, 100, 0)", "green", "rgb(0, 180, 0)", "rgb(0, 255, 0)"];;
var hlight_pointer = 'rgba(0, 0, 0, 0.33)';

var txt_fill = txt_fillStyle;
var txt_stroke = txt_strokeStyle;

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
//var target_doblank = 0;
var helpSwitch = 0;

var imgurl = '';//'./Icon-1024.png';
var img;
var canvas;
var ctx;

var color_selection = 0;

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
  //document.body.style.backgroundColor = 'green';
  
}

createCanvas();
createBGHiddenFile();

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

function prepareImage() {
  img = new Image();
  img.src = imgurl;
  img.onload = function() {};
}

function drawHlight(yy, hh) {
    if (doblank == 1 || phase < 1) return;

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

      ctx.fillRect (0, yy, canvas.width, hh);
  
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

function isEnglishCharacter(char) {
  return /^[A-Za-z]$/.test(char);
}

function islastChar(str) {
  return isEnglishCharacter(str[str.length - 1]);
}

function is0Char(str) {
  return isEnglishCharacter(str[0]);
}

var display_mode = 0;
const animTotal = 60;
var animElapse = -1; //var savePre = 0;
function verse_update(elapse) {

    switch(display_mode) {
        case 0:
            render(animElapse.toFixed(2)/animTotal.toFixed(2));
            break;
        case 1:
            render_vertical(animElapse.toFixed(2)/animTotal.toFixed(2));
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
  let cv = getPreCV(obj.chapter, obj.verse);
  let c = cv[0];//getPreChapter(obj.chapter, obj.verse);
  let v = cv[1];//getPreVerse(obj.chapter, obj.verse);
  obj = new VerseObj();
  obj.initial(song, c, v, 1);
  return obj;
}

function getQueueNext() {
  if (queue.length == 0) return null;
  let obj = queue[queue.length -1];
  let cv = getNextCV(obj.chapter, obj.verse);
  let c = cv[0];//getNextChapter(obj.chapter, obj.verse);
  let v = cv[1];//getNextVerse(obj.chapter, obj.verse);
  obj = new VerseObj();
  obj.initial(song, c, v, 1);
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
  for (let i = 0;i<queue.length;i++) {
    let obj = queue[i];
    obj.setLevel(1);
    if (obj.chapter == phase && obj.verse == line) {
      obj.setLevel(0);
      sel = i;
    }
  }

  if (color_selection <= 1) {
    for (let _sel = 2;;_sel++)
      if (sel >= _sel) queue[sel - _sel].setLevel(_sel);
      else break;
    for (let _sel = 2;;_sel++)
      if (queue.length > sel + _sel) queue[sel + _sel].setLevel(_sel);
      else break;
  }

  if (doanim > 0) {
    animElapse = 0;
    window.requestAnimationFrame(verse_update);
  } else {
    render(-1);
  }
  
}

function render(progress) {
  _layer0();
  _render(progress); //_layer2();
  _layerui();
}

var queue = [];

function _render(progress) {
  
  let x = canvas.width * 0.1;

  let fixy = canvas.height * 0.33;
  let offY = fixy;

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
      
        switch(display_mode) {
            case 0:
                obj.preDraw(progress);
                obj.draw();
                break;
            case 1:
                //render_vertical(progress);//animElapse.toFixed(2)/animTotal.toFixed(2));
                if (v_vertical.volumn != obj.volumn || v_vertical.chapter != obj.chapter || v_vertical.verse != obj.verse) {
                    v_vertical.initial(obj.volumn, obj.chapter, obj.verse);
                }
    
                //console.log(v_vertical.chapter +', '+ v_vertical.verse);
                
                v_vertical.draw(progress);
                return;
            }

      
      
      for (let k = i + 1;k<queue.length;k++) {
        let o = queue[k];
        o.preDraw(progress);
        if (o.transY + o.substrings.length * o.fs > canvas.height) break;
        o.draw();
      }
      
      //offY = obj.transY;
      offY = fixy; 
      for (let k = i - 1;k >= 0;k--) {
        let o = queue[k];
        o.preDraw(progress);
        if (o.transY < 0) break;
        o.draw();
      }
      
      break;
    }
    
  }

  ctx.textBaseline = 'alphabetic';

}

function printMain(chapter, verse) {

  queue.length = 0;
  queue = [];

  let i = chapter;
  let j = verse;

  let amount = color_selection <= 0? MAX_VERSES_GREEN : MAX_VERSES_NORMAL;

  for (let k = 1;k<=amount;k++) {

      let cv = getPreCV(i, j);
      i = cv[0];
      j = cv[1];
      //let _i = getPreChapter(i, j);
      //j = getPreVerse(i, j);
      //i = _i;

      let obj = new VerseObj();
      if (color_selection <= 1) {
        obj.initial(song, i, j, k);
      } else {
        obj.initial(song, i, j, 1);
      }

      queue.unshift(obj);
  }

  let obj = new VerseObj();
  obj.initial(song, chapter, verse, 0);
  queue.push(obj);

  i = chapter;
  j = verse;
  for (let k = 1;k <= amount;k++) {

    let cv = getNextCV(i, j);
    i = cv[0];
    j = cv[1];

    //  let _i = getNextChapter(i, j);
    //  j = getNextVerse(i, j);
    //  i = _i;

      let obj = new VerseObj();
      if (color_selection <= 1) {
        obj.initial(song, i, j, k);
      } else {
        obj.initial(song, i, j, 1);
      }

      queue.push(obj);   
  }

  _render(-1);

}

var fontColorType = 0;

function _drawSdwtxt(txt, x, y, opa) {
    
    switch (fontColorType) {
        case 0:
          ctx.fillStyle = 'rgba(255,255,255,' + opa + ')';//'white';
          break;
        case 1:
          ctx.fillStyle = 'rgba(255,255,255,' + opa + ')';
          ctx.strokeStyle = 'rgba(0,0,0,' + opa + ')';
          ctx.lineWidth = Math.ceil(fontsize/12.0);
          ctx.strokeText(txt, x, y);
          break;
        case 2:
          ctx.fillStyle = 'rgba(0,0,0,' + opa + ')';
          break;
        case 3:
          ctx.fillStyle = 'rgba(0,0,0,' + opa + ')';
          ctx.strokeStyle = 'rgba(255,255,255,' + opa + ')';
          ctx.lineWidth = Math.ceil(fontsize/12.0);
          ctx.strokeText(txt, x, y);
          break;
      }

  ctx.lineWidth = 1;
  ctx.fillText(txt, x, y);

}

function _drawtxt(txt, x, y, a) {

    switch (fontColorType) {
        case 0:
        case 1:
          ctx.fillStyle = 'rgba(255,255,255,' + a + ')';//'white';
          break;
        case 2:
        case 3:
          ctx.fillStyle = 'rgba(0,0,0,' + a + ')';//'black';
          break;
      }

  //ctx.fillStyle = txt_fill + a + ')';

  ctx.lineWidth = 1;
  ctx.fillText(txt, x, y);

}

function getPreCV(chapter, verse) {
    if (verse > 0) 
        return [chapter, verse - 1];
    if (chapter > 0) //verse == 0
        return [chapter - 1, subtitles[chapter - 1].length - 1];
    return [-1, -1];
}

function getNextCV(chapter, verse) {
    if (chapter < 0) return [-1, -1];
    if (verse < subtitles[chapter].length - 1)
        return [chapter, verse + 1];
    if (chapter < subtitles.length - 1) 
        return [chapter + 1, 0];
    return [-1, -1];
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

function jumpTo1() {
  if (song == 0) {
      song = 1;
      subtitles = SONGS[song];
      phase = 0;
      line = 0;
  }
}

function anim1() {
    if (animType != 1) return;
    
    if (checkBeforeTail([song, phase, line]))
        keyboard({keyCode : 39});
    else { //jumpwoanim(head);
        jump2preset4Anim(head);
        timeoutID = setTimeout(anim1, conutWord(subtitles[head[1]][head[2]]) * WORD_DELAY);
        return;
    }
        
    timeoutID = setTimeout(anim1, conutWord(subtitles[phase][line]) * WORD_DELAY);
}

let head = [];
let tail = [];

function checkBetweenHeadTail(ps) {
    if (checkAfterHead(ps) && checkBeforeTail(ps)) return 1;
    if (ps[0] == head[0] && ps[1] == head[1] && ps[2] == head[2])
        return 0;
    if (ps[0] == tail[0] && ps[1] == tail[1] && ps[2] == tail[2])
        return 2;
    return -1;
}

function checkAfterHead(ps) {
    if (ps[0] < head[0]) return false;
    if (ps[1] < head[1]) return false;
    //目前是同卷書 此章之後
    if (ps[1] == head[1] && ps[2] <= head[2]) return false;
    return true;
}

function checkBeforeTail(ps) {
    if (ps[0] > tail[0]) return false;
    if (ps[1] > tail[1]) return false;
    //目前是同卷書 此章之前
    if (ps[1] == tail[1] && ps[2] >= tail[2]) return false;
    return true;
}

function jumpwoanim(ps) {
    for (var i = 1;i<SONGS.length;i++) {
      if (ps[0] == SONGS[i][0][0] || ps[0] == i) {
          song = i;
          subtitles = SONGS[i];//presetVerse[value][0]
          phase = ps[1];
          line =  ps[2];
          break;
      }
    }
    _repaint();
}

var animType = 0;
var timeoutID = -1;

function stopAnim() {
    animType = 0;
    window.clearTimeout(timeoutID);
}

function conutWord(word) {
    if (abbr == chineseAbbr) {
        return word.length;
      } else {
        return word.split(' ').length + 2;
      }
}

function jump2preset(ps) {
    if (timeoutID > 0) stopAnim();
    if (ps.length == 2) {
        animType = 1;
        jumpwoanim([ps[0], ps[1], 1]);
        head = [song, phase, line];
        tail = [song, phase, subtitles[phase].length-1];
        _repaint();
        timeoutID = setTimeout(anim1, conutWord(subtitles[phase][line]) * WORD_DELAY);
        return;
    }
    if (ps.length == 3) {
        animType = 0;
        jump2preset4Anim(ps);
        return;
    }
    if (ps.length == 6) {        
        animType = 1;
        jumpwoanim([ps[3], ps[4], ps[5]]);
        tail = [song, phase, line];
        jumpwoanim([ps[0], ps[1], ps[2]]);
        head = [song, phase, line];
        console.log(head +'::::'+ tail);
        _repaint();
        timeoutID = setTimeout(anim1, conutWord(subtitles[phase][line]) * WORD_DELAY);
        return;
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
  
  _repaint();
}

var t_song = 0;
var t_phase = 0;
var t_line = 0;

function jump2preset4Anim(ps) {
  for (var i = 1;i<SONGS.length;i++) {
    if (ps[0] == SONGS[i][0][0] || ps[0] == i) {
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

function keyboard(e) { //key up

    //alert(e.keyCode);

    if (e.keyCode == 16) { //} || e.keyCode == 17) { //key up release lock
        stopAnim();
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
      case 77: //m
          img = null;
          document.getElementById('img').click();
          //loadUrlImg();
          //connect2Data();
          break;
      case 65: //a
        if (color_selection == 2 && display_mode == 0) {
            display_mode = 1;
            break;
        }
        if (display_mode == 1) {
            display_mode = 0;
        }
        color_selection = (color_selection + 1) % 3;
        break;
      case 67: //'c'
        fontColorType = (fontColorType + 1)%4; 
        break;
      case 78:
        switchLang();
        break;
      case 66: //'b'
        //console.log('b press');
        doblank = doblank == 0?1:0;
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
          let cv = getPreCV(phase, line);
          let _phase = cv[0];//getPreChapter(phase, line);
          let _line = cv[1];//getPreVerse(phase, line);
          if (_phase >= 0 && (phase != _phase || line != _line)) {
            phase = _phase;
            line = _line;
            if (mode == 0 && queue.length > 0) {
              operateQuene(2, e.keyCode == 37?1:0);
              return;
            }
          }

        }
          break;
      case 34: //'page down' 
      case 39: { //'ArrowRight'
          helpSwitch = 0;
          let cv = getNextCV(phase, line);
          let _phase = cv[0];//getNextChapter(phase, line);
          let _line = cv[1];//getNextVerse(phase, line);
          if (_phase >=0 && (phase != _phase || line != _line)) {
            phase = _phase;
            line  = _line;
            if (mode == 0 && queue.length > 0) {
              operateQuene(1, e.keyCode == 39?1:0);
              return;
            }
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
        
        case 48:    case 49:  case 50:  case 51:  case 52:  case 53:  case 54:  case 55:  case 56:  case 57:
        //case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
          var value = e.keyCode - 48;
          if (value > presetVerse.length -1) break;
          if (presetVerse[value][0].length == 0) break;
          jump2preset(presetVerse[value]);
          return;
        case 32: stopAnim(); break;
        //case 13: //'enter' break;
        case 27: //'escape'
          animType = 0;
          mode = 0;
          doblank = 0;
          uisel = 0;
          break;
        default:
          break;
    }

    _repaint();

}

function _layer0() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
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

  if (img) {
    if (img.width/img.height > canvas.width/canvas.height) { //圖比較寬 佔滿canvas的高
        ctx.drawImage(img, img_idx, 0, canvas.height * img.width/img.height, canvas.height);
    } else { //畫布比較寬 佔滿canvas的寬
        ctx.drawImage(img,0,img_idx, canvas.width, canvas.width * img.height/img.width);
    }
  }
}

var img_step = -1;//10;
var img_idx = 0;
//var img_move = img_step;
var pre_elapse = 0;
var elapse = 0;

const during = 10;
var _during = 0;

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

    let _t = 1-t;
    
    let b = p0 * _t * _t * _t +
            p1 * 3 * t * _t * _t +
            p2 * 3 * t * t * _t +
            p3 * t * t * t;
    return b;
}

function img_update(elapse) {
 
    
    let dt = (elapse - pre_elapse)/1000.0;
    if (dt > 1) dt = 0.008; 
    pre_elapse = elapse;

    _during += dt;
    if (_during > during) {
        _during = 0;
        img_step = -img_step;
    }
        
    if (img.width/img.height > canvas.width/canvas.height) { //圖比較寬 佔滿canvas的高
        
        let w = canvas.height * img.width/img.height;
        let h = canvas.height;
        let range = Math.abs(w - canvas.width);

        if (img_step < 0)
            img_idx = img_step * range * easeInOut(_during/during);// += img_move * dt;
        else 
            img_idx = -range + range * easeInOut(_during/during);
        
    } else { //畫布比較寬 佔滿canvas的寬

        let w = canvas.width;
        let h = canvas.width * img.height/img.width;
        let range = Math.abs(h - canvas.height);

        if (img_step < 0)
            img_idx = img_step * range * easeInOut(_during/during);// += img_move * dt;
        else 
            img_idx = -range + range * easeInOut(_during/during);

    }

    if (animElapse >= 0) {
        render(animElapse.toFixed(2)/animTotal.toFixed(2));
    } else {
        render(-1);
    }    

    window.requestAnimationFrame(img_update);

  
    /*
    if (animElapse < animTotal) {
        animElapse++;
    } else {
        animElapse = 0;
    }
    */

}

function startImgAnim() {
    img_move = 1;
    window.requestAnimationFrame(img_update);
}

function _layerui() {
  
  if (uisel == 0) return;
  ctx.fillStyle = 'green';//bgcolor_pointer;//;
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

function _repaint() {
  //ctx.globalCompositeOperation='difference';
  //ctx.filter = 'invert(1)';
  _layer0();
  printMain(phase, line);//_layer1();_layer2();
  _layerui();
}

init();

// message 事件
//function receiveMessage(e) {}
//window.addEventListener('message', receiveMessage, false);

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
  
  if (e.keyCode == 16) {// || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 91) {
    keylock = 1;
    _repaint();
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

// 滑鼠滾輪...
window.addEventListener('wheel',function (event){
  //only vertical scroll
  if (event.deltaY > 4) {
    keyboard({keyCode : 34}); //right
  } else if (event.deltaY < -4) {
    keyboard({keyCode : 33}); //left
  }
});

function toObj() {
  let obj = {};
  obj['color'] = color_selection;
  obj['fontfactor'] = fontfactor;
  obj['saved'] = presetVerse;
  return obj;
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

function connect2Data() {
    const url = 'https://script.google.com/macros/s/AKfycbzM3r3hUmQa-PUNlNQsZkKj8OsuKt5ImtuF4VMZpjrnnuGOhAI6_AW608Y_8pMzoqdF/exec';
    _ajax({}, url, 
        (res)=>{
            console.log(JSON.stringify(res));
            //console.log(res);
        }, 
        () => {
            console.log('error:');
        });
}


/*
function connect2Data() {
    const url = 'https://script.google.com/macros/s/AKfycbzM3r3hUmQa-PUNlNQsZkKj8OsuKt5ImtuF4VMZpjrnnuGOhAI6_AW608Y_8pMzoqdF/exec';
    fetch(url, { method: 'POST'})
              .then(response => alert("You have successfully submitted."))
              .catch(error => console.error('Error!', error.message))
}
*/

//建構整本聖經
for(let i=1;i<abbr.length;i++) SONGS[i] = getSong(abbr[i]);

song = 0;

jumpTo1();

_repaint();

//let v = "5"-"2";console.log(typeof v);
/*
function getPreChapter(chapter, verse) {
    if (chapter <= 0) return -1;
    if (verse > 0) return chapter;
    return chapter - 1;
  }
  
  function getPreVerse(chapter, verse) {
    if (verse > 0) return verse - 1;
    if (chapter > 0) return subtitles[chapter - 1].length - 1;
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
  */

  /*
  function createParticle() {
    particles[i] = newParticle_txt(i, total);//();
    particles[i].initial(canvas);
  }

  function newParticle_txt(sequence, total) {
    let p = {
      x: 0,
      y: 0,
    idx: 0,
    txt: "",
    array: [],
    size:0,
    seq:sequence,
    ttl:total,
    idxlen:0,
    elapse:0,
    gap : 0.1,
    lev:0,
      release: function() {
        this.txt = '';
        this.array = [];
        this.array.length = 0;
      },
      initial: function (c) {
  
        //this.txt += String.fromCharCode(Math.floor(65 + Math.random() * 26));
  
        let chapter = 1 + Math.floor(Math.random() * (subtitle.length - 1));
        let verse = 1 + Math.floor(Math.random() * (subtitle[chapter].length - 1));
        this.txt = subtitle[chapter][verse];
  
        //this.size = Math.floor(10 + (this.seq/this.ttl) * 20);
        this.size = 20 + 4 * Math.floor(this.seq/5);
        
        
        this.lev = Math.floor(this.ttl - this.seq)/5;
        if (this.lev < 3) {
          this.x = Math.floor(this.ttl - this.seq)%5 * c.width/5 + 2 * this.lev * c.width/this.ttl;
        } else {
          this.x = c.width * Math.random();
        }
        //this.x = this.seq * c.width/this.ttl;
        //console.log(':'+this.size);
  
        this.array = Array.from(this.txt);
        
        this.y = 10 + Math.random() * c.height/4;
        this.idxlen = Math.max(2, Math.floor(this.array.length * 0.8));//10 + 10 * Math.random();
        this.elapse = 0;
        this.idx = 0;
        this.gap = 0.06 + Math.random() * 0.15;
        //console.log('___  ' + this.gap);
      },
  
      update: function (c, _ctx, dt) {
        
        if (dt > 1000) dt = 16;
  
        this.size += 0.05 * this.size * dt * 0.001;
        this.y -= this.size * dt * 0.001;
  
        _ctx.textAlign = "left";
  
        var fontFamily = "Arial";//'華康瘦金體';//"cwTeXKai";//"Noto Serif TC";"標楷體";
        _ctx.font = this.size + "px "+ fontFamily;
  
        this.elapse += dt * 0.001;
        if (this.elapse > this.gap) {
          this.idx++;
          if (this.idx - this.idxlen + 1 >= this.array.length) {
            this.initial(c);
            return;
          }
          this.elapse = 0;
        }
  
        //console.log(this.idx + '/' + this.array.length);
  
        let _len = this.idxlen;
        for (var i = this.idx;i>=0;i--) {
          
          if (i < this.array.length) {
            
            let cl = Math.floor(150 * _len/this.idxlen);
  
            let _r = PT_R == 0?cl:255;
            let _g = PT_G == 0?cl:255;
            let _b = PT_B == 0?cl:255;
            
            if (i == this.idx) {
              
              if (this.lev >= 2) {
                _ctx.fillStyle = 'rgb(' + (PT_R == 0?0:255) + ',' + (PT_G == 0?0:255) + ',' + (PT_B == 0?0:255) + ',' + '1.0)';//'rgb(200, 200, 200, 0.8)';
              } else {
                _ctx.strokeStyle = 'rgb(' +(PT_R == 0?0:255) + ',' + (PT_G == 0?0:255) + ',' + (PT_B == 0?0:255) + ',' + '1.0)';//'rgb(255, 0, 0, 1.0)';
                _ctx.lineWidth = 6;
                _ctx.fillStyle = 'rgb(0,0,0,1.0)';
                _ctx.strokeText(this.array[i], this.x, this.y + (i * this.size));
              }      
              
            } else {
  
              let opa = _len/this.idxlen;
              if (this.lev >= 2) {
                opa *= 0.5;
              }
              _ctx.fillStyle = 'rgb(' + _r + ',' + _g + ',' + _b + ',' + opa + ')';
            }
            _ctx.fillText(this.array[i], this.x, this.y + (i * this.size)); 
            //_ctx.fillText(this.txt.substr(i, 1), this.x, this.y + (i * this.size));
          }  
          _len--;
          if (_len == 0) break;
        }
        
      }
    }
    return p;
  }

  */