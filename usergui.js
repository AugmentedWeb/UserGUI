/*
* usergui.js
* v1.0.0
* https://github.com/AugmentedWeb/UserGui
* Apache 2.0 licensed
*/

class UserGui {
	constructor() {
		const grantArr = GM_info?.script?.grant;
	
		if(typeof grantArr == "object") {
			if(!grantArr.includes("GM.xmlHttpRequest")) {
				prompt(`${this.#projectName} requires xmlHttpRequest to function!\n\nPlease add this to your userscript (with a dot)`, "// @grant       GM.xmlHttpRequest");
			}
		}
	}
	
	#projectName = "UserGui";
	window = undefined;
	document = undefined;
	iFrame = undefined;
	settings = {
		"window" : {
			"title" : "No title set",
			"name" : "userscript-gui",
			"external" : false,
			"centered" : false,
			"size" : {
				"width" : 300,
				"height" : 500,
				"dynamicSize" : true
			}
		},
		"gui" : {
			"internal" : {
				"darkCloseButton" : false,
				"style" : `
					body {
						background-color: #ffffff;
						overflow: hidden;
					}

					form {
						padding: 10px;
					}
			
					#gui {
						height: fit-content;
					}
			
					.rendered-form {
						padding: 10px;
					}

					#header {
						padding: 10px;
						cursor: move;
						z-index: 10;
						background-color: #2196F3;
						color: #fff;
						height: fit-content;
					}

					.header-item-container {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
			
					.left-title {
						font-size: 14px;
						font-weight: bold;
						padding: 0;
						margin: 0;
					}
					
					#button-close-gui {
						vertical-align: middle;
					}

					div .form-group {
						margin-bottom: 15px;
					}

					#resizer {
						width: 10px;
						height: 10px;
						cursor: se-resize;
						position: absolute;
						bottom: 0;
						right: 0;
					}
				`
			},
			"external" : {
				"style" : `
					.rendered-form {
						padding: 10px; 
					}
					div .form-group {
						margin-bottom: 15px;
					}
				`
			}
		},
		"messages" : {
			"blockedPopups" : () => alert(`The GUI (graphical user interface) failed to open!\n\nPossible reason: The popups are blocked.\n\nPlease allow popups for this site. (${window.location.hostname})`)
		}
	};

	// This error page will be shown if the user has not added any pages
	#errorPage = (title, code) => `
		<style>
			.error-page {
				width: 100%;
				height: fit-content;
				background-color: black;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				padding: 25px
			}
			.error-page-text {
				font-family: monospace;
				font-size: x-large;
				color: white;
			}
			.error-page-tag {
				margin-top: 20px;
				font-size: 10px;
				color: #4a4a4a;
				font-style: italic;
				margin-bottom: 0px;
			}
		</style>
		<div class="error-page">
			<div>
				<p class="error-page-text">${title}</p>
				<code>${code}</code>
				<p class="error-page-tag">${this.#projectName} error message</p>
			</div>
		</div>`;

	// The user can add multiple pages to their GUI. The pages are stored in this array.
	#guiPages = [
		{
			"name" : "default_no_content_set",
			"content" : this.#errorPage("Content missing", "Gui.setContent(html, tabName);")
		}
	];

	// The userscript manager's xmlHttpRequest is used to bypass CORS limitations (To load Bootstrap)
	async #bypassCors(externalFile) {
		const res = await new Promise(resolve => {
			GM.xmlHttpRequest({
			method: "GET",
			url: externalFile,
			onload: resolve
			});
		});

		return res.responseText;
	}

	// Returns one tab (as HTML) for the navigation tabs
	#createNavigationTab(page) {
		const name = page.name;

		if(name == undefined) {
			console.error(`[${this.#projectName}] Gui.addPage(html, name) <- name missing!`);
			return undefined;
		} else {
			const modifiedName = name.toLowerCase().replaceAll(' ', '').replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000000000);

			const content = page.content;
			const indexOnArray = this.#guiPages.map(x => x.name).indexOf(name);
			const firstItem = indexOnArray == 0 ? true : false;

			return {
				"listItem" : `
					<li class="nav-item" role="presentation">
						<button class="nav-link ${firstItem ? 'active' : ''}" id="${modifiedName}-tab" data-bs-toggle="tab" data-bs-target="#${modifiedName}" type="button" role="tab" aria-controls="${modifiedName}" aria-selected="${firstItem}">${name}</button>
					</li>
				`,
				"panelItem" : `
					<div class="tab-pane ${firstItem ? 'active' : ''}" id="${modifiedName}" role="tabpanel" aria-labelledby="${modifiedName}-tab">${content}</div>
				`
			};
		}
	}

	// Will determine if a navbar is needed, returns either a regular GUI, or a GUI with a navbar
	#getContent() {
		// Only one page has been set, no navigation tabs will be created
		if(this.#guiPages.length == 1) {
			return this.#guiPages[0].content;
		}
		// Multiple pages has been set, dynamically creating the navigation tabs
		else if(this.#guiPages.length > 1) {
			const tabs = (list, panels) => `
				<ul class="nav nav-tabs" id="userscript-tab" role="tablist">
					${list}
				</ul>
				<div class="tab-content">
					${panels}
				</div>
			`;

			let list = ``;
			let panels = ``;

			this.#guiPages.forEach(page => {
				const data = this.#createNavigationTab(page);

				if(data != undefined) {
					list += data.listItem + '\n';
					panels += data.panelItem + '\n';
				}
			});

			return tabs(list, panels);
		}
	}

	// Returns the GUI's whole document as string
	async #createDocument() {
		const bootstrapStyling = await this.#bypassCors("https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css");
		const bootstrapBundle = await this.#bypassCors("https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js");

		const externalDocument = `
		<!DOCTYPE html>
		<html>
		<head>
			<title>${this.settings.window.title}</title>
			<script>${bootstrapBundle}</script>
			<style>
			${bootstrapStyling}
			${this.settings.gui.external.style}
			</style>
		</head>
		<body>
		${this.#getContent()}
		</body>
		</html>
		`;

		const internalDocument = `
		<!doctype html>
		<html lang="en">
		<head>
			<style>
			${bootstrapStyling}
			${this.settings.gui.internal.style}
			body {
				width: ${this.settings.window.size.width}px
			}
			</style>
			<script>
			${bootstrapBundle}
			</script>
		</head>
		<body>
			<div id="gui">
				<div id="header">
					<div class="header-item-container">
						<h1 class="left-title">${this.settings.window.title}</h1>
						<div class="right-buttons">
							<button type="button" class="${this.settings.gui.internal.darkCloseButton ? "btn-close" : "btn-close btn-close-white"}" aria-label="Close" id="button-close-gui"></button>
						</div>
					</div>
				</div>
				<div id="content">
				${this.#getContent()}
				</div>
				<div id="resizer"></div>
			</div>
		</body>
		</html>
		`;

		if(this.settings.window.external) {
			return externalDocument;
		} else {
			return internalDocument;
		}
	}

	// The user will use this function to add a page to their GUI, with their own HTML (Bootstrap 5)
	addPage(htmlString, tabName) {
		if(this.#guiPages[0].name == "default_no_content_set") {
			this.#guiPages = [];
		}

		this.#guiPages.push({
			"name" : tabName,
			"content" : htmlString
		});
	}

	#getCenterScreenPosition() {
		const guiWidth = this.settings.window.size.width;
		const guiHeight = this.settings.window.size.height;

		const x = (screen.width / 2) - (guiWidth / 2);
		const y = (screen.height / 2) - (guiHeight / 2);
		
		return { "x" : x, "y": y };
	}

	#initializeInternalGuiEvents(iFrame) {
		// - The code below will consist mostly of drag and resize implementations
		// - iFrame window <-> Main window interaction requires these to be done
		// - Basically, iFrame document's event listeners make the whole iFrame move on the main window

		// Sets the iFrame's size
		function setFrameSize(x, y) {
			iFrame.style.width = x + "px";
			iFrame.style.height = y + "px";
		}

		// Gets the iFrame's size
		function getFrameSize() {
			const frameBounds = iFrame.getBoundingClientRect();

			return { "width" : frameBounds.width, "height" : frameBounds.height };
		}

		// Sets the iFrame's position relative to the main window's document
		function setFramePos(x, y) {
			iFrame.style.left = x + "px";
			iFrame.style.top = y + "px";
		}

		// Gets the iFrame's position relative to the main document
		function getFramePos() {
			const frameBounds = iFrame.getBoundingClientRect();
			
			return { "x": frameBounds.x, "y" : frameBounds.y };
		}

		// Sets the frame body's offsetHeight
		function setInnerFrameSize(x, y) {
			const innerFrameElem = iFrame.contentDocument.querySelector("#gui");

			innerFrameElem.style.width = `${x}px`;
			innerFrameElem.style.height = `${y}px`;
		}

		// Gets the frame body's offsetHeight
		function getInnerFrameSize() {
			const innerFrameElem = iFrame.contentDocument.querySelector("#gui");

			return { "x": innerFrameElem.offsetWidth, "y" : innerFrameElem.offsetHeight };
		}

		// Sets the frame's size to the innerframe's size
		const adjustFrameSize = () => {
			const innerFrameSize = getInnerFrameSize();

			setFrameSize(innerFrameSize.x, innerFrameSize.y);
		}

		// Variables for draggable header
		let dragging = false,
			dragStartPos = { "x" : 0, "y" : 0 };

		// Variables for resizer
		let resizing = false,
			lastFrameResizePos = { "x" : 0, "y" : 0 },
			lastInnerFrameResizePos = { "x" : 0, "y" : 0 };

		function handleResize(isInsideFrame, e) {
			let framePos, framePos2;

			if(isInsideFrame) {
				framePos = lastInnerFrameResizePos;
				framePos2 = lastFrameResizePos;
			} else {
				framePos = lastFrameResizePos;
				framePos2 = lastInnerFrameResizePos;
			}

			// Reset the variable to avoid a leap between changing from main frame to iframe
			framePos2 = { "x" : 0, "y" : 0 }; 

			const frameSize = getFrameSize();
			const innerFrameSize = getInnerFrameSize();

			if(framePos.x == 0 && framePos.y == 0) {
				framePos.x = e.clientX;
				framePos.y = e.clientY;
			}

			const deltaX = framePos.x - e.clientX;
			const deltaY = framePos.y - e.clientY;

			// Delta [-50,50] (to avoid a huge leap between sizes)
			// Slows the speed of resizing a bit, though
			if((deltaX >= -50 && deltaX <= 50) && (deltaY >= -2 && deltaY <= 2)) {
				// Current size - delta
				setFrameSize(frameSize.width - deltaX, frameSize.height - deltaY);

				// Current size - delta
				setInnerFrameSize(innerFrameSize.x - deltaX, innerFrameSize.y - deltaY);
			}

			framePos.x = e.clientX;
			framePos.y = e.clientY;
		}

		function handleDrag(isInsideFrame, e) {
			const bR = iFrame.getBoundingClientRect();

			const windowWidth = window.innerWidth,
				windowHeight = window.innerHeight;

			let x, y;

			if(isInsideFrame) {
				x = getFramePos().x += e.clientX - dragStartPos.x;
				y = getFramePos().y += e.clientY - dragStartPos.y;
			} else {
				x = e.clientX - dragStartPos.x;
				y = e.clientY - dragStartPos.y;
			}

			// Check out of bounds: left
			if(x <= 0) {
				x = 0
			}

			// Check out of bounds: right
			if(x + bR.width >= windowWidth) {
				x = windowWidth - bR.width;
			}

			// Check out of bounds: top
			if(y <= 0) {
				y = 0;
			}

			// Check out of bounds: bottom
			if(y + bR.height >= windowHeight) {
				y = windowHeight - bR.height;
			}

			setFramePos(x, y);
		}

		// Dragging start (iFrame)
		this.document.querySelector("#header").addEventListener('mousedown', e => {
			e.preventDefault();
			dragging = true;

			dragStartPos.x = e.clientX;
			dragStartPos.y = e.clientY;
		});

		// Resizing start
		this.document.querySelector("#resizer").addEventListener('mousedown', e => {
			e.preventDefault();

			resizing = true;
		});

		// While dragging or resizing (iFrame)
		this.document.addEventListener('mousemove', e => {
			e.preventDefault();

			if(dragging)
				handleDrag(true, e);

			if(resizing) 
				handleResize(true, e);
		});

		// While dragging or resizing (Main window)
		document.addEventListener('mousemove', e => {
			e.preventDefault();

			if(dragging)
				handleDrag(false, e);

			if(resizing)
				handleResize(false, e);
		});

		// Stop dragging and resizing (iFrame)
		this.document.addEventListener('mouseup', e => {
			e.preventDefault();
			dragging = false;
			resizing = false;
		});

		// Stop dragging and resizing (Main window)
		document.addEventListener('mouseup', e => {
			e.preventDefault();
			dragging = false;
			resizing = false;
		});

		// Adjust the frame size every time the user clicks
		this.document.addEventListener('click', adjustFrameSize);

		// Listener for the close button, closes the internal GUI
		this.document.querySelector("#button-close-gui").addEventListener('click', e => {
			e.preventDefault();

			this.close();
		});

		adjustFrameSize();
	}

	async #openExternalGui(readyFunction) {
		const noWindow = this.window?.closed;

		if(noWindow || this.window == undefined) {
			let pos = "";

			if(this.settings.window.centered) {
				const centerPos = this.#getCenterScreenPosition();
				pos = `left=${centerPos.x}, top=${centerPos.y}`;
			}

			// Create a new window for the GUI
			this.window = window.open("", this.settings.windowName, `width=${this.settings.window.size.width}, height=${this.settings.window.size.height}, ${pos}`);

			if(!this.window) {
				this.settings.messages.blockedPopups();
				return;
			}

			// Write the document to the new window
			this.window.document.write(await this.#createDocument());

			// Dynamic sizing (only height)
			this.window.resizeTo(
				this.window.outerWidth,
				this.settings.window.size.dynamicSize 
					? this.window.document.body.offsetHeight + (this.window.outerHeight - this.window.innerHeight)
					: this.window.outerHeight
			);

			this.document = this.window.document;

			// Call user's function
			if(typeof readyFunction == "function") {
				readyFunction();
			}

			window.onbeforeunload = () => {
				// Close the GUI if parent window closes
				this.close();
			}
		} 
		
		else {
			// Window was already opened, bring the window back to focus
			this.window.focus();
		}
	}

	async #openInternalGui(readyFunction) {
		if(this.iFrame) {
			return;
		}

		const fadeInSpeedMs = 250;

		let left = 0, top = 0;

		if(this.settings.window.centered) {
			const centerPos = this.#getCenterScreenPosition();

			left = centerPos.x;
			top = centerPos.y;
		}

		const iframe = document.createElement("iframe");
		iframe.srcdoc = await this.#createDocument();
		iframe.style = `
			position: absolute;
			top: ${top}px;
			left: ${left}px;
			width: ${this.settings.window.size.width};
			height: ${this.settings.window.size.height};
			border: 0;
			opacity: 0;
			transition: all ${500/1000}s;
			border-radius: 5px;
			box-shadow: rgb(0 0 0 / 6%) 10px 10px 10px;
			z-index: 2147483647;
		`;

		// Prepend the GUI to the document's body
		document.body.prepend(iframe);

		iframe.contentWindow.onload = () => {
			// Fade-in implementation
			iframe.style["opacity"] = "1";
			setTimeout(() => iframe.style["transition"] = "none", fadeInSpeedMs);

			this.window = iframe.contentWindow;
			this.document = iframe.contentDocument;
			this.iFrame = iframe;

			this.#initializeInternalGuiEvents(iframe);

			readyFunction();
		}
	}

	// Determines if the window is to be opened externally or internally
	open(readyFunction) {
		if(this.settings.window.external) {
			this.#openExternalGui(readyFunction);
		} else {
			this.#openInternalGui(readyFunction);
		}
	}

	// Closes the GUI if it exists
	close() {
		if(this.settings.window.external) {
			if(this.window) {
				this.window.close();
			}
		} else {
			if(this.iFrame) {
				this.iFrame.remove();
				this.iFrame = undefined;
			}
		}
	}

	// Creates an event listener a GUI element
	event(name, event, eventFunction) {
		this.document.querySelector(`.field-${name}`).addEventListener(event, eventFunction);
	}

	// Disables a GUI element
	disable(name) {
		[...this.document.querySelector(`.field-${name}`).children].forEach(childElem => {
			childElem.setAttribute("disabled", "true");
		});
	}

	// Enables a GUI element
	enable(name) {
		[...this.document.querySelector(`.field-${name}`).children].forEach(childElem => {
			if(childElem.getAttribute("disabled")) {
				childElem.removeAttribute("disabled");
			}
		});
	}

	// Gets data from types: TEXT FIELD, TEXTAREA, DATE FIELD & NUMBER
	getValue(name) {
		return this.document.querySelector(`.field-${name}`).querySelector(`[id=${name}]`).value;
	}

	// Sets data to types: TEXT FIELD, TEXT AREA, DATE FIELD & NUMBER
	setValue(name, newValue) {
		this.document.querySelector(`.field-${name}`).querySelector(`[id=${name}]`).value = newValue;
	}
	
	// Gets data from types: RADIO GROUP
	getSelection(name) {
		return this.document.querySelector(`.field-${name}`).querySelector(`input[name=${name}]:checked`).value;
	}

	// Sets data to types: RADIO GROUP
	setSelection(name, newOptionsValue) {
		this.document.querySelector(`.field-${name}`).querySelector(`input[value=${newOptionsValue}]`).checked = true;
	}

	// Gets data from types: CHECKBOX GROUP
	getChecked(name) {
		return [...this.document.querySelector(`.field-${name}`).querySelectorAll(`input[name*=${name}]:checked`)]
			.map(checkbox => checkbox.value);
	}

	// Sets data to types: CHECKBOX GROUP
	setChecked(name, checkedArr) {
		const checkboxes = [...this.document.querySelector(`.field-${name}`).querySelectorAll(`input[name*=${name}]`)]
		
		checkboxes.forEach(checkbox => {
			if(checkedArr.includes(checkbox.value)) {
				checkbox.checked = true;
			}
		});
	}
	
	// Gets data from types: FILE UPLOAD
	getFiles(name) {
		return this.document.querySelector(`.field-${name}`).querySelector(`input[id=${name}]`).files;
	}
	
	// Gets data from types: SELECT
	getOption(name) {
		return this.document.querySelector(`.field-${name}`).querySelector(`option[id*=${name}]:checked`).value;
	}

	// Sets data to types: SELECT
	setOption(name, newOptionsValue) {
		this.document.querySelector(`.field-${name}`).querySelector(`option[value=${newOptionsValue}]`).selected = true;
	}

	#typeProperties = [
		{
			"type": "button",
			"event": "click",
			"function": {
				"get" : null,
				"set" : null
			}
		},
		{
			"type": "radio",
			"event": "change",
			"function": {
				"get" : n => this.getSelection(n),
				"set" : (n, nV) => this.setSelection(n, nV)
			}
		},
		{
			"type": "checkbox",
			"event": "change",
			"function": {
				"get" : n => this.getChecked(n),
				"set" : (n, nV) => this.setChecked(n, nV)
			}
		},
		{
			"type": "date",
			"event": "change",
			"function": {
				"get" : n => this.getValue(n),
				"set" : (n, nV) => this.setValue(n, nV)
			}
		},
		{
			"type": "file",
			"event": "change",
			"function": {
				"get" : n => this.getFiles(n),
				"set" : null
			}
		},
		{
			"type": "number",
			"event": "input",
			"function": {
				"get" : n => this.getValue(n),
				"set" : (n, nV) => this.setValue(n, nV)
			}
		},
		{
			"type": "select",
			"event": "change",
			"function": {
				"get" : n => this.getOption(n),
				"set" : (n, nV) => this.setOption(n, nV)
			}
		},
		{
			"type": "text",
			"event": "input",
			"function": {
				"get" : n => this.getValue(n),
				"set" : (n, nV) => this.setValue(n, nV)
			}
		},
		{
			"type": "textarea",
			"event": "input",
			"function": {
				"get" : n => this.getValue(n),
				"set" : (n, nV) => this.setValue(n, nV)
			}
		},
	];

	// The same as the event() function, but automatically determines the best listener type for the element
	// (e.g. button -> listen for "click", textarea -> listen for "input")
	smartEvent(name, eventFunction) {
		if(name.includes("-")) {
			const type = name.split("-")[0].toLowerCase();
			const properties = this.#typeProperties.find(x => type == x.type);

			if(typeof properties == "object") {
				this.event(name, properties.event, eventFunction);

			} else {
				console.warn(`${this.#projectName}'s smartEvent function did not find any matches for the type "${type}". The event could not be made.`);
			}

		} else {
			console.warn(`The input name "${name}" is invalid for ${this.#projectName}'s smartEvent. The event could not be made.`);
		}
	}

	// Will automatically determine the suitable function for data retrivial
	// (e.g. file select -> use getFiles() function)
	getData(name) {
		if(name.includes("-")) {
			const type = name.split("-")[0].toLowerCase();
			const properties = this.#typeProperties.find(x => type == x.type);

			if(typeof properties == "object") {
				const getFunction = properties.function.get;

				if(typeof getFunction == "function") {
					return getFunction(name);

				} else {
					console.error(`${this.#projectName}'s getData function can't be used for the type "${type}". The data can't be taken.`);
				}

			} else {
				console.warn(`${this.#projectName}'s getData function did not find any matches for the type "${type}". The event could not be made.`);
			}

		} else {
			console.warn(`The input name "${name}" is invalid for ${this.#projectName}'s getData function. The event could not be made.`);
		}
	}

	// Will automatically determine the suitable function for data retrivial (e.g. checkbox -> use setChecked() function)
	setData(name, newData) {
		if(name.includes("-")) {
			const type = name.split("-")[0].toLowerCase();
			const properties = this.#typeProperties.find(x => type == x.type);

			if(typeof properties == "object") {
				const setFunction = properties.function.set;

				if(typeof setFunction == "function") {
					return setFunction(name, newData);

				} else {
					console.error(`${this.#projectName}'s setData function can't be used for the type "${type}". The data can't be taken.`);
				}

			} else {
				console.warn(`${this.#projectName}'s setData function did not find any matches for the type "${type}". The event could not be made.`);
			}

		} else {
			console.warn(`The input name "${name}" is invalid for ${this.#projectName}'s setData function. The event could not be made.`);
		}
	}
};
