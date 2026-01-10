var memberimgs = [];
var members = [
    '',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
    'James',
    'Amy',
];

class Vector {

    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Add another vector
    add(otherVector) {
        this.x += otherVector.x;
        this.y += otherVector.y;
        return this;
        //return new Vector(this.x + otherVector.x, this.y + otherVector.y);
    }

    // Subtract another vector
    sub(otherVector) {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
        return this;
    }

    // Scale by a scalar value
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    getScaleV(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    // Calculate length (magnitude)
    getLength() {
        return Math.hypot(this.x, this.y);
    }

    // Normalize (get unit vector)
    getNormalize() {
        const len = this.getLength();
        if (len > 0) {
            return new Vector(this.x / len, this.y / len);
        }
        return new Vector(0, 0);
    }

    normalize() {
        const len = this.getLength();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
        } else {
            this.x = 0;
            this.y = 0;
        }
        return this;
    }

    // Calculate dot product
    dot(otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y;
    }

    getAngle() {
        return this.getAngleFromHeadPoiont(null);
    }

    getAngleFromHeadPoiont(t) {
        let v = t == null ? this : new Vector(t.x - this.x, t.y - this.y);
        let len = v.getLength();//sqrt(v.x * v.x + v.y * v.y);
        if (len < 0.001) len = 0.001;
        let cosvalue = v.x / len;//sqrt(v.x * v.x + v.y * v.y);
        //if (isnan(cosvalue))  return 0;
        if (cosvalue < -1) {
            cosvalue = -1;
        } else if (cosvalue > 1) {
            cosvalue = 1;
        }
        let d = R2D(Math.acos(cosvalue));
        if (v.y < 0) d = 360 - d;
        //log("%f : %f", d, R2D(v.angle(Vec2(1, 0), v)));
        return d;
    }
}

function D2R(degrees) {
    return degrees * (Math.PI / 180);
}

function R2D(radien) {
    return radien * (180 / Math.PI);
}

function getUnitVectorFromAngle(_angle) {
    let x = Math.cos(D2R(_angle));
    return new Vector(x, (_angle < 180 ? 1 : -1) * Math.sqrt(1 - x * x));
}

function convertPos(c, pos) {
    return [pos.x, c.height - pos.y];
}

function getAngleDiff(a1, a2) {

    let diff = Math.abs(a2 - a1);

    if (a1 < a2) {
        if (diff > 180) {
            //diff = 360 - diff;
            //return -diff;
            return diff - 360;
        } else {
            return diff;
        }
    } else {
        if (diff > 180) {
            //diff = 360 - diff;
            //return diff;
            return 360 - diff;
        } else {
            return -diff;
        }
    }

}

function angleNormalized(_a) {
    if (_a < 0) {
        return _a + 360;
    } else if (_a >= 360) {
        return _a - 360;
    }
    return _a;
}

const radius = 20;

class Ball {

    R = 0;
    G = 0;
    B = 0;

    pos = null;
    dir = null;
    name = '';
    action = 0;
    idx = -1;
    target = null;
    bscale = 1;

    initial(c, _idx) {

        this.idx = _idx;
        this.name = members[this.idx];

        this.pos = new Vector(c.width / 2 + c.width * (-0.4 + Math.random() * 0.8),
            c.height / 2 + c.height * (-0.4 + Math.random() * 0.8));
        this.dir = new Vector(0, 0);
    }
    draw(c, _ctx) {

        const img = memberimgs[this.idx];
        if (this.action == 0)
            _ctx.drawImage(img, this.pos.x - img.width / 2, this.pos.y - img.height / 2);
        else {
            _ctx.drawImage(img, this.pos.x - this.bscale * img.width/2, this.pos.y - this.bscale * img.height/2, this.bscale * img.width, this.bscale * img.height);
        }
    }

    wall(c, _dt) {

        const bounce = 1.0;

        if (this.pos.x < radius) { //left
            this.pos.x = radius + 1;
            let diff = getAngleDiff(this.dir.getScaleV(-1).getAngle(), 0);
            diff = 0 + diff;
            diff = angleNormalized(diff);
            let add = getUnitVectorFromAngle(diff).scale(bounce * this.dir.getLength());
            this.dir = add;
        } else if (this.pos.x > c.width - radius) { //right
            this.pos.x = c.width - radius - 1;
            let diff = getAngleDiff(this.dir.getScaleV(-1).getAngle(), 180);
            diff = 180 + diff;
            diff = angleNormalized(diff);
            let add = getUnitVectorFromAngle(diff).scale(bounce * this.dir.getLength());
            this.dir = add;
        }

        if (this.pos.y < radius) { //bottom
            this.pos.y = radius + 1;
            let diff = getAngleDiff(this.dir.getScaleV(-1).getAngle(), 90);
            diff = 90 + diff;
            diff = angleNormalized(diff);
            let add = getUnitVectorFromAngle(diff).scale((bounce - 0.1) * this.dir.getLength());
            //add.add(new Vector(c.width/2 - this.pos.x, 0 - this.pos.y).normalize().scale(c.width/2));
            this.dir = add;
            this.dir.add(new Vector(c.width / 2 - this.pos.x, 0 - this.pos.y).normalize().scale(2 * c.width).scale(_dt));

        } else if (this.pos.y > c.height - radius) { //top
            this.pos.y = c.height - radius - 1;
            let diff = getAngleDiff(this.dir.getScaleV(-1).getAngle(), 270);
            diff = 270 + diff;
            diff = angleNormalized(diff);
            let add = getUnitVectorFromAngle(diff).scale(bounce * this.dir.getLength());
            this.dir = add;
        }
    }

    gravity(c, _dt) {
        let gv = getUnitVectorFromAngle(270).scale(c.height * 0.5).scale(_dt);
        this.dir.add(gv);
    }

    wind(c, _dt) {
        if (!dofan) return;
        //if (Math.random() * 10 < 7) return;


        {
            let wv = new Vector(this.pos.x - c.width / 2, this.pos.y - 0);
            let diff = getAngleDiff(90, wv.getAngle());
            if (Math.abs(diff) < 45) {
                let weight = (100 - Math.abs(diff)) / 90.0;//Math.pow((100 - Math.abs(diff))/90.0, 2);
                wv.normalize().scale(2 * (c.height - this.pos.y) * weight);
                this.dir.add(wv.scale(_dt));
            }

        }


        {
            let wv = new Vector(this.pos.x - 0, this.pos.y - 0);
            let diff = getAngleDiff(45, wv.getAngle());
            if (wv.getLength() < c.width) {
                //let weight = (90 - Math.abs(diff)) / 90.0;//Math.pow((100 - Math.abs(diff))/90.0, 2);
                let weight2 = c.width - wv.getLength();
                wv = getUnitVectorFromAngle(45).scale(2.0 * weight2);
                //wv.normalize().scale(2.0 * weight2);
                this.dir.add(wv.scale(_dt));
            }
        }

        {
            let wv = new Vector(this.pos.x - 0, this.pos.y - c.height);
            let diff = getAngleDiff(315, wv.getAngle());
            if (wv.getLength() < c.width) {
                //let weight = (90 - Math.abs(diff)) / 90.0;//Math.pow((100 - Math.abs(diff))/90.0, 2);
                let weight2 = c.width - wv.getLength();
                wv = getUnitVectorFromAngle(315).scale(2.0 * weight2);
                //wv.normalize().scale(2.0 * weight2);
                this.dir.add(wv.scale(_dt));
            }
        }

        {
            let wv = new Vector(this.pos.x - c.width, this.pos.y - c.height);
            let diff = getAngleDiff(225, wv.getAngle());
            if (wv.getLength() < c.width) {
                //let weight = (90 - Math.abs(diff)) / 90.0;//Math.pow((100 - Math.abs(diff))/90.0, 2);
                let weight2 = c.width - wv.getLength();
                wv = getUnitVectorFromAngle(225).scale(2.0 * weight2);
                //wv.normalize().scale(2.0 * weight2);
                this.dir.add(wv.scale(_dt));
            }
        }

        {
            let wv = new Vector(this.pos.x - c.width, this.pos.y - 0);
            let diff = getAngleDiff(135, wv.getAngle());
            if (wv.getLength() < c.width) {
                //let weight = (90 - Math.abs(diff)) / 90.0;//Math.pow((100 - Math.abs(diff))/90.0, 2);
                let weight2 = c.width - wv.getLength();
                wv = getUnitVectorFromAngle(135).scale(2.0 * weight2);
                //wv.normalize().scale(2.0 * weight2);
                this.dir.add(wv.scale(_dt));
            }
        }

        /*
        {
            let wv = new Vector(this.pos.x - 0, this.pos.y - 0);
            let diff = getAngleDiff(90, wv.getAngle());
            if (Math.abs(diff) < 30) {
                let weight = (100 - Math.abs(diff)) / 90.0;//Math.pow((100 - Math.abs(diff))/90.0, 2);
                wv.normalize().scale(1.0 * (c.height - this.pos.y) * weight);
                this.dir.add(wv.scale(_dt));
            }
        }

        {
            let wv = new Vector(this.pos.x - c.width, this.pos.y - 0);
            let diff = getAngleDiff(90, wv.getAngle());
            if (Math.abs(diff) < 30) {
                let weight = (100 - Math.abs(diff)) / 90.0;//Math.pow((100 - Math.abs(diff))/90.0, 2);
                wv.normalize().scale(1.0 * (c.height - this.pos.y) * weight);
                this.dir.add(wv.scale(_dt));
            }

        }

        if (Math.random() < 0.2) {
            let wv = new Vector(this.pos.x - 0, this.pos.y - c.height);
            let diff = getAngleDiff(0, wv.getAngle());

            let weight = (100 - Math.abs(diff)) / 90.0;//Math.pow((100 - Math.abs(diff))/90.0, 2);
            wv.normalize().scale(2.0 * (c.width - this.pos.x) * weight);
            this.dir.add(wv.scale(_dt));
        }

        if (Math.random() < 0.2) {
            let wv = new Vector(this.pos.x - c.width, this.pos.y - c.height);
            let diff = getAngleDiff(180, wv.getAngle());

            let weight = (100 - Math.abs(diff)) / 90.0;//Math.pow((100 - Math.abs(diff))/90.0, 2);
            wv.normalize().scale(2.0 * (this.pos.x) * weight);
            this.dir.add(wv.scale(_dt));
        }
        */

    }

    update(c, _ctx, dt) {

        let _dt = dt / 1000.0;

        switch (this.action) {
            case 0:

                this.wind(c, _dt);
                this.gravity(c, _dt);
                this.wall(c, _dt);

                if (this.dir.getLength() > c.height * 1.2)
                    this.dir.normalize().scale(c.height);  //console.log('exceed');

                this.pos.add(this.dir.getScaleV(_dt));//this.vector.getScaleV(_dt));
                break;
            case 1:
                if (this.target == null) break;
                this.pos.x = this.pos.x + (this.target.x - this.pos.x) * _dt;
                this.pos.y = this.pos.y + (this.target.y - this.pos.y) * _dt;
                this.bscale += (1.8 - this.bscale) * _dt;
                break;
        }

        this.draw(c, _ctx);

    }

}

var canvas;
var ctx;
var pre = 0;
var keepGoing = false;
var particles = [];
var dofan = false;
var gate = 0;

function stop() {
    keepGoing = false;
    gate = 0;
}
function start() {
    gate = 0;
    keepGoing = false;
    dofan = false
    initAnim();
    setTimeout(function () {
        keepGoing = true;
    }, 1000);
    setTimeout(function () {
        openFan();
    }, 2000);
}
function openFan() {
    dofan = true;
}

function closeFan() {
    dofan = false;
}

function init() {

    canvas = document.getElementById("canvas");
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");

    ctx.font = "24px Monospace";
    ctx.textAlign = "center";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = 'red';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillText('Ready to go', canvas.width / 2, canvas.height / 2);

    drawBox();

}

function drawBox() {

    ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
    //ctx.fillRect(10, 50, 50, 40);
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, 10);
    ctx.stroke();
    ctx.closePath();

    //ctx.roundRect(0, 0, canvas.width, canvas.height, 8);

    //ctx.strokeRect(0, 0, canvas.width, canvas.height);

    //ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    //ctx.scale(1, -1);
    //ctx.fillText('5' , 15, 25);

}

var hole_pos = new Vector(0, 0);
var hole_target_pos = new Vector(0, 0);

function openGate() {
    if (gate > 0) return;
    gate = 1;
    prepareGate();
    setTimeout(function () {
        startUsingGate();
    }, 2000);
}

function prepareGate() {
    hole_target_pos.x = canvas.width * (0.2 + Math.random() * 0.6);
    hole_target_pos.y = canvas.height * (0.3 + Math.random() * 0.4);
}

function startUsingGate() {
    gate = 2;
}

function drawHole(dt) {
    switch (gate) {
        case 0: //nothing
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            break;
        case 1: //ready
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            break;
        case 2: //search
            if (Math.random() > 0.5)
                ctx.fillStyle = 'rgba(0, 255, 0, 1.0)';
            else
                ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
            break;
        case 3:
            ctx.fillStyle = 'rgba(200, 0, 0, 0.5)';
            break;
    }

    hole_pos.x = hole_pos.x + (hole_target_pos.x - hole_pos.x) * 2 * dt / 1000.0;
    hole_pos.y = hole_pos.y + (hole_target_pos.y - hole_pos.y) * 2 * dt / 1000.0;

    ctx.fillRect(hole_pos.x - 5, canvas.height, 10, -(canvas.height - hole_pos.y - 2 * radius));
    //ctx.fillRect(0, hole_pos.y - 5, canvas.width, 10);

    //ctx.fillStyle = 'rgba(' + this.R + ',' + this.G + ',' + this.B + ', 1.0)';
    ctx.beginPath();
    ctx.arc(hole_pos.x, hole_pos.y, radius * 2, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();

    if (gate == 2) {
        let mini = -1;
        let minirange = -1;
        for (let i = 1; i < particles.length; i++) {
            if (particles[i].action != 0) continue;
            let len = new Vector(hole_target_pos.x - particles[i].pos.x, hole_target_pos.y - particles[i].pos.y).getLength();
            if (minirange < 0 || len < minirange) {
                minirange = len;
                mini = i;
            }
        }
        if (minirange < 5) {
            gate = 3;
            particles[mini].action = 1;
            particles[mini].target = new Vector(hole_target_pos.x, hole_target_pos.y);
            setTimeout(() => {
                particles[mini].target = new Vector(hole_target_pos.x, canvas.height * 2);
            }, 2000);
            setTimeout(() => {
                gate = 0;
            }, 3000);
        }
        return;
    }

    if (gate == 3) {
        for (let i = 1; i < particles.length; i++) {
            if (particles[i] != null && particles[i].action == 1) {
                particles[i].draw(canvas, ctx);
            }
        }
    }

}

function anim_update(elapse) {

    let dt = elapse - pre;
    if (dt > 1000) dt = 16.0;
    pre = elapse;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //ctx.fillStyle = 'gray';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

    //ctx.scale(1, -1);        
    //ctx.translate(0, -canvas.height);
    //console.log(ctx.getTransform());

    //let _scale = 0.5;
    const gap = 30;

    ctx.transform(
        (canvas.width - gap * 2) / canvas.width,
        0,
        0,
        -(canvas.height - gap * 2) / canvas.height,
        gap,
        canvas.height - gap
    );

    //ctx.fillStyle = 'gray';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawHole(dt);

    drawBox();
    for (let i = 1; i < particles.length; i++) {
        particles[i].update(canvas, ctx, dt);
    }

    if (gate == 3) {
        drawHole(dt);
    }

    ctx.resetTransform();

    if (keepGoing)
        window.requestAnimationFrame(anim_update);

}

function initAnim() {

    hole_pos = new Vector(canvas.width / 2, canvas.height / 2);
    hole_target_pos = new Vector(canvas.width / 2, canvas.height / 2);

    for (let i = 1; i < members.length; i++) {
        let img = generateBall('' + i);
        memberimgs[i] = img;
    }


    for (let i = 1; i < members.length; i++) {
        particles[i] = new Ball();
        particles[i].initial(canvas, i);
    }

    //if (idx > 0) window.requestAnimationFrame(anim_update);

    if (!keepGoing) {
        keepGoing = true;
        window.requestAnimationFrame(anim_update);
    }

}

//initAnim();

/*
window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var img = document.getElementById("scream");
    ctx.drawImage(img, 10, 10);
};
*/

function generateBall(txt) {

    const fsize = 20;

    //txt = txt.substring(0, 1);

    let _font = fsize + "px Arial";
    var tempCanvas = document.createElement("canvas");
    var tempCtx = tempCanvas.getContext("2d");

    tempCtx.font = _font;
    tempCtx.textBaseline = 'middle';
    //let fw = radius * 2;//Math.ceil(tempCtx.measureText(txt).width) + 4;
    //let fh = radius * 2;//fontsize * 1.2;

    // set the temp canvas size == the canvas size
    tempCanvas.width = radius * 2;
    tempCanvas.height = radius * 2;


    //tempCtx = tempCanvas.getContext("2d");
    tempCtx.font = _font;

    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);


    tempCtx.transform(
        1,
        0,
        0,
        -1,
        0,
        tempCanvas.height
    );

    let r = Math.floor(Math.random() * 10); //console.log(r);
    switch (r) {
        case 0:
            tempCtx.fillStyle = 'rgba(100,100,100, 1.0)';
            break;
        case 1:
            tempCtx.fillStyle = 'rgba(255,0,0, 1.0)';
            break;
        case 2:
            tempCtx.fillStyle = 'rgba(0,200,0, 1.0)';
            break;
        case 3:
            tempCtx.fillStyle = 'rgba(0,0,255, 1.0)';
            break;
        case 4:
            tempCtx.fillStyle = 'rgba(200,200,0, 1.0)';
            break;
        case 5:
            tempCtx.fillStyle = 'rgba(0,200,200, 1.0)';
            break;
        case 6:
            tempCtx.fillStyle = 'rgba(200,0,200, 1.0)';
            break;
        case 7:
            tempCtx.fillStyle = 'rgba(100,200,50, 1.0)';
            break;
        case 8:
            tempCtx.fillStyle = 'rgba(200,100,50, 1.0)';
            break;
        case 9:
            tempCtx.fillStyle = 'rgba(50,100,200, 1.0)';
            break;
    }

    tempCtx.strokeStyle = 'rgba(255, 255, 255, 1.0)';
    tempCtx.lineWidth = 2;

    tempCtx.beginPath();
    tempCtx.arc(tempCanvas.width / 2, tempCanvas.height / 2, radius - 1, 0, 2 * Math.PI, true);
    tempCtx.fill();
    tempCtx.closePath();

    tempCtx.beginPath();
    tempCtx.arc(tempCanvas.width / 2, tempCanvas.height / 2, radius - 2, 0, 2 * Math.PI, true);
    tempCtx.stroke();
    tempCtx.closePath();

    //tempCtx.fillStyle = 'black';
    //tempCtx.fillRect(0, 0, fw, fh);
    //tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.textAlign = "center";

    tempCtx.fillStyle = 'rgba(255,255,255, 1.0)';
    //tempCtx.strokeText(txt, tempCanvas.width / 2, tempCanvas.height / 2); // + '('+ _s +','+ _d +')'
    tempCtx.fillText(txt, tempCanvas.width / 2, tempCanvas.height / 2 + fsize / 3);

    tempCtx.resetTransform();

    const dataURL = tempCanvas.toDataURL(); // Creates a PNG image data URL by default
    // Create a new Image object and set its source to the data URL
    const img = new Image();
    /*
    img.onload = function() {
      // Once the image is loaded, draw it onto the destination canvas
      destCtx.drawImage(img, 0, 0);
    };
    */
    img.src = dataURL;
    return img;

}

init();
