const APPS = [
  'lyrics', 'Bible', 'NIV', 'BPlay', 'iPlay',
  'url_1', 'url_2', 'url_3',
  'file_1', 'file_2', 'file_3',
  'swipe',
  'anim', 'info', 'effect', 'time', 'dBoard', 'tabs'
];

const GRID_W = 48;
const GRID_H = 48;
const PPPX = "perspective(1000px)";
var PRY_MAX = 20;
const PRY_OPA = 1.0;

var stateSaved = {
  "save0": [],
  "save1": [],
  "save2": [],
  "save3": [],
  "save4": [],
  "save5": []
}

function rYAdd(value) {
  PRY_MAX += value;
  if (PRY_MAX > 80)
    PRY_MAX = 80;
  if (PRY_MAX < 5)
    PRY_MAX = 5;
  console.log('PRY_MAX : ' + PRY_MAX);
}

function buildActionState() {
  let array = [];
  for (let i = 0; i < applets.length; i++) {
    let obj = {};
    obj['name'] = applets[i].keyname;
    obj['posize'] = [applets[i].x, applets[i].y, applets[i].w, applets[i].h];
    obj['visible'] = applets[i].t_Opacity > 0 ? 1 : 0;
    obj['perspective'] = applets[i].t_rotateY != 0 ? 1 : 0;
    array[i] = obj;
  }
  return array;
}

function restoreActionState(array) {
  for (let i = 0; i < array.length; i++) {
    let jobj = array[i];
    let idx = -1;
    for (let i = 0; i < applets.length; i++) {
      if (jobj['name'] == applets[i].keyname) {
        idx = i;
        break;
      }
    }
    if (idx == -1) continue;
    let item = applets[idx];
    item.ctrl_locked = false;
    item.onTop();
    item.gotoxywh(jobj['posize']);
    if (jobj['visible'] == 1) {
      item.progress_show_Self();
    } else {
      item.progress_hide_Self();
    }
    if (jobj['perspective'] == 1) item.progress_3d_Self(); else item.progress_2d_Self();
    item.presave_action();
  }
  anim_update(-1);
}

function stateAction(idx) {
  if (keylock) {
    let saved = buildActionState();
    console.log('state saved: ' + JSON.stringify(saved));
    stateSaved['save' + idx] = saved;
  } else {
    restoreActionState(stateSaved['save' + idx]);
  }
}

function initContent() {
  applets = [];
}

class Applet {

  keyname = null;

  x = 0;
  y = 0;
  w = 0;
  h = 0;
  elm = null;
  ry = 0;

  sx = 0;
  sy = 0;
  sw = 0;
  sh = 0;
  sOpacity = 0;
  sRy = 0;

  t_x = 0;
  t_y = 0;
  t_w = 0;
  t_h = 0;
  t_Opacity = 1.0;
  t_rotateY = 0.0;
  ctrl_locked = 0;
  //t_angle = 0;
  //t_hide = false;

  printInfo() {
    console.log('(' + this.x + ', ' + this.y + ', ' +
      this.w + ', ' + this.h + '), ' +
      this.elm.hidden + ', "' + this.elm.style.opacity + '" ' + this.ry);
  }

  constructor(data) {
    this.keyname = data.keyname;
    this.x = data.x;
    this.y = data.y;
    this.w = data.w;
    this.h = data.h;
    this.elm = document.getElementById(this.keyname);//data.elm;
    this.elm.style.opacity = '1.0';
    //this.elm.style.boxShadow = "10px 5px 5px #ff0000";
    this.ry = 0;
    this.t_rotateY = 0;
    this.sOpacity = 1.0;
    this.t_Opacity = 1.0;
    this.adjust();
    this.presave();
    this.doFix();
  }

  presave_action() {
    if (this.t_x == 1 && this.t_y == 1 && this.t_w == GRID_W && this.t_h == GRID_H) return;
    this.sx = this.t_x;
    this.sy = this.t_y;
    this.sw = this.t_w;
    this.sh = this.t_h;//this.sOpacity = parseFloat(this.elm.style.opacity);
    this.sOpacity = this.t_Opacity;
    this.sRy = this.t_rotateY;
  }

  presave() {
    if (this.x == 1 && this.y == 1 && this.w == GRID_W && this.h == GRID_H) return;
    this.sx = this.x;
    this.sy = this.y;
    this.sw = this.w;
    this.sh = this.h;//this.sOpacity = parseFloat(this.elm.style.opacity);
    this.sOpacity = this.t_Opacity;
    this.sRy = this.t_rotateY;
  }

  gotoxywh(posize) {
    this.t_x = posize[0];
    this.t_y = posize[1];
    this.t_w = posize[2];
    this.t_h = posize[3];
  }

  recover() {
    this.t_x = this.sx;
    this.t_y = this.sy;
    this.t_w = this.sw;
    this.t_h = this.sh;
    this.t_Opacity = this.sOpacity;
    this.t_rotateY = this.sRy;
  } //tmpHide() { this.t_Opacity = 0.0; }

  doFix() {
    //return;
    this.t_x = this.x;
    this.t_y = this.y;
    this.t_w = this.w;
    this.t_h = this.h;
    this.t_Opacity = this.elm.hidden ? 0.0 : 1.0;
    this.t_rotateY = this.ry;
  }

  enlargeSelf() {
    this.t_x = 1;
    this.t_y = 1;
    this.t_w = GRID_W;
    this.t_h = GRID_H;
    this.t_rotateY = 0;
    this.t_Opacity = 1.0;
  }

  targetProgress_easyout() {

    if (this.x != this.t_x) this.x += Math.ceil((this.t_x - this.x) / Math.abs(this.t_x - this.x));
    if (this.y != this.t_y) this.y += Math.ceil((this.t_y - this.y) / Math.abs(this.t_y - this.y));
    if (this.w != this.t_w) this.w += Math.ceil((this.t_w - this.w) / Math.abs(this.t_w - this.w));
    if (this.h != this.t_h) this.h += Math.ceil((this.t_h - this.h) / Math.abs(this.t_h - this.h));

    let opcy = parseFloat(this.elm.style.opacity);

    if (opcy != this.t_Opacity) {
      this.elm.hidden = false;
      opcy += (this.t_Opacity - opcy) * 0.1;
      //opcy += 0.05 * (this.t_Opacity - opcy)/Math.abs(this.t_Opacity - opcy);
      //opcy += (this.t_Opacity - opcy) * 0.016 * 3;
      if (Math.abs(opcy - this.t_Opacity) <= 0.05) {
        opcy = this.t_Opacity;

        if (opcy < 0.1) {
          this.elm.hidden = true;
          //this.elm.style.display = 'none'; console.log('display = none');
        } else {
          this.elm.hidden = false;
          //this.elm.style.display = 'block'; console.log('display = block');
        }

      }

    }

    this.elm.style.opacity = '' + opcy;

    //if (this.x == this.t_x && this.y == this.t_y && this.w == this.t_w && this.h == this.t_h)
    if (this.ry != this.t_rotateY) {
      this.ry += (this.t_rotateY - this.ry) * 0.1;
      if (Math.abs(this.ry - this.t_rotateY) <= 0.5)
        this.ry = this.t_rotateY;
    }

    this.settle();//

    if (this.ry == this.t_rotateY && opcy == this.t_Opacity &&
      this.x == this.t_x && this.y == this.t_y &&
      this.w == this.t_w && this.h == this.t_h) {
      return true;
    }
    return false;
  }

  targetProgress() {

    this.x = this.x == this.t_x ? this.x : this.x > this.t_x ? this.x - 1 : this.x + 1;
    this.y = this.y == this.t_y ? this.y : this.y > this.t_y ? this.y - 1 : this.y + 1;
    this.w = this.w == this.t_w ? this.w : this.w > this.t_w ? this.w - 1 : this.w + 1;
    this.h = this.h == this.t_h ? this.h : this.h > this.t_h ? this.h - 1 : this.h + 1;

    let opcy = parseFloat(this.elm.style.opacity);

    if (opcy != this.t_Opacity) {

      this.elm.hidden = false;

      if (opcy > this.t_Opacity) {
        opcy -= 0.05;
        if (opcy < this.t_Opacity) {
          opcy = this.t_Opacity;
        }
      } else if (opcy < this.t_Opacity) {
        opcy += 0.05;
        if (opcy > this.t_Opacity) {
          opcy = this.t_Opacity;
        }
      }
    }

    this.elm.style.opacity = '' + opcy;

    if (opcy < 0.05) {
      this.elm.hidden = true;
    }

    this.ry = this.ry == this.t_rotateY ? this.ry : this.ry > this.t_rotateY ? this.ry - 1 : this.ry + 1;
    if (Math.abs(this.ry - this.t_rotateY) <= 0.1) 
      this.ry = this.t_rotateY;

    this.settle();//

    if (this.ry == this.t_rotateY && opcy == this.t_Opacity &&
      this.x == this.t_x && this.y == this.t_y &&
      this.w == this.t_w && this.h == this.t_h) {
      return true;
    }
    return false;
  }

  moveX_(_x) {

    let fix_rx = this.x + this.w;

    if (_x < 1) return false;
    if (_x >= fix_rx) return false;
    if (fix_rx - _x < 2) return false;

    this.x = _x;
    this.w = fix_rx - this.x;

    this.settle();
    this.presave();
    this.doFix();

    return true;
  }

  move_X(_x) {

    if (_x > GRID_W + 1) return false;
    if (_x <= this.x) return false;
    if (_x - this.x < 2) return false;
    this.w = _x - this.x;
    this.settle();
    this.presave();
    this.doFix();

    return true;
  }

  moveY_(_y) {

    let fix_by = this.y + this.h;

    if (_y < 1) return false;
    if (_y >= fix_by) return false;
    if (fix_by - _y < 2) return false;

    this.y = _y;
    this.h = fix_by - this.y;

    this.settle();
    this.presave();
    this.doFix();

    return true;
  }

  move_Y(_y) {

    if (_y > GRID_H + 1) return false;
    if (_y <= this.y) return false;
    if (_y - this.y < 2) return false;
    this.h = _y - this.y;
    this.settle();
    this.presave();
    this.doFix();

    return true;
  }

  moveBody(_x, _y) {

    if (_x < 1) {
      return false;
    }
    if (_x + this.w > GRID_W + 1) {
      return false;
    }
    if (_y < 1) {
      return false;
    }
    if (_y + this.h > GRID_H + 1) {
      return false;
    }
    this.x = _x;
    this.y = _y;
    this.settle();
    this.presave();
    this.doFix();

    return true;
  }

  adjust() {

    if (this.w < 1) this.w = 1;
    if (this.h < 1) this.h = 1;

    if (this.x < 1) {
      this.x = 1;
    }
    if (this.x + this.w > GRID_W + 1) {
      this.w = GRID_W + 1 - this.x;
    }

    if (this.y < 1) {
      this.y = 1;
    }
    if (this.y + this.h > GRID_H + 1) {
      this.h = GRID_H + 1 - this.y;
    }

    this.settle();
    this.presave();
    this.doFix();

  }

  settle() {
    //if (!checkRange()) return;
    this.elm.style.gridColumn = this.x + ' / ' + (this.x + this.w);//' '2 / 4';
    this.elm.style.gridRow = this.y + ' / ' + (this.y + this.h);//'1 / 8';
    if (this.ry == 0.0 && this.t_rotateY == 0.0)
      this.elm.style.transform = '';
    else
      this.elm.style.transform = PPPX + " rotateY(" + this.ry + "deg)";
    //console.log('"posize" : ['+this.x + ', ' + this.y + ', ' + this.w +', '+ this.h + ']');
  }

  checkInside(px, py) { //pixel x y
    let _gap_w = canvas.width / GRID_W;
    let _gap_h = canvas.height / GRID_H;
    if (px < (this.x - 1) * _gap_w) return false;
    if (py < (this.y - 1) * _gap_h) return false;
    if (px > (this.x + this.w - 1) * _gap_w) return false;
    if (py > (this.y + this.h - 1) * _gap_h) return false;
    return true;
  }

  check_L_Edge(px) {
    let _gap_w = canvas.width / GRID_W;
    let _gap = 0.25 * _gap_w;
    if (Math.abs(px - (this.x - 1) * _gap_w) < _gap) {
      return true;
    }
    return false;
  }

  check_R_Edge(px) {
    let _gap_w = canvas.width / GRID_W;
    let _gap = 0.25 * _gap_w;
    if (Math.abs(px - (this.x + this.w - 1) * _gap_w) < _gap) {
      return true;
    }
    return false;
  }

  check_T_Edge(py) {
    let _gap_h = canvas.height / GRID_H;
    let _gap = 0.25 * _gap_h;
    if (Math.abs(py - (this.y - 1) * _gap_h) < _gap) {
      return true;
    }
    return false;
  }

  check_B_Edge(py) {
    let _gap_h = canvas.height / GRID_H;
    let _gap = 0.25 * _gap_h;
    if (Math.abs(py - (this.y + this.h - 1) * _gap_h) < _gap) {
      return true;
    }
    return false;
  }

  isHide() {
    return this.t_Opacity == 0.0;
    //return this.elm.hidden;//parseFloat(this.elm.style.opacity) < 0.1;
  }

  progress_show_Self() {
    this.t_Opacity = 1.0;
    this.sOpacity = this.t_Opacity;
  }

  progress_hide_Self() {
    this.t_Opacity = 0.0;
    this.sOpacity = this.t_Opacity;
  }

  progress_hide_show_Self() {
    if (this.t_Opacity == 0.0) { //target to show
      this.elm.style.opacity = '0.0';
      //this.elm.hidden = false;
      this.t_Opacity = 1.0;
      this.presave();
    } else { //target to hide
      this.elm.style.opacity = '1.0';
      //this.elm.hidden = false;
      this.t_Opacity = 0.0;
      this.presave();
    }

    this.t_x = this.x;
    this.t_y = this.y;
    this.t_w = this.w;
    this.t_h = this.h;
  }

  progress_2d_Self() {
    this.t_rotateY = 0;//this.t_Opacity = 1.0;
    this.presave(); //this.doFix();
  }

  progress_3d_Self() {
    /*
    if (this.x + this.w / 2.0 <= (GRID_W / 2.0 + 1)) {
      this.t_rotateY = PRY_MAX;
      this.elm.style.transformOrigin = "left center";//"bottom left";
      //this.t_Opacity = PRY_OPA;
    } else {
      this.t_rotateY = -PRY_MAX;
      this.elm.style.transformOrigin = "right center";//"bottom right";
      //this.t_Opacity = PRY_OPA;
    }
    */
    if (this.t_x + this.t_w / 2.0 <= (GRID_W / 2.0 + 1)) {
      this.t_rotateY = PRY_MAX;
      this.elm.style.transformOrigin = "left center";//"bottom left";
      //this.t_Opacity = PRY_OPA;
    } else {
      this.t_rotateY = -PRY_MAX;
      this.elm.style.transformOrigin = "right center";//"bottom right";
      //this.t_Opacity = PRY_OPA;
    }

    this.presave(); //this.doFix();
  }

  progress_perspective_Self() {
    if (Math.abs(this.t_rotateY) == PRY_MAX) {
      this.progress_2d_Self();
    } else {
      this.progress_3d_Self();
    }
  }

  hideSelf() {
    this.t_Opacity = 0.0;
    this.presave();
  }

  showSelf() {
    this.t_Opacity = 1.0;
    this.presave();
  }

  removeSelf() {
    this.elm.remove();
  }

  isClickHide(px, py) {
    let _gap_w = canvas.width / GRID_W;
    let _gap_h = canvas.height / GRID_H;
    if (px < (this.x - 2 + this.w) * _gap_w) return false;
    if (py > (this.y + 1) * _gap_h || py < (this.y) * _gap_h) return false;
    return true;
  }

  isClickRemove(px, py) {
    let _gap_w = canvas.width / GRID_W;
    let _gap_h = canvas.height / GRID_H;
    if (px < (this.x - 2 + this.w) * _gap_w) return false;
    if (py > (this.y) * _gap_h) return false;
    return true;
  }

  isClickOntop(px, py) {
    let _gap_w = canvas.width / GRID_W;
    let _gap_h = canvas.height / GRID_H;
    if (px < (this.x - 3 + this.w) * _gap_w) return false;
    if (py > (this.y) * _gap_h) return false;
    return true;
  }

  drawSelRect() {

    let _gap_w = canvas.width / GRID_W;
    let _gap_h = canvas.height / GRID_H;

    ctx.lineWidth = _gap_h * 0.25;
    ctx.strokeStyle = 'rgb(0,255,0)';

    ctx.strokeRect((this.x - 1) * _gap_w,
      (this.y - 1) * _gap_h,
      this.w * _gap_w,
      this.h * _gap_h);

    let _x = (this.x - 3 + this.w) * _gap_w;
    let _y = (this.y - 1) * _gap_h;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = Math.floor(_gap_h * 0.75) + "px Arial";

    /*
    //draw ^ ontop
    ctx.fillStyle = 'rgb(0, 180, 0)';
    ctx.fillRect(_x, _y, _gap_w, _gap_h);
    ctx.fillStyle = 'rgb(0, 0, 0)';//"rgb(0,180,0)";
    ctx.fillText('^', _x + _gap_w/2, _y + _gap_h/2);
    */

    //draw X remove
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(_x + _gap_w, _y, _gap_w, _gap_h);

    ctx.fillStyle = 'rgb(0, 0, 0)';//"rgb(0,180,0)";
    ctx.fillText('x', _x + _gap_w + _gap_w / 2, _y + _gap_h / 2);


    //draw _ hide
    ctx.fillStyle = 'rgb(0, 180, 0)';
    ctx.fillRect(_x + _gap_w, _y + _gap_h, _gap_w, _gap_h);

    ctx.fillStyle = 'rgb(0, 0, 0)';//"rgb(0,180,0)";
    ctx.fillText('_', _x + _gap_w + _gap_w / 2, _y + _gap_h + _gap_h / 2);


    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = _gap_w + "px Arial";
    ctx.fillStyle = 'rgb(0, 255, 0)';//"rgb(0,180,0)";
    let pos = this.getPosition();
    ctx.fillText(this.keyname, pos[0] + 4, pos[1]);
    //ctx.fillStyle = 'rgb(50, 255, 50)';//"rgb(0,180,0)";
    ctx.fillText(this.x + ', ' + this.y + ', ' + this.w + ', ' + this.h, pos[0] + 4, pos[1] + _gap_w);
  }

  getPosition() {
    let _gap_w = canvas.width / GRID_W;
    let _gap_h = canvas.height / GRID_H;
    return [(this.x - 1) * _gap_w, (this.y - 1) * _gap_h];
  }

  onTop() {
    //先移除自己
    for (let i = 0; i < applets.length; i++)
      if (applets[i].elm == this.elm) {
        applets.splice(i, 1);
        break;
      }
    //設定別的
    for (let i = 0; i < applets.length; i++) {
      applets[i].elm.style.zIndex = '' + i;
    }
    //加回自己
    applets.push(this);
    this.elm.style.zIndex = '' + applets.length;
  }

  getPos() {
    let _gap_w = canvas.width / GRID_W;
    let _gap_h = canvas.height / GRID_H;
    return [(this.x - 1) * _gap_w, (this.y - 1) * _gap_h];
  }

}

/////////////////

function downloadExpJson() {
  let str = JSON.stringify(toObj(), null, "\t");
  console.log(str);
  var downloadLink = document.createElement("a");
  downloadLink.setAttribute("href", "data:text/plain;charset=utf-8," + str);
  downloadLink.setAttribute("download", "dashboard_setting.json"); // 设置下载文件的名称，此处为myFile.txt
  // 4. 使用JavaScript模拟用户点击下载链接，从而触发下载
  downloadLink.click();
}

/*
window.addEventListener('keyup', e => {
  e.preventDefault();
  e.stopPropagation();
  if (e.keyCode == 16) {// || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 91) {
    switchEditMode();
  }
 
}, false);
*/

window.addEventListener('keydown', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.keyCode == 16) { // || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 91) {
    switchEditMode();
  }
}, false);

function switchEditMode() {
  let btn = document.getElementById('editbtn');
  if (!btn) return;
  keylock = !keylock;
  if (keylock) { //edit mode start
    btn.className = 'btn_sel';
    let div = document.getElementById("content_control");
    div.hidden = false;
    _repaint();
  } else {  //end edit mode
    btn.className = 'btn'
    let div = document.getElementById("content_control");
    div.hidden = true;
    mouseDown = -1;
    selectIdx = -1;
  }
}

function sendOX() {

  var b = document.getElementById('oxBtn');
  if (b.textContent == 'o') {
    b.textContent = 'x';
    postMsg('x');
  } else {
    b.textContent = 'o';
    postMsg('o');
  }

}

function preload(url, doneCb) {
  fetch(url).then((response) => {
    return response.json();
  }).then((json) => {
    handleProfile(JSON.stringify(json));
    if (doneCb) doneCb('done');
  }).catch((error) => {
    alert('Error' + error);
    console.log(`Error: ${error}`);
    if (doneCb) doneCb('error');
  });
}

/*
  B/G: B b G g
  ctrl: 1
    perspective: 1, 0
    posize : [,,,]
*/
function handleProfile(fileContent) {

  const jsonData = JSON.parse(fileContent);

  for (let i = 0; i < applets.length; i++) {
    applets[i].removeSelf();
  }

  applets = [];
  _repaint();

  if (jsonData['B/G']) {
    let div = document.getElementById("mainDiv");
    if (jsonData['B/G'] === 'B' || jsonData['B/G'] === 'b') {
      div.style.backgroundColor = 'black';
    } else {
      div.style.backgroundColor = 'black';
      colorSwitch();
    }
  }

  var keys = Object.keys(jsonData);

  // 按照属性名数组的顺序遍历对象，并输出数据
  keys.forEach(function (key) {
    let app = _createFrame(key);
    if (!app) return;
    app.presave();
    app.x = jsonData[key]['posize'][0];
    app.y = jsonData[key]['posize'][1];
    app.w = jsonData[key]['posize'][2];
    app.h = jsonData[key]['posize'][3];
    app.presave();
    app.settle();//app.recover();
    app.doFix();
    if (jsonData[key].obj) {
      app.elm.onload = function () {
        app.elm.onload = null;
        app.elm.contentWindow.postMessage(JSON.stringify(jsonData[key].obj), '/');
      }
    }
    if (jsonData[key]['perspective']) {
      app.progress_3d_Self();
    }
  });

  if (jsonData['stateSaved']) stateSaved = jsonData['stateSaved'];

  anim_update(-1);

  if (jsonData['ctrl'] && jsonData['ctrl'] == 1) openCtrl();

  //closeSideMenu();
}

function selectProfile(event) {
  let inputFile = document.getElementById('profile');
  if (inputFile.files.length == 0) return;

  // 讀取使用者選擇的檔案
  const file = inputFile.files[0];
  const reader = new FileReader();
  reader.readAsText(file);
  // 當讀取完成時，將檔案內容轉換成 JSON 物件並進行處理
  reader.onload = function (event) {
    const fileContent = event.target.result;
    handleProfile(fileContent);
  }
}

function openProfile() {
  document.getElementById('profile').click();
}

/*
 B/G : B, G
 obj 
    posize [x,y,w,h]
    perspective 0, 1
 */
function toObj() {
  let obj = {};

  //if (stateSaved['save0'].length == 0) stateSaved['save0'] = buildActionState();
  if (stateSaved) obj['stateSaved'] = stateSaved;

  for (let i = 0; i < applets.length; i++) {
    obj[applets[i].keyname] = {};
    obj[applets[i].keyname]['posize'] = [applets[i].x, applets[i].y, applets[i].w, applets[i].h];
    obj[applets[i].keyname]['perspective'] = applets[i].t_rotateY != 0 ? 1 : 0;

    try {
      let _obj = applets[i].elm.contentWindow.toObj();
      if (_obj != null) {
        obj[applets[i].keyname]['obj'] = _obj;
      }
    } catch (e) {
      obj[applets[i].keyname]['obj'] = { "url": "" }
    }
  }
  let div = document.getElementById("mainDiv");
  obj['B/G'] = div.style.backgroundColor == 'black' ? 'B' : 'G';
  //console.log(JSON.stringify(obj));
  return obj;
}

function getElmState() {
  let stateArray = {
    lyrics: -1, Bible: -1, NIV: -1, BPlay: -1, iPlay: -1,
    url_1: -1, url_2: -1, url_3: -1,
    file_1: -1, file_2: -1, file_3: -1,
    swipe: -1, 
    anim: -1, info: -1, effect: -1, time: -1,
    dBoard: -1, tabs: -1
  };
  
  let div = document.getElementById("mainDiv");
  stateArray['bgcolor'] = div.style.backgroundColor;

  for (let key in stateArray) {
    for (let i = 0; i < applets.length; i++) {
      if (key == applets[i].keyname) {
        stateArray[key] = '1';
        if (applets[i].t_Opacity == 0) {
          stateArray[key] += '0';
        } else {
          stateArray[key] += '1';
        }
        if (applets[i].t_rotateY != 0) {
          stateArray[key] += '1';
        } else {
          stateArray[key] += '0';
        }
        if (applets[i].ctrl_locked == 1) {
          stateArray[key] += '1';
        } else {
          stateArray[key] += '0';
        }
      }
    }
  }
  return stateArray;
}

var _openWin = null;

function openCtrl() {
  closeCtrl();
  _openWin = window.open("dashboard_control.html", "_blank");
  return;
  if (standalong) {
    _openWin = window.open(
      "dashboard_control.html", 
      "", 
      "popup=no,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,width=300,height=320,top=" + (screen.height - 400) + ",left=" + (screen.width - 840));
  } else {
    _openWin = window.open("dashboard_control.html", "");
  }
}

function closeCtrl() {
  if (_openWin)
    _openWin.close();
  _openWin = null;
}

function colorSwitch() {

  let div = document.getElementById("mainDiv");
  if (div.style.backgroundColor != 'black') {
    div.style.backgroundColor = 'black';
  } else if (div.style.backgroundColor == 'black') {
    div.style.backgroundColor = 'rgb(0, 112, 0)';
  }

}

var canvas;
var ctx;
var keylock = false;
var selectIdx = -1;
var mouseDown = -1;
var mouseDownPos = [0, 0];

var applets = null;

//var keysel = -1;

function anim_update(elapse) {

  //if (elapse < 0) {}
  let count = 0;
  for (let i = 0; i < applets.length; i++) {
    if (applets[i].targetProgress())
      count++;
  }

  if (count == applets.length) {
    return;
  }

  window.requestAnimationFrame(anim_update);

}

function recoverAll() {
  for (let i = 0; i < applets.length; i++) {
    if (!applets[i].ctrl_locked) {
      applets[i].recover();
    }
  }
  anim_update(-1);
}

function showAll() {
  for (let i = 0; i < applets.length; i++) {
    if (!applets[i].ctrl_locked) {
      applets[i].progress_show_Self();
    }
  }
  anim_update(-1);
}

function actionOne(keyname, action) { //0 hide 1 show 2 enlarge
  recoverAll();
  //hideAll();
  let idx = -1;
  for (let i = 0; i < applets.length; i++) {
    if (keyname == applets[i].keyname) {
      idx = i;
      break;
    }
  }

  if (idx == -1) return;
  let app = applets[idx];
  if (app.ctrl_locked) return;

  switch (action) {
    case 0:
      app.progress_hide_Self();
      break;
    case 1:
      app.onTop();
      app.progress_show_Self();
      break;
    case 2:
      app.enlargeSelf();
      break;
  }
  anim_update(-1);
}

function hideAll() {
  for (let i = 0; i < applets.length; i++) {
    if (!applets[i].ctrl_locked) {
      applets[i].progress_hide_Self();
    }
  }
  anim_update(-1);
}

//function fixAll() { for (let i=0;i<applets.length;i++) applets[i].doFix();  }

function createFrame(id, url) {
  //class="full" id="frame_song" frameborder="0" width="100%" height="100%" src="subtitle.html"
  let frame = document.createElement("iframe");
  frame.setAttribute("src", url);
  frame.setAttribute("class", "full");
  frame.setAttribute("id", id);
  frame.style.border = 'none';
  frame.style.width = "100%";
  frame.style.height = "100%";
  document.getElementById("mainDiv").appendChild(frame);
  return frame;
}

function _createFrame(keyname) {
  switch (keyname) {
    case 'tabs': {
      createFrame(keyname, 'tabs.html');
      let app = new Applet({ x: 2, y: 11, w: 24, h: 15, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'dBoard': {
      createFrame(keyname, 'dashboard.html');
      let app = new Applet({ x: 4, y: 15, w: 24, h: 15, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'lyrics': {
      createFrame(keyname, 'subtitle.html');
      let app = new Applet({ x: 3, y: 21, w: 22, h: 27, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'Bible': {
      createFrame(keyname, 'subtitle_b.html');
      let app = new Applet({ x: 12, y: 11, w: 24, h: 27, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'NIV': {
      createFrame(keyname, 'subtitle_niv.html');
      let app = new Applet({ x: 8, y: 12, w: 24, h: 27, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'BPlay': {
      createFrame(keyname, 'subtitle_b_display.html');
      let app = new Applet({ x: 15, y: 21, w: 24, h: 27, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'iPlay': {
      createFrame(keyname, 'image_play.html');
      let app = new Applet({ x: 17, y: 14, w: 24, h: 27, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'url_1':
    case 'url_2': 
    case 'url_3' : {
      createFrame(keyname, 'newurl.html');
      let app = new Applet({ x: 10, y: 5, w: 15, h: 24, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'swipe': {
      createFrame(keyname, 'newurl_slides.html');
      let app = new Applet({ x: 6, y: 1, w: 15, h: 24, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'file_1':
    case 'file_2':
    case 'file_3': {
      createFrame(keyname, 'newfile.html');
      let app = new Applet({ x: 6, y: 1, w: 10, h: 16, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'anim': {
      createFrame(keyname, 'anim.html');
      let app = new Applet({ x: 8, y: 8, w: 24, h: 24, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'info': {
      createFrame(keyname, 'marquee_v.html');
      let app = new Applet({ x: 1, y: 1, w: 5, h: 48, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'effect': {
      createFrame(keyname, 'effect.html');
      let app = new Applet({ x: 18, y: 2, w: 10, h: 10, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    case 'time': {
      createFrame(keyname, 'clock.html');
      let app = new Applet({ x: 36, y: 2, w: 13, h: 20, keyname: keyname });
      applets.push(app);
      app.onTop();
      return app;
    }
    default:
      return null;
  }

}


function appAction(keyname, action) {
  let idx = -1;
  for (let i = 0; i < applets.length; i++) {
    if (keyname == applets[i].keyname) {
      idx = i;
      break;
    }
  }

  if (idx == -1) return;
  let app = applets[idx];

  if (action == 'lock') {
    app.ctrl_locked = !app.ctrl_locked;
    return;
  }

  if (app.ctrl_locked) return;

  switch (action) {
    case 'close':
      applets.splice(idx, 1);
      app.removeSelf();
      break;
    case 'ontop':
      app.onTop();
      break;
    case '3d':
      applets[idx].progress_perspective_Self();
      break;
    case 'show':
      applets[idx].progress_hide_show_Self();
      break;
    default:
      break;
  }

  anim_update(-1); //_repaint();

}

function lockApp(keyname) { appAction(keyname, 'lock'); }
function onTopApp(keyname) { appAction(keyname, 'ontop'); }
function closeApp(keyname) { appAction(keyname, 'close'); }
function switchVisible4iframe(keyname) { appAction(keyname, 'show'); }
function perspective4iframe(keyname) { appAction(keyname, '3d'); }

function spot2iframe(keyname) {

  let idx = -1;
  for (let i = 0; i < applets.length; i++) {
    if (keyname == applets[i].keyname) {
      idx = i;
      break;
    }
  }
  if (idx == -1) {
    _createFrame(keyname);
    return;
  }

  let app = applets[idx];

  if (app.ctrl_locked) return;

  if (app.x == 1 && app.y == 1 && app.w == GRID_W && app.h == GRID_H) {
    app.onTop();
    app.recover();
    anim_update(-1);
    return;
  }

  app.onTop();
  app.enlargeSelf();
  applets[idx].elm.focus();
  anim_update(-1);

}

function init() {

  if (applets == null) initContent();

  if (keylock) switchEditMode();

  let div = document.getElementById("content_control");
  if (div) {
    div.hidden = false;
    div.style.gridColumn = '1 / ' + (GRID_W + 1)//' '2 / 4';
    div.style.gridRow = '1 / ' + (GRID_H + 1);//'1 / 8';
  }

  canvas = document.getElementById("canvas");
  canvas.width = div.clientWidth;
  canvas.height = div.clientHeight;

  ctx = canvas.getContext("2d");

  div.hidden = true;

  let sideMenu = document.getElementById('sideMenu');
  if (sideMenu) sideMenu.style.top = window.innerHeight + 'px';

}

function _repaint() {

  if (!canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let gap_w = canvas.width / GRID_W;
  let gap_h = canvas.height / GRID_H;

  ctx.fillStyle = "rgba(0, 255, 0, 0.1)";
  for (let i = 0; i < GRID_W; i++) {
    for (let j = 0; j < GRID_H; j++) {
      if ((i + j) % 2 == 0)
        ctx.fillRect(i * gap_w, j * gap_h, gap_w, gap_h);
    }
  }

  if (selectIdx >= 0) {
    applets[selectIdx].drawSelRect();
  }

  /*
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = gap_w + "px Arial";
  ctx.fillStyle = 'rgb(0, 255, 0)';//"rgb(0,180,0)";
  for (let i=0;i<applets.length;i++) {
    let pos = applets[i].getPosition();
    //ctx.fillText(' ' + i, pos[0], pos[1]);
    ctx.fillText(applets[i].keyname, pos[0], pos[1]);
  }
  */


}

function postMsg(edata) {
  for (let i = 0; i < applets.length; i++) {
    applets[i].elm.contentWindow.postMessage(edata, '/');
  }
}

// 監聽 message 事件
window.addEventListener('message', e => {

  if (e.data == 'x' || e.data == 'o') {
    postMsg(e.data);
    var b = document.getElementById('oxBtn');
    b.textContent = e.data;
  } else {
    handleProfile(e.data);
  }
}, false);

var mouseX;
var mouseY;

init();
_repaint();

window.addEventListener('resize', e => {
  init();
});

function showCtrlPane(show) {
  let div = document.getElementById("controlDiv");
  //div.hidden = !show;
  if (show) {
    div.style.opacity = '0.8';
  } else {
    div.style.opacity = '0.1';
  }
}

function openSideMenu() {
  let sideMenu = document.getElementById('sideMenu');
  if (sideMenu)
    sideMenu.style.top = (window.innerHeight - 50) + 'px';
}
function closeSideMenu() {
  let sideMenu = document.getElementById('sideMenu');
  if (sideMenu)
    sideMenu.style.top = (window.innerHeight + 50) + 'px';
}

window.addEventListener('beforeunload', function (e) {
  closeCtrl();
});

function registerCanvasEvent() {
  canvas.addEventListener('mousemove', e => {

    mouseX = e.x;
    mouseY = e.y;

    if (mouseDown < 0) {
      /*
      if (selectIdx >= 0 && applets[selectIdx].checkInside(mouseX, mouseY)) {
        _repaint();
        return;
      }
      */
      selectIdx = -1;
      for (let i = applets.length - 1; i >= 0; i--) {
        if (applets[i].checkInside(mouseX, mouseY)) {
          selectIdx = i;
          break;
        }
      }
      _repaint();
      return;
    }

    if (selectIdx < 0) return;

    let _gap_w = canvas.width / GRID_W;
    let _gap_h = canvas.height / GRID_H;

    let applet = applets[selectIdx];
    let pos = applet.getPos();

    let _px = pos[0] + mouseX - mouseDownPos[0];
    let _py = pos[1] + mouseY - mouseDownPos[1];

    //move
    let _x = Math.floor((_px + _gap_w / 2) / _gap_w) + 1;//Math.ceil(_px/_gap_w);
    let _y = Math.floor((_py + _gap_h / 2) / _gap_h) + 1;//Math.ceil(_py/_gap_h);

    switch (mouseDown) {
      case 0:
        if (_x != applet.x || _y != applet.y) {
          if (applet.moveBody(_x, _y)) {
            mouseDownPos = [mouseX, mouseY];
          }
        }
        break;
      case 1:
        if (_x != applet.x) {
          if (applet.moveX_(_x)) {
            mouseDownPos = [mouseX, mouseY];
          }
        }
        break;
      case 2:
        _px = pos[0] + applet.w * _gap_w + mouseX - mouseDownPos[0];
        _x = Math.floor((_px + _gap_w / 2) / _gap_w) + 1;
        if (_x != applet.x + applet.w) {
          if (applet.move_X(_x)) {
            mouseDownPos = [mouseX, mouseY];
          }
        }
        break;
      case 3:
        if (_y != applet.y) {
          if (applet.moveY_(_y)) {
            mouseDownPos = [mouseX, mouseY];
          }
        }
        break;
      case 4:
        _py = pos[1] + applet.h * _gap_h + mouseY - mouseDownPos[1];
        _y = Math.floor((_py + _gap_h / 2) / _gap_h) + 1;
        if (_y != applet.y + applet.h) {
          if (applet.move_Y(_y)) {
            mouseDownPos = [mouseX, mouseY];
          }
        }
        break;
    }

    _repaint();
    return true;

  });

  canvas.addEventListener('mousedown', (e) => {

    mouseDownPos = [e.x, e.y];

    if (selectIdx >= 0) {

      mouseDown = 0;

      let _gap_w = canvas.width / GRID_W;
      let _gap_h = canvas.height / GRID_H;

      let applet = applets[selectIdx];
      let pos = applet.getPos();

      if (applet.isClickHide(mouseX, mouseY)) {
        switchVisible4iframe(applets[selectIdx].keyname);
        return;
      } else if (applet.isClickRemove(mouseX, mouseY)) {
        applets.splice(selectIdx, 1);
        applet.removeSelf();
        selectIdx = -1;
        _repaint();
        return;
      }
      /* 
      else if (applet.isClickOntop(mouseX, mouseY)) {
        applet.onTop();
        _repaint();
        return;
      }
      */

      if (applets[selectIdx].check_L_Edge(mouseX)) {
        mouseDown = 1;
        return;
      }
      if (applets[selectIdx].check_R_Edge(mouseX)) {
        mouseDown = 2;
        return;
      }

      if (applets[selectIdx].check_T_Edge(mouseY)) {
        mouseDown = 3;
        return;
      }
      if (applets[selectIdx].check_B_Edge(mouseY)) {
        mouseDown = 4;
        return;
      }

    }

  });

  canvas.addEventListener('mouseup', (e) => {
    mouseDown = -1;
    if (selectIdx < 0)
      return false;
    if (Math.abs(mouseDownPos[0] - e.x) + Math.abs(mouseDownPos[1] - e.y) < 3) {
      let applet = applets[selectIdx];
      applet.onTop();
    }
    return true;
  });

}

if (canvas)
  registerCanvasEvent();

openSideMenu();
