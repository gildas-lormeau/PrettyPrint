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

var cssContent = '.webkit-css-comment { color: rgb(0, 116, 0); } .webkit-css-url, .webkit-css-color, .webkit-css-string, .webkit-css-keyword {  color: rgb(7, 144, 154); } .webkit-css-number {  color: rgb(50, 0, 255); } .webkit-css-property, .webkit-css-at-rule {  color: rgb(200, 0, 0); } .webkit-css-selector {  color: black; } .webkit-css-important {  color: rgb(200, 0, 180); } .webkit-javascript-comment {  color: rgb(0, 116, 0); } .webkit-javascript-keyword {  color: rgb(170, 13, 145); } .webkit-javascript-number {  color: rgb(28, 0, 207); } .webkit-javascript-string, .webkit-javascript-regexp {  color: rgb(196, 26, 22); } .webkit-javascript-ident {  color: black; } .text-editor-lines {  border: 0;  -webkit-border-horizontal-spacing: 0;  -webkit-border-vertical-spacing: 0;  -webkit-user-select: text; } .webkit-line-number {  color: rgb(128, 128, 128);  background-color: rgb(240, 240, 240);  border-right: 1px solid rgb(187, 187, 187);  text-align: right;  word-break: normal;  -webkit-user-select: none; padding-right: 4px; padding-left: 6px; } .webkit-line-number-inner {  margin-right: 4px; } .webkit-line-number-outer {  margin-right: -4px;  margin-left: -4px;  border-color: transparent;  border-style: solid;  border-width: 0 0 0px 2px;  vertical-align: top; } body { font-family: monospace; white-space: pre; margin: 0px; } .viewer-line-numbers { float: left; -webkit-user-select: none; } .viewer-content { position: relative; left: 5px; }';

function createViewer(newNode, count) {
	var _linesContainerElement, i, element, _lineNumberElement, innerSpan, anchor, _linesElement, contentElement, outerSpan;

	document.body.innerHTML = '<style>' + cssContent + '</style>';

	_linesContainerElement = document.createElement("table");
	_linesContainerElement.className = "text-editor-lines";
	_linesContainerElement.setAttribute("cellspacing", 0);
	_linesContainerElement.setAttribute("cellpadding", 0);
	for (i = 0; i < count; i++) {
		element = document.createElement("tr");
		_lineNumberElement = document.createElement("td");
		_lineNumberElement.className = "webkit-line-number";
		element.appendChild(_lineNumberElement);
		anchor = document.createElement("a");
		anchor.name = i + 1;
		innerSpan = document.createElement("span");
		innerSpan.className = "webkit-line-number-inner";
		innerSpan.textContent = i + 1;
		outerSpan = document.createElement("div");
		outerSpan.className = "webkit-line-number-outer";
		outerSpan.appendChild(anchor);
		outerSpan.appendChild(innerSpan);
		_lineNumberElement.appendChild(outerSpan);
		_linesContainerElement.appendChild(element);
	}

	_linesElement = document.createElement("div");
	_linesElement.className = "viewer-line-numbers";
	_linesElement.appendChild(_linesContainerElement);
	document.body.appendChild(_linesElement);

	contentElement = document.createElement("div");
	contentElement.className = "viewer-content";
	contentElement.appendChild(newNode);
	return contentElement;
}

function injectViewer(contentType, text) {
	var highlighter, code, newNode = document.createElement("span"), pathname = document.location.pathname;
	if (pathname.substr(-3) == ".js"
			&& (!contentType || (contentType.indexOf("text/plain") != -1 || contentType.indexOf("text/javascript") != -1
					|| contentType.indexOf("application/javascript") != -1 || contentType.indexOf("application/x-javascript") != -1))) {
		try {
			new Function(text);
		} catch (e) {
			return;
		}
		code = options.auto_indentation ? js_beautify(text, options) : text;
		newNode.textContent = code;
		highlighter = new WebInspector.DOMSyntaxHighlighter("text/javascript");
	} else if (pathname.substr(-4) == ".css" && (!contentType || (contentType.indexOf("text/css") != -1 || contentType.indexOf("text/plain") != -1))) {
		newNode.innerHTML = text;
		code = text;
		if (options.css_auto_indentation) {
			CSS_INDENT_CHAR = options.css_indent_char || CSS_INDENT_CHAR;
			CSS_INDENT_SIZE = options.css_indent_size || CSS_INDENT_SIZE;
			var parser = new CSSParser();
			var sheet = parser.parse(code, false, true);
			if (sheet) {
				newNode.textContent = code = sheet.cssText();
			} else
				newNode.textContent = code;
		} else
			newNode.textContent = code;
		highlighter = new WebInspector.DOMSyntaxHighlighter("text/css");
	}
	if (newNode.textContent) {
		highlighter.syntaxHighlightNode(newNode);
		document.body.appendChild(createViewer(newNode, code.split("\n").length));
	}
}

function processXHR() {
	var xhr;
	if (document.body.childNodes[0] && document.body.childNodes[0].className != "webkit-line-gutter-backdrop") {
		xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4)
				injectViewer(xhr.getResponseHeader("Content-Type"), xhr.responseText);
		};
		xhr.open("GET", document.location.href, true);
		xhr.send(null);
	}
}

function processFile() {
	var pre = document.querySelector("pre");
	if (pre && pre.textContent)
		injectViewer(null, pre.textContent);
}

function process() {
	if (document.location.protocol == "file:")
		processFile();
	else
		processXHR();
}

chrome.extension.onRequest.addListener(process);

if (document.location.protocol != "file:" && !options.use_contextmenu)
	process();