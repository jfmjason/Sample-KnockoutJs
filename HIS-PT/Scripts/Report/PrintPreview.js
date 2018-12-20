

$(window).load(function () {
    var height = $(window).innerHeight();
    var width = $(window).innerWidth();
    var container = $("#framecontainer");
    height -= 100;
    container.css('height', height + 'px');
});


function PrintPreview(url, containerid) {

    var container = $("#" + containerid)

    iframe = '<iframe src="' + url + '" height="100%" width="100%;background:gray;" style="margin-bottom:10px;"></iframe>'

    container.html(iframe);

    $(container).block({
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: 0.7,
            color: '#fff',
            top: '500px !important'
        }
    });


    $('.blockUI.blockMsg').css('top', '40%');
    $('.blockUI.blockMsg').css('left', '33%');
    container.find("iframe").unbind('load');
    container.find("iframe").load(function () {
        $(container).unblock({ fadeOut: 0 });
    });

};


function PrintPreviewModal(url) {

    var container =  $("#framecontainer");

    iframe = '<iframe src="' + url + '" height="100%" width="100%;background:gray;"></iframe>'

    container.html(iframe);

    $(container).block({
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: 0.7,
            color: '#fff',
            top: '500px !important'
        }
    });


    $('.blockUI.blockMsg').css('top', '40%');
    $('.blockUI.blockMsg').css('left', '33%');
    container.find("iframe").unbind('load');
    container.find("iframe").load(function () {
        $(container).unblock({ fadeOut: 0 });
    });


    $("#PrintPreview").modal('show');
}