import { CanvasDriver } from './CanvasDriver.js';
import { BoundingBox } from './BoundingBox.js';
import { Renderer } from './Renderer.js';

// TODO:
// 1. Create a separate class which stores the GraphSettings
// 2. Create some kind of FileList which will store the following info per each file (graph)
// 	- The image
// 	- The zoom, position, BoundingBox etc. if implemented
// 	- The saved GraphSettings
// 	- Cached graph data I guess
// 	Implement persistence for it as well (https://www.iubenda.com/en/help/5525-cookies-gdpr-requirements), implement it only
// 	if the cookies are enabled.
// 3. FIX: Bounding box for files occupying more than the canvas size
// 4. I *guess* add some nice utilities, like automatically guessing the BoundingBox, exporting all graphs data simultenously
// 5. Decouple BoundingBox from image size/offset I reckon?
//    Properly update all sizes and dimensions from one place and accomodate the bounding box size for the size of the image and the canvas
//     - The image size must be untouched to haver proper ImageData
//     - A class that holds the proper size and reacts to resize

let box = new BoundingBox();
let currentImage = null

// TODO: Potentially pass the driver to the canvas?
let driver = new CanvasDriver()
let canvas = new Renderer(driver);

driver.onmousedown(pos => {
	box.click(pos)
	canvas.setActiveBox(box)
})
driver.onmouseup(pos => {
	box.release(pos)
	canvas.setActiveBox(box)
})
driver.onmousemove(pos => {
	box.move(pos)
	canvas.setActiveBox(box)
})

function calcBounds() {
	const boxProtrudance = box.protrudance()
	console.log(box.protrudance())
	const boxOffset = boxProtrudance * 3

	const { width: canvasWidth, height: canvasHeight } = driver.dimensions()
	const width = Math.floor(Math.min(currentImage.width, canvasWidth)) - boxOffset
	const height = Math.floor(Math.min(currentImage.height, canvasHeight)) - boxOffset

	const boxOff = driver.centerOffset(width, height)

	const obj =  {
		x: boxOff.x,
		y: boxOff.y,
		width: width,
		height: height,
	}

	console.log(obj)

	return obj
}

window.visualViewport.addEventListener('resize', _ev => {
	driver.fitCanvas()

	if(currentImage) {
		const { x, y, width, height } = calcBounds()
		box.setBounds(x, y, width, height)
		canvas.redrawWhole()
	}
})

function imageFromFile(file) {
	let image = new Image();
	image.src = URL.createObjectURL(file)
	return image
}

function updateCanvasWith(file) {
	let img = imageFromFile(file)
  img.onload = () => {
		currentImage = img

		const { x, y, width, height } = calcBounds()
		box.setBounds(x, y, width, height)
		canvas.setActiveBox(box)
		canvas.setActiveImage(currentImage)
	}
}

function updateFileList(files) {
  let list = document.querySelector('.settings .list')
  let elems = files.map(f => {
    let li = document.createElement('li')
    li.textContent = f.name;

    li.addEventListener('click', () => updateCanvasWith(f))
    return li
  })

  elems.forEach(e => list.prepend(e))

  elems[0].click();
}

function setupFileSelector() {
	const button = document.querySelector('.settings input[name=file-selector]')

	button.addEventListener('change', ev => {
		const files = Array.from(ev.target.files);
		updateFileList(files);
	})

	const label = document.querySelector('label[for=file-selector]')
	label.addEventListener('click', _ev => {
		button.click();
	})
}

// TODO: Refactor to some kind of component that deals with graph settings
const elems = document.querySelectorAll('input[type=number]')
elems.forEach(elem => {
	const originalBorder = elem.style.border
	elem.addEventListener('keypress', ev => {
		const zero = '0'.charCodeAt(0)
		const nine = '9'.charCodeAt(0)
		if(zero > ev.which || ev.which > nine) {
			ev.preventDefault()

			elem.style.border = '2px solid red'
			setTimeout(
				() => {
					elem.style.border = originalBorder
				},
				1000
			)
		}
	})
})

setupFileSelector();
