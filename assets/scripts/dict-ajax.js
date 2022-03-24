"use strict";
function load_word(word, audio, level) {
    let html =
        `					<div class = "text">${word}</div>\n` +
        `					<div class = "sound" id = "Player">\n` +
        `						<button class = "jp-play" id = "playpause" title = "Play"></button>\n` +
        `						<audio autoplay = "autoplay" id = "webAudio">\n` +
        `							<source src = ${audio} type = "audio/mpeg">\n` +
        `							Your browser does not support the audio tag.\n` +
        `						</audio>\n` +
        `					</div>\n` +
        `					<div class = "newMmark">NEW</div>\n` +
        `					<div class = "level">${level}</div>\n` +
        `					<ul class = "stars">\n` +
        `						<li>★</li>\n` +
        `						<li>★</li>\n` +
        `						<li>★</li>\n` +
        `						<li>★</li>\n` +
        `						<li>★</li>\n` +
        `					</ul>\n`;
    return html;
}

function load_new(bNew, callback_setNew) {
    mark_new(bNew);

    console.log(typeof callback_setNew);
    let bNewBefore = bNew === 'true';

    $('.newMmark').on('click', function () {
        if (bNewBefore) {
            $('.newMmark').css('color', 'Gainsboro');
            $('.newMmark').css('font-weight', 'normal');
            callback_setNew(false);
        } else {
            $('.newMmark').css('color', 'Black');
            $('.newMmark').css('font-weight', 'bold');
            callback_setNew(true);
        }

        bNewBefore = !bNewBefore;
    });
}

function mark_new(bNew) {
    if (bNew === 'true') {
        $('.newMmark').css('color', 'Black');
        $('.newMmark').css('font-weight', 'bold');
    } else {
        $('.newMmark').css('color', 'Gainsboro');
        $('.newMmark').css('font-weight', 'normal');
    }
}

function dictHtml(word, tabId, dict, audio, bNew, level, nStars) {
    if ($('#panel1 first').html() == 'false') {
        return;
    }
    try {
        let display = `\r\n\t\t\t\t\t\t\t\t<iframe src="${dict}" style="position: relative; width:701px; height:314px" frameborder="no" noresize="noresize"></iframe>`
        $('#' + tabId + ' p').html(display);
        $('.Word').html(load_word(word, audio, level));
        load_new(bNew, function (bSetNew) {
            ipcRenderer.send('dictApp', 'markNew', word, bSetNew);
        });
        load_starts(nStars);
        loadPlayer();
    } catch (error) {
        log('error', error, true);
    }

    $('#panel1 first').html('false');
}
