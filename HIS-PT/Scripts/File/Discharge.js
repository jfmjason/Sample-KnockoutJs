//Creator : Jason F. Morales
//Date : 19 - Dec - 2016

function Discharge(model) {
    self = this;
    self.UrlActions = $("#urlAcions");

    self.PatientTypes = ko.observableArray([{ id: -1, text: 'ALL' }, { id: 1, text: 'INPATIENT' }, { id: 0, text: 'OUTPATIENT' }]);

    self.Therapist = ko.observableArray(model.Therapist);
    self.Technicians = ko.observableArray(model.Technicians);
    self.Procedures = ko.observableArray(model.Procedures);
    self.Sexes = ko.observableArray(model.Sex);
    self.Cities = ko.observableArray(model.Cities);
    self.Countries = ko.observableArray(model.Countries);
    self.AgeTypes = ko.observableArray(model.AgeTypes);
    self.Patients = ko.observableArray();
    self.LatestIcdDescription = ko.observableArray();
    self.OrderedProcedures = ko.observableArray();

    self.ResetProcedureandIcdflag = ko.observable(true);

    self.LatestIcdIdJsonArray = ko.computed(function () {
        ids = [];

        $.each(self.LatestIcdDescription(), function (index, item) {
            ids.push(item.ICDId);
        });

        return JSON.stringify(ids);
    }, this);

    self.AllPTDischarge = ko.observableArray([]);
    self.PhysioExaminationDetails = ko.observableArray([]);

    self.TabContentHeight = ko.computed(function () {
        var docheight = $(window).innerHeight();

        return docheight -320 + 'px';

    },this);
    // --------- exam tabs  -----------------------
    self.Rom = ko.observableArray([]);
    self.SelectedRomTab = ko.observable();

    self.Measurement = ko.observableArray([]);
    self.SelectedMeasurementTab = ko.observable();

    self.MotorExamination = ko.observableArray([]);
    self.SelectedMotorExaminationTab = ko.observable();

    self.Presently = ko.observableArray([]);
    self.SelectedPresentlyTab = ko.observable();

    self.BladderBowel = ko.observableArray([]);
    self.SelectedBladderBowelTab = ko.observable();

    self.PressureSore = ko.observableArray([]);
    self.SelectedPressureSoreTab = ko.observable();

    self.FunctionalAbilities = ko.observableArray([]);
    self.SelectedFunctionalAbilitiesTab = ko.observable();

    self.AdviceOnDischarge = ko.observableArray([]);
    self.SelectedAdviceOnDischargeTab = ko.observable();

    // --------------------------------------------

    self.SearchedPatient = ko.observableArray();

    self.LoginOperator = ko.observable(model.Operator);
    self.BookingOperator = "";
    self.Operator = ko.observable(model.Operator);
    self.RegistrationNo = ko.observable(0);

    self.LatestIcdDisplay = ko.observable(false);
    self.PTDischarge = new PTDischarge();

    //Search Patient
    self.SearchParam = new PatientSeachParam();

    self.SelectedRegNo = ko.observable();
    self.OPPin = ko.observable();
    self.hasDate = ko.observable(false);

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

    self.GetInpatients = function () {
        url = self.UrlActions.data("getinpatients");
        data = ajaxWrapper.Sync('GET', url);
        ko.utils.arrayPushAll(self.Patients, data);
        self.Patients.unshift({ IPOPID: "", PatientName: "", RegistrationNo: "", IACRegno: "", BedId: 0, BedName: "" });
        self.PTDischarge.IPIDOPID('');
    };

    self.GetPatient = function (val) {
        url = self.UrlActions.data("getpatient");
        param = { regNo: self.PTDischarge.PIN() }
        self.PTDischarge.RegistrationNo(0);
        self.ResetProcedureandIcdflag(false);
        ajaxWrapper.Post(url, param, function (data, callback) {
            self.PTDischarge.RegistrationNo(data.RegistrationNo)
            if (data.RegistrationNo > 0) {

                self.PTDischarge.RegistrationNo(data.RegistrationNo);
                self.PTDischarge.PIN(data.IACRegno);
                self.PTDischarge.PatientName(data.PatientName);
                self.PTDischarge.ConsultantName(data.DoctorName);
                self.PTDischarge.AgeStr(data.AgeStr);
                self.PTDischarge.SexStr(data.Sex);
                self.PTDischarge.WardStr(data.WardName);
                self.PTDischarge.DateOfAdmission('');
                self.GetLatestICDDetailsOP(data.RegistrationNo, true);

                self.PTDischarge.CountryName(data.CountryName);
                self.PTDischarge.CityName(data.CityName);
                self.PTDischarge.ZipCode(data.ZipCode);
                self.PTDischarge.Address1(data.Address1);
                self.PTDischarge.Address2(data.Address2);
                self.PTDischarge.Address3(data.Address3);

            } else {
                self.LatestIcdDescription([]);
                self.ResetFields();
                self.ShowMessage('Error Alert', 'error', 'Patient not found');
            }


        }, 'SchedDetail', 'Please wait');


    };

    self.GetPatients = function () {
        url = self.UrlActions.data("searchpatient");

        from = moment(self.SearchParam.fromDate()).format("DD-MMM-YYYY");
        to = moment(self.SearchParam.toDate()).format("DD-MMM-YYYY");
        param = {
            firstName: self.SearchParam.firstName(),
            lastName: self.SearchParam.lastName(),
            middleName: self.SearchParam.middleName(),
            familyName: self.SearchParam.familyName(),
            fatherName: self.SearchParam.fatherName(),
            fromDate: from != 'Invalid date' && to != 'Invalid date' ? from : '',
            toDate: to != 'Invalid date' && from != 'Invalid date' ? to : '',
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

    self.GetPTSchedule = function (schedId) {

        if (schedId) {
            url = self.UrlActions.data("getptschedule");

            param = {
                schedId: schedId
            }

            ajaxWrapper.Post(url, param, function (data, callback) {

                self.OrderDoctorId(data.DoctorId);
                self.OrderRemarks(data.getptschedule);
                self.OrderProcedureStartTime(moment(data.FromDateTime).format("DD-MMM-YYYY hh:mm A"));
                self.OrderProcedureEndTime(moment(data.ToDatetime).format("DD-MMM-YYYY hh:mm A"));
                self.OrderRemarks(data.Remarks);
            }, '', 'Searching', function () { alert('error') });
        }

    };

    self.GetPTDischarge = function (ipidopid) {
        url = self.UrlActions.data("getptdicharge");
        param = { ipopid: ipidopid, patienttype: self.PTDischarge.PatientType() };

        return ajaxWrapper.Sync('GET', url, param);
    }

    self.GetPhysioExaminationDetails = function (ptdischargeid) {

        url = self.UrlActions.data("getptexamdetails");
        param = { ptdischargeid: ptdischargeid };

        return ajaxWrapper.Sync('GET', url, param);
    };

    self.GetInpatientDetails = function (val) {

        url = self.UrlActions.data("getinpatientdetails");
        param = { ipid: val };

        var data = ajaxWrapper.Sync('GET', url, param);

        ajaxWrapper.Get(url, param, function (data, callback) {

            self.PTDischarge.PatientName(data.PatientName);
            self.PTDischarge.ConsultantName(data.DoctorName);
            self.PTDischarge.AgeStr(data.AgeStr);
            self.PTDischarge.SexStr(data.Sex);
            self.PTDischarge.WardStr(data.WardName);
            self.PTDischarge.DateOfAdmission(moment(data.AdmitDateTime).format("DD-MMM-YYYY hh:mm A"));

            self.PTDischarge.CountryName(data.CountryName);
            self.PTDischarge.CityName(data.CityName);
            self.PTDischarge.ZipCode(data.ZipCode);
            self.PTDischarge.Address1(data.Address1);
            self.PTDischarge.Address2(data.Address2);
            self.PTDischarge.Address3(data.Address3);

        });  
    };

    self.GetLatestICDDetailsOP = function (regno, withconfirmation) {
        self.LatestIcdDescription([]);
        self.OrderedProcedures([]);

        self.GetOrderedProcedures(regno, self.PTDischarge.PatientType());

        url = self.UrlActions.data("geticddescriptionop");

        param = {
            regno: regno
        };
    

        ajaxWrapper.Post(url, param, function (data, callback) {
            ko.utils.arrayPushAll(self.LatestIcdDescription, data);

            
            if (withconfirmation) {
                self.AllPTDischarge([]);
                discharge = self.GetPTDischarge(regno);

                if (discharge.length > 0) {

                    sel = discharge[0];
                    discharge.unshift({ Id: '', DateOfDischarge: '' });

                    ko.utils.arrayPushAll(self.AllPTDischarge, discharge);
                    self.PTDischarge.Id('');

                    swal({
                        title: 'Confirmation',
                        text: "Do you want to create New Discharge Summary?",
                        type: "info",
                        showCancelButton: true,
                        confirmButtonText: 'YES',
                        cancelButtonText: "NO",
                        closeOnConfirm: true,
                        allowOutsideClick: false
                    }, function (isConfirm) {
                        self.ResetProcedureandIcdflag(false);

                        if (isConfirm) {
                            self.NewEntry();

                        } else {

                            self.PTDischarge.DateOfAdmission(moment(sel.DateOfAdmission).format("DD-MMM-YYYY hh:mm A"));
                            self.PTDischarge.DateOfDischarge(moment(sel.DateOfDischarge).format("DD-MMM-YYYY hh:mm A"));
                            self.PTDischarge.TherapistId(sel.TherapistId);
                            self.SetDichargeDetails(sel.Id);

                            self.PTDischarge.Id(sel.Id);

                        }
                    });


                } else {

                    self.NewEntry();
                }
            } else {
                self.SetPhysioTableDefination();
                if (self.LatestIcdDescription().length > 0) {
                    self.PTDischarge.DateOfAdmission(moment(self.LatestIcdDescription()[0].DateTime).format("DD-MMM-YYYY hh:mm A"));
                }
                self.PTDischarge.DateOfDischarge(moment(new Date()).format("DD-MMM-YYYY hh:mm A"));
            }
        });

    };

    self.NewEntry = function () {
        self.AllPTDischarge([]);
        self.PTDischarge.Id(0);
        self.SetDichargeDetails(0);
        self.PTDischarge.TherapistId(0);
        self.PTDischarge.DateOfDischarge(moment(new Date()).format("DD-MMM-YYYY hh:mm A"));
        if (self.LatestIcdDescription().length > 0) {
            admitdate = moment(self.LatestIcdDescription()[0].DateTime).format("DD-MMM-YYYY hh:mm A");
            self.PTDischarge.DateOfAdmission(admitdate);
        } else {
            self.PTDischarge.DateOfAdmission('');
        }

        self.SetPhysioTableDefination();
    }

    self.GetLatestICDDetailsIP = function (ipid) {
        self.LatestIcdDescription([]);
        self.AllPTDischarge([]);
        url = self.UrlActions.data("geticddescriptionip");

        param = {
            ipid: ipid
        };

        ajaxWrapper.Get(url, param, function (data, callback) {
            ko.utils.arrayPushAll(self.LatestIcdDescription, data);
            discharge = self.GetPTDischarge(ipid);
            ko.utils.arrayPushAll(self.AllPTDischarge, discharge);
            self.PTDischarge.TherapistId(0);
            self.PTDischarge.DateOfDischarge(moment(new Date()).format("DD-MMM-YYYY hh:mm A"));
            self.PTDischarge.DateOfAdmission('');
            if (self.AllPTDischarge().length > 0) {

                sel = self.AllPTDischarge()[0];
                self.AllPTDischarge.unshift({ Id: '', DateOfDischarge: '' });
                self.PTDischarge.TherapistId(sel.TherapistId);
                self.PTDischarge.DateOfDischarge(moment(sel.DateOfDischarge).format("DD-MMM-YYYY hh:mm A"));
                self.PTDischarge.DateOfAdmission(moment(sel.DateOfAdmission).format("DD-MMM-YYYY hh:mm A"));
          
                self.PTDischarge.Id(sel.Id);
                self.SetDichargeDetails(sel.Id);
            }
            self.SetPhysioTableDefination();
        });

    };

    self.GetDichargeOPICDDetails = function (ptdischargeId) {


        url = self.UrlActions.data("getopdischargedicddescriptionop");
        param = { ptdischargeId: ptdischargeId };

        ajaxWrapper.Get(url, param, function (data, callback) {

            ko.utils.arrayPushAll(self.LatestIcdDescription, data);
            self.SetPhysioTableDefination();
        });

    };

    self.AddDichargeSummary = function () {
        discharge = {
            Id: 0,
            IPIDOPID: self.PTDischarge.PatientType() == 1 ? self.PTDischarge.IPIDOPID() : self.PTDischarge.RegistrationNo(),
            PatientType: self.PTDischarge.PatientType(),
            TherapistId: self.PTDischarge.TherapistId(),
            DateOfDischarge: self.PTDischarge.DateOfDischarge(),
            DateOfAdmission: self.PTDischarge.DateOfAdmission() == '' ? moment(new Date()).format('DD-MMM-YYYY hh:mm A') : self.PTDischarge.DateOfAdmission(),
            OrderDateTime: self.PTDischarge.OrderDateTime(),
            OperatorId: 0
        };
        exams = JSON.stringify(self.ParseDischargeExamination());

        orderids = [];
        clinicalvisitids = [];

        ko.utils.arrayForEach(self.OrderedProcedures(), function (item, index) {
            orderids.push(item.OrderId);
        });

        ko.utils.arrayForEach(self.LatestIcdDescription(), function (item, index) {
            clinicalvisitids.push(item.VisitId);
        });

        orderids = JSON.stringify(orderids);
        clinicalvisitids = JSON.stringify(clinicalvisitids);


        param = { discharge: discharge, jsonStrExamination: exams, jsonStrRhOrderIds: orderids, jsonStrClinicalVisitIds: clinicalvisitids };

        url = self.UrlActions.data('adddischargesummary');


        ajaxWrapper.Post(url, param, function (data, callback) {

            if (data.returnid > 0) {
                self.ShowMessage('Success', 'success', data.message);
                self.AllPTDischarge.push({ Id: data.returnid, DateOfDischarge: moment(self.PTDischarge.DateOfAdmission()).format('DD-MMM-YYYY hh:mm A') });
                self.PTDischarge.Id(data.returnid);
            }
            else {
                self.PTDischarge.Id('');
                self.ShowMessage('Error', 'error', data.message);
            }
        });

    };

    self.UpdateDichargeSummary = function () {
        discharge = {
            Id: self.PTDischarge.Id(),
            IPIDOPID: self.PTDischarge.PatientType() == 1 ? self.PTDischarge.IPIDOPID() : self.PTDischarge.RegistrationNo(),
            PatientType: self.PTDischarge.PatientType(),
            TherapistId: self.PTDischarge.TherapistId(),
            DateOfDischarge: self.PTDischarge.DateOfDischarge(),
            DateOfAdmission: self.PTDischarge.DateOfAdmission(),
            OrderDateTime: self.PTDischarge.OrderDateTime(),
            OperatorId: 0
        };
        exams = JSON.stringify(self.ParseDischargeExamination());

        orderids = [];
        clinicalvisitids = [];

        ko.utils.arrayForEach(self.OrderedProcedures(), function (item, index) {
            orderids.push(item.OrderId);
        });

        ko.utils.arrayForEach(self.LatestIcdDescription(), function (item, index) {
            clinicalvisitids.push(item.VisitId);
        });

        orderids = JSON.stringify(orderids);
        clinicalvisitids = JSON.stringify(clinicalvisitids);


        param = { discharge: discharge, jsonStrExamination: exams, jsonStrRhOrderIds: orderids, jsonStrClinicalVisitIds: clinicalvisitids };

        url = self.UrlActions.data('updatedischargesummary');


        ajaxWrapper.Post(url, param, function (data, callback) {

            if (data.returnid > 0) {
                self.ShowMessage('Success', 'success', data.message);
            }
            else {
                self.ShowMessage('Error', 'error', data.message);
            }
        });

    };

    self.Save = function () {

        if (self.Validate()) {
            self.AddDichargeSummary();
        }
    };


    self.Update = function () {

        if (self.Validate()) {
            self.UpdateDichargeSummary();
        }
    };


    self.Print = function () {


        url = self.UrlActions.data("previewdischarge");
        url += "?dischargeId=" + self.PTDischarge.Id();

        PrintPreviewModal(url);
    };



    self.Validate = function () {
            valid = true;
            errors = '';

            if (self.PTDischarge.PatientType() == 1) {

                if (self.PTDischarge.IPIDOPID() == '') {
                    errors += "* No Patient detail selected \n";
                    valid = false;
                }
            } else {

                if (self.PTDischarge.RegistrationNo() == 0) {
                    errors += "* No Patient detail selected \n";
                    valid = false;
                }
            }
           
            if (self.PTDischarge.TherapistId() == '') {

                errors += "* Please Select A Therapist \n";
                valid = false;
            }
           
            if (!valid) {

                self.ShowMessage("Validation Error", "error", errors, 3000);
            }

            return valid;
      
    }

    self.ClearProcedureDetails = function () {
        self.OrderDoctorId("");
        self.OrderShiftNurseId('');
        self.OrderRemarks("");
        self.OrderOPVisitNo("");
        self.OrderRemarks("");
        self.OrderDiagnosis("");
        self.OrderRefferedBy("");
        self.OrderTherapist([]);
        self.OrderNurses([]);
        self.OrderTechnicians([]);
        self.OrderProcedures([]);
        self.OrderTreatmentDetails('');

        self.ResetTime();

        self.OrderHasFromTime(true);
        self.OrderHasToTime(true);

    }

    self.GetEmployee = function (id) {
        url = self.UrlActions.data("getemployee");
        param = { id: id };
        ajaxWrapper.Get(url, param, function (data, callback) {
            self.BookingOperator = data.Name;
            self.Operator(data.Name);
        });
    }

    self.GetPhysioExam = function (tabId, icdidjsonarray) {
        url = self.UrlActions.data("getphysioexam");
        param = { tabId: tabId, icdidjsonarray: icdidjsonarray, dischargeid: self.PTDischarge.Id() };
        return ajaxWrapper.Sync('GET', url, param);
    }

    self.SelectPatient = function (data) {

        self.PTDischarge.PIN(data.RegistrationNo);
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

    self.ResetFields = function () {

        self.PTDischarge.Id('');
        self.PTDischarge.RegistrationNo(0);
        self.PTDischarge.IPIDOPID('');
        self.PTDischarge.PIN('');
        self.PTDischarge.PatientName('');
        self.PTDischarge.ConsultantName('');
        self.PTDischarge.AgeStr('');
        self.PTDischarge.SexStr('');
        self.PTDischarge.WardStr('');
        self.PTDischarge.TherapistId(0);
        self.PTDischarge.DateOfAdmission('')
        self.PTDischarge.DateOfDischarge(moment(new Date()).format("DD-MMM-YYYY hh:mm A"));
        self.LatestIcdDescription([]);
        self.PhysioExaminationDetails([]);
        self.AllPTDischarge([]);
        self.PTDischarge.Address1('')
        self.PTDischarge.Address2('')
        self.PTDischarge.Address3('')
        self.PTDischarge.CountryName('')
        self.PTDischarge.ZipCode('')
        self.PTDischarge.CityName('')
        self.ClearPhysioExams();

        $("#DischargedDate").val("");
    
    };

    self.ClearPhysioExams = function () {
      
        self.Rom([]);
        self.SelectedRomTab(0);

        self.Measurement([]);
        self.SelectedMeasurementTab(0);

        self.MotorExamination([]);
        self.SelectedMotorExaminationTab(0);

        self.Presently([]);
        self.SelectedPresentlyTab(0);

        self.BladderBowel([]);
        self.SelectedBladderBowelTab(0);

        self.PressureSore([]);
        self.SelectedPressureSoreTab(0);

        self.FunctionalAbilities([]);
        self.SelectedFunctionalAbilitiesTab(0);

        self.AdviceOnDischarge([]);
        self.SelectedAdviceOnDischargeTab(0);

        self.OrderedProcedures([]);

    };


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

    self.GetROM = function () {
        self.Rom([]);
        var data = self.GetPhysioExam(1623, self.LatestIcdIdJsonArray());

        ko.utils.arrayPushAll(self.Rom, data);

        self.BindExamTables('romcontent', 'SelectedRomTab', 'Rom', data);

        if (data.length > 0)
            self.SelectedRomTab(data[0].Id);
    };

    self.GetMeasurement = function () {
        self.Measurement([]);
        var data = self.GetPhysioExam(1624, self.LatestIcdIdJsonArray());
        ko.utils.arrayPushAll(self.Measurement, data);

        self.BindExamTables('measurmentcontent', 'SelectedMeasurementTab', 'Measurement', data);

        if (data.length > 0)
            self.SelectedMeasurementTab(data[0].Id);
    };

    self.GetMotorExamination = function () {

        self.MotorExamination([]);
        var data = self.GetPhysioExam(1622, self.LatestIcdIdJsonArray());
        ko.utils.arrayPushAll(self.MotorExamination, data);

        self.BindExamTables('motorexaminationcontent', 'SelectedMotorExaminationTab', 'MotorExamination', data);

        if (data.length > 0)
            self.SelectedMotorExaminationTab(data[0].Id);
    }

    self.GetPresently = function () {

        self.Presently([]);
        var data = self.GetPhysioExam(1629, self.LatestIcdIdJsonArray());
        ko.utils.arrayPushAll(self.Presently, data);

        self.BindExamTables('presentlycontent', 'SelectedPresentlyTab', 'Presently', data);

        if (data.length > 0)
            self.SelectedPresentlyTab(data[0].Id);
    }

    self.GetBladderBowel = function () {

        self.BladderBowel([]);
            var data = self.GetPhysioExam(1630, self.LatestIcdIdJsonArray());
            ko.utils.arrayPushAll(self.BladderBowel, data);

            self.BindExamTables('bladderbowelcontent', 'SelectedBladderBowelTab', 'BladderBowel', data);

            if (data.length > 0)
                self.SelectedBladderBowelTab(data[0].Id);
    };

    self.GetPressureSore = function () {

        self.PressureSore([]);
        var data = self.GetPhysioExam(1631, self.LatestIcdIdJsonArray());
        ko.utils.arrayPushAll(self.PressureSore, data);

        self.BindExamTables('pressuresorecontent', 'SelectedPressureSoreTab', 'PressureSore', data);

        if (data.length > 0)
            self.SelectedPressureSoreTab(data[0].Id);
    };

    self.GetFunctionalAbilities = function () {
        self.FunctionalAbilities([]);
        var data = self.GetPhysioExam(1632, self.LatestIcdIdJsonArray());
        ko.utils.arrayPushAll(self.FunctionalAbilities, data);

        self.BindExamTables('functionalabilitiescontent', 'SelectedFunctionalAbilitiesTab', 'FunctionalAbilities', data);

        if (data.length > 0)
            self.SelectedFunctionalAbilitiesTab(data[0].Id);
    };

    self.GetAdviceOndischarge = function () {
        self.AdviceOnDischarge([]);
        var data = self.GetPhysioExam(1633, self.LatestIcdIdJsonArray());
        ko.utils.arrayPushAll(self.AdviceOnDischarge, data);

        self.BindExamTables('adviceondischargecontent', 'SelectedAdviceOnDischargeTab', 'AdviceOnDischarge', data);

        if (data.length > 0)
            self.SelectedAdviceOnDischargeTab(data[0].Id);
    };

    self.SetPhysioTableDefination = function () {
        self.GetROM();
        self.GetMeasurement();
        self.GetMotorExamination();
        self.GetPresently();
        self.GetBladderBowel();
        self.GetPressureSore();
        self.GetFunctionalAbilities();
        self.GetAdviceOndischarge();
        $("textarea").alphanum({ disallow: ':*', allow: ',.()[]', });

    };

    self.GetOrderedProcedures = function (ipidopid, patienttype) {
        self.OrderedProcedures([]);
        param = { ipidopid: ipidopid, patienttype: patienttype };
        url = self.UrlActions.data('getorderedprocedure');

        ajaxWrapper.Get(url, param, function (data, callback) {
            ko.utils.arrayPushAll(self.OrderedProcedures, data);
        });
      
    };

    self.GetOPDischargeProcedures = function (ptdichargeid) {
        param = { ptdischargeid: ptdichargeid };
        url = self.UrlActions.data('getopdischargedprocedureop');
 
        ajaxWrapper.Get(url, param, function (data, callback) {
            ko.utils.arrayPushAll(self.OrderedProcedures, data);
        });

    };

    self.ParseDischargeExamination = function () {
        exams = [];

        exams = $.merge(exams, self.SetExamArray(self.Rom()));
        exams = $.merge(exams, self.SetExamArray(self.Measurement()));
        exams = $.merge(exams, self.SetExamArray(self.MotorExamination()));
        exams = $.merge(exams, self.SetExamArray(self.Presently()));
        exams = $.merge(exams, self.SetExamArray(self.PressureSore()));
        exams = $.merge(exams, self.SetExamArray(self.FunctionalAbilities()));
        exams = $.merge(exams, self.SetExamArray(self.AdviceOnDischarge()));
        exams = $.merge(exams, self.SetExamArray(self.BladderBowel()));

        return exams;
    };

    self.SetExamArray = function (data) {
        exams = [];
        $.each(data, function (i, item) {

            $.each(item.Child, function (x, main) {

                if (main.Child.length == 0) {
                    if ($.trim(main.Description) !== "") {
                        exams.push({ Id: main.Parent, Parent: main.Id, TabId: main.TabId, Description: main.Description });
                    }
                } else {
                    subdata = { Id: item.Id, Parent: main.Id, TabId: main.TabId, Description: "" };
                    $.each(main.Child, function (y, sub) {
                        if ($.trim(sub.Description) !== "") {
                            subdata.Description += sub.Name + " : " + sub.Description + "*\r\n";
                        }
                    });
                    if ($.trim(subdata.Description) !== "") {

                        exams.push(subdata);
                    }
                }

            });
        });
        return exams;
    };

    self.BindExamTables = function (containerId, selectedObservableName, observablearrayName, data) {

        $("#" + containerId).html('');
        ko.cleanNode($("#" + containerId)[0]);

        $.each(data, function (i, item) {

            datatable = "<table class='table table-bordered default-color' data-bind='visible:$root." + selectedObservableName + "() ==" + item.Id + "'>"
                          + "<thead>"
                              + "<tr>"
                                  + "<th>" + item.Name + "</th>"
                                  + "<th>Description</th>"
                              + "</tr>"
                          + "</thead>"
                          + "<tbody data-bind='foreach: " + observablearrayName + "'>"
                              + "<!-- ko foreach: $data.Child-->"
                              + "<!-- ko if: Parent ==" + item.Id + "-->"
                                  + "<tr>"
                                      + "<td  data-bind='text:Name' style='font-size:12px !important;vertical-align: middle;font-size:11px !important;'></td>"
                                      + "<td style='font-size:12px !important;'>"
                                          + "<!-- ko foreach: $data.Child -->"
                                              + "<!-- ko if: $parent.Child.length > 1  -->"
                                                  + "<div class='col-md-3 top10' data-bind='text:Name' style='font-size:11px !important;'></div>"
                                                  + "<div class='col-md-9'><textarea data-bind='value:Description' style='width:100%;resize: none;' rows='2'></textarea></div>"
                                              + "<!-- /ko -->"
                                          + "<!-- ko if: $parent.Child.length == 1  -->"
                                                + "<div class='col-md-12'><textarea data-bind='value:Description' style='width:100%;resize: none;font-size:11px !important;' rows='2'></textarea></div>"
                                          + "<!-- /ko -->"
                                          + "<!-- /ko -->"
                                          + "<!-- ko if: $data.Child.length == 0  -->"
                                                + "<div class='col-md-12'><textarea data-bind='value:Description' style='width:100%;resize: none;font-size:11px !important;' rows='2'></textarea></div>"
                                          + "<!-- /ko -->"
                                      + "</td>"
                                  + "</tr>"
                              + "<!-- /ko -->"
                              + "<!-- /ko -->"
                          + "</tbody>"
                          + "</table>";

            $("#" + containerId).append(datatable);

        });

        ko.applyBindings(viewModel, $("#" + containerId)[0]);
    };



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

    self.init = function () {
        self.GetInpatients();
        self.AgeTypes.unshift({ Id: "", Name: "" });
        self.Countries.unshift({ Id: "", Name: "" });
        self.Cities.unshift({ Id: "", Name: "" });
        self.Sexes.unshift({ Id: "", Name: "" });
        self.Therapist.unshift({ Id: "", Text: "" });

        self.PTDischarge.IPIDOPID.subscribe(function (val) {
            self.LatestIcdDescription([]);
            self.PhysioExaminationDetails([]);
            self.AllPTDischarge([]);
            self.ClearPhysioExams();
            if (val == '') {
                self.PTDischarge.DateOfAdmission('');
                self.PTDischarge.TherapistId('');
                self.PTDischarge.Id('');
            } else {
                self.GetLatestICDDetailsIP(val);
                self.GetOrderedProcedures(val, self.PTDischarge.PatientType());
            }

            self.GetInpatientDetails(val);
        });

        self.PTDischarge.PatientType.subscribe(function (val) {
            self.ResetFields();
        });

        self.SetDichargeDetails = function (dischargeId) {

            data = self.GetPhysioExaminationDetails(dischargeId);
            ko.utils.arrayPushAll(self.PhysioExaminationDetails, data);

        };

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

        self.PTDischarge.Id.subscribe(function (val) {

            if (self.PTDischarge.PatientType() == 0) {

                if (self.ResetProcedureandIcdflag() == true) {
                    self.LatestIcdDescription([]);
                    self.OrderedProcedures([]);
                    self.ClearPhysioExams();
                };

                if (val != '') {
                    sel = {};

                    $.each(self.AllPTDischarge(), function (i, item) {
                        if (item.Id == val) {
                            sel = item;
                        }
                    });
                    self.PTDischarge.DateOfAdmission(moment(sel.DateOfAdmission).format("DD-MMM-YYYY hh:mm A"));
                    self.PTDischarge.DateOfDischarge(moment(sel.DateOfDischarge).format("DD-MMM-YYYY hh:mm A"));
                    self.PTDischarge.TherapistId(sel.TherapistId);
                    self.SetDichargeDetails(sel.Id);
                    self.GetOPDischargeProcedures(sel.Id);
                    self.GetDichargeOPICDDetails(sel.Id);

                } else {
                    if (self.ResetProcedureandIcdflag() == true) {
                        self.GetLatestICDDetailsOP(self.PTDischarge.RegistrationNo(), false);
                        self.SetDichargeDetails(0);
                        self.PTDischarge.TherapistId(0);
                        self.PTDischarge.DateOfDischarge(moment(new Date()).format("DD-MMM-YYYY hh:mm A"));
                        debugger;
                        if (self.LatestIcdDescription().length > 0) {
                            admitdate = moment(self.LatestIcdDescription()[0].DateTime).format("DD-MMM-YYYY hh:mm A");
                            self.PTDischarge.DateOfAdmission(admitdate);
                        } else {
                            self.PTDischarge.DateOfAdmission('');
                        }
                    };
                }
                self.ResetProcedureandIcdflag(true);
            }
        });
    };

    self.init();

};


function PatientSeachParam() {
    winks = this
    winks.firstName = ko.observable();
    winks.lastName = ko.observable();
    winks.middleName = ko.observable();
    winks.familyName = ko.observable();
    winks.fatherName = ko.observable();
    winks.fromDate = ko.observable(moment(new Date()).format("DD-MMM-YYYY hh:mm A"));
    winks.toDate = ko.observable(moment(new Date()).format("DD-MMM-YYYY hh:mm A"));
    winks.age = ko.observable();
    winks.ageType = ko.observable();
    winks.city = ko.observable();
    winks.country = ko.observable();
    winks.sex = ko.observable();
};


function PTDischarge() {
    ako = this;
    ako.Id = ko.observable('');
    ako.PatientType = ko.observable(1);
    ako.IPIDOPID = ko.observable(0);
    ako.RegistrationNo = ko.observable(0);
    ako.TherapistId = ko.observable('');
    ako.OperatorId = ko.observable(0);
    ako.PIN = ko.observable('');

    ako.OrderDateTime = ko.observable('');
    ako.DateOfDischarge = ko.observable('');
    ako.DateOfAdmission = ko.observable('');
    ako.ConsultantName = ko.observable('');

    ako.PatientName = ko.observable('');
    ako.AgeStr = ko.observable('');
    ako.WardStr = ko.observable('');
    ako.SexStr = ko.observable('');

    ako.CountryName = ko.observable('');
    ako.CityName = ko.observable('');
    ako.ZipCode = ko.observable('');

    ako.Address1 = ko.observable('');
    ako.Address2 = ko.observable('');
    ako.Address3 = ko.observable('');

    ako.Address = ko.computed(function () {

        add = '';

        if ($.trim(this.Address1()) != '') {
            add +=  ako.Address1() 
        }
        else if ($.trim(this.Address2()) != '') {
            add += ako.Address2() 
        }
        else if ($.trim(this.Address3()) != '') {
            add +=  ako.Address3() 
        }

        return add;
        
    },this);

};

