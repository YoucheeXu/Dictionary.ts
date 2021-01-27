"use strict";
// import { ipcRenderer } from "electron";
// const { ipcRenderer } = require('electron');
/*function getValue(id: string) {
    let ele = document.getElementById(id);
    if (ele != null) {
        if (ele.value) {
            // console.log(`value of ${id}: ${ele.value}`);
            return ele.value;
        } else {
            // console.log(`innerHTML of ${id}: ${ele.innerHTML}`);
            return ele.innerHTML;
        }
    }
}

function modifyValue(id: string, valueStr: string) {
    let ele = document.getElementById(id);
    if (ele != null) {
        if (ele.value === undefined) {
            console.log(`innerHTML of ${id}: ${ele.innerHTML}`);
            ele.innerHTML = valueStr;
        } else {
            console.log(`value of ${id}: ${ele.value} to ${valueStr}.`);
            ele.value = valueStr;
        }
    }
}*/
function displayOrHide(id, is) {
    if (is === void 0) { is = true; }
    var ele = document.getElementById(id);
    if (ele != null) {
        if (is) {
            ele.style.display = "block";
        }
        else {
            ele.style.display = "none";
        }
    }
}
function getAttr(id, attr) {
    var ele = document.getElementById(id);
    if (ele != null) {
        return ele.getAttribute(attr);
    }
    else {
        return null;
    }
}
function modifyAttr(id, attr, attrVal) {
    var ele = document.getElementById(id);
    if (ele != null) {
        ele.setAttribute(attr, attrVal);
        console.log(id + ': ' + attr + ' => ' + attrVal);
    }
}
function removeAttr(id, attr) {
    var ele = document.getElementById(id);
    if (ele != null) {
        ele.removeAttribute(attr);
    }
}
function DisaOrEnaBtn(id, set) {
    if (set === void 0) { set = "true"; }
    // console.log(`DisaOrEnaBtn ${typeof(set)}`);
    var btn = document.getElementById(id);
    if (btn != null) {
        btn.disabled = (set == "true");
        // if (set == true) {
        //     console.log(`disable button: ${id}`);
        // }
        // else if (set == false) {
        //     console.log(`enable button: ${id}`);
        // }
    }
}
function appendOpt(id, val, txt) {
    console.log("append " + val + " to " + id);
    var ele = document.getElementById(id);
    if (ele != null) {
        var sel = ele;
        var opt = document.createElement("option");
        opt.value = val;
        /*if (txt === undefined) {
            opt.text = val;
        }
        else {
            opt.text = txt;
        }*/
        opt.text = txt || val;
        sel.appendChild(opt);
    }
}
function getSelTxt(id) {
    var ele = document.getElementById(id);
    if (ele != null) {
        var selEle = ele;
        var selIndex = selEle.selectedIndex;
        if (selIndex < 0) {
            console.error(id + "is not prepared!");
            return "";
        }
        return selEle.options[selIndex].text;
    }
}
function getSelVal(id) {
    var ele = document.getElementById(id);
    if (ele != null) {
        var selEle = ele;
        return selEle.value;
    }
}
function clearOptions(id) {
    var ele = document.getElementById(id);
    if (ele != null) {
        var selEle = ele;
        selEle.options.length = 0;
    }
}
//# sourceMappingURL=gui-common.js.map