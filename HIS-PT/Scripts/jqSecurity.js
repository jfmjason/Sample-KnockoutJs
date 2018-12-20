var ajaxWrapper = $.ajaxWrapper();
var PatientViewFrame = $('<div class="modal fade" id="_message-iframe" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog" style="width: 100%;height:100%;"><button type="button" class="btn btn-danger btn-md pull-right"  data-dismiss="modal" id="btn-close"><span class="glyphicon glyphicon-remove"></span> Close</button><iframe id="iframe-link" style="width: 100%;height:100%;"></iframe></div></div>');
$(document).ready(function () {
    GetMenu();
    $(document).on("click", "._iframeload", function () {
        setCookie("AppName", $(".AR_about_title").html(), 1);
        var url = $(this).data('url');
        $("._mainiframe").append($(PatientViewFrame));
        $("#_message-iframe").modal();
        $("#iframe-link").attr('src', url);
    });
    $(document).on('hidden.bs.modal', "#_message-iframe", function () {
        $(this).remove();
    });
});
function GetMenu() {
    ajaxWrapper.Get($("#txtstationame").data("appmenu"), null, function (d, e) {
        $("#url-menu").html(d);
        if ($(".featlink").data('isshow') != '0') {
            ajaxWrapper.Get($("#txtstationame").data("appissue"), null, function (dd) {
                $.each(dd, function (iss, isss) {
                    NotifyIssueInfo("<b><u>Issue:</u></b><small> : <i>" + isss.Remarks + "</i></small><br/>" + "<b><u>Remarks</u></b> : <small>" + isss.ResolvedRemarks + '</small>');
                });
            });
        }
    });
}

function SecureFeatures() {
    $(".featlink").addClass("disabled");
    $(".featlink").css("pointer-events", "none");
    ajaxWrapper.Get($("#txtstationame").data("urlsecure"), null, function (d, e) {
        $.each(d, function (index, name) {
            $('.featlink').each(function () {
                if ($(this).data("featid") == name.id) {
                    $(this).removeClass("disabled");
                    $(this).css("pointer-events", "visible");
                }
            });
        });
    });
}

function SecureFunction() {
    $(".func-btn").addClass("disabled");
    ajaxWrapper.Get($("#txtstationame").data("urlfunction"), null, function (d, e) {
        $.each(d, function (index, name) {
            $('.func-btn').each(function () {
                if ($(this).data("funcid") == name.id) {
                    $(this).removeClass("disabled");
                }
            });
        });
    });
}

function NotifyIssueInfo(msg, module) {
    toastr.options = {
        "closeButton": true,
        "debug": true,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "0",
        "hideDuration": "0",
        "timeOut": "0",
        "extendedTimeOut": "0",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "fadeOut"
    }
    toastr.info(msg, module);
}

function LckScr() {
    $('body').block({ message: null });
    //console.log($(window).data());
    //alert();
}
function UnLckScr() {
    $('body').unblock();
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
function delCookie(cname) {
    document.cookie = cname + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;path=/';
}