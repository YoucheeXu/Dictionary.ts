"use strict";
// import { ipcRenderer, remote } from 'electron';
const { ipcRenderer } = require('electron');

// $(document).ready(function () {
$(function () {
    // top_panel
    initButton3('btn_menu', './skin/menu_btn.bmp', 31, 21);
    initButton3('btn_min', './skin/minimize_btn.bmp', 33, 21);
    initButton3('btn_max', './skin/maxmize_btn.bmp', 33, 21);
    initButton3('btn_restore', './skin/restore_btn.bmp', 33, 21);
    initButton3('btn_close', './skin/close_btn.bmp', 43, 21);

    // input_panel
    initButton4('btn_prev', './skin/prev_btn.bmp', 45, 37);
    initButton4('btn_next', './skin/next_btn.bmp', 40, 37);
    initButton3('btn_del', './skin/delete_item.bmp', 30, 34);
    initButton3('btn_drop', './skin/combobox_drop_btn.bmp', 20, 34);
    initButton3('btn_lookup', './skin/lookup_btn.bmp', 110, 37);

    // double click to query word
    document.addEventListener('dblclick', function (e) {
        if ('word_input' == e.target.id) return;

        let word =
            (document.selection && document.selection.createRange().text) ||
            (window.getSelection && window.getSelection().toString());
        word = word.trim();
        modifyValue('word_input', word);
        query_word(word);
    });

    $('#tabContainer').tabs({
        data: [],
    });

    ipcRenderer.send('dictApp', 'OnDocumentReady');
    ipcRenderer.on('gui', (event, fun, ...paras) => {
        let parasStr = paras.join('`, `');
        if (paras.length >= 1) {
            parasStr = '`' + parasStr + '`';
        }

        let command = `${fun}(${parasStr})`;
        console.log('command: ' + command);
        eval(command);

        event.returnValue = 'true';
    });
    console.log('document_ready');
});

function initButton3(id, img, width, height) {
    $('#' + id).css('background', 'url(' + img + ')');
    $('#' + id).css('width', width);
    $('#' + id).css('height', height);
    $('#' + id).css('outline', 'none');
    $('#' + id).css('background-position', '0px 0px');

    $('#' + id).hover(
        function () {
            $(this).css('background-position-x', -1 * width);
        },
        function () {
            $(this).css('background-position-x', 0);
        }
    );

    // $('#' + id).mousedown(function () {
    $('#' + id).on('mousedown', function () {
        $(this).css('background-position-x', -2 * width);
    });

    // $('#' + id).mouseup(function () {
    $('#' + id).on('mouseup', function () {
        $(this).css('background-position-x', -1 * width);
    });
}

function initButton4(id, img, width, height) {
    $('#' + id).css('background', 'url(' + img + ')');
    $('#' + id).css('width', width);
    $('#' + id).css('height', height);
    $('#' + id).css('outline', 'none');
    $('#' + id).css('background-position', '0px 0px');

    $('#' + id).hover(
        function () {
            $(this).css('background-position-x', -1 * width);
        },
        function () {
            $(this).css('background-position-x', 0);
        }
    );

    // $('#' + id).mousedown(function () {
    $('#' + id).on('mousedown', function () {
        $(this).css('background-position-x', -2 * width);
    });

    // $('#' + id).mouseup(function () {
    $('#' + id).on('mouseup', function () {
        $(this).css('background-position-x', -1 * width);
    });

    // TODO: statements follow do not work as expection
    // console.log("#" + id + ":" + $("#" + id + ":disabled").css('background-position-x'));
    $('#' + id + ':disabled').css('background-position-x', -3 * width);
    $('#' + id + ':enabled').css('background-position-x', 0);
    // console.log("#" + id + ":" + $("#" + id + ":disabled").css('background-position-x'));
}

function disableButton(id, is) {
    if (is == true) {
        let btn_width = $('#' + id)
            .css('width')
            .slice(0, -2);
        newXPos = -3 * parseInt(btn_width);
        $('#' + id).css('background-position-x', newXPos);
        $('#' + id).attr('disabled', 'disabled');
    } else {
        $('#' + id).removeAttr('disabled');
        $('#' + id).css('background-position-x', 0);
    }
}

function hideButton(id, is) {
    if (is == true) {
        $('#' + id).hide();
    } else $('#' + id).show();
}

function hide_words_list() {
    $('#words_list').hide();
    $('#contents_box').css('width', 701);
}

function get_word() {
    try {
        let word = $('#word_input').val();
        // 去除字符串内两头的空格
        word = word.replace(/^\s*|\s*$/g, '');
        modifyValue('word_input', word);
        return word;
    } catch (error) {
        log('error', error, true);
        return '';
    }
}

function query_word(word, tabId) {
    if (word == null || word == undefined || word == '') {
        word = get_word();
    }

    if (word.length < 1) {
        let tabRef = get_active_tab_href();
        $(tabRef + ' p').html('');
        return false;
    }

    try {
        if (window.external) {
            ipcRenderer.send('dictApp', 'QueryWord', word, tabId);

            ipcRenderer.on('QueryWord', (event, fun, ...paras) => {
                let parasStr = paras.join('`, `');
                if (paras.length >= 1) {
                    parasStr = '`' + parasStr + '`';
                }

                let command = `${fun}(${parasStr})`;
                console.log('command: ' + command);
                eval(command);

                event.returnValue = 'true';
            });
        }
        // $('#word_input').focus();
        $('#word_input').trigger('focus');
        // $('#word_input').select();
        $('#word_input').trigger('select');
        return true;
    } catch (error) {
        log('error', error, true);
    }

    return false;
}

function clear_input() {
    $('#word_input').val('');

    clearOptions('words_list');
    $('#words_list').hide();
    $('#contents_box').css('width', 701);
    // $('#panel1 p').html('');
}

// $(':button').click(function () {
$(':button').on('click', function () {
    // disableLink(link);
    let id = $(this).attr('id');
    console.log(id + ' is clicked!');
    if (id == 'btn_lookup') {
        hide_words_list();
        query_word();
    } else if (id == 'btn_del') {
        clear_input();
    } else if (id == 'btn_menu') {
    } else if (window.external) {
        ipcRenderer.send('dictApp', 'OnButtonClicked', id);
    }
});

let lstWordLen = 0;

$(function () {
    // $('#word_input').bind('keyup', function (event) {
    $('#word_input').on('keyup', function (event) {
        let inputChar = event.keyCode;
        if (inputChar == '13') {
            // return/Enter key
            hide_words_list();
            query_word();
        } else {
            let rawWord = $('#word_input').val();
            let rawWordLen = rawWord.length;
            if(lstWordLen == rawWordLen){
                return;
            }
            let word = rawWord.replace(/[^\w -]/g, '');
            let wordLen = word.length;
            if (wordLen != rawWordLen) {
                modifyValue('word_input', word);
                return;
            }

            lstWordLen = wordLen;

            // get current tabRef
            let tabRef = get_active_tab_href();

            if (wordLen >= 1) {
                $(tabRef + ' p').html('你输入的内容为：' + word);
                clearOptions('words_list');
                $('#words_list').show();
                $('#contents_box').css('width', 500);
                try {
                    if (window.external) {
                        // window.external.OnTextChanged(word);
                        ipcRenderer.sendSync('dictApp', 'OnTextChanged', word);
                    }
                } catch (error) {
                    log('error', error, true);
                }
                // append_words_list(word);
            } else {
                // clear_input();
                $('#words_list').hide();
                $('#contents_box').css('width', 701);
                $(tabRef + ' p').html('');
            }
        }
    });
});

function TopMostOrNot() {
    if (window.external) {
        ipcRenderer.sendSync('dictApp', 'TopMostOrNot');
    }
}

function BindSwitchTab() {
    // $('.nav-tabs li a').click(function () {
    $('.nav-tabs li a').on('click', function () {
        try {
            let tabId = $(this).attr('href');
            log('info', 'Switch to : ' + tabId, false);
            $(tabId + ' p').html('');

            tabId = tabId.slice(1);
            log('info', 'tabId: ' + tabId, false);
            if (window.external) {
                // window.external.switch_tab(tabId);
                ipcRenderer.sendSync('dictApp', 'SwitchTab', tabId);
            }
            query_word("", tabId);
        } catch (error) {
            log('error', error, true);
        }

        $('#words_list').hide();
        $('#contents_list_box').css('width', 701);
    });
}

function get_active_tab_href() {
    return $('.nav-tabs').find('li.active').children('a').attr('href');
}

function AddTab(tabId, name, html) {
    $('#tabContainer').data('tabs').addTab({ tabId: tabId, name: name, closeable: true, html: html });
    console.log('addTab: ', tabId, name, html);
}

function ActiveTab(tabId) {
    $('#tabContainer').data('tabs').showTab(tabId);
}

function bindMenus() {
    // $('.dropdown-menu a').click(function () {
    $('.dropdown-menu a').on('click', function () {
        var menuId = $(this).attr('href');

        menuId = menuId.slice(1);
        log('info', 'menuId: ' + menuId, false);

        if (window.external) {
            ipcRenderer.sendSync('dictApp', 'OnMenuClicked', menuId);
        }
    });
}

function fill_menu(menuId, name) {
    // <a class="dropdown-item" href="#XX-Net">XX-Net</a>
    let item = '<a class="dropdown-item" href="#{0}">{1}</a>'.format(menuId, name);
    $('#sys_menu').append(item);
}

function active_menu(menuId) {
    var as = $('#sys_menu a');
    for (var i = 0; i < as.length; i++) {
        var a = as.eq(i);
        // console.log(a);
        href = a.attr('href');
        // console.log(href)
        if (href != '#' + menuId) {
            a.removeClass('active');
        } else {
            a.addClass('active');
        }
    }
}

function loadAndPlayAudio(audioFile) {
    // console.log(audioFile);
    let webAudio = document.getElementById('webAudio');
    let source = document.getElementById('audioSource');
    source.src = 'file:///' + audioFile;

    webAudio.load(); //call this to just preload the audio without playing
    webAudio.addEventListener(
        'canplaythrough',
        function () {
            webAudio.play(); //call this to play the song right away
        },
        false
    );
}

function playAudio() {
    let webAudio = document.getElementById('webAudio');
    webAudio.play(); //call this to play the song right away
}

function getValue(id) {
    let ele = document.getElementById(id);
    if (ele.value) {
        // console.log(`value of ${id}: ${ele.value}`);
        return ele.value;
    } else {
        // console.log(`innerHTML of ${id}: ${ele.innerHTML}`);
        return ele.innerHTML;
    }
}

function modifyValue(id, valueStr) {
    let ele = document.getElementById(id);
    if (ele.value === undefined) {
        console.log(`innerHTML of ${id}: ${ele.innerHTML}`);
        ele.innerHTML = valueStr;
    } else {
        console.log(`modify value of ${id}: from ${ele.value} to ${valueStr}.`);
        ele.value = valueStr;
    }
}


function log(lvl, info, isException) {
    try {
        console.log(info);

        if (window.external) {
            if (isException == true) {
                info =
                    'Name: ' +
                    info.nameinfo +
                    '\n\t' +
                    'message: ' +
                    info.message +
                    '\n\t' +
                    'description: ' +
                    info.description +
                    '\n\t' +
                    'stack: ' +
                    info.stack.toString();
            }
            // window.external.log(lvl, info);
            ipcRenderer.send('dictApp', 'log', lvl, info);
        }
    } catch (error) {
        console.log(error);
    }
}
