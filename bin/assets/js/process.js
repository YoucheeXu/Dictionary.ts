var bMeaning = false;

function getChange() {
    let url = window.location.href;
    let index = url.search('word=');
    if (index != -1) {
        word = url.substring(index + 5);
        let script = document.createElement('script');
        script.setAttribute('src', getUrl(word));
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}

function getUrl(word) {
    let url =
        'http://www.google.com/dictionary/json?callback=getJson&q=' + word + '&sl=en&tl=zh-cn&restrict=pr,de&client=te';
    return url;
}

function changeSound() {
    sounds = document.getElementsByClassName('sound');
    //sounds = document.getElementsByName("sound");
    for (i in sounds) {
        html = getSound(escape(sounds[i].innerHTML));
        sounds[i].innerHTML = html;
        // alert(html);
        // loadPlayer();
    }
}

/*
// To-Do：dynamic set player
function getSound(url){
	sound = "<div id=\"jquery_jplayer_1\"></div>\r\n" +
		"<div id=\"jp_container_1\">\r\n" +
		"\t<div class=\"jp-controls\">\r\n" +
		"\t\t<button class=\"jp-play\" role=\"button\" tabindex=\"0\">play</button>\r\n" +
		"\t</div>\r\n" +
		"</div>\r\n"
	return sound;
}

function loadPlayer2(audio){
	let word = get_word();
	$("#jquery_jplayer_1").jPlayer({
		ready: function () {
		$(this).jPlayer("setMedia", {
			mp3: audio
		}).jPlayer("play");
		},
		supplied: "mp3",
		useStateClassSkin: true,
		keyEnabled: true
	});
}

// To-Do：dynamic load player
function loadPlayer(){
	let word = get_word();
	$("#jquery_jplayer_1").jPlayer({
		ready: function () {
		$(this).jPlayer("setMedia", {
			mp3: "../audio/Google/" + word + ".mp3"
		}).jPlayer("play");
		},
		supplied: "mp3",
		useStateClassSkin: true,
		keyEnabled: true
	});
}*/

/*function getSound(url){
	// sound = '<object data="http://www.google.com/dictionary/flash/SpeakerApp16.swf" \
		type = "application/x-shockwave-flash" width=" 16" height="16" id="pronunciation"> \
	// sound = '<object data="SpeakerApp16.swf" type="application/x-shockwave-flash" width=" 16" \
		// height="16" id="pronunciation">\
		// <param name="movie" value="Speaker.swf">\
		// <param name="flashlets" value="sound_name='+ url+'">\
	// </object>';
	// sound = '<embed type="application/x-shockwave-flash" src="SpeakerApp16.swf" width="20" \
		height="20" id="movie28564" name="movie28564" bgcolor="#000000" quality="high" \
		flashlets="sound_name=../../Audio/Google/class.mp3" wmode="transparent">';
	sound = '<embed type="application/x-shockwave-flash" src="SpeakerApp16.swf" \
		width="20" height="20" id="movie28564" name="movie28564" bgcolor="#000000" \
		quality="high" flashlets="sound_name='+ url + '"wmode="transparent">';
	return sound;
}*/

/*function getSound(url){
	//sound = '<a href = "javascript:;" class = "laba" onmouseover = "asplay(\'' + url +
		'\');" onmouseout = "clearTimeout(timer);" onclick = "asplay(\'' + url + '\');" ></a>'
	sound = '<div class="sound"><a href="javascript:;" class="laba" onmouseover="asplay(\'' + url +
		'\');" onmouseout ="clearTimeout(timer);" onclick="asplay(\'' + url + '\');" ></a></div>'
	return sound;
}*/

/*function getSound(url){
	sound = '<div class = "sound">\r\n<a href = "' + url +
		'" class = "laba" onmouseover = "asplay(\'' + url +'\');" onmouseout = "clearTimeout(timer);"></a>\r\n</div>\r\n'
	//sound = '<div class="sound"><a href="javascript:;" class="laba" onmouseover="asplay(\'' + url +
		'\');" onmouseout ="clearTimeout(timer);" onclick = \
		"response.setHeader("Content-disposition", "attachment;filename = \'"' + url + '\');" ></a></div>'
	return sound;
}*/

function getFlashObject_top(movieName) {
    if (window.document[movieName]) {
        return window.document[movieName];
    }
    if (navigator.appName.indexOf('Microsoft Internet') == -1) {
        if (document.embeds && document.embeds[movieName]) return document.embeds[movieName];
    } else {
        return document.getElementById(movieName);
    }
}

var timer = null;
function player_callback(c) {
    // let asound = getFlashObject_top("asound_top");
    // if(asound){
    // asound.Setletiable("f",c);
    // asound.GotoFrame(1);
    // //alert(c);
    // }
    // else alert("can't get asound_top!");
    return false;
}
function asplay(c) {
    clearTimeout(timer);
    let mp3_1 = "player_callback('" + c + "')";
    timer = setTimeout(mp3_1, 100);
    //alert("haha!");
}

function formSubmit() {
    let value = document.getElementById('form_value');
    let word = value.value;
    let script = document.createElement('script');
    script.setAttribute('src', getUrl(word));
    document.getElementsByTagName('head')[0].appendChild(script);
    //alert(getUrl(word))
    script.onload = function () {
        let content = process_primary(dict.primaries);
        let webdef = process_primary(dict.webDefinitions);
        document.getElementById('content').innerHTML = content;
        changeSound();
        document.getElementById('webdef').innerHTML = webdef;
    };
    translate(word);
}

var search = function (searchbox) {
    if (searchbox == undefined) {
        searchbox = 'searchbox';
    }
    if (lastword == word) {
        return;
    }
    let word = $(searchbox).value.trim().toLowerCase();
    if (word.match(/\w+/) == null) {
        $(searchbox).value = '';
        $(searchbox).focus();
        //alert("请输入要查询的英文单词");return false;
    }
    if (word.length == 0) {
        $(searchbox).focus();
        return false;
    }

    window.location.href = g_word_prefix + '/' + word;
    return false;
};

function enter() {
    if (event.keyCode == 13) {
        formSubmit();
    }
}

var tl = null;

function translate(word) {
    let url =
        'https://www.googleapis.com/language/translate/v2?key= \
		AIzaSyCTAervvQn5LZBCMgMcwHi4y5K7js71hU0&source=en&target=zh&callback=translateText&q=' +
        word;
    let script = document.createElement('script');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = function () {
        document.getElementById('translate').innerHTML = tl;
    };
}

function translateText(response) {
    let tl = response.data.translations[0].translatedText;
}
