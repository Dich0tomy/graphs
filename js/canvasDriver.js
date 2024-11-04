
import { BoundingBox } from './boundingBox.js'

import { clamp } from './math.js'

export class GraphCanvas {
  constructor() {
    this._canvas = document.querySelector('canvas');

    this._ctx = this._setupContext(this._canvas.getContext('2d'));

		this._box = new BoundingBox()

    this._setupCanvas();
		this._setupEvents();
  }

  setActive(img) {
    this._image = img;
    const off = this._centerOffset(img.width, img.height)
    this._box.setBounds(off.x, off.y, img.width, img.height)
    requestAnimationFrame(() => this._redrawWhole());
  }

  _centerOffset(w, h) {
		const offX = Math.floor((this._canvas.width - w) / 2);
		const offY = Math.floor((this._canvas.height - h) / 2);
		return { x: offX, y: offY }
	}

  _setupContext(ctx) {
		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
    return ctx;
  }

	_setupEvents() {
		this._canvas.onmousedown = ev => {
			this._box.click(this._canvasMousePos(ev))
		}
		this._canvas.onmouseup = ev => {
			this._box.release()
		}
		this._canvas.onmousemove = ev => {
			this._box.move(this._canvasMousePos(ev))
			this._redrawWhole()
		}
	}

  _setupCanvas() {
    this._canvas.width = this._canvas.clientWidth
    this._canvas.height = this._canvas.clientHeight
  }

  _canvasMousePos(ev) {
    const rect = this._canvas.getBoundingClientRect()

    const x = ev.clientX - Math.trunc(rect.left)
    const y = ev.clientY - Math.trunc(rect.top)

    return { x: x, y: y }
  }

  _redrawWhole(pos) {
    const { _ctx, _canvas, _image } = this

    if(_image) {
      const width = Math.floor(Math.min(_image.width, _canvas.width))
      const height = Math.floor(Math.min(_image.height, _canvas.height))

			const protrudance = this._box.protrudance()
			const aW = (width - protrudance);
			const aH = (height - protrudance);

      const off = this._centerOffset(aW, aH)

      this._clear()
      _ctx.drawImage(
        _image,
        off.x,
				off.y,
				aW,
				aH
      )
      this._box.draw(_ctx)
    }
  }

  _clear() {
    this._ctx.fillStyle = '#ffffff'
    this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  _box = null;
  _image = null;
  _canvas = null;
  _ctx = null;
}
