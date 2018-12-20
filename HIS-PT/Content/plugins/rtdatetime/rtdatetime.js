$(document).ready(function () {
    var sgh_realtime_dateandtime = setInterval(function () {
        var momentNow = moment().locale('en');
        $('#sgh_rt_date').html(momentNow.format('dddd').toUpperCase() + ', ' + momentNow.format('MMMM DD, YYYY ').toUpperCase());
        //.substring(0, 3).toUpperCase());
        $('#sgh_rt_time').html(momentNow.format('hh:mm:ss A'));
    }, 100);

    var sgh_realtime_hijri_dateandtime = setInterval(function () {
        var momentNow1 = moment();
        var momentNow2 = moment().locale('ar-sa');

        $('#sgh_hjrt_date').html('[ Month of ' + momentNow1.format('iM ') + '] ' + momentNow1.format('iMMMM iDD, iYYYY ').toUpperCase());

        $('#sgh_arrt_date').html(momentNow2.format('iYYYY/iM/iD').toUpperCase());
    }, 100);

});