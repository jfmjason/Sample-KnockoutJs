//$.fn.dataTable.ext.errMode = 'none'; //temporary hide warning alert message for datatable

function Treatments(model) {
    self = this;
    self.UrlActions = $("#urlAcions");

    self.PatientTypes   = ko.observableArray([{ id: -1, text: 'ALL' }, { id: 1, text: 'INPATIENT' }, { id: 0, text: 'OUTPATIENT' }]);
    self.PTTreatments   = ko.observableArray(model.Treatments);
  
    self.Therapist      = ko.observableArray(model.Therapist);
    self.Sexes          = ko.observableArray(model.Sex);
    self.Cities         = ko.observableArray(model.Cities);
    self.Countries      = ko.observableArray(model.Countries);
    self.AgeTypes       = ko.observableArray(model.AgeTypes);
    self.Patients       = ko.observableArray();
    self.SearchedPatient= ko.observableArray();

  

    self.LoginOperator  = ko.observable(model.Operator);
    self.BookingOperator= "";
    self.Operator       = ko.observable(model.OperatorId);
    self.FromDateTime   = ko.observable(model.BookingDate);
    self.ToDateTime     = ko.observable(model.BookingDate);
    self.RegistrationNo = ko.observable(0);

    //Search Patient
    self.SearchParam     = new PatientSeachParam();

    self.SelectedRegNo   = ko.observable();
    self.OPPin           = ko.observable();
    self.hasDate         = ko.observable(false);
    self.SelectedPatTientType = ko.observable(-1);
    self.SelectedIPOPID  = ko.observable();
    self.SelectedBedId = ko.observable();

    self.TreatmentSheet = new TreatmentSheet();


    self.SearchPin = function (query) {

           
                param = { searchString: query.term };
                url = self.UrlActions.data('searchpatientpin');
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

    self.ClearSearchFilters = function () {
        self.SearchParam.firstName('');
        self.SearchParam.lastName('');
        self.SearchParam.middleName('');
        self.SearchParam.familyName('');
        self.SearchParam.fatherName('');
        self.SearchParam.fromDate('');
        self.SearchParam.toDate('');
        self.SearchParam.age('');
        self.SearchParam.ageType('');
        self.SearchParam.city('');
        self.SearchParam.country('');
        self.SearchParam.sex('');

        self.hasDate(false);

    };

    self.GetTreatments = function () {
      
        url = self.UrlActions.data("gettreatments");
        param = {
            from: moment(self.FromDateTime()).format("DD-MMM-YYYY"),
            to: moment(self.ToDateTime()).format("DD-MMM-YYYY"),
            patienttype: self.SelectedPatTientType(),
            pin: self.SelectedRegNo()
        };
        ajaxWrapper.Get(url, param, function (data, callback) {
            self.PTTreatments([]);
            if (data.length > 0) {
                ko.utils.arrayPushAll(self.PTTreatments, data);
            } 
        }, 'PTTreatments', 'Searching', function () { alert('error') });

    };

    self.GetTreatment = function (id) {

        url = self.UrlActions.data("gettreatmentbyid");
        param = {
          id : id
        };

        var data = ajaxWrapper.Sync('GET', url, param);

        self.TreatmentSheet.Id(id);
        self.TreatmentSheet.PatientType(data.PatientType);

        if (data.PatientType == 0) {
            self.TreatmentSheet.PIN(data.IPIDOPID);
            self.GetPatient();
        } else {
            self.TreatmentSheet.IPIDOPID(data.IPIDOPID);
        }

        self.TreatmentSheet.TherapistId(data.TherapistId);
        self.TreatmentSheet.Diagnosis(data.Diagnosis);
        self.TreatmentSheet.PlanOfManagement(data.PlanOfManagement);
        self.TreatmentSheet.BriefHistory(data.BriefHistory);
        self.TreatmentSheet.AGoals(data.Goals);
        self.TreatmentSheet.Objective(data.ObjEvalProblems);
        self.TreatmentSheet.BTreatment(data.Treatment);
        self.TreatmentSheet.Assessment(data.Assessment);
        self.TreatmentSheet.ProgressNotes(data.ProgressNotes);

    };

    self.GetInpatients = function (selected) {
        url = self.UrlActions.data("getinpatients");
        ajaxWrapper.Post(url, null, function (data, callback) {
            self.Patients([]);
            if (data.length > 0) {
                ko.utils.arrayPushAll(self.Patients, data);

                self.Patients.unshift({ IPOPID: "", PatientName: "", RegistrationNo: "", IACRegno: "", BedId: 0, BedName: "" });
                if (selected) {
                    self.TreatmentSheet.IPIDOPID(selected);
                } else {
                    self.TreatmentSheet.IPIDOPID('');
                }
            }
        });
      
    };

    self.GetPatient = function () {
        url = self.UrlActions.data("getpatient");
        param = { regNo: self.TreatmentSheet.PIN() }

        self.TreatmentSheet.RegistrationNo(param.regNo);


        var data = ajaxWrapper.Sync('GET', url, param);

          if (data.RegistrationNo > 0) {
                self.TreatmentSheet.PIN(data.IACRegno);
                self.TreatmentSheet.PatientName(data.PatientName);
                self.TreatmentSheet.AgetTypeId(data.AgeTypeId);
                self.TreatmentSheet.Age(data.Age);
                self.TreatmentSheet.SexId(data.SexId);
                self.TreatmentSheet.BedId(0);
   
                self.TreatmentSheet.ConsultantName('');
                self.TreatmentSheet.StrAge(data.AgeStr);
                self.TreatmentSheet.StrSex(data.Sex)
                self.TreatmentSheet.StrWard(data.WardName);
               
            } else {
                self.ShowMessage('Error Alert', 'error', 'Patient not found');
                self.ClearPatientDetails();
            }



    };

    self.GetPatients = function () {
        url = self.UrlActions.data("searchpatient");

        from = moment(self.SearchParam.fromDate()).format("DD-MMM-YYYY");
        to   = moment(self.SearchParam.toDate()).format("DD-MMM-YYYY");
        param = {
                    firstName: self.SearchParam.firstName(),
                    lastName: self.SearchParam.lastName(),
                    middleName: self.SearchParam.middleName(),
                    familyName: self.SearchParam.familyName(),
                    fatherName: self.SearchParam.fatherName(),
                    fromDate: from != 'Invalid date' && to != 'Invalid date' ? from : '',
                    toDate: to != 'Invalid date'&& from != 'Invalid date' ? to : '',
                    age: self.SearchParam.age(),
                    ageType: self.SearchParam.ageType(),
                    city: self.SearchParam.city(),
                    country: self.SearchParam.country(),
                    sex: self.SearchParam.sex()
                }

        ajaxWrapper.Post(url, param, function (data, callback) {
            self.SearchedPatient([]);
            ko.utils.arrayPushAll(self.SearchedPatient, data);
        }, 'PatientTable', 'Searching', function () { alert('error') });

    };

    self.GetEmployee = function (id) {
        url = self.UrlActions.data("getemployee");
        param = { id: id };
        ajaxWrapper.Get(url, param, function (data, callback) {
            self.BookingOperator = data.Name;
            self.Operator(data.Name);
        });
    }
 
    self.GetInpatientDetails = function () {
        url = self.UrlActions.data("getinpatientdetails");
        param = { ipid: self.TreatmentSheet.IPIDOPID() };


       var data = ajaxWrapper.Sync('GET', url, param);

       self.TreatmentSheet.PatientName(data.PatientName);
       self.TreatmentSheet.AgetTypeId(data.AgeTypeId);
       self.TreatmentSheet.Age(data.Age);
       self.TreatmentSheet.SexId(data.SexId);
       self.TreatmentSheet.BedId(data.BedId);

       self.TreatmentSheet.ConsultantName(data.DoctorName);

       self.TreatmentSheet.StrAge(data.AgeStr);
       self.TreatmentSheet.StrSex(data.Sex)
       self.TreatmentSheet.StrWard(data.WardName);

    };


    self.AddTreatment = function () {

        var errors = self.Validate();
        if (errors.length > 0) {
            self.ShowErrors(errors);
        } else {

            url = self.UrlActions.data("addtreatment");

            treatment = {

                Id: self.TreatmentSheet.Id(),
                PatientType: self.TreatmentSheet.PatientType(),
                IPIDOPID: self.TreatmentSheet.PatientType() == 1? self.TreatmentSheet.IPIDOPID(): self.TreatmentSheet.RegistrationNo(),
                OperatorId:0,
                TherapistId: self.TreatmentSheet.TherapistId(),
                OrderDateTime: moment(new Date()).format("DD-MMM-YYYY HH:mm"),
                Diagnosis: self.TreatmentSheet.Diagnosis(),
                BriefHistory: self.TreatmentSheet.BriefHistory(),
                ObjEvalProblems: self.TreatmentSheet.Objective(),
                Assessment: self.TreatmentSheet.Assessment(),
                PlanOfManagement: self.TreatmentSheet.PlanOfManagement(),
                Goals: self.TreatmentSheet.AGoals(),
                Treatment: self.TreatmentSheet.BTreatment(),
                ProgressNotes: self.TreatmentSheet.ProgressNotes()
            };


            param = { treatment: treatment };

            ajaxWrapper.Post(url, param, function (data, callback) {
                self.TreatmentSheet.Id(data.id);
                if (data.id > 0) {
                    self.ShowMessage('Notification', 'success', data.message);
                    self.GetTreatments();
                    self.TreatmentSheet.OperatorName(data.operatorname);
                    
                } else {
                    self.ShowMessage('Error', 'error', data.message);
                }


            });
        }
    }

    self.UpdateTreatment = function () {

        var errors = self.Validate();

        if (self.TreatmentSheet.OperatorId() != self.Operator()) {
            self.ShowMessage('Access Denied', 'error', 'This Treatment Sheet is made by \n [ ' + self.TreatmentSheet.OperatorId() + ' ] ' + self.TreatmentSheet.OperatorName() + '\n You cannot edit this record', 3000);
        }
        else if (errors.length > 0) {
            self.ShowErrors(errors);
        } else {

            url = self.UrlActions.data("updatetreatment");

            treatment = {

                Id: self.TreatmentSheet.Id(),
                PatientType: self.TreatmentSheet.PatientType(),
                IPIDOPID: self.TreatmentSheet.PatientType() == 1 ? self.TreatmentSheet.IPIDOPID() : self.TreatmentSheet.RegistrationNo(),
                OperatorId: 0,
                TherapistId: self.TreatmentSheet.TherapistId(),
                OrderDateTime: moment(new Date()).format("DD-MMM-YYYY HH:mm"),
                Diagnosis: self.TreatmentSheet.Diagnosis(),
                BriefHistory: self.TreatmentSheet.BriefHistory(),
                ObjEvalProblems: self.TreatmentSheet.Objective(),
                Assessment: self.TreatmentSheet.Assessment(),
                PlanOfManagement: self.TreatmentSheet.PlanOfManagement(),
                Goals: self.TreatmentSheet.AGoals(),
                Treatment: self.TreatmentSheet.BTreatment(),
                ProgressNotes: self.TreatmentSheet.ProgressNotes()
            };


            param = { treatment: treatment };

            ajaxWrapper.Post(url, param, function (data, callback) {
                self.TreatmentSheet.Id(data.id);
                if (data.id > 0) {
                    self.ShowMessage('Notification', 'success', data.message);
                    self.GetTreatments();
                    self.TreatmentSheet.OperatorName(data.operatorname);

                } else {
                    self.ShowMessage('Error', 'error', data.message);
                }


            });
        }
    }

    self.NewTreatment = function () {
        self.TreatmentModal('show');
      
        self.ResetTreatment();
    }

    self.TreatmentModal = function (showhide) {
        $("#TreatmentEntry").modal(showhide);
    };

    self.SelectTreatment = function (data) {
      
            self.TreatmentModal('show');
            self.GetTreatment(data.Id);
            self.TreatmentSheet.OperatorName(data.OperatorName);
            self.TreatmentSheet.OperatorId(data.OperatorId);
     
    };
  
    self.SelectPatient = function (data) {
        
        self.TreatmentSheet.RegistrationNo(data.RegistrationNo);
        self.TreatmentSheet.PIN(data.RegistrationNo);
        self.GetPatient();
        $("#SearchPatient").modal('hide');
    };

    self.SearchPatient = function () {
        $("#SearchPatient").modal('show');
    };

    self.ShowErrors = function (errors) {
        var messages = '';
        $.each(errors, function (i, item) {
            messages += item + "\n \n";
        });

        self.ShowMessage('Validation Error(s)', 'error', messages, 3000);
    };

    self.ResetTreatment = function () {
        self.ClearPatientDetails();
        self.ClearSheetData('');
        self.TreatmentSheet.Id(0);
    };

    self.Validate = function (action) {

        var errors = [];


      
        if (self.TreatmentSheet.PatientType() == 1 && self.TreatmentSheet.IPIDOPID() == "") {
              errors.push("Please select patient details");

        }

        if (self.TreatmentSheet.PatientType() == 0 && (self.TreatmentSheet.RegistrationNo() <= 0)) {
             errors.push("Please select patient details");
       }



       return errors;
    }

    self.ShowMessage = function (title, type, message, timeout) {

        swal({
            title: title,
            text: message,
            type: type,
            confirmButtonText: 'OK',
            closeOnConfirm: true,
            allowOutsideClick: false,
            timer: timeout ? timeout : 1500
        })
    }

    self.ClearPatientDetails = function () {
        self.TreatmentSheet.PIN('');
        self.TreatmentSheet.IPIDOPID('');
        self.TreatmentSheet.RegistrationNo(0);
        self.TreatmentSheet.PatientName('');
        self.TreatmentSheet.AgetTypeId('');
        self.TreatmentSheet.Age('');
        self.TreatmentSheet.SexId('');
        self.TreatmentSheet.BedId(0);

        self.TreatmentSheet.ConsultantName('');
        self.TreatmentSheet.StrAge('');
        self.TreatmentSheet.StrSex('')
        self.TreatmentSheet.StrWard('');
        self.TreatmentSheet.OperatorName(self.LoginOperator());
        self.TreatmentSheet.TherapistId('');
    };

    self.ClearSheetData = function () {
        self.TreatmentSheet.Diagnosis('');
        self.TreatmentSheet.PlanOfManagement('');
        self.TreatmentSheet.BriefHistory('');
        self.TreatmentSheet.AGoals('');
        self.TreatmentSheet.Objective('');
        self.TreatmentSheet.BTreatment('');
        self.TreatmentSheet.Assessment('');
        self.TreatmentSheet.ProgressNotes('');
    };

    self.Print = function () {

        
        url = self.UrlActions.data("printtreatment");
        url += "?id=" + self.TreatmentSheet.Id();
      
        PrintPreviewModal(url);
    };

    self.init = function () {
        self.GetInpatients();
        self.AgeTypes.unshift({ Id: "", Name: "" });
        self.Countries.unshift({ Id: "", Name: "" });
        self.Cities.unshift({ Id: "", Name: "" });
        self.Sexes.unshift({ Id: "", Name: "" });
        self.Therapist.unshift({ Id: "", Text: "" });
        self.TreatmentSheet.OperatorName(self.LoginOperator());


        self.FromDateTime.subscribe(function (val) {
            if (val) {
                self.GetTreatments();
            }
        });
        self.ToDateTime.subscribe(function (val) {
            if (val) {
                self.GetTreatments();
            }
        });
        self.SelectedRegNo.subscribe(function (i) {
            self.GetTreatments();
        });
        self.SelectedPatTientType.subscribe(function (i) {
            self.GetTreatments();
        });

        self.TreatmentSheet.IPIDOPID.subscribe(function (i) {
            self.GetInpatientDetails();
        });
        self.TreatmentSheet.PatientType.subscribe(function (i) {
            self.ClearPatientDetails();
        });

        self.hasDate.subscribe(function (i) {
            if (!i) {
                self.SearchParam.toDate('');
                self.SearchParam.fromDate('');
                $("#SFrom").val("");
                $("#STo").val("");
            }
        });
        self.hasDate(true);
        self.hasDate(false);
    };

    self.init();

}




function PatientSeachParam() {
    winks = this
    winks.firstName = ko.observable();
    winks.lastName = ko.observable();
    winks.middleName = ko.observable();
    winks.familyName = ko.observable();
    winks.fatherName = ko.observable();
    winks.fromDate = ko.observable(moment(new Date()).format('DD-MMM-YYYY'));
    winks.toDate = ko.observable(moment(new Date()).format('DD-MMM-YYYY'));
    winks.age = ko.observable();
    winks.ageType = ko.observable();
    winks.city = ko.observable();
    winks.country = ko.observable();
    winks.sex = ko.observable();
};


function TreatmentSheet() {
    that = this
    that.Id = ko.observable(0);
    that.IPIDOPID = ko.observable('');
    that.PIN = ko.observable();
    that.RegistrationNo = ko.observable();
    that.PatientName = ko.observable();
    that.StrAge = ko.observable();
    that.StrWard = ko.observable();
    that.OperatorName = ko.observable();
    that.OperatorId = ko.observable();
    that.StrSex = ko.observable();
    that.ConsultantName = ko.observable();
    that.DateTime = ko.observable(moment(new Date()).format("DD-MMM-YYYY"));
    that.PatientType = ko.observable(1);

    that.OrderNo = ko.observable();
    that.BedId = ko.observable();
    that.TherapistId = ko.observable();
    that.Age = ko.observable();
    that.AgetTypeId = ko.observable();
    that.SexId = ko.observable();

    that.Diagnosis = ko.observable();
    that.PlanOfManagement = ko.observable();
    that.BriefHistory = ko.observable();
    that.AGoals = ko.observable();
    that.Objective = ko.observable();
    that.BTreatment = ko.observable();
    that.Assessment = ko.observable();
    that.ProgressNotes = ko.observable();
};


