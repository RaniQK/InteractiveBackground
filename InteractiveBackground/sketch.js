let video;

let saveCanvas;

function preload() {
    frame = loadImage('frame.png')
    aa = loadImage('assets/aa.png')
    bb = loadImage('assets/bb.png')
    cc = loadImage('assets/cc.png')
    dd = loadImage('assets/dd.png')
    //     ee = loadImage('assets/e.png')
    //     ff = loadImage('assets/f.png')

}

function setup() {

    createCanvas(640, 530);
    background('white')



    video = createCapture(VIDEO);

    video.size(width / 2, height / 2)

    video.hide();
    pixelDensity(1);


    myButton = new Clickable();
    myButton.resize(60, 40);
    myButton.locate(width / 2 - 30, height - 45);
    myButton.cornerRadius = 13;
    myButton.textColor = "#000000";
    myButton.textSize = 15;
    myButton.text = "Save";

    myButton.onHover = function () {
        this.color = "#a9caf5"
    }

    myButton.onOutside = function () {
        this.color = "#ffd6bf";
    }
    saveCanvas = createGraphics(width - 4, height - 53)
}



function draw() {
    background('white')
    myButton.draw()

    push()
    image(video, 0, 0);//video 1
    blur() //slightly altered from class example to get the directional blur 

    filter3() //filter effect
    pop()


    image(video, width / 2, 0); //video2
    filter2()//purple yellow pink filter


    image(video, 0, height / 2 - 30); //video 3
    mos()

    //detectEdges()

    image(video, width / 2, height / 2 - 30); //video 4
    filter1()//ghost

    image(frame, -2, -3, 640, 480)

    myButton.onRelease = function () {
        saveToFile()
    }

}

function saveToFile() {
    let c = get(0, 0, width, 480);
    saveCanvas.image(c, 0, 0);
    save(saveCanvas, frameCount + ".png");
}

function filter1() { //ghost in noise, based on serpia
    loadPixels();
    for (var y = height / 2 - 23; y < height - 55; y++) {
        for (var x = width / 2; x < width; x++) {
            var index = (x + y * width) * 4;

            let r = pixels[index + 0];
            let g = pixels[index + 1];
            let b = pixels[index + 2];
            let a = pixels[index + 3];

            var tr = (r * 0.193) + (g * 0.769) + (b * 0.189);
            var tg = (r * 0.349) + (g * 0.686) + (b * 0.168);
            var tb = (r * 0.272) + (g * 0.534) + (b * 0.131);

            pixels[index + 0] = tr * random(10);
            pixels[index + 1] = tg * random(10);
            pixels[index + 2] = tb * random(25);
        }
    }
    updatePixels();
}

function filter2() {//colorful aloha
    loadPixels();
    for (var y = 0; y < height / 2; y++) {
        for (var x = width / 2; x < width; x++) {
            var index = (x + y * width) * 4;

            let r = pixels[index + 0];
            let g = pixels[index + 1];
            let b = pixels[index + 2];
            let a = pixels[index + 3];

            let avg = (r + g + b) / 3;

            pixels[index + 0] = avg;
            pixels[index + 1] = avg;
            pixels[index + 2] = avg;
            pixels[index + 3] = 255;

            if (r < 50) {
                pixels[index + 0] = 135
                pixels[index + 1] = 88;
                pixels[index + 2] = 245;
            } else if (r > 50 && r < 100)//purple
            {
                pixels[index + 0] = 245
                pixels[index + 1] = 127;
                pixels[index + 2] = 195;//green
            }
            else {
                pixels[index + 0] = 225
                pixels[index + 1] = 229
                pixels[index + 2] = 59; //yellow
            }

        }
    }
    updatePixels();
}

function filter3() { //color of polaroid
    loadPixels()
    for (var y = 0; y < height / 2 - 30; y++) {
        for (var x = 0; x < width / 2; x++) {
            var index = (x + y * width) * 4

            let r = pixels[index + 0];
            let g = pixels[index + 1];
            let b = pixels[index + 2];
            let a = pixels[index + 3];

            pixels[index + 0] = 2 * r
            pixels[index + 1] = 1.7 * g
            pixels[index + 2] = y / 1.7
            pixels[index + 3] = 252

        }
    }

    updatePixels()
}

function blur() {
    loadPixels();
    for (var y = 0; y < height - 50; y++) {
        for (var x = 0; x < width; x++) {
            boxBlur(x, y);
        }
    }
    updatePixels();
}

function getIndex(x, y) {
    return (x + y * width) * 4;
}

function boxBlur(x, y) {
    let avgR = 0;
    let avgG = 0;
    let avgB = 0;

    let pixelsSeen = 0;

    for (let dx = -1; dx < 7; dx++) {
        for (let dy = -1; dy < 2; dy++) {
            let index = getIndex(x + dx, y + dy);

            if (index < 0 || index > pixels.length) {
                continue;
            }

            let r = pixels[index + 0];
            let g = pixels[index + 1];
            let b = pixels[index + 2];

            avgR += r;
            avgG += g;
            avgB += b;

            pixelsSeen += 1;
        }
    }

    avgR /= pixelsSeen;
    avgG /= pixelsSeen;
    avgB /= pixelsSeen;

    let trueIndex = getIndex(x, y);

    pixels[trueIndex] = avgR;
    pixels[trueIndex + 1] = avgG;
    pixels[trueIndex + 2] = avgB;
}

function mos() { //color of mosaic
    loadPixels()
    let size = 7
    for (var y = height / 2 - 30; y < height - 50; y++) {
        for (var x = 0; x < width / 2; x++) {
            var index = (x + y * width) * 4


            let r = pixels[index + 0];
            let g = pixels[index + 1];
            let b = pixels[index + 2];
            let a = pixels[index + 3];

            var colorScale = (r + g + b) / 3

            if (colorScale < 22.5) {
                image(aa, x, y, size, size)
            }
            else if (colorScale > 22.5 && colorScale < 85) {
                image(bb, x, y, size, size)
            }
            else if (colorScale > 86 && colorScale < 127.5) {
                image(cc, x, y, size, size)
            }
            // else if(colorScale>127.5 &&colorScale < 170){
            //   image(dd,x,y,size,size)
            // }
            // else if(colorScale>170 &&colorScale < 212.5){
            //   image(ee,x,y,size,size)
            // }
            else {
                image(dd, x, y, size, size)
            }


            x = x + size - 1 //update pos
        }
        y = y + size - 1
    }

}

