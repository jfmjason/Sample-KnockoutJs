//$.fn.dataTable.ext.errMode = 'none'; //temporary hide warning alert message for datatable

function Report(model) {
    self = this;
    self.UrlActions = $("#urlAcions");

    self.PatientType  =  ko.observable(0);

    self.FromDate = ko.observable(moment(new Date()).format("DD-MMM-YYYY"));
    self.ToDate = ko.observable(moment(new Date()).format("DD-MMM-YYYY"));

    self.Doctors = ko.observableArray(model.Doctors);
    self.Inpatients = ko.observableArray(model.Inpatients);

    self.SelectedDoctor = ko.observable();
    self.Refferedby = ko.observable('');
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
        self.Refferedby('');
        self.SelectedRegNo('');
        self.SelectedDoctor('');
        $("#pdfwrapper").html('');
    };

    self.PrintPreview = function () {

        regno = self.SelectedRegNo();
        regno = regno == ""?0:regno;

        doctor = self.SelectedDoctor();
        doctor = doctor == "" ? 0 : doctor;
        debugger;
        url     = self.UrlActions.data("printpreview");
        url += "?from=" + moment(self.FromDate()).format("DD-MMM-YYYY")
                + "&to=" + moment(self.ToDate()).format("DD-MMM-YYYY")
                + "&patientType=" + self.PatientType()
                + "&referredBy=" + $.trim(self.Refferedby())
                + "&doctorId=" + doctor
                + "&registrationNo=" + regno;

        PrintPreview(url,'pdfwrapper');
    };

    self.init = function () {
        self.Doctors.unshift({ Id: '', Text: '' });
        self.Inpatients.unshift({ RegistrationNo: '', IACRegno: '' });

        var height = $(document).innerHeight();
        height -=300;

        self.ReportHeight(height + 'px');
    };
    self.init();


}