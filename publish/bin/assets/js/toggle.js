var curr_show_example = true;

var get_all_example_uls = function () {
    let results = [];
    let eles = document.getElementsByTagName('ul');
    for (let i in eles) {
        if (eles[i].className == 'entries_example') {
            results.push(eles[i]);
        }
    }
    return results;
};

var hide_example = function () {
    let tog = $('#toggle_example');
    //alert(tog.innerHTML);
    tog.innerHTML = '+ Show Examples';
    $('.example').hide();
    curr_show_example = false;
    //alert("hide_example");
};

var show_example = function () {
    let tog = $('toggle_example');
    tog.innerHTML = '- Hide Examples';
    $('.example').show();
    curr_show_example = true;
    alert('show_example');
};

var toggle_example = function () {
    alert('toggle_example');
    if (curr_show_example) {
        hide_example();
    } else {
        show_example();
    }
};

function bindToggleExample() {
    // $("#toggle_example").click(function() {
    $('#toggle_example').on('click', function () {
        $('.example').toggleClass('hide_Style');
        //alert("(\"#toggle_example\").click");
        //let togtext = $(this).text();
        //alert(togtext);
        if (curr_show_example) {
            curr_show_example = false;
            //alert($(this).attr)
            //$(this).innerHTML = "+ Show Examples";
            $(this).text('+ Show Examples');
        } else {
            curr_show_example = true;
            //$(this).innerHTML = "- Hide Examples";
            $(this).text('- Hide Examples');
        }
    });

    // $('#toggle_example').mouseover(function () {
    $('#toggle_example').on('mouseover', function () {
        $('.none_class_just_example').toggleClass('bold');
    });

    // $('#toggle_example').bind('mouseenter mouseleave', function () {
    $('#toggle_example').on('mouseenter mouseleave', function () {
        $(this).toggleClass('bold');
    });
}
