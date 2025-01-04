
var canvas;
var ctx;

var PT_R = 0;
var PT_G = 0;
var PT_B = 0;
var brightest = '';

const fontFamily_array = ["Monospace", "LXGW WenKai Mono TC", "Noto Serif TC", "Shippori Antique B1", "Mochiy Pop One"]; //google fonts
//["報隸-繁", "行楷-繁", "宋體-繁", "黑體-繁"]; //mac system fonts
var fontFamily = fontFamily_array[0];


function setMainColor(R, G, B) {
  PT_R = R;
  PT_G = G;
  PT_B = B;
  brightest = 'rgb(' + (PT_R == 0 ? 0 : 255) + ',' + (PT_G == 0 ? 0 : 255) + ',' + (PT_B == 0 ? 0 : 255) + ',' + '1.0)';
}

function init() {
  canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d"); 
}

function getSong(jsonid) {
  var json_elm = document.getElementById(jsonid);
  if (json_elm) {
    var obj = JSON.parse(json_elm.innerHTML);
    return obj.content;
  }
  return [['']];
}

function newParticle_txt(sequence, total) {
  let p = {
    x: 0,
    y: 0,
    idx: 0,
    //txt: "",
    array: [],
    size: 0,
    seq: sequence,
    ttl: total,
    idxlen: 0,
    elapse: 0,
    gap: 0.1,
    lev: 0,
    release: function () {
      //this.txt = '';
      this.array = [];
      this.array.length = 0;
    },
    initial: function (c) {

      let chapter = 1 + Math.floor(Math.random() * (subtitle.length - 1));
      let verse = 1 + Math.floor(Math.random() * (subtitle[chapter].length - 1));
      //this.txt = subtitle[chapter][verse];

      //this.size = Math.floor(10 + (this.seq/this.ttl) * 20);
      this.size = 15 + 4 * Math.floor(this.seq / 5);

      //size seq越大 lev越小
      this.lev = Math.floor(this.ttl - this.seq) / 5;
      if (this.lev < 3) {
        this.x = Math.floor(this.ttl - this.seq) % 5 * c.width / 5 + 2 * this.lev * c.width / this.ttl;
      } else {
        this.x = c.width * Math.random();
      }
      //this.x = this.seq * c.width/this.ttl;
      //console.log(':'+this.size);

      this.array = Array.from(subtitle[chapter][verse]);//this.txt);

      this.y = 10 + Math.random() * c.height / 4;
      this.idxlen = Math.max(2, Math.floor(this.array.length * 0.8));//10 + 10 * Math.random();
      this.elapse = 0;
      this.idx = 0;
      this.gap = 0.06 + Math.random() * 0.15;
      //console.log('___  ' + this.gap);
      ctx.textAlign = "left";
    },

    update: function (c, _ctx, dt) {

      if (dt > 1000) dt = 16;

      //console.log("matrix: "+dt);

      this.size += 0.05 * this.size * dt * 0.001;
      this.y -= this.size * dt * 0.001;

      //_ctx.textAlign = "left";//var fontFamily = "Arial";//'華康瘦金體';//"cwTeXKai";//"Noto Serif TC";"標楷體";

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

      let _len = this.idxlen;
      for (var i = this.idx; i >= 0; i--) {

        //if (this.array[i] == ' ') continue;

        if (this.array[i] == ' ' || i >= this.array.length) {
          _len--;
          if (_len == 0)
            break;
          continue;
        }

        let _y = this.y + (i * this.size);
        if (_y > canvas.height + this.size) {
          continue;
        }

        if (i == this.idx) {
          
          _ctx.fillStyle = brightest;

        } else {

          let opa = _len / this.idxlen;
          if (this.lev >= 2) opa *= 0.5;
          if (opa < 0.1) break;

          let cl = Math.floor(150 * _len / this.idxlen);

          let _r = PT_R == 0 ? cl : 255;
          let _g = PT_G == 0 ? cl : 255;
          let _b = PT_B == 0 ? cl : 255;

          //let _r = PT_R == 0?0:255;
          //let _g = PT_G == 0?0:255;
          //let _b = PT_B == 0?0:255;

          _ctx.fillStyle = 'rgb(' + _r + ',' + _g + ',' + _b + ',' + opa + ')';
        }
        
        _ctx.fillText(this.array[i], this.x, _y);//this.y + (i * this.size));
        //_ctx.fillText(this.txt.substr(i, 1), this.x, this.y + (i * this.size));

        _len--;
        if (_len == 0) break;
      }

    }
  }
  return p;
}

function anim_update(elapse) {

  var c = document.getElementById("canvas");
  var ctx = c.getContext("2d");

  //ctx.clearRect(0, 0, c.width, c.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, c.width, c.height);

  let dt = elapse - pre;
  pre = elapse;

  //if (Math.random() < 0.05) console.log('dt: ' + dt);

  for (var i = 0; i < particles.length; i++) {
    particles[i].update(c, ctx, dt);
  }
  window.requestAnimationFrame(anim_update);

}

function initAnim() {

  var isinit = false;
  if (particles.length == 0) {
    isinit = true;
  }

  //var c = document.getElementById("canvas");
  //var ctx = c.getContext("2d");
  //console.log(c.width + ', ' + c.height);

  if (particles.length >= 1) {
    for (var i = 0; i < particles.length; i++) {
      particles[i].release();
    }
  }

  particles.length = 0;
  particles = [];

  var total = Math.min(30, 10 + 5 * Math.floor(canvas.width / 500));
  //console.log('total:'+total);
  for (var i = 0; i < total; i++) {
    particles[i] = newParticle_txt(i, total);//();
    particles[i].initial(canvas);
  }

  if (isinit)
    window.requestAnimationFrame(anim_update);
}

function doresize() {
  init();
  initAnim();
}

var pre = 0;
var particles = [];

var subtitle = getSong('scripture');

init();

window.addEventListener('resize', doresize);
window.addEventListener('click', initAnim, false);
//document.getElementsByTagName("canvas")[0].addEventListener("touchend", initAnim, false);

initAnim();


/*
          if (this.lev >= 2) {
            _ctx.fillStyle = 'rgb(' + (PT_R == 0?0:255) + ',' + (PT_G == 0?0:255) + ',' + (PT_B == 0?0:255) + ',' + '1.0)';//'rgb(200, 200, 200, 0.8)';
          } else {
            _ctx.strokeStyle = 'rgb(' +(PT_R == 0?0:255) + ',' + (PT_G == 0?0:255) + ',' + (PT_B == 0?0:255) + ',' + '1.0)';//'rgb(255, 0, 0, 1.0)';
            _ctx.lineWidth = 6;
            _ctx.fillStyle = 'rgb(0,0,0,1.0)';
            _ctx.strokeText(this.array[i], this.x, this.y + (i * this.size));
          }
          */
