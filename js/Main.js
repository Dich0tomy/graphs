import { CanvasDriver } from './CanvasDriver.js';
import { BoundingBox } from './BoundingBox.js';
import { Renderer } from './Renderer.js';

// TODO:
// 1. Properly update all sizes and dimensions from one place and accomodate the bounding box size for the size of the image and the canvas
// 2. Use up down and move events from the entire window not just the canvas
// 3. Create a separate class which stores the GraphSettings
// 4. Create some kind of FileList which will store the following info per each file (graph)
// 	- The image
// 	- The zoom, position, BoundingBox etc. if implemented
// 	- The saved GraphSettings
// 	- Cached graph data I guess
// 	Implement persistence for it as well (https://www.iubenda.com/en/help/5525-cookies-gdpr-requirements), implement it only
// 	if the cookies are enabled.
// 5. FIX: Bounding box for files occupying more than the canvas size
// 6. I *guess* add some nice utilities, like automatically guessing the BoundingBox, exporting all graphs data simultenously

let box = new BoundingBox();

// TODO: Potentially pass the driver to the canvas?
let driver = new CanvasDriver()
let canvas = new Renderer(driver.dimensions(), driver.context2d());

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

function imageFromFile(file) {
	let image = new Image();
	image.src = URL.createObjectURL(file)
	return image
}

function updateCanvasWith(file) {
	let img = imageFromFile(file)
  img.onload = () => {
  	canvas.setActiveImage(img)

		const off = driver.centerOffset(img.width, img.height)
		box.setBounds(off.x, off.y, img.width, img.height)
		canvas.setActiveBox(box)
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
