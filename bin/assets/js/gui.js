'use strict';

// import { ipcRenderer, remote } from 'electron';
const { ipcRenderer } = require('electron');

// $(document).ready(function () {
$(function () {
    // console.log("#btn_prev:" + $("#btn_prev:disabled").css('background-position-x'));
    // console.log("#btn_next:" + $("#btn_next:disabled").css('background-position-x'));

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
        // console.log("Dobule Click!");
        // console.log(e);
        // console.log(e.target.id);
        if ('word_input' == e.target.id) return;

        let word =
            (document.selection && document.selection.createRange().text) ||
            (window.getSelection && window.getSelection().toString());
        // log("info", "dblclick: " + word, false);
        word = word.trim();
        // set_word(word);
        modifyValue('word_input', word);
        query_word(word);
    });

    $('#tabContainer').tabs({
        data: [],
    });

    // addTab("tab1", "tab1-haah", "");
    // addTab("tab2", "tab2-haah", "");

    // console.log("#btn_prev:" + $("#btn_prev:disabled").css('background-position-x'));
    // console.log("#btn_next:" + $("#btn_next:disabled").css('background-position-x'));

    // log('info', 'document_ready', false);
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
    // $('#' + id).hover(
    $('#' + id).on(
        'hover',
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

    // $('#' + id).hover(
    $('#' + id).on(
        'hover',
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

/*
function set_word(word) {
    $('#word_input').val(word);
}*/

function hide_words_list() {
    $('#words_list').hide();
    $('#contents_box').css('width', 701);
}

function get_word() {
    try {
        let word = $('#word_input').val();
        // word = word.replace(/\ /g, "_");
        // 去除字符串内两头的空格
        word = word.replace(/^\s*|\s*$/g, '');
        // word = word.trim();
        // log("info", "get_word: " + word, false)
        // set_word(word);
        modifyValue('word_input', word);
        return word;
    } catch (error) {
        log('error', error, true);
        return '';
    }
}

function query_word(word) {
    if (word == null || word == undefined || word == '') {
        word = get_word();
    }

    if (word.length < 1) {
        let tabRef = get_active_tab_href();
        $(tabRef + ' p').html('');
        return false;
    }

    // log("info", "query_word: " + word, false)

    try {
        if (window.external) {
            // window.external.query_word(word);
            ipcRenderer.send('dictApp', 'QueryWord', word);
            // ipcRenderer.sendSync("QueryWord", this.dictParseFun, word, this.dictId, dict, audio);

            ipcRenderer.on('QueryWord', (event, fun, ...paras) => {
                // function buildName(firstName: string, ...restOfName: string[]) {
                //     return firstName + " " + restOfName.join(" ");
                //   }

                // let parasStr = paras.join("', '");
                // if (paras.length >= 1) {
                //     parasStr = "'" + parasStr + "'";
                // }

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
    // clear_words_list();
    clearOptions('words_list');
    $('#words_list').hide();
    $('#contents_box').css('width', 701);
    // $('#panel1 p').html('');
}

// $(':button').click(function () {
$(':button').on('click', function () {
    // disableLink(link);
    let id = $(this).attr('id');
    // alert(id + " button is clicked!")
    console.log(id + ' is clicked!');
    if (id == 'btn_lookup') {
        hide_words_list();
        query_word();
    } else if (id == 'btn_del') {
        clear_input();
    } else if (id == 'btn_menu') {
    } else if (window.external) {
        // window.external.OnButtonClicked(id);
        ipcRenderer.send('dictApp', 'OnButtonClicked', id);
    }
});

$(function () {
    // $('#word_input').bind('keyup', function (event) {
    $('#word_input').on('keyup', function (event) {
        if (event.keyCode == '13') {
            //return key
            // alert('你输入的内容为：' + $('#word_input').val());
            hide_words_list();
            query_word();
        } else {
            let word = $('#word_input').val();
            // get current tabRef

            // $('#panel1 p').html('你输入的内容为：' + word);
            // tabRef = $(".nav-tabs").children('.active').attr('href');
            let tabRef = get_active_tab_href();
            // log("info", tabRef, false);

            if (word.length >= 1) {
                $(tabRef + ' p').html('你输入的内容为：' + word);
                // clear_words_list();
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

function playMP3(mp3) {
    // $("#jquery_jplayer_1").jPlayer("play");
}

function TopMostOrNot() {
    if (window.external) {
        // window.external.TopMostOrNot();
        ipcRenderer.sendSync('dictApp', 'TopMostOrNot');
    }
}

function BindSwitchTab() {
    // $('.nav-tabs li a').click(function () {
    $('.nav-tabs li a').on('click', function () {
        try {
            // var id = $(this).attr("id");
            // log("info", "id: " + id, false);
            // eval(id + "_search()");
            // log("info", "SwitchTab", false);

            let tabId = $(this).attr('href');
            log('info', 'Switch to : ' + tabId, false);
            $(tabId + ' p').html('');

            tabId = tabId.slice(1);
            log('info', 'tabId: ' + tabId, false);
            // var n = parseInt(tabNum);
            if (window.external) {
                // window.external.switch_tab(tabId);
                ipcRenderer.sendSync('dictApp', 'SwitchTab', tabId);
            }
            query_word();
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
            // window.external.OnMenuClicked(menuId);
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
    // var $a = $("#sys_menu a")
    // console.log($a);
    // href = $a.attr("href");

    // var ch = $("#ff").find("input");
    // console.log(ch.length);
    // for (var i=0; i <ch.length; i++) {
    // console.log(ch.eq(i));
    // }

    var as = $('#sys_menu a');
    // console.log(as.length);
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

function loadAndPlayAudio(audioFile){
    loadPlayer();
}

function modifyValue(id, valueStr) {
    let ele = document.getElementById(id);
    if (ele.value === undefined) {
        console.log(`innerHTML of ${id}: ${ele.innerHTML}`);
        ele.innerHTML = valueStr;
    } else {
        console.log(`value of ${id}: ${ele.value} to ${valueStr}.`);
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
