class ClockObj {
  fontColor = "rgb(200, 200, 200)";
  bgColor = "rgba(0, 0, 0, 0.5)";
  frequence = -1;

  hourColor = "rgb(0, 200, 200)";
  minColor = "rgb(255, 255, 50)";
  secColor = "rgb(255, 50, 50)";
  mode = 0;
  isDark = false;

  constructor() {}

  release() {}
  initial(c) {}

  changeFreq() {
    switch (this.frequence) {
      case -1:
        this.frequence = 5;
        break;
      case 5:
        this.frequence = 4;
        break;
      case 4:
        this.frequence = 3;
        break;
      case 3:
        this.frequence = 0.5;
        break;
      case 0.5:
        this.frequence = -1;
        break;
    }
  }

  switchDisplayMode() {
    this.mode = (this.mode + 1) % 3;
  }

  setDarkmask() {
    this.isDark = true;
  }

  cancelDarkmask() {
    this.isDark = false;
  }

  update(c, _ctx) {
    if (this.mode == 2) return;

    let x = c.width / 2.0;
    let y = c.height / 2.0;
    let len = Math.min(c.width, c.height) / 5.0;
    let lw = Math.min(c.width, c.height) / 22;

    let date = new Date();

    let h = date.getHours();
    let min = date.getMinutes();
    let s = date.getSeconds();
    let ms = date.getMilliseconds();

    _ctx.strokeStyle = this.fontColor;
    _ctx.fillStyle = this.bgColor;
    _ctx.lineWidth = lw;
    _ctx.beginPath();
    _ctx.arc(x, y, 2 * len + 10, 0, 2 * Math.PI, true);
    _ctx.fill();
    _ctx.stroke();
    _ctx.closePath();

    _ctx.fillStyle = this.fontColor;
    for (let i = 0; i < 12; i++) {
      let angle = ((90 - (i * 360.0) / 12.0) * Math.PI) / 180;
      let dx = 2 * len * Math.cos(angle);
      let dy = -2 * len * Math.sin(angle);
      _ctx.beginPath();
      _ctx.arc(x + dx, y + dy, lw / 1.5, 0, 2 * Math.PI, true);
      _ctx.fill();
      _ctx.closePath();
    }

    _ctx.lineCap = "round";

    /*
     * HOUR
     */
    h = h % 12;
    let angle = ((90 - ((h + min / 60.0) * 360.0) / 12.0) * Math.PI) / 180;
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
    angle = ((90 - ((min + s / 60.0) * 360.0) / 60.0) * Math.PI) / 180;
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
    angle = Math.PI / 180;
    if (this.frequence < 0) {
      angle = (90 - (s + ms / 1000.0) * 6.0) * angle; //360.0/60.0
    } else {
      let hz = this.frequence * 2;
      var gap = Math.floor(ms / (1000 / hz));
      angle = (90 - (s + gap / hz) * 6.0) * angle;
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

    if (this.isDark) {
      _ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      _ctx.fillRect(0, 0, c.width, c.height);
    }
  }

  printDatetime(c, _ctx) {
    if (this.mode == 0) return;

    let date = new Date();

    let h = date.getHours();
    let min = date.getMinutes();
    let s = date.getSeconds();
    //let ms = date.getMilliseconds();

    let _time =
      (h < 10 ? "0" + h : h) +
      ":" +
      (min < 10 ? "0" + min : min) +
      ":" +
      (s < 10 ? "0" + s : s);
    let _date =
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

    let fs = c.width / 10;
    _ctx.font = fs + "px Monospace";

    _ctx.fillStyle = "rgb(200,200,200)";
    _ctx.strokeStyle = "rgb(0,0,0)";//this.fontColor;
    _ctx.lineWidth = Math.ceil(fs / 14.0);

    let x = c.width / 2;
    let y = c.height / 2;
    _ctx.textAlign = "center";

    _ctx.strokeText(_time, x, y);
    _ctx.fillText(_time, x, y);

    _ctx.font = fs / 1.5 + "px Monospace";

    _ctx.strokeText(_date, x, y + fs / 1.5);
    _ctx.fillText(_date, x, y + fs / 1.5);
  }
}
