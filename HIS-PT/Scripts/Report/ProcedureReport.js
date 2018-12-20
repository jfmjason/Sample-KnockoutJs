//$.fn.dataTable.ext.errMode = 'none'; //temporary hide warning alert message for datatable

function Report(model) {
    self = this;
    self.UrlActions = $("#urlAcions");

    self.PatientType  =  ko.observable(0);
    self.ReportOption = ko.observable(0);

    self.FromDate = ko.observable(moment(new Date()).format("DD-MMM-YYYY"));
    self.ToDate = ko.observable(moment(new Date()).format("DD-MMM-YYYY"));

    self.Therapist = ko.observableArray(model.PTTherapist);
    self.Procedures = ko.observableArray(model.PTProcedure);
    self.Inpatients = ko.observableArray(model.Inpatients);

    self.SelectedTherapist = ko.observable();
    self.SelectedProcedure = ko.observable();
    self.SelectedRegNo = ko.observable();
    self.ReportHeight = ko.observable();

    self.SearchPin = function (query) {
        param = { searchString: query.term };
        url = self.UrlActions.data('searchpatient');
        ajaxWrapper.Get(url, param, function (data, e) {
            var filteredData = [];
            ko.utils.arrayForEach(data, function (patient) {
                filteredData.push({ id: patient.RegistrationNo, text: patient.IACRegno });

            });
            query.callback({
                results: filteredData
            });
        });
    };

    self.Clear = function () {

        self.SelectedProcedure('');
        self.SelectedRegNo('');
        self.SelectedTherapist('');
        $("#pdfwrapper").html('');
    };

    self.PrintPreview = function () {

        procId = self.SelectedProcedure();
        procId = procId == ""?0:procId;

        regno = self.SelectedRegNo();
        regno = regno == ""?0:regno;

        theraId = self.SelectedTherapist();
        theraId = theraId == ""?0:theraId;
        debugger;
        url     = self.UrlActions.data("printpreview");
        url += "?from=" + moment(self.FromDate()).format("DD-MMM-YYYY")
                + "&to=" + moment(self.ToDate()).format("DD-MMM-YYYY")
                + "&patientType=" + self.PatientType()
                + "&ordermode=" + self.ReportOption()
                + "&procedureId=" + procId
                + "&therapistId=" + theraId
                + "&registrationNo=" + regno;

        PrintPreview(url,'pdfwrapper');
    };

    self.init = function () {
        self.Therapist.unshift({ Id: '', Text: '' });
        self.Procedures.unshift({ Id: '', Text: '' });
        self.Inpatients.unshift({ RegistrationNo: '', IACRegno: '' });

        var height = $(document).innerHeight();
        height -=300;

        self.ReportHeight(height + 'px');
    };
    self.init();


}