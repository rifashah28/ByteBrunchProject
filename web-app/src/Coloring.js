import React from 'react';
import './App.css';

class Point {
  x = 0;
  y = 0;

  constructor(x, y) {
    if(x !== undefined && y !== undefined) {
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
    if(r !== undefined && g !== undefined && b !== undefined) {
      this.r = r;
      this.g = g;
      this.b = b;
      if(a !== undefined) {
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


export default class Coloring extends React.Component {
  canvasId = 'coloring-canvas';
  canvasWidth = 600;
  canvasHeight = 400;

  get canvas() {
    return document.getElementById(this.canvasId)
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
    this.fill(point, new Color(0xff, 0, 0, 0xff));
  }

  drawImg() {
    var ctx = this.getCtx();
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
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

    while(queue.length > 0) {
      const cursor = queue.shift();

      if(!(visited.has(cursor.toString()))) {
        visited.add(cursor.toString());

        setPixel(imageData, cursor, color);

        for(const c of CARDINALS) {
          const coord = cursor.add(c);
          if(coord.x >= 0 && coord.x < imageData.width
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

  handleLoad() {
    this.drawImg()
  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoad.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.handleLoad.bind(this))
  }

  render() {
    return (
      <div className="App">
        <canvas id={this.canvasId} width={this.canvasWidth} height={this.canvasHeight} onClick={e => this.clickCanvas(e)} style={{border: '1px solid'}}></canvas>
      </div>
    );
  };

};
