// ==UserScript==
// @author         VampiRUS
// @name           Evernote clipper for Habrahabr.ru
// @description    Adds Evernote Site Memory button on Habrahabr.ru
// @namespace      http://userscripts.org/scripts/show/86438
// @include        http://habrahabr.ru/blogs/*/*/*
// @include        http://habrahabr.ru/qa/*
// @include        http://habrahabr.ru/company/*/blog/*/*
// @exclude        http://habrahabr.ru/blogs/*/page*/
// @exclude        http://habrahabr.ru/qa/page*/
// @exclude        http://habrahabr.ru/qa/hot/
// @exclude        http://habrahabr.ru/qa/popular/
// @exclude        http://habrahabr.ru/qa/unanswered/
// @exclude        http://habrahabr.ru/company/*/blog/page*/
// @version        0.0.3
// @licence        LGPL 3
// ==/UserScript==


(function(){
	var w = window.wrappedJSObject || window;
	var head = document.getElementsByTagName('head')[0];
	if (head) {
		var evernoteJs = document.createElement("script");
		evernoteJs.type = "text/javascript";
		evernoteJs.src = "http://static.evernote.com/noteit.min.js";
		head.appendChild(evernoteJs);
	}
	var notebook = document.querySelector("a.silentlink");
	if (notebook) {
		notebook = notebook.text;
	} else {
		notebook = '';
	}
	var title = document.querySelector("span.topic");
	if (title) {
		title = title.firstChild.nodeValue;
	} else {
		title = document.querySelector("a.topic").text;
	}
	var tagLinks = document.querySelectorAll("ul.tags li a");
	var tags = new Array();
	for (var i in tagLinks) {
		tags.push(tagLinks[i].text);
	}
	tags = tags.splice(0, 3).join(',');
	var content = document.querySelector("div.content").innerHTML;
	var comments = document.querySelector("div#comments ul.hentry");
	if (comments) {
		comments = comments.innerHTML;
		comments = comments.replace(/<li/g,'<li style="float:left;margin-right:10;list-style:none;"');
		comments = comments.replace(/class="comment_holder vote_holder"/g,'style="float:left;width:100%;list-style:none;"');
		comments = comments.replace(/<p class="reply">.*?<\/p>/g,'');
		comments = comments.replace(/class="hentry"/g,'style="list-style:none outside none;clear:both;width:auto;"');
		comments = comments.replace(/class="entry-content"/g,'style="clear:both;margin:20px 0"');
		content += '<br/><ul style="list-style:none outside none;clear:both;width:auto;">'+comments+'</ul>';
	}
	var evernoteClipper = document.createElement("div");
	var evernoteClipperLink = document.createElement("a");
	evernoteClipperLink.href = '#';
	evernoteClipperLink.addEventListener('click',function(e){
			e.stopPropagation();
			e.preventDefault();
			w.Evernote.doClip({
						'title':title,
						'suggestNotebook':notebook,
						'suggestTags': tags,
						'styling':'full',
						'content': content
						});
			return false;
		},true);
	var img = document.createElement('img');
	img.src = "http://static.evernote.com/site-mem-16.png";
	evernoteClipperLink.appendChild(img);
	evernoteClipper.appendChild(evernoteClipperLink);
	document.querySelector("div.entry-info-wrap").insertBefore(evernoteClipper,document.querySelector("div.twitter"));

})();
