// TODO: Rename to something like Renderer?
export class Renderer {
  constructor(driver) {
		this._driver = driver
  }

	setActiveImage(img) {
    this._image = img;
    requestAnimationFrame(() => this.redrawWhole());
  }

	setActiveBox(box) {
		this._box = box
    requestAnimationFrame(() => this.redrawWhole());
  }

	// TODO: Move somewhere
  _centerOffset(w, h) {
  	const { width, height } = this._driver.dimensions()

		const offX = Math.floor((width - w) / 2);
		const offY = Math.floor((height - h) / 2);
		return { x: offX, y: offY }
	}

  _context() {
  	let ctx = this._driver.context2d()

		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;

    return ctx;
  }

  redrawWhole() {
    const { _image } = this
    const { width: canvasWidth, height: canvasHeight } = this._driver.dimensions()
    let ctx = this._context()

    if(_image) {
    	const { floor, min } = Math
			const boxProtrudance = this._box.protrudance()
			const requiredPadding = boxProtrudance * 4

      const width = floor(min(_image.width, canvasWidth)) - requiredPadding
			const height = floor(min(_image.height, canvasHeight)) - requiredPadding

      const off = this._centerOffset(width, height)

      this._clear()
      ctx.drawImage(
        _image,
        off.x,
				off.y,
				width,
				height
      )
      this._box.draw(ctx)
    }
  }

  _clear() {
  	const { width, height } = this._driver.dimensions()
		let ctx = this._context()

    ctx.fillStyle = '#333333'
    ctx.fillRect(0, 0, width, height);
  }

	_driver = null;
  _box = null;
  _image = null;
}
