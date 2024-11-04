import { GraphCanvas } from './canvas.js';

let canvas = new GraphCanvas();

function imageFromFile(file) {
	let image = new Image();
	image.src = URL.createObjectURL(file)
	return image
}

function updateCanvasWith(file) {
	let image = imageFromFile(file)
  image.onload = () => canvas.setActive(image)
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
