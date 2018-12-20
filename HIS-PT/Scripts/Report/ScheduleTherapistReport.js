//$.fn.dataTable.ext.errMode = 'none'; //temporary hide warning alert message for datatable

function Report(model) {
    self = this;
    self.UrlActions = $("#urlAcions");



    self.FromDate = ko.observable(moment(model.From).format("DD-MMM-YYYY"));

    self.ToDate = ko.observable(moment(model.To).format("DD-MMM-YYYY"));

    self.Therapist = ko.observableArray(model.Therapist);

    self.SelectedTherapist = ko.observable();

    self.ReportHeight = ko.observable();

    self.Clear = function () {

        self.SelectedProcedure('');
        self.SelectedRegNo('');
        self.SelectedTherapist('');
        $("#pdfwrapper").html('');
    };

    self.PrintPreview = function () {
        url     = self.UrlActions.data("printpreview");
        url += "?from=" + moment(self.FromDate()).format("DD-MMM-YYYY")
               + "&to=" + moment(self.ToDate()).format("DD-MMM-YYYY")
               + "&therapistId=" + self.SelectedTherapist()
        PrintPreview(url,'pdfwrapper');
    };

    self.init = function () {
      
        self.Therapist.unshift({ Id: '', Name: '' });
        var height = $(document).innerHeight();
        height -=280;

        self.ReportHeight(height + 'px');
    };
    self.init();


}