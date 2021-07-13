// ==UserScript==
// @name         Youtube Keyword Filter
// @namespace    https://github.com/Hoithmach/youtube_keyword_filter
// @version      0.3
// @description  Filter out specific keywords from youtube subscription feed
// @author       Hoithmach
// @include      *youtu*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==


function if_in(v, text) {

	return this.text.toLowerCase().includes(v);

};

function remove_blocked_words() {

	var elem_list = document.getElementsByTagName("ytd-grid-video-renderer");

	var elem_list_len = elem_list.length;

	for (var i = 0; i < elem_list_len; i++) {

		var title = elem_list[i].getElementsByTagName("h3")[0].getElementsByTagName("a")[0];

		if (block_words.some(if_in, title)) {

			elem_list[i].style.display = "none";

		} else {

			elem_list[i].style.display = "";

		};
	};
};


function item_popup(add_or_remove) {

	if (add_or_remove == "add") {

		var add_value = prompt("Add blocked word");

		if (add_value == null) {

			return;

		};
		
		add_value = add_value.toLowerCase()

		if (!block_words.includes(add_value)) {

			block_words.push(add_value);

		};

	} else if (add_or_remove == "remove") {

		var remove_value = prompt(`remove blocked word:\n${block_words}`);

		if (remove_value == null) {

			return;
		};
		
		remove_value = remove_value.toLowerCase()

		if (block_words.includes(remove_value)) {

			block_words.splice(block_words.indexOf(remove_value.toLowerCase()));

		};

	} else { return; };

	GM_setValue("block_words", JSON.stringify(block_words));

	remove_blocked_words();

};



(function() {

	if (GM_getValue("block_words") == undefined) {

		GM_setValue("block_words", JSON.stringify([]));

	};

	block_words = JSON.parse(GM_getValue("block_words"));

	GM_registerMenuCommand("Add blocked word", function() { item_popup("add") } );
	GM_registerMenuCommand("Remove block word", function() { item_popup("remove") } );

	waitForKeyElements(
		"div#items",
		remove_blocked_words
		);

})();
