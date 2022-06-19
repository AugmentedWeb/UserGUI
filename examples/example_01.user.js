// ==UserScript==
// @name        Example-GUI
// @namespace   HKR
// @match       https://example.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      HKR
// @description This is an example userscript made for UserGui
// @require     https://raw.githubusercontent.com/AugmentedWeb/UserGui/main/usergui.js
// @run-at      document-load
// ==/UserScript==

const Gui = new UserGui;
Gui.settings.window.title = "GUI Demo"; // set window title
Gui.settings.window.centered = true;

Gui.addPage(`
<div class="rendered-form">
	<div class="">
		<h2 class="userscript-title" access="false" id="control-8281685">Site InnerText Changer</h2></div>
	<div class=""><address class="userscript-address" access="false" id="control-6944086">This is an example GUI</address></div>
	<div class="formbuilder-text form-group field-text-query-selector">
		<label for="text-query-selector" class="formbuilder-text-label">Query Selector</label>
		<input type="text" class="form-control" name="text-query-selector" access="false" id="text-query-selector">
	</div>
	<div class="formbuilder-textarea form-group field-text-new-value">
		<label for="text-new-value" class="formbuilder-textarea-label">New Value</label>
		<textarea type="textarea" class="form-control" name="text-new-value" access="false" id="text-new-value"></textarea>
	</div>
	<div class="formbuilder-button form-group field-button-change-value">
		<button type="button" class="btn-success btn" name="button-change-value" access="false" style="success" id="button-change-value">Change value</button>
	</div>
</div>
`, "Main");

Gui.addPage(`
<div class="rendered-form">
    <div class="">
        <h2 access="false" class="text-primary" id="control-274549">GUI Settings</h2></div>
    <div class="formbuilder-radio-group form-group field-radio-group-background-color">
        <label for="radio-group-background-color" class="formbuilder-radio-group-label">Primary Color</label>
        <div class="radio-group">
            <div class="formbuilder-radio">
                <input name="radio-group-background-color" access="false" id="radio-group-background-color-1" value="black" type="radio">
                <label for="radio-group-background-color-1">Black</label>
            </div>
            <div class="formbuilder-radio">
                <input name="radio-group-background-color" access="false" id="radio-group-background-color-2" value="pink" type="radio">
                <label for="radio-group-background-color-2">Pink</label>
            </div>
            <div class="formbuilder-radio">
                <input name="radio-group-background-color" access="false" id="radio-group-background-color-3" value="green" type="radio">
                <label for="radio-group-background-color-3">Green</label>
            </div>
                      <div class="formbuilder-radio">
                <input name="radio-group-background-color" access="false" id="radio-group-background-color-3" value="purple" type="radio">
                <label for="radio-group-background-color-3">Purple</label>
            </div>
        </div>
    </div>
</div>
`, "Settings");

function changeSiteValues(querySelector, newValue) {
	if(querySelector && newValue) {
		[...document.querySelectorAll(querySelector)].forEach(elem => {
			elem.innerText = newValue;
		});
	} else {
		Gui.window.alert("Please input both values!");
	}
}

function openGui() {
    Gui.open(() => {
        // "Click" listener for the "Change Value" button
        Gui.smartEvent("button-change-value", () => {
            const querySelector = Gui.getValue("text-query-selector");
            const newValue = Gui.getValue("text-new-value");

            changeSiteValues(querySelector, newValue);
        });

        // "Change" listener for the primary color radio group
        const bgColorRadio = "radio-group-background-color";
        Gui.smartEvent(bgColorRadio, () => {
            const color = Gui.getData(bgColorRadio);

            Gui.setPrimaryColor(color);
        });
    });
}

const openBtn = document.createElement("button");
openBtn.innerText = "Open GUI";
openBtn.onclick = () => {
	openGui();
}

document.querySelector("div").appendChild(openBtn);
