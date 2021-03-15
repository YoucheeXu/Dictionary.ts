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

function displayOrHide(id: string, is = true) {
    let ele = document.getElementById(id);
    if (ele != null) {
        if (is) {
            ele.style.display = "block";
        }
        else {
            ele.style.display = "none";
        }
    }
}

function getAttr(id: string, attr: string) {
    let ele = document.getElementById(id);
    if (ele != null) {
        return ele.getAttribute(attr);
    }
    else {
        return null;
    }
}

function modifyAttr(id: string, attr: string, attrVal: string) {
    let ele = document.getElementById(id);
    if (ele != null) {
        ele.setAttribute(attr, attrVal);
        console.log(id + ': ' + attr + ' => ' + attrVal);
    }
}

function removeAttr(id: string, attr: string) {
    let ele = document.getElementById(id);
    if (ele != null) {
        ele.removeAttribute(attr);
    }
}

function DisaOrEnaBtn(id: string, set = "true") {
    // console.log(`DisaOrEnaBtn ${typeof(set)}`);
    let btn = <HTMLButtonElement>document.getElementById(id);
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

function appendOpt(id: string, val: string, txt?: string) {
    console.log(`append ${val} to ${id}`);
    let ele = document.getElementById(id);
    if (ele != null) {
        let sel = <HTMLSelectElement>ele;
        let opt = document.createElement("option");
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

function getSelTxt(id: string) {
    let ele = document.getElementById(id);
    if (ele != null) {
        let selEle = <HTMLSelectElement>ele;
        let selIndex = selEle.selectedIndex;
        if (selIndex < 0) {
            console.error(id + "is not prepared!");
            return "";
        }
        return selEle.options[selIndex].text;
    }
}

function getSelVal(id: string) {
    let ele = document.getElementById(id);
    if (ele != null) {
        let selEle = <HTMLSelectElement>ele;
        return selEle.value;
    }
}

function selIndex(id: string, index: number) {
    let ele = document.getElementById(id);
    if (ele != null) {
        let selEle = <HTMLSelectElement>ele;
        selEle.options[index].setAttribute("selected", "selected");
        let selIndex = selEle.selectedIndex;
        console.log(selIndex);
        // selIndex = index;
    }
}

function clearOptions(id: string) {
    let ele = document.getElementById(id);
    if (ele != null) {
        let selEle = <HTMLSelectElement>ele;
        selEle.options.length = 0;
    }
}