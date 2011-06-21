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
		css_indent_size : 4,
		css_indent_char : " ",
		css_auto_indentation : false,
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
				chrome.tabs.sendRequest(tab.id, getOptions());
			}
		});
	if (!options.use_contextmenu && menuId)
		menuId = chrome.contextMenus.remove(menuId);
}

function executeScripts(tabId, scripts, callback, index) {
	if (!index)
		index = 0;
	if (index < scripts.length)
		chrome.tabs.executeScript(tabId, {
			file : scripts[index].file,
			code : scripts[index].code,
			allFrames : true
		}, function() {
			executeScripts(tabId, scripts, callback, index + 1);
		});
	else if (callback)
		callback();
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.getOptions) {
		sendResponse(getOptions());
		executeScripts(request.id, [ {
			file : "WebInspector.js"
		}, {
			file : "beautify.js"
		}, {
			file : "cssParser.js"
		}, {
			file : "content.js"
		} ]);
	}
});

refreshContextMenu(getOptions());