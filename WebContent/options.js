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

var options, use_contextmenu, auto_indentation, css_auto_indentation, css_indent_char, css_indent_size, braces_on_own_line, indent_size, indent_char, preserve_newlines, space_after_anon_function, keep_array_indentation, css_braces_on_own_line, bgPage = chrome.extension.getBackgroundPage();

function initForm() {
	options = bgPage.getOptions();
	use_contextmenu.checked = options.use_contextmenu;
	auto_indentation.checked = options.auto_indentation;
	braces_on_own_line.checked = options.braces_on_own_line;
	indent_size.value = options.indent_size;
	indent_char.value = options.indent_char;
	preserve_newlines.checked = options.preserve_newlines;
	space_after_anon_function.checked = options.space_after_anon_function;
	keep_array_indentation.checked = options.keep_array_indentation;	
	css_auto_indentation.checked = options.css_auto_indentation;
	css_indent_char.value = options.css_indent_char;
	css_indent_size.value = options.css_indent_size;
	css_braces_on_own_line.checked = options.css_braces_on_own_line;
}

function load() {
	use_contextmenu = document.getElementById("use_contextmenu");
	auto_indentation = document.getElementById("auto_indentation");
	braces_on_own_line = document.getElementById("braces_on_own_line");
	indent_size = document.getElementById("indent_size");
	indent_char = document.getElementById("indent_char");
	preserve_newlines = document.getElementById("preserve_newlines");
	space_after_anon_function = document.getElementById("space_after_anon_function");
	keep_array_indentation = document.getElementById("keep_array_indentation");
	css_auto_indentation = document.getElementById("css_auto_indentation");
	css_indent_char = document.getElementById("css_indent_char");
	css_indent_size = document.getElementById("css_indent_size");
	css_braces_on_own_line = document.getElementById("css_braces_on_own_line");
	initForm();

	document.getElementById("reset").onclick = function() {
		bgPage.resetOptions();
		initForm();
	};

	document.getElementById("save").onclick = function() {
		options.use_contextmenu = use_contextmenu.checked;
		options.auto_indentation = auto_indentation.checked;
		options.braces_on_own_line = braces_on_own_line.checked;
		options.indent_size = indent_size.value;
		options.indent_char = indent_char.value;
		options.preserve_newlines = preserve_newlines.checked;
		options.space_after_anon_function = space_after_anon_function.checked;
		options.keep_array_indentation = keep_array_indentation.checked;
		options.css_auto_indentation = css_auto_indentation.checked;
		options.css_indent_char = css_indent_char.value;
		options.css_indent_size = css_indent_size.value;
		options.css_braces_on_own_line = css_braces_on_own_line.checked;
		bgPage.setOptions(options);
	};
};

addEventListener("load", load, false);