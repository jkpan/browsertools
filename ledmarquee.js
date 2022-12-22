var subtitle = [ [''], 
                 [''],
                 ['']];
    
var fsize = 128;
var fontFamily = "標楷體";

var FONT = fsize + "px 標楷體";//黑體-繁";//宋體-繁";

var speed = 160;
var speed1 = 160;
var speed_backflash = 0;

var animIdx = 0;
var bgIdx = 0;

var color_0 = '#ffffff';
var color_1 = '#ffffff';
var color_b = '#ffffff';

var swing = 0;
var swing1 = 0;

var canvas;
var ctx;

var phase = 0;
var keepGoing = 0;
var keepLEDGoing = 1;

var pre = 0;
var particles = [];
var particlesAnim = [];
var backEffect;

function initCanvas() {
  canvas = document.getElementById("canvas");
  canvas.width  = window.innerWidth;// Width;
  canvas.height = window.innerHeight;//window.outerHeight;
  ctx = canvas.getContext("2d");
}

function init() {
  initCanvas();

  initLED(0, 0, canvas.width, canvas.height);
  newLEDMask();
}


function newParticle_swingtxt(_txt, xx, yy) {
    let p = {
            x: xx,
            y: yy,
          txt: _txt,
         step: 0,
          len:0,
        color:'#ffffff',
        speed:4.0,
      release: function() {
        this.txt = '';
      },
      sinoutin: function(t) { // 0-1  15 * sinoutin(recoil_t * 1.0/8.0);
        if (t < 0.5) return 2 * t;
        return  -2 * t + 2;//Math.sin(t * Math.PI);//- (t-1) * (t-1) +1 ;
      },
      stepValue: function(peroidSec, range, dt) { //(float &_step, float peroidSec, float range, float dt) {
        this.step += dt/peroidSec;
        if (this.step > 1.0) {
          this.step = 0.0;
        }
        return this.sinoutin(this.step) * range;
      },
      initial: function (c) {
        this.step = 0;
        var _ctx = c.getContext("2d");
        _ctx.font = FONT;// + "px 標楷體";
        this.len = _ctx.measureText(this.txt).width;
        return this.len;
      },
  
      update: function (c, _ctx, dt) {
         
        if (dt > 1000) dt = 16;
        
        dt *= 0.001;

        let t = 2 * Math.abs(c.width - this.len)/this.speed;

        this.x = (c.width - this.len) - this.stepValue(t, (c.width - this.len), dt);

        //this.x -= dt * 0.001 * speed;//dt * 0.001 * (dots + side) * 2;
  
        _ctx.textAlign = "left";
        _ctx.font = FONT;// + "px 標楷體";
        
        _ctx.strokeStyle = this.color;//'white';
        _ctx.lineWidth = 4;
          
        _ctx.fillStyle = this.color;//'white';

        _ctx.strokeText(this.txt, this.x, this.y);
        _ctx.fillText(this.txt, this.x, this.y);
  
      }
    }
    return p;
}

function newParticle_txt(_txt, xx, yy) {
    let p = {
            x: xx,
            y: yy,
          txt: _txt,
        color:'#ffffff',
        speed:160,
      release: function() {
        this.txt = '';
      },
      initial: function (c) {
        //this.release();
        //this.txt = subtitle[this.p][this.idx];
        var _ctx = c.getContext("2d");
        _ctx.font = FONT;// + "px 標楷體";
        return _ctx.measureText(this.txt).width;
      },
  
      update: function (c, _ctx, dt) {
         
        if (dt > 1000) dt = 16;
  
        this.x -= dt * 0.001 * this.speed;//dt * 0.001 * (dots + side) * 2;
         
        if (this.x < -_ctx.measureText(this.txt).width + 10) {
          this.x = c.width;
          return;
        }
          
        _ctx.textAlign = "left";
        _ctx.font = FONT;// + "px 標楷體";
        
        _ctx.strokeStyle = this.color;//color_0;//'white';
        _ctx.lineWidth = 4;
          
        _ctx.fillStyle = this.color;//color_0;//'white';

        _ctx.strokeText(this.txt, this.x, this.y);
        _ctx.fillText(this.txt, this.x, this.y);
  
      }
    }
    return p;
}
  
function anim_update(elapse) {
  
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    let dt = elapse - pre;
    pre = elapse;
  
    /*
    if (keepGoing != 1) {
      initAnim();
      return;
    }
    */

    if (backEffect)
      backEffect.update(canvas, ctx, dt);

    for (var i = 0;i<particlesAnim.length;i++) {
      particlesAnim[i].update(canvas, ctx, dt);
    }

    for (var i = 0;i<particles.length;i++) {
      particles[i].update(canvas, ctx, dt);
    }
     
    if (keepLEDGoing == 1) {
      ledAction4Still(canvas, ctx);
    }
    
    if (keepGoing == 1) {
      window.requestAnimationFrame(anim_update); //console.log("requestAnimationFrame update " + elapse);
    }
  
}

/*
async function restartAnim() {
  console.log('1 keepGoing : ' + keepGoing);
  if (keepGoing == 1) {
    new Promise(function(resolve, reject) {
      
      console.log('2 keepGoing : ' + keepGoing);
      while (keepGoing != -100) {}
      resolve(); // 正確完成的回傳方法//reject();  // 失敗的回傳方法
    }).then(function() {
      console.log('3 keepGoing : ' + keepGoing);
      initAnim();
    });
  }
}
*/
  
function initAnim() {
  
    //keepGoing = 0;
    //if (subtitle.length == 1) return;

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
  
    //console.log(c.width + ', ' + c.height);
    
    if (particles.length >= 1) {
      for (var i = 0;i<particles.length;i++) {
        particles[i].release();
      }
    }

    particles.length = 0;
    particles = [];
  
    //for (let _i = 1;_i<subtitle.length;_i++) {}
    //let yy = c.height/4.0 + fsize/2;
    
    fsize = canvas.height/3;
    FONT = fsize + "px " + fontFamily;
    let xx = c.width;

    //var total = subtitle[1].length;//Math.min(35, 15 + 5 * Math.floor(c.width/500));//console.log('total:'+total);
    if (subtitle[2][0].length > 0) {
      if (swing == 0) {
        particles[0] = newParticle_txt(subtitle[1][0], xx, 0.5 * c.height - fsize/5);//();
        particles[0].speed = speed;
      } else {
        particles[0] = newParticle_swingtxt(subtitle[1][0], xx, 0.5 * c.height - fsize/5);//();
        particles[0].speed = speed;//7 - speed/100.0;
      }
      particles[0].initial(c);
      particles[0].color = color_0;

      if (swing1 == 0) {
        particles[1] = newParticle_txt(subtitle[2][0], xx, 0.5 * c.height + fsize);//();
        particles[1].speed = speed1;
      } else {
        particles[1] = newParticle_swingtxt(subtitle[2][0], xx, 0.5 * c.height + fsize);//();
        particles[1].speed = speed1;//7 - speed1/100.0;
      }
      particles[1].initial(c);
      particles[1].color = color_1;

    } else {
      fsize = canvas.height/2;
      FONT = fsize + "px " + fontFamily;
      if (swing == 0) {
        particles[0] = newParticle_txt(subtitle[1][0], xx, 0.5 * c.height + fsize/3);//();
        particles[0].speed = speed;
      } else {
        particles[0] = newParticle_swingtxt(subtitle[1][0], xx, 0.5 * c.height + fsize/3);//();
        particles[0].speed = speed;//7 - speed/100.0;;
      }

      particles[0].initial(c);
      particles[0].color = color_0;
    }
    
    if (particlesAnim.length >= 1) {
      for (var i = 0;i<particlesAnim.length;i++) {
        particlesAnim[i].release();
      }
    }

    particlesAnim.length = 0;
    particlesAnim = [];

    switch (animIdx) {
      case 0:break;
      case 1:
        for (var i = 0;i<150;i++) {
          particlesAnim[i] = newParticle_casual();
          particlesAnim[i].initial(canvas);
        }
        break;
      case 2:
        for (var i = 0;i<150;i++) {
          particlesAnim[i] = newParticle_in();
          particlesAnim[i].initial(canvas);
        }
        break;
      case 3:
        for (var i = 0;i<150;i++) {
          particlesAnim[i] = newParticle_out();
          particlesAnim[i].initial(canvas);
        }
        break;
      case 4:
        for (var i = 0;i<150;i++) {
          if (Math.random() > 0.5)  
            particlesAnim[i] = newParticle_in();
          else 
            particlesAnim[i] = newParticle_out();
          particlesAnim[i].initial(canvas);
        }
        break;
      case 5:
        for (var i = 0;i<150;i++) {
          particlesAnim[i] = newParticle_ring();
          particlesAnim[i].initial(canvas);
        }
        break;
      case 6:
        for (var i = 0;i<150;i++) {
          particlesAnim[i] = newParticle_snow();
          particlesAnim[i].initial(canvas);
        }
        break;
      case 7:
        for (var i = 0;i<3;i++) {
          particlesAnim[i] = newParticle_firework();
          particlesAnim[i].initial(canvas);
        }
        break;
      case 8:
        particlesAnim[0] = new ClockObj();// newClock();
        particlesAnim[0].initial(canvas);
        break;
        
    }

    if (backEffect) backEffect.release();
    backEffect = null;

    //bgIdx = 1;
    switch(bgIdx) {
      case 0:
        break;
      case 1:
        backEffect = newFlashBG(color_b, speed_backflash);
        backEffect.initial(canvas);
        break;
      default:
        break;
    }

    if (keepGoing == 1) return;

    keepGoing = 1;
    window.requestAnimationFrame(anim_update);
  
}

