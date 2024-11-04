// TODO: Rename to something like Renderer?
export class Renderer {
  constructor(dimensions, context) {
		this._dims = dimensions
    this._ctx = this._setupContext(context);
  }

	setActiveImage(img) {
    this._image = img;
    requestAnimationFrame(() => this._redrawWhole());
  }

	setActiveBox(box) {
		this._box = box
    requestAnimationFrame(() => this._redrawWhole());
  }

	// TODO: Move somewhere
  _centerOffset(w, h) {
		const offX = Math.floor((this._dims.width - w) / 2);
		const offY = Math.floor((this._dims.height - h) / 2);
		return { x: offX, y: offY }
	}

  _setupContext(ctx) {
		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;

    return ctx;
  }

  _redrawWhole() {
    const { _ctx, _dims, _image } = this

    if(_image) {
      const width = Math.floor(Math.min(_image.width, _dims.width))
      const height = Math.floor(Math.min(_image.height, _dims.height))

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
    this._ctx.fillRect(0, 0, this._dims.width, this._dims.height);
  }

	_dims = null;
  _box = null;
  _image = null;
  _ctx = null;
}
