import { CanvasDriver } from './CanvasDriver.js';
import { BoundingBox } from './BoundingBox.js';
import { GraphCanvas } from './Canvas.js';

// TODO:
// 1. Create a separate class which stores the GraphSettings
// 2. Create some kind of FileList which will store the following info per each file (graph)
// 	- The image
// 	- The zoom, position, BoundingBox etc. if implemented
// 	- The saved GraphSettings
// 	- Cached graph data I guess
// 	Implement persistence for it as well (https://www.iubenda.com/en/help/5525-cookies-gdpr-requirements), implement it only
// 	if the cookies are enabled.
// 3. I *guess* add some nice utilities, like automatically guessing the BoundingBox, exporting all graphs data simultenously
// 4. Refactor things like Drag to classes
// 5. Rename GraphCanvas to something like Renderer
// 6. Rename files to PascalCase
// 7. FIX: Bounding box for files occupying more than the canvas size

let box = new BoundingBox();

// TODO: Potentially pass the driver to the canvas?
let driver = new CanvasDriver()
let canvas = new GraphCanvas(driver.dimensions(), driver.context2d());

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

			const labelError = document.querySelector(`.input-error[for=${elem.name}]`)
			labelError.style.display = 'block'
			elem.style.border = '2px solid red'
			setTimeout(
				() => {
					labelError.style.display = 'none'
					elem.style.border = originalBorder
				},
				1000
			)
		}
	})
})

setupFileSelector();