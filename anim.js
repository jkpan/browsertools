
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
        this.radius = (c.width + c.height)/2 * 0.02 * Math.random();
        //Math.max(c.width, c.height) * 0.02 * Math.random();
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
  
        this.radius = (c.width + c.height)/2 * 0.01 + Math.random() * 50;
        //Math.max(c.width, c.height) * 0.01 + Math.random() * 50;
        //20 + Math.random() * 50;
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
  
        this.radius = (c.width + c.height)/2 * 0.01 + Math.random() * 50;
        //Math.max(c.width, c.height) * 0.01 + Math.random() * 50;
        //20 + Math.random() * 50;
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
  
        this.radius = (c.width + c.height)/2 * 0.01 + Math.random() * 50;
        //Math.max(c.width, c.height) * 0.01 + Math.random() * 50;
        //20 + Math.random() * 50;
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

      //this.radius = 6 + 4 * (1- range/_range);// + Math.random() * 50;      
      this.radius = (c.height/72) + (c.height/84) * (1- range/_range);// + Math.random() * 50;
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
      //let r = 0.0 + (this.radius - 0) * eout;
      let r = this.radius * this.A;
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
      let range = Math.max(c.width, c.height) * 0.25 * (0.5 + Math.random()/2.0);

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
        grd.addColorStop(0, 'rgba(200, 128, 0, 0.8)');
        grd.addColorStop(1, 'rgba(0,0,0, 0)');
  
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
        grd.addColorStop(0, 'rgba(255, 128, 0,1.0)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
  
        // Fill with gradient
        _ctx.fillStyle = grd;
        _ctx.fillRect(0, 0, c.width, c.height/2);
  
        grd = _ctx.createLinearGradient(0, c.height/2, 0, c.height);
        grd.addColorStop(0, 'rgba(255, 128, 0,1.0)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
  
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
    
  class SpotLightObj {
  
    pos = {x:0, y:0};
    a_start;
    a_end;
    elapse;
    range;
    preoid;
    radius;
    type;
    color;

    constructor(_type) {
      
      this.elapse = Math.random();
      this.type = _type;
      this.preoid = 2 + Math.random();

      switch(this.type) {
        case 1:
          this.color = 'rgba(255,255,255,';
          break;
        case 2:
          this.color = 'rgba(80,255,80,';
          break;
        case 3:
          this.color = 'rgba(255,255,80,';
          break;
        case 4:
          this.color = 'rgba(255,80,255,';
          break;
        case 5:
          this.color = 'rgba(80,255,255,';
          break;
      }

    }

    release() { }

    goline(t) {
      if (t < 0.5) return t * 2;
      return  -2 * t + 2;
    }

    getStepVelue(_elapse, _range, _peroid) {
      return _range * this.goline(_elapse/_peroid);
    }

    D2R(x) {
      return x * 0.01745329252;
    }
    //M_PI / 180.0)
    
    R2D(x) {
      return x * 57.29577951;
    }
    //180.0 / M_PI)

    R_POS(_pos, angle, len) {
      angle = this.D2R(angle);
      let _x = _pos.x + Math.cos(angle) * len;
      let _y = _pos.y + Math.sin(angle) * len;
      return {x: _x, y:_y};
    }
  
    update(c, _ctx, dt) {

      this.radius = c.height * 0.8;
      switch(this.type) {
        case 1:
          this.pos.x = c.width/2;
          this.pos.y = -c.height/10;
          this.a_start = 70;
          this.range = 40;
          break;
        case 2:
          this.pos.x = c.width / 4;
          this.pos.y = -c.height/10;
          this.a_start = 90;
          this.range = -40;
          break;
        case 3:
          this.pos.x = c.width * 0.75;
          this.pos.y = -c.height/10;
          this.a_start = 90;
          this.range = 40;
          break;
        case 4:
          this.pos.x = c.width/3;
          this.pos.y = c.height * 1.1;
          this.a_start = -90;
          this.range = 40;
          break;
        case 5:
          this.pos.x = c.width * 2 / 3;
          this.pos.y = c.height * 1.1;
          this.a_start = -90;
          this.range = -40;
          break;
      }
      //console.log(dt);

      dt = dt/1000.0;
      
      //this.a_end = this.a_start + this.range;


      this.elapse += dt;
      if (this.elapse > this.preoid) this.elapse = 0;
      let value = this.a_start + this.getStepVelue(this.elapse, this.range, this.preoid);

      let end_pos = this.R_POS(this.pos, value, this.radius);
      let v = { x: end_pos.x - this.pos.x, 
                y:end_pos.y - this.pos.y};
      
      let r = c.width/8;
      let v_norm = r / Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
      let p1 = {x:end_pos.x + v.y * v_norm,
                y:end_pos.y - v.x * v_norm};
      let p2 = {x:end_pos.x - v.y * v_norm,
                y:end_pos.y + v.x * v_norm};


      // 绘制三角形并应用渐变
      _ctx.beginPath();
      _ctx.moveTo(this.pos.x, this.pos.y);    // 起始点
      _ctx.lineTo(p1.x, p1.y);   // 第一个顶点
      _ctx.lineTo(p2.x, p2.y);  // 第二个顶点
      _ctx.closePath();       // 封闭路径

            // 创建线性渐变对象
            let gradient = _ctx.createLinearGradient(
              this.pos.x, this.pos.y, 
              end_pos.x, end_pos.y);
            gradient.addColorStop(0, this.color + '0.8)');      // 起始颜色为红色
            //gradient.addColorStop(0.5, 'rgba(0,0,0, 0.5)');  // 中间颜色为绿色
            gradient.addColorStop(1.0, this.color + '0.0)');     // 结束颜色为蓝色

      _ctx.fillStyle = gradient;  // 设置填充样式为渐变
      _ctx.fill();               // 填充三角形

    }

  }

  function newParticle_led() {
    let p = {
      
      dot: 32,
      R: 80,
      G: 80,
      B: 150,
      data: [[]],

      release: function() {
        console.log('newParticle_led release');
        data = [[]];
      },
      lightProb : function() {
        return Math.floor(10 + Math.random() * 5);
      },
      chgProb : function() {
        return Math.floor(Math.random() * 50) == 0;
      },
      initial: function (c) {
        this.dot = Math.ceil((c.width + c.height)/2/10);
        console.log('newParticle_led initial');
        for (let i = 0; i * this.dot< c.width;i++) {
          this.data[i] = [];
          for (let j = 0;j * this.dot < c.height; j++) {
            if (Math.floor(Math.random() * 4) == 10) {
              this.data[i][j] = this.lightProb();
            } else {
              this.data[i][j] = 0;
            }
          }
        }
        //console.log('newParticle_led update: ' + this.data.length + ', ' + this.data[0].length);
        
      },
      update: function (c, _ctx, dt) {
        //console.log('newParticle_led update: ' + this.data.length + ', ' + this.data[0].length);
        for (let i = 0; i < this.data.length;i++) {
          for (let j = 0;j < this.data[i].length; j++) {
            if (this.data[i][j] > 0) 
              this.data[i][j]--;
            else 
              if (this.chgProb()) this.data[i][j] = this.lightProb();
            
            if (this.data[i][j] > 0) {
              let a = 0.3 + 0.4 * this.data[i][j]/15.0;
              _ctx.fillStyle = 'rgba(' + this.R + ',' + this.G + ',' + this.B + ',' + (a) +')'; //"rgb(0,0,200)";
              _ctx.fillRect (i * this.dot, j * this.dot, this.dot, this.dot);
            }
              
          }
        }
        /*
        for (let x = 0;x < c.width;x += this.dot) {
          for (let y = 0;y < c.height;y += this.dot) {
            if (Math.floor(Math.random() * 4) == 1)
              _ctx.fillRect (x, y, this.dot, this.dot);
          }
        }
        */
      }
    }
    return p;
  }
