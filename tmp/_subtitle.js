  
var FONT = "100px 標楷體";

function flow() {

  SONGS = [ [['']],

            

          ];

  //for (var i=1;i<SONGS.length;i++)  SONGS[0][0][i-1] = i + '. ' + SONGS[i][0][0];
  //"chrome 全螢幕F11(win) ctrl-cmd-F(mac)",
                
}

function getSong(jsonid) {
  var json_elm = document.getElementById(jsonid);
  if (json_elm) {
    var obj = JSON.parse(json_elm.innerHTML);
    return obj.content;
  }
  return [['']];
} 

var SONGS;

//var PREFIX = '救恩';

var song;
var subtitles;

var phase = 0;
var line = 0;
var mode = 0;
var animSwh = 0;
var animIdx = 0;

var displayProgress = 0;
var doblank = 0;
var helpSwitch = 0;

var imgurl = '';//'./Icon-1024.png';
var img;
var canvas;
var ctx;

function init() {
    canvas = document.getElementById("canvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
}

function _createEmptyBtn() {
  var button = document.createElement('button');
  button.innerHTML = ' <br/> ';
  button.style.width = '172px'; // setting the width to 200px
  button.style.height = '25px'; // setting the height to 200px
  //button.style.background = 'teal'; // setting the background color to teal
  //button.style.color = 'white'; // setting the color to white
  button.style.fontSize = '16px'; // setting the font size to 20px
  document.body.appendChild(button);
  return button;
}

function _createBtn(idtxt, attr) {
  var button = document.createElement('button');
  button.innerHTML = idtxt + '<br/>' + attr;// + ' ' + getSong(idtxt)[0][0];
  button.id = 'btn' + idtxt;

  button.style.width = '172px'; // setting the width to 200px
  button.style.height = '75px'; // setting the height to 200px
  //button.style.background = 'teal'; // setting the background color to teal
  //button.style.color = 'white'; // setting the color to white
  button.style.fontSize = '16px'; // setting the font size to 20px

  button.onclick = function() {
    SONGS[SONGS.length] = getSong(idtxt);
    song = SONGS.length - 1;
    phase = 0;
    line = 0;
    subtitles = SONGS[song];
    alert(idtxt + ' ' + subtitles[0][0]);
    hideCanvas();
    _repaint();
    return false;
  };
  //document.body.appendChild(button);
  return button;
}

function createBtns() {

  var div = document.createElement('div');
  div.id = 'btns';
  document.body.appendChild(div);

  var btn;

  let count = 0;
  for (var i=1;i<=300;i++) {
    var exist = document.getElementById(PREFIX+i);
    if (exist) {
      count++;
      var attr = exist.getAttribute("name");
      if (!attr) attr = ''; 
      //var button = document.createElement('button');
      let idx = PREFIX+i;
      btn = _createBtn(PREFIX+i, attr);
    } else {
      btn = _createEmptyBtn();
      btn.id = 'btn' + PREFIX + i;
    }
    div.appendChild(btn);
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

function printTxt(i, j) {

  let txt = subtitles[i][j];
      
  ctx.font = FONT;
  ctx.textAlign = "center";
  var x = canvas.width/2;
  var y = animSwh == 1?canvas.height/2:canvas.height - 100;

  if (i == 0 && txt.length > 0) {
    txt = '['+txt+']';
  }

  if (doblank == 1 || (i == 0 && animSwh == 0)) {
    ctx.fillStyle = "rgb(0,180,0)";
    ctx.lineWidth = 1;
    ctx.fillText(txt, x, y);
    return;
  }

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 4;
  ctx.strokeText(txt, x, y);

  ctx.fillStyle = 'white';
  ctx.lineWidth = 1;
  ctx.fillText(txt, x, y);

}

function printChart() {
  
  if (phase == 0) return;
  
  var all = 0;
  
  for (var i = 1;i < subtitles.length;i++) {
    all += subtitles[i].length;
  }
  
  if (all == 0) return;

  var gap = canvas.width/all;
  var _h = 20;
  var y = canvas.height - _h * 2;
  
  var _step = 0;
  for (var i = 1;i <subtitles.length;i++) {
    if (i%2 == 0) {
      ctx.fillStyle = "rgb(0,115,0)";
    } else {
      ctx.fillStyle = "rgb(0,160,0)";
    }
    ctx.fillRect (_step * gap, y, subtitles[i].length * gap, _h);
    _step += subtitles[i].length;
  }
  
  var idx = line;
  for (var i = 1;i < phase;i++) {
    idx += subtitles[i].length;
  }

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'green';
  
  for (var i = 0;i < all;i++) {
    ctx.strokeRect (i * gap, y, gap, _h);
  }

  ctx.strokeStyle = "rgb(0,220,0)";
  ctx.strokeRect (idx * gap, y, gap, _h);

}

function printPhase() {  

  ctx.font = FONT;
  ctx.textAlign = 'center';

  var gap = canvas.height/(subtitles[phase].length + 1);

  for (var i=0;i<subtitles[phase].length;i++) {

    var x = canvas.width/2;
    var y = (i + 1) * gap;

    //ctx.lineWidth = 4;ctx.strokeStyle = 'black';ctx.strokeText(subtitles[phase][i], x, y);

    ctx.lineWidth = 1;
    ctx.fillStyle = 'white';
    ctx.fillText(subtitles[phase][i], x, y);
  
    if (i == line) {
      ctx.strokeStyle = 'white';
      ctx.strokeRect (10, y, 20, 20);
    }

  }

}

function printPhaseChart() {

  if (phase == 0) return;

  var gap = canvas.width/(subtitles.length - 1);
  var _h = 20;
  var y = canvas.height - _h * 2;

  for (var i = 1;i <subtitles.length;i++) {
    if (i%2 == 0) {
      ctx.fillStyle = "rgb(100,100,100)";
    } else {
      ctx.fillStyle = "rgb(150,150,150)";
    }
    ctx.fillRect((i-1) * gap, y, gap, _h);
  }

  ctx.lineWidth = 3;

  ctx.strokeStyle = "white";
  ctx.strokeRect ((phase-1) * gap, y, gap, _h); 

}

function keyboard(e) {

    //alert(e.keyCode);
    if (e.keyCode == 16 || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 91) {
      keylock = false;
    }

    if (keylock) return;

    /*
    if (doblank == 1) {
      doblank = 0;
      _repaint();
      return;
    }
    */
    
    switch (e.keyCode) {
      /*
      case 68: {
        var strWindowFeatures = "location=no,height=570,width=520,scrollbars=yes,status=no";
        var URL = "https://www.linkedin.com/cws/share?mini=true&amp;url=" + location.href;
        var win = window.open("", "_blank", strWindowFeatures);
      }
        break;
        */
      case 66: //'b'
        doblank = doblank == 0?1:0;
        break;
      case 33: //'page up'
        if (mode == 0) 
          keyboard({keyCode : 37}); //left
        else 
          keyboard({keyCode : 38}); //down
        break;
      case 34: //'page down'
        if (mode == 0) 
          keyboard({keyCode : 39}); //right
        else 
          keyboard({keyCode : 40}); //up
        break;
      case 65: //'A'
          if (animSwh == 0) {
            initAnim(animIdx);
          } else {
            initAnim(-1);
          }
          break;
      case 83: displayProgress = displayProgress == 1?0:1; break; //'s'
      case 67: //'c' jump to coda last one phase
          phase = subtitles.length - 1;
          line = 0;
          break;
      case 80:
          if (animSwh == 0) {
            mode = mode == 0?1:0;
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
          var value = e.keyCode - 48;
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
        case 79: phase = 0; line = 0; break;
        case 81: if (subtitles.length > 1) { phase = 1; line = 0; } break;
        case 87: if (subtitles.length > 2) { phase = 2; line = 0; } break;
        case 69: if (subtitles.length > 3) { phase = 3; line = 0; } break;
        case 82: if (subtitles.length > 4) { phase = 4; line = 0; } break;
        case 84: if (subtitles.length > 5) { phase = 5; line = 0; } break;
        case 89: if (subtitles.length > 6) { phase = 6; line = 0; } break;
        case 85: if (subtitles.length > 7) { phase = 7; line = 0; } break;
        case 73: if (subtitles.length > 8) { phase = 8; line = 0; } break;

        case 27: //'escape' case 13: //'enter'
          mode = 0;
          removeBtns();
          canvas.hidden = false;
          animSwh = 0;   
          doblank = 0;
          helpSwitch = 0;
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
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (img) {
      ctx.drawImage(img,0,0, canvas.width, canvas.height);
  }
}

function _layer1() {
  if (mode == 0) {
    printTxt(phase, line);
    if (displayProgress == 1) printChart();
  } else {
    printPhase();
    if (displayProgress == 1) printPhaseChart();
  }
}

function _layer2() {
  if (helpSwitch == 1) {
    userhelp(); 
  }
  if (doblank == 1) 
    blank();
}

function _repaint() {
  _layer0();
  _layer1();
  _layer2();
}

function userhelp() {
  
  let helps = getSong('help');
    
  ctx.fillStyle = 'green'; //"rgb(0,0,255)"//ctx.fillRect(0, 0, c.width, c.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "64px Arial";
  ctx.textAlign = "left";

  let gap = canvas.height/(helps[0].length + 1);
  for (let i=0;i<helps[0].length;i++) {
    let x = 20;
    let y = (i + 1) * gap;
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgb(0,180,0)';
    ctx.fillText(helps[0][i], x, y);
  }
}

function blank() {
  if (animSwh == 1 || mode == 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black'; //"rgb(0,0,255)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  /* 
  else {
    ctx.fillStyle = 'green'; //"rgb(0,0,255)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  */
}

init();

var keylock = false;

window.addEventListener('keyup', keyboard, false);
window.addEventListener('keydown', function(e) {

  if (e.keyCode == 16 || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 91) {
    keylock = true;
  }

}, false);
window.addEventListener('resize', function() {
  init();
  _repaint();
});

flow();

hideCanvas();

song = 0;
subtitles = SONGS[song];
//prepareImage();
_repaint();


//<!-- Animation -->

var pre = 0;
var particles = [];

function anim_update(elapse) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
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
    animIdx = (animIdx + 1)%10;
    idx = animIdx;
  }

  //idx = 7;

  if (idx == 0) {
    for (var i = 0;i<150;i++) {
      particles[i] = newParticle_casual();
      particles[i].initial(canvas);
    }
  } else if (idx == 1) {
    for (var i = 0;i<150;i++) {
      particles[i] = newParticle_in();
      particles[i].initial(canvas);
    }
  } else if (idx == 2) {
    for (var i = 0;i<150;i++) {
      particles[i] = newParticle_out();
      particles[i].initial(canvas);
    }
  } else if (idx == 3) {
    for (var i = 0;i<150;i++) {
      particles[i] = newParticle_ring();
      particles[i].initial(canvas);
    }
  } else if (idx == 4) {
    for (var i = 0;i<150;i++) {
      particles[i] = newParticle_snow();
      particles[i].initial(canvas);
    }
  } else if (idx == 5) {
    for (var i = 0;i<3;i++) {
      particles[i] = newParticle_firework();
      particles[i].initial(canvas);
    }
  } else if (idx == 6) {
    for (var i = 0;i<20;i++) {
      particles[i] = newParticle_rect();
      particles[i].initial(canvas);
    }
  } else if (idx == 7) {
    particles[0] = newParticle_skylight_background();
    for (var i = 1;i<100;i++) {
      particles[i] = newParticle_skylight();//newParticle_snow();
      particles[i].initial(canvas);
    }
  } else if (idx == 8) {
    particles[0] = newParticle_sunrise_background();
    for (var i = 1;i<100;i++) {
      particles[i] = newParticle_sunrise();//();
      particles[i].initial(canvas);
    }
  } else if (idx == 9) {
    particles[0] = newClock();
    particles[0].initial(canvas);
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
      let range = c.width * 0.2 * (0.5 + Math.random()/2.0);

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

function newClock() {
  let p = {
    release: function() { },
    initial: function (c) { },
    update: function (c, _ctx, dt) {
      
      var x = c.width/2.0;
      var y = c.height/2.0;
      var len = c.height/5.0;

      var date = new Date();

      //var n = d.getTime();
      //_ctx.font = "64px Arial";
      //_ctx.fillStyle = 'rgb(' + this.R + ',' + this.G + ',' + this.B + ',' + this.A + ')'; //"rgb(0,0,20)"
      //if (Math.random() > 0.5) _ctx.fillText(h + ':' + min +':' + s, this.x, this.y);

      let h = date.getHours() % 12;
      let min = date.getMinutes();
      let s = date.getSeconds();
      let ms = date.getMilliseconds();

      _ctx.strokeStyle = "rgb(100, 100, 100)";
      _ctx.lineWidth = 16;
      _ctx.beginPath();
      _ctx.arc(x, y, 2 * len + 10, 0, 2 * Math.PI, true);
      _ctx.stroke();

      _ctx.fillStyle = "rgb(100, 100, 100)";
      for (let i = 0;i<12;i++) {
        let angle = (90 - i * 360.0/12.0) * Math.PI/180;
        let dx = 2 * len * Math.cos(angle);
        let dy = -2 * len * Math.sin(angle);
        _ctx.beginPath();
        _ctx.arc(x + dx, y + dy, len/10, 0, 2 * Math.PI, true);
        _ctx.fill();
      }

      _ctx.lineCap = "round";

      /*
       * HOUR
       */
      let angle = (90 - (h + min/60.0) * 360.0/12.0) * Math.PI/180;
      let dx = 0.8 * len * Math.cos(angle);
      let dy = -0.8 * len * Math.sin(angle);
      
      _ctx.beginPath();
      _ctx.moveTo(x, y);
      _ctx.lineTo(x + dx, y + dy);
      _ctx.lineWidth = 40;
      _ctx.strokeStyle = "rgb(0, 0, 150)";
      _ctx.stroke();
      
      /*
       * MINUTE
       */
      angle = (90 - (min + s/60.0) * 360.0/60.0) * Math.PI/180;
      dx = 1.5 * len * Math.cos(angle);
      dy = -1.5 * len * Math.sin(angle);

      _ctx.beginPath();
      _ctx.moveTo(x, y);
      _ctx.lineTo(x + dx, y + dy);
      _ctx.lineWidth = 20;
      _ctx.strokeStyle =  "rgb(120, 120, 0)";
      _ctx.stroke();
      
      /*
       * SECOND
       */
      //var gap = Math.floor(ms/(1000/10));
      //console.log(gap);
      //angle = (90 - (s + gap/10) * 360.0/60.0) * Math.PI/180;
      angle = (90 - (s + ms/1000.0) * 360.0/60.0) * Math.PI/180;
      dx = 1.7 * len * Math.cos(angle);
      dy = -1.7 * len * Math.sin(angle);

      _ctx.beginPath();
      _ctx.moveTo(x, y);
      _ctx.lineTo(x + dx, y + dy);
      _ctx.lineWidth = 10;
      _ctx.strokeStyle = "rgb(120, 0, 0)";
      _ctx.stroke();

      
      _ctx.beginPath();
      _ctx.fillStyle = "rgb(120, 0, 0)";
      _ctx.arc(x, y, 20, 0, 2 * Math.PI, true);
      _ctx.fill();
      
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
      let gray = 100 + 100 * Math.random();
      this.R = gray;
      this.G = gray;
      this.B = gray;
      this.A = 0.4 + Math.random() * 0.6;//0.3 - 1.0 
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
      if (this.t > this.elapse) {
        this.initial(c);
        this.elapse = 3 + Math.random();
      }
    }
  }
  return p;
}
