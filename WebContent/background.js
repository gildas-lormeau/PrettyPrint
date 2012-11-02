/*
 * Copyright 2011 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 * 
 * This file is part of PrettyPrint.
 *
 *   PrettyPrint is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   PrettyPrint is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Lesser General Public License for more details.
 *
 *   You should have received a copy of the GNU Lesser General Public License
 *   along with PrettyPrint.  If not, see <http://www.gnu.org/licenses/>.
 */

var menuId;

function getOptions() {
	return localStorage.options ? JSON.parse(localStorage.options) : {
		auto_indentation : true,
		braces_on_own_line : false,
		indent_size : 4,
		indent_char : " ",
		preserve_newlines : true,
		space_after_anon_function : false,
		keep_array_indentation : false,
		css_auto_indentation : true,
		css_indent_size : 4,
		css_indent_char : " ",
		css_braces_on_own_line : false,
		use_contextmenu : false
	};
}

function resetOptions() {
	delete localStorage.options;
}

function setOptions(options) {
	localStorage.options = JSON.stringify(options);
	refreshContextMenu(options);
}

function refreshContextMenu(options) {
	if (options.use_contextmenu && !menuId)
		menuId = chrome.contextMenus.create({
			title : "pretty print",
			onclick : function(info, tab) {
				if (tab.url.indexOf("file:") != 0)
					chrome.tabs.executeScript(tab.id, {
						file : "content.js"
					});
			}
		});
	if (!options.use_contextmenu && menuId)
		menuId = chrome.contextMenus.remove(menuId);
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	var workerBeautifyJS, workerBeautifyCSS, workerWebInspector;
	if (request.getOptions) {
		chrome.tabs.sendMessage(sender.tab.id, {
			options : getOptions()
		});
		if (!getOptions().use_contextmenu && sender.tab.url.indexOf("file:") != 0)
			chrome.tabs.executeScript(sender.tab.id, {
				file : "content.js"
			});
	}
	if (request.beautifyJS) {
		workerBeautifyJS = new Worker("worker-beautify.js");
		workerBeautifyJS.addEventListener("message", function(event) {
			chrome.tabs.sendMessage(sender.tab.id, {
				content : event.data
			});
			workerBeautifyJS.terminate();
		}, false);
		workerBeautifyJS.postMessage({
			text : request.text,
			options : getOptions()
		});
	}
	if (request.beautifyCSS) {
		workerBeautifyCSS = new Worker("worker-cssbeautify.js");
		workerBeautifyCSS.addEventListener("message", function(event) {
			chrome.tabs.sendMessage(sender.tab.id, {
				content : event.data
			});
			workerBeautifyCSS.terminate();
		}, false);
		workerBeautifyCSS.postMessage({
			text : request.text,
			options : getOptions()
		});
	}
	if (request.syntaxHighlight) {
		workerWebInspector = new Worker("worker-WebInspector.js");
		workerWebInspector.addEventListener("message", function(event) {
			chrome.tabs.sendMessage(sender.tab.id, {
				content : event.data.text,
				linesLength : event.data.linesLength
			});
			workerWebInspector.terminate();
		}, false);
		workerWebInspector.postMessage({
			text : request.text,
			type : request.type
		});
	}
	return true;
});

refreshContextMenu(getOptions());
