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

var options;

if (document.location.pathname.substr(-4) == ".css" || document.location.pathname.substr(-3) == ".js") {
	chrome.extension.onMessage.addListener(function(response) {
		if (response.options) {
			options = response.options;
			if (document.location.protocol == "file:")
				process();
		}
	});
	chrome.extension.sendMessage({
		getOptions : true
	});	
}
