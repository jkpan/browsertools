//const canvas = document.getElementById('canvas');
//const ctx = canvas.getContext('2d');
/*
source = [
        { x: 0,            y: 0 },
        { x: canvas.width, y: 0 },
        { x: canvas.width, y: canvas.height },
        { x: 0,            y: canvas.height }
    ];
    
    target_left = [
        { x: 0, y: canvas.height/2 },
        { x: 0, y: 0 },
        { x: 0, y: canvas.height },
        { x: 0, y: canvas.height/2 }
    ];
    
    target_right = [
        { x: canvas.width, y: 0 },
        { x: canvas.width, y: canvas.height/2 },
        { x: canvas.width, y: canvas.height/2 },
        { x: canvas.width, y: canvas.height }
    ];
*/

const SKEWTOTAL = 30;
var skewidx = -1;
var idxvar = 0;
var idxvar_target = 0;
var imageData = null;
var pre_image = null;
var volAnim = true;

//function init3D() {}

function chkVolDir(pre, now) {
    if (!volAnim || display_mode != 0) {
        skewidx = -1;
        return false;
    }
    if (pre < now) {
        console.log('goLeft');
        goLeft();
        return true;
    }
    if (pre > now) {
        console.log('goRight');
        goRight();
        return true;
    }
    return false;
}

function getOldImage() {

    //imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //
    //ctx.fillStyle = 'rgba(0,0,0,0.2)';
    //ctx.fillRect(0,0,canvas.width, canvas.height);
    const dataURL = canvas.toDataURL();

    // 创建一个新的Image对象
    const _img = new Image();
    _img.src = dataURL;

    _img.onload = function () {
        // 清空Canvas
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 将Image对象绘制到Canvas上
        //ctx.drawImage(img, 0, 0);
        pre_image = _img;
        
        let dorepaint = skewidx < 0;
        if (dorepaint) {
            skewidx = 0;
            _repaint();
        } else {
            skewidx = 0;
        }
    }
}

function goLeft() {
    idxvar = 1.0;
    idxvar_target = 0;
    getOldImage();
}

function goRight() {
    idxvar = 0.0;
    idxvar_target = 1.0;
    getOldImage();
}

function trans_start() {
    if (skewidx < 0) return;
    
    skewidx++;
    //idxvar += (idxvar_target - idxvar) * skewidx/SKEWTOTAL; 
    let progress = idxvar + (idxvar_target - idxvar) * skewidx / SKEWTOTAL;

    let m;

    if (pre_image) {
        ctx.save();
        if (idxvar_target > 0) { //go right right side 
            m = [1 - progress, 0, 0, 1, canvas.width * progress, 0];//calculateTransform(source, current);
            let opa = 1 - progress;
            ctx.globalAlpha = - (opa - 1) * (opa - 1) + 1;
            // y = -(x-1)^2+1
        } else { //go left left side
            m = [progress, 0, 0, 1, 0, 0];//calculateTransform(source, current);
            ctx.globalAlpha = -(progress - 1) * (progress - 1) + 1;
        }
        ctx.setTransform(...m);
        ctx.drawImage(pre_image, 0, 0);
        ctx.restore();
    }

    if (idxvar_target > 0) { //go right
        m = [progress, 0, 0, 1, 0, 0];//calculateTransform(source, current);
    } else { //go left
        m = [(1 - progress), 0, 0, 1, canvas.width * progress, 0];//calculateTransform(source, current);    
    }

    ctx.save();
    ctx.setTransform(...m);

}

function trans_end() {
    ctx.restore();
    if (skewidx > 0 && skewidx == SKEWTOTAL) {
        skewidx = -1;
        if (pre_image)
            pre_image = null;
    }
}

/*
function drawImageTrapezoid(ctx, img, src, dst) {
    const transform = calculateTransform(src, dst);
    ctx.save();
    ctx.setTransform(...transform);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
}
*/

/*
function calculateTransform(src, dst) {

    const [x0, y0] = [src[0].x, src[0].y];
    const [x1, y1] = [src[1].x, src[1].y];
    const [x2, y2] = [src[2].x, src[2].y];
    const [x3, y3] = [src[3].x, src[3].y];

    const [u0, v0] = [dst[0].x, dst[0].y];
    const [u1, v1] = [dst[1].x, dst[1].y];
    const [u2, v2] = [dst[2].x, dst[2].y];
    const [u3, v3] = [dst[3].x, dst[3].y];

    const a = ((u1 - u0) - (u3 - u2)) * (y3 - y0) - ((u3 - u0) - (u2 - u1)) * (y1 - y0);
    const b = ((u1 - u0) - (u3 - u2)) * (x3 - x0) - ((u3 - u0) - (u2 - u1)) * (x1 - x0);
    const c = ((v1 - v0) - (v3 - v2)) * (y3 - y0) - ((v3 - v0) - (v2 - v1)) * (y1 - y0);
    const d = ((v1 - v0) - (v3 - v2)) * (x3 - x0) - ((v3 - v0) - (v2 - v1)) * (x1 - x0);

    const m11 = ((u1 - u0) - (u3 - u2)) / a;
    const m12 = ((v1 - v0) - (v3 - v2)) / c;
    const m21 = ((u3 - u0) - (u2 - u1)) / b;
    const m22 = ((v3 - v0) - (v2 - v1)) / d;
    const dx = u0 - x0 * m11 - y0 * m21;
    const dy = v0 - x0 * m12 - y0 * m22;

    //if (isNaN(x)) { return NaN; }

    return [isNaN(m11)?0:m11, isNaN(m12)?0:m12, isNaN(m21)?0:m21, isNaN(m22)?0:m22, isNaN(dx)?0:dx, isNaN(dy)?0:dy];
}
*/
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