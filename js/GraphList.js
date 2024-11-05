import { BoundingBox } from "./BoundingBox.js"

export class GraphListElement {
	constructor(dom_element) {
		this.dom_element = dom_element

		this.box = new BoundingBox()
	}

	setActive() {
		this.dom_element.click()
		this.dom_element.classList.add('chosen')
	}

	setInactive() {
		this.dom_element.classList.remove('chosen')
	}

	box = null
	img = null

	dom_element = null
}

export class GraphList {
	constructor(driver) {
		this._driver = driver
		this._setupFileSelector()
	}

	onFilePick(cb) {
		this._filePickCallback = cb
	}

	picked() {
		return this._current !== null
	}

	current() {
		return this._current
	}

	fitCurrent() {
		if(this.picked())
		{
			const bounds = this._calcBounds(this._current)
			const { x, y, width, height } =  bounds
			console.log(bounds)
			this._current?.box.setBounds(x, y, width, height)
		}
	}

	_setupFileSelector() {
		const button = document.querySelector('.settings input[name=file-selector]')

		button.addEventListener('change', ev => {
			const files = Array.from(ev.target.files);
			this._updateFileList(files);
		})

		const label = document.querySelector('label[for=file-selector]')
		label.addEventListener('click', _ev => {
			button.click();
		})
	}

	_updateFileList(files) {
		let list = document.querySelector('.settings .list')
		let graphElems = files.map((file, index) => {
			let li = this._createListElement(file, index)
			let image = this._imageFromFile(file)
			let elem = new GraphListElement(li)
			image.onload = _ev => {
				const { x, y, width, height } = this._calcBounds(elem)
				elem.box.setBounds(x, y, width, height)
			}

			elem.img = image

			return elem
		})
		this._elems.push(...graphElems)

		this._elems.forEach(e => list.prepend(e.dom_element))

		graphElems[0].setActive();
	}

	_createListElement(file, index) {
		let li = document.createElement('li')
		li.textContent = file.name;
		li.addEventListener('click', () => this._updateChosen(index))

		return li
	}

	_updateChosen(index) {
		this._current?.setInactive()
		this._current = this._elems[index]

		// this.fitCurrent()
		this._current.setActive()
		this._filePickCallback(this._current.img, this._current.box)
	}

	_imageFromFile(file) {
		let image = new Image();
		image.src = URL.createObjectURL(file)
		return image
	}

	_calcBounds(elem) {
		const boxProtrudance = elem.box.protrudance()
		const boxOffset = boxProtrudance * 3

		const { width: canvasWidth, height: canvasHeight } = this._driver.dimensions()
		const width = Math.floor(Math.min(elem.img.width, canvasWidth)) - boxOffset
		const height = Math.floor(Math.min(elem.img.height, canvasHeight)) - boxOffset

		const boxOff = this._driver.centerOffset(width, height)

		const obj =  {
			x: boxOff.x,
			y: boxOff.y,
			width: width,
			height: height,
		}

		return obj
	}

	_filePickCallback = () => {}
	_driver = null
	_current = null
	_elems = []
}
