export class CanvasDriver {
  constructor() {
    this._canvas = document.querySelector('canvas');

		this._setupCanvas();
  }

  context2d() {
  	return this._canvas.getContext('2d')
	}

  onmousedown(callback) {
		this._canvas.onmousedown = ev => {
			callback(this._canvasMousePos(ev))
		}
	}

  onmouseup(callback) {
		this._canvas.onmouseup = ev => {
			callback(this._canvasMousePos(ev))
		}
	}

  onmousemove(callback) {
		this._canvas.onmousemove = ev => {
			callback(this._canvasMousePos(ev))
		}
	}

  centerOffset(w, h) {
		const offX = Math.floor((this._canvas.width - w) / 2);
		const offY = Math.floor((this._canvas.height - h) / 2);
		return { x: offX, y: offY }
	}

	dimensions() {
		return {
			width: this._canvas.width,
			height: this._canvas.height,
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

  _canvas = null;
}
