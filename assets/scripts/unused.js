"use strict";
// dict-ajax.js
function google_suggest(word) {
    let curl = 'http://dictionary.so8848.com/suggestion/?q=' + word;
    $.ajax({
        type: 'get',
        url: curl,
        datatype: 'json',
        cache: false,
        // async: false,
        success: function (data) {
            $('#toggle_example')
                .first()
                .after(data.replace('Similar', 'Wow, not in the dict. Check out the suggested'));
        },
        error: function (err) {
            $('#panel1 p').html("can't find the suggestion of " + word + ' in google');
        },
    });
}

function ajax_search() {
    let word = get_word();

    $.get(
        'http://dictionary.so8848.com/ajax_search',
        {
            q: word,
        },
        function (data) {
            let obj = eval('(' + data + ')');
            if (obj.ok != false) {
                let obj = eval('(' + obj.info + ')');
                let display = process_primary(obj.primaries);
                $('#panel1 p').html(display);
                changeSound();
                if (display.length > 1000) {
                    $('#button_ads').attr('style', '');
                }
                $.get(
                    'http://dictionary.so8848.com/suggestion',
                    {
                        q: word,
                    },
                    function (data) {
                        $('.wordtype').first().before(data);
                    }
                );
            } else {
                $.get(
                    'http://dictionary.so8848.com/suggestion',
                    {
                        q: word,
                    },
                    function (data) {
                        $('#toggle_example')
                            .first()
                            .after(data.replace('Similar', 'Wow, not in the dict. Check out the suggested'));
                    }
                );
            }
        }
    );
}

function norm_search() {
    content = $('#searchresult').html();
    let obj = eval('(' + content + ')');
    let word = $('#queryword').html();
    if (obj.ok != false) {
        let obj = eval('(' + obj.info + ')');
        let display = process_primary(obj.primaries);
        $('#content').html(display);
        changeSound();
        if (display.length > 1500) {
            $('#button_ads').attr('style', '');
        }
        $.get(
            '/suggestion',
            {
                q: word,
            },
            function (data) {
                $('.wordtype').first().before(data);
            }
        );
    } else {
        $.get(
            '/suggestion',
            {
                q: word,
            },
            function (data) {
                $('#toggle_example')
                    .first()
                    .after(data.replace('Similar', 'Wow, not in the dict. Check out the suggested'));
            }
        );
    }
}

function collocation_search() {
    if ($('#panel2 first').html() != 'true') {
        // alert("collocation_first: " + $('#panel2 first').html());
        return;
    }

    let word = get_word();

    $.get(
        'http://dictionary.so8848.com/ajax_collocation_search',
        {
            q: word,
        },
        function (data) {
            $('#panel2 p').html(data);
        }
    );
    $('#panel2 first').html('false');
}

function wordnet_search() {
    if ($('#panel3 first').html() != 'true') {
        // alert("wordnet_first: " + $('#panel3 first').html());
        return;
    }

    // let word = $('#queryword').html();
    // word = word.replace(/\ /g, "_");
    let word = get_word();
    // alert("wordnet: " + word);

    let curl = 'http://wordnet-online.freedicts.com/ajax/' + word;
    //curl = "http://gdicts.com/word/meaning/good";
    //alert("wordnet_curl: " + curl);

    /*$.getJSON(curl, function(data){
	  console.log(data.title); // Logs "jQuery Howto";
	alert('getJSON');});

	$.ajax({
	  type:     "GET",
	  url:      "https://graph.facebook.com/10150232496792613",
	  dataType: "jsonp",
	  success: function(data){
	      alert(data.id);
	      $('##panel3 p').html(data.id);
	  }});*/

    let request = $.ajax({
        //url: "http://wordnet-online.freedicts.com/ajax/good",
        url: curl,
        type: 'GET',
        dataType: 'text',
        crossDomain: true,
    });

    request.success(function (data) {
        $('#panel3 p').html(data);
    });

    request.done(function (msg) {
        //  $( "#log" ).html( msg );
        // alert('request sucess');
    });

    request.fail(function (xhr, textStatus, ajaxOptions, thrownError) {
        $('#panel3 p').html('cannot find ' + word + ' in wordnet');
        // alert( "Request failed: " + textStatus );
        // alert(xhr.responseText);
        // alert(xhr.status);
        // alert(thrownError);
    });

    /*$.ajax({
		type: 'GET',
		url: 'http://www.blogoola.com/data/destinations.json',
		async: false,
		jsonpCallback: 'jsonCallback',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(data)
		{
			alert(JSON.stringify(data));
			console.log(json);
		},
		error: function(e)
		{
		   alert(e.message);
		}});

	Works with $.get too!

	alert('http://wordnet-online.freedicts.com/ajax/' + word)
	url = 'http://wordnet-online.freedicts.com/ajax/' + word
	$.get(url, {q:word}, function(data){
	   $('#panel3 p').html(data);
	   alert(url)});*/

    $('#panel3 first').html('false');
}

function googleenglish_search() {
    let word = get_word();

    let curl = '../dict/Google2/' + word.substr(0, 1) + '/' + word + '.json';
    let script = document.createElement('script');
    script.setAttribute('src', curl);
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = function () {
        // alert(dict);
        let content = process_primary(dict4.primaries);
        let webdef = process_primary(dict4.webDefinitions);
        //$('#panel p').html(content + webdef);
        document.getElementById('panel4').innerHTML = content + webdef;
        changeSound();
        loadPlayer();
    };
    //translate(word);
}

// $('#likes').click(function () {
$('#likes').on('click', () => {
    let catid;
    catid = $(this).attr('data-catid');
    $.get(
        '/rango/like_category/',
        {
            category_id: catid,
        },
        function (data) {
            $('#like_count').html(data);
            $('#likes').hide();
        }
    );
});

// $('#suggestion').keyup(function () {
$('#suggestion').on('keyup', () => {
    let query;
    query = $(this).val();
    $.get(
        '/rango/suggest_category/',
        {
            suggestion: query,
        },
        function (data) {
            $('#cats').html(data);
        }
    );
});

// dict-process.js
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
