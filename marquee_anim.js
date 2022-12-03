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
      let range = Math.random() * short * 0.1;
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

function newClock() {
  let p = {
    fontColor : "rgb(120, 120, 120)",
    bgColor : "rgba(0, 0, 0, 0.0)",
    hourColor : "rgb(50, 50, 180)",
    minColor : "rgb(180, 180, 50)",
    secColor : "rgb(180, 50, 50)",
    frequence : -1,
    changeFreq :  function() {
      switch(this.frequence) {
        case -1: this.frequence = 5; break;
        case 5:  this.frequence = 4; break;
        case 4:  this.frequence = 3; break;
        case 3:  this.frequence = 0.5; break;
        case 0.5: this.frequence = -1; break;
      }
    },
    release: function() { },
    initial: function (c) { },
    update: function (c, _ctx, dt) {

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

      /*
      //_ctx.fillStyle = "rgb(100,100,100)" //if (Math.random() > 0.5) 
      //
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
      */

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
      let gray = 128 + 100 * Math.random();
      this.R = gray;
      this.G = gray;
      this.B = gray;
      this.A = 0.6 + Math.random() * 0.4;//0.3 - 1.0 
      this.radius = 0.03 * c.width * ((1 - this.A) + 0.1); //0.7 - 0
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

function newFlashBG(_color, flashpsec) {
  let p = {
    color: _color,
   elapse: 0,
    fpsec:flashpsec,
    release: function() { },
    initial: function (c) {
      this.elapse = 0;
    },
    update: function (c, _ctx, dt) {
      dt *= 0.001;
      this.elapse += dt;
      if (this.fpsec == 0) {
        _ctx.fillStyle = this.color;
      } else {
        let t = 1.0/this.fpsec;
        if (this.elapse < t) {
          if (this.elapse < t/2.0) {
            _ctx.fillStyle = 'black';
          } else {
            _ctx.fillStyle = this.color;
          }
        } else {
          this.elapse = 0;
          _ctx.fillStyle = 'black';
        }
      }
      _ctx.fillRect(0, 0, c.width, c.height);
    }
  }
  return p;
}
