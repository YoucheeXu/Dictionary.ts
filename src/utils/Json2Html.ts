
export function process_primary(tabAlign: string, dict_primary: any): string {
    let primary = dict_primary;
    let xml = "";
    let html = "";
    let bMeaning = false;
    if (primary instanceof Array) {
        for (let i in primary) {
            let data = primary[i];
            html = process_primary(tabAlign, data);
            // console.log("html1: " + html + ";");
            if (html.slice(0, 1) == "<") {
                xml += "\r\n" + tabAlign;
            }
            xml += html;
        }
    }
    else if (typeof (primary) == "object") {
        let hasChild = false;
        let hasType = false;
        if (primary.type != undefined) {
            hasType = true;
            if (primary.type == "container") {
                xml += "\r\n" + tabAlign + "<div class = 'wordtype'>" + primary.labels[0].text + ": </div>\r\n";
                xml += tabAlign + "<div class = '" + primary.type + "1'>\r\n";
                tabAlign += "\t";
                html = process_terms(tabAlign, primary.terms, primary.type);
                if (html.slice(0, 1) == "<") {
                    xml += "\r\n" + tabAlign;
                }
                xml += html;
            } else {
                if (primary.labels != undefined) {
                    // if(xml.substr(-1, 1) == ">"){
                    // xml += "\r\n";
                    // }
                    xml += tabAlign + "<div class = '" + primary.type + "'>";
                    tabAlign += "\t";
                    xml += "\r\n" + tabAlign + "<div class = 'labels'>" + primary.labels[0].text + "</div>";
                    html = process_terms(tabAlign, primary.terms, primary.type);
                    if (html.slice(0, 1) == "<") {
                        xml += "\r\n" + tabAlign;
                    }
                    xml += html;
                }
                else {
                    if (primary.type == "meaning") {
                        bMeaning = true;
                    }
                    if (primary.type == "example" && bMeaning == true) {
                        xml += "\r\n";
                        bMeaning = false;
                    }
                    xml += tabAlign + "<div class = '" + primary.type + "'>";
                    tabAlign += "\t";
                    html = process_terms(tabAlign, primary.terms, primary.type);
                    if (html.slice(0, 1) == "<") {
                        xml += "\r\n" + tabAlign;
                    }
                    // console.log("html4: " + html + ";");
                    xml += html;
                }
            }
            if (primary.entries != undefined) {
                html = process_primary(tabAlign, primary.entries);
                // console.log("html: " + html + ";");
                // console.log("xml: " + xml + ";");
                // console.log("html2: " + html + ";");
                if (html.slice(0, 1) == "<") {
                    xml += "\r\n" + tabAlign + "Q: ";
                }
                xml += html;
            }
            // xml += tabAlign + "</div>\r\n";
            tabAlign = tabAlign.slice(0, -1);
            // console.log(xml.substr(-3, 3));
            if (xml.substr(-3, 1) == ">") {
                xml += tabAlign;
            }
            if (xml.substr(-1, 1) == ">") {
                xml += "\r\n" + tabAlign;
            }
            xml += "</div>\r\n";
            // tabAlign = tabAlign.slice(0, -2);
        }
    }
    else if (typeof (primary) == "string") {
        html = process_primary(tabAlign, eval("(" + primary + ")"));
        // console.log("html3: " + html + ";");
        xml += html;
    }
    return xml;
}

function process_terms(tabAlign: string, dict_terms: any, type: any): string {
    let terms = dict_terms
    let xml = ""
    let html = ""
    if (terms instanceof Array) {
        for (let i in terms) {
            let data = terms[i];
            html = process_terms(tabAlign, data, type);
            // if(html.slice(0,1) == "<"){
            // xml += "\r\n" + tabAlign;
            // }
            xml += html;
        }
    }
    else if (typeof (terms) == "object") {
        let hasType = false;
        if (terms.type != undefined) {
            hasType = true;
            if (terms.type != "text" || type == "headword" || type == "related") {
                if (terms.type == "sound") {
                    /*xml += '<div class="'+ terms.type + '">';
                    //xml += terms.text +"</div>";
                    xml += '<embed type="application/x-shockwave-flash" src="SpeakerApp16.swf"' +
                        'width="20" height="20" id="movie28564" name="movie28564" bgcolor="#000000"' +
                        'quality="high" flashlets="sound_name='+ terms.text + '"wmode="transparent">'
                    xml += "</div>"*/
                    // alert(terms.text);
                    xml += getSound(tabAlign, terms.text);
                }
                else {
                    // console.log("P: " + xml)
                    // if(xml.substr(-1, 1) == ">"){
                    // xml += "\r\n" + tabAlign;
                    // }
                    xml += "\r\n" + tabAlign + "<div class = '" + terms.type + "'>" +
                        terms.text + "</div>";
                }
            }
            else {
                xml += terms.text;
            }
        }
    }
    return xml
}

function process_term(dict_terms: any): string {
    let terms = dict_terms

    let xml = "";
    for (let i in terms) {
        let data = terms[i];
        xml += (data.text);
    }
    return xml;
}


function getSound(tabAlign: string, url: string): string {
    let sound =
        '\r\n' +
        tabAlign +
        "<div class = 'sound' id = 'Player'>\r\n" +
        tabAlign +
        '\t' +
        "<button class = 'jp-play' id = 'playpause' title = 'Play'></button>\r\n" +
        tabAlign +
        '\t' +
        "<audio id = 'myaudio'>\r\n" +
        tabAlign +
        '\t' +
        '\t' +
        '<source src = ' +
        url +
        " type= 'audio/mpeg'>\r\n" +
        tabAlign +
        '\t' +
        '\t' +
        'Your browser does not support the audio tag.\r\n' +
        tabAlign +
        '\t' +
        '</audio>\r\n' +
        tabAlign +
        '</div>';
    return sound;
}