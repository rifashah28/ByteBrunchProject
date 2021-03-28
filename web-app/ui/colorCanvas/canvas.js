'use strict';

class Point {
  x = 0;
  y = 0;

  constructor(x, y) {
    if (x !== undefined && y !== undefined) {
      this.x = x;
      this.y = y;
    }
  }

  add(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  toString() {
    return `Point(${this.x}, ${this.y})`
  }
}

class Color {
  r = 0xff;
  g = 0xff;
  b = 0xff;
  a = 0xff;

  constructor(r, g, b, a) {
    if (r !== undefined && g !== undefined && b !== undefined) {
      this.r = r;
      this.g = g;
      this.b = b;
      if (a !== undefined) {
        this.a = a;
      }
    }
  }

  equals(other) {
    return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a;
  }

  almostEquals(other, delta) {
    delta = delta === undefined ? 64 : delta
    const actualDelta = Math.sqrt(
      Math.pow(this.r - other.r, 2)
      + Math.pow(this.g - other.g, 2)
      + Math.pow(this.b - other.b, 2)
      + Math.pow(this.a - other.a, 2)
    );

    return actualDelta <= delta;
  }
}


function setPixel(imageData, point, color) {
  const base = (point.y * imageData.width + point.x) * 4
  imageData.data[base] = color.r;
  imageData.data[base + 1] = color.g;
  imageData.data[base + 2] = color.b;
  imageData.data[base + 3] = color.a;
}

function getPixel(imageData, point, color) {
  const base = (point.y * imageData.width + point.x) * 4
  return new Color(
    imageData.data[base],
    imageData.data[base + 1],
    imageData.data[base + 2],
    imageData.data[base + 3]
  );
}

class Coloring {
  constructor(canvasElement, drawTool) {
    this.canvas = canvasElement;
    this.canvas.addEventListener('click', (e) => this.clickCanvas(e));

    this.drawTool = drawTool;
  }

  get canvasWidth() {
    return this.canvas.getBoundingClientRect().width;
  }

  get canvasHeight() {
    return this.canvas.getBoundingClientRect().height;
  }

  getCtx() {
    return this.canvas.getContext('2d');
  }

  getCursorPosition(event) {
    const canvas = this.canvas;
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const point = new Point(x, y);
    console.log(point);
    return point;
  }

  clickCanvas(event) {
    const point = this.getCursorPosition(event);
    this.fill(point, this.drawTool.drawColor);
  }

  drawImg() {

    var ctx = this.getCtx();
    var img = new Image();
    img.onload = () => {
      const scale = Math.min(
        this.canvasHeight / img.height,
        this.canvasWidth / img.width
      )
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      const x = (this.canvasWidth - scaledWidth) / 2;
      const y = (this.canvasHeight - scaledHeight) / 2
      console.log(scale);
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    };
    img.src = 'coloring_img/umberella-2013229_960_720.png';
  }

  fill(point, color) {
    const ctx = this.getCtx()
    const imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);

    const replaceColor = getPixel(imageData, point);

    const visited = new Set();
    const queue = [point];
    const CARDINALS = [new Point(1, 0), new Point(0, 1), new Point(-1, 0), new Point(0, -1)]

    while (queue.length > 0) {
      const cursor = queue.shift();

      if (!(visited.has(cursor.toString()))) {
        visited.add(cursor.toString());

        setPixel(imageData, cursor, color);

        for (const c of CARDINALS) {
          const coord = cursor.add(c);
          if (coord.x >= 0 && coord.x < imageData.width
            && coord.y >= 0 && coord.y < imageData.height
            && !(visited.has(coord.toString()))
            && getPixel(imageData, coord).almostEquals(replaceColor)) {
            queue.push(coord);
          }
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);

  }

  start() {
    this.drawImg()
  }
};


class DrawTool {
  WHITE = new Color(0xff, 0xff, 0xff, 0xff);
  constructor() {
    this.selectedColor = new Color(0xff, 0, 0, 0xff);  // the color chosen for the palette
    this.drawColor = new Color(0xff, 0, 0, 0xff);  // either the color or white if the eraser is selected
  }

  erase(eraseFlag) {
    if(eraseFlag) {
      this.drawColor = this.WHITE;
    } else {
      this.drawColor = this.selectedColor;
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  console.log('canvas started');
  const drawTool = new DrawTool();

  const canvasElement = document.getElementById('canvas');
  const coloring = new Coloring(canvasElement, drawTool);
  coloring.start();

  const eraserElement = document.getElementById('eraser');
  eraserElement.addEventListener('click', () => {
    drawTool.erase(true);
  })

  const paintElement = document.getElementById('paint');
  paintElement.addEventListener('click', () => {
    drawTool.erase(false);
  })
});
