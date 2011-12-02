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

importScripts('cssbeautify.js');

addEventListener("message", function(event) {
	var options = event.data.options, i, indent = "";
	for (i = 0; i < options.css_indent_size; i++)
		indent += options.css_indent_char;
	postMessage(cssbeautify(event.data.text, {
		indent : indent,
		openbrace : options.css_braces_on_own_line ? "separate-line" : "end-of-line"
	}));
}, false);
