import { CanvasDriver } from './CanvasDriver.js';
import { GraphList } from './GraphList.js';
import { Renderer } from './Renderer.js';

// TODO:
// 1. Only offset the bounding box in certain scenarios instead of modifying it's entire bounds
// 2. Create a separate class which stores the GraphSettings
// 3. Create some kind of FileList which will store the following info per each file (graph)
// 	- The image
// 	- The zoom, position, BoundingBox etc. if implemented
// 	- The saved GraphSettings
// 	- Cached graph data I guess
// 	Implement persistence for it as well (https://www.iubenda.com/en/help/5525-cookies-gdpr-requirements), implement it only
// 	if the cookies are enabled.
// 4. Button for clearing the list, separate smaller buttons for each list element for removing them from the list
// 5. FIX: Bounding box for files occupying more than the canvas size
// 6. I *guess* add some nice utilities, like automatically guessing the BoundingBox, exporting all graphs data simultenously
// 7. Decouple BoundingBox from image size/offset I reckon?
//    Properly update all sizes and dimensions from one place and accomodate the bounding box size for the size of the image and the canvas
//     - The image size must be untouched to haver proper ImageData
//     - A class that holds the proper size and reacts to resize
// 8. Refactor allat

let driver = new CanvasDriver()
let graphList = new GraphList(driver)
let canvas = new Renderer(driver);

driver.onmousedown(pos => {
	if(graphList.picked()) {
		let box = graphList.current().box
		box.click(pos)
		canvas.setActiveBox(box)
	}
})
driver.onmouseup(pos => {
	if(graphList.picked()) {
		let box = graphList.current().box
		box.release(pos)
		canvas.setActiveBox(box)
	}
})
driver.onmousemove(pos => {
	if(graphList.picked()) {
		let box = graphList.current().box
		box.move(pos)
		canvas.setActiveBox(box)
	}
})

window.visualViewport.addEventListener('resize', _ev => {
	if(graphList.picked()) {
		driver.fitCanvas()
		graphList.fitCurrent()
		canvas.redrawWhole()
	}
})

graphList.onFilePick((img, box) => {
	canvas.setActiveBox(box)
	canvas.setActiveImage(img)
})

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
