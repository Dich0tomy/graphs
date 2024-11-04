import { clamp } from './Math.js'

class Anchor
{
  constructor(x, y) {
    this._x = x
    this._y = y
  }

  draw(ctx) {
    const { x, y } = this

    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, 2 * Math.PI)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  inside(x, y) {
    return Math.abs(this.x - x) <= this.size + 1
      && Math.abs(this.y - y) <= this.size + 1
  }

  size = 8
  x = 0
  y = 0
}

export class BoundingBox {
  constructor() {}

  setBounds(x, y, width, height) {
    this._anchors[0].y = y + height
    this._anchors[0].x = x
    this._anchors[1].y = y
    this._anchors[1].x = x + width

    this._updateBounds()
    this._maxRect = this._rect
  }

  draw(ctx) {
    const { x, y, width, height } = this._rect

    ctx.lineWidth = 2
    ctx.strokeStyle = '#5555ee'
    ctx.strokeRect(x, y, width, height)

    ctx.strokeStyle = '#aaaacc'
    ctx.fillStyle = '#5555ee'
    this._anchors.forEach(a => a.draw(ctx))
  }

  click(pos) {
    this._drag = this._tryStartDrag(pos)
  }

  release() {
    this._drag = this._noDrag()
  }

  move(pos) {
    if(this._drag.ongoing) {

      const dX = pos.x - this._drag.anchor.x
      const dY = pos.y - this._drag.anchor.y
      this._drag.anchor.x = clamp(
        this._drag.anchor.x += dX,
        this._maxRect.x,
        this._maxRect.x + this._maxRect.width,
      )
      this._drag.anchor.y = clamp(
        this._drag.anchor.y += dY,
        this._maxRect.y,
        this._maxRect.y + this._maxRect.height,
      )
      this._updateBounds()
    }
  }

  protrudance() {
    return Math.max(...this._anchors.map(a => a.size))
  }

  _tryStartDrag(pos) {
    const anchor = this._anchors.filter(a => a.inside(pos.x, pos.y))[0]
    if(anchor) {
      return {
        ongoing: true,
        anchor: anchor,
      }
    }
    return this._noDrag()
  }

  _noDrag() {
    return {
      ongoing: false,
      anchor: null,
    }
  }

  _updateBounds() {
    const a1 = this._anchors[0]
    const a2 = this._anchors[1]
    this._rect = {
      x: a1.x,
      y: a2.y,
      width: a2.x - a1.x,
      height: a1.y - a2.y
    }
  }

  _drag = {
    ongoing: false,
    anchor: null,
  }
  _anchors = [
    new Anchor(0, 0),
    new Anchor(0, 0),
  ];
  _rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
  _maxRect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
}
