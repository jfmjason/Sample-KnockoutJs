//$.fn.dataTable.ext.errMode = 'none'; //temporary hide warning alert message for datatable

function Schedules(model) {
    self = this;
    self.UrlActions = $("#urlAcions");
    self.Doctors        = ko.observableArray(model.Doctors);
    self.Therapist      = ko.observableArray(model.Therapist);
    self.Procedures     = ko.observableArray([]);
    self.ProceduresClone= ko.observableArray([]);
    self.Patients       = ko.observableArray();
    self.SearchedPatient= ko.observableArray();
    self.Sexes          = ko.observableArray(model.Sex);
    self.Cities         = ko.observableArray(model.Cities);
    self.Countries      = ko.observableArray(model.Countries);
    self.AgeTypes = ko.observableArray(model.AgeTypes);
    self.TimeSchedule = ko.observableArray([]);
    self.LoginOperator  = ko.observable(model.Operator);
    self.BookingOperator= "";

    self.Operator       = ko.observable(model.Operator);
    self.BookingDate    = ko.observable(model.BookingDate);
    self.FromTime       = ko.observable();
    self.ToTime         = ko.observable();
    self.AgeStr         = ko.observable();
    self.WardName       = ko.observable();
    self.SexStr         = ko.observable();
    self.RegistrationNo = ko.observable(0);
    self.ProcedureDate  = ko.observable(moment(new Date()).format("DD-MMM-YYYY"));
   

    self.CurrentSchedule = new Schedule(2);
    self.SearchParam     = new PatientSeachParam();
    
    self.OPPin           = ko.observable();
    self.hasDate         = ko.observable(false);
    self.SelectedPatTientType = ko.observable(2);
    self.SelectedIPOPID  = ko.observable();
    self.SelectedBedId   = ko.observable();

    self.CurrentDate = ko.observable(moment(new Date()).format("DD-MMM-YYYY"));

    self.GetPatient = function () {
        url = self.UrlActions.data("getpatient");
        param = { regNo: self.OPPin() }
        ajaxWrapper.Post(url, param, function (data, callback) {

            if (data.RegistrationNo > 0) {
                self.CurrentSchedule.PatientName(data.PatientName);
                self.CurrentSchedule.AgeType(data.AgeTypeId);
                self.CurrentSchedule.Age(data.Age);
                self.CurrentSchedule.Sex(data.SexId);

                self.OPPin(data.IACRegno);
                self.AgeStr(data.AgeStr);
                self.SexStr(data.Sex)
                self.RegistrationNo(data.RegistrationNo);
            } else {
                self.ShowMessage('Error Alert', 'error', 'Patient not found');
                self.OPPin('');
                self.AgeStr('');
                self.SexStr('')
                self.RegistrationNo('');

                self.CurrentSchedule.PatientName('');
                self.CurrentSchedule.AgeType('');
                self.CurrentSchedule.Age('');
                self.CurrentSchedule.Sex('');
            }


        }, 'SchedDetail', 'Please wait');

      

    };

    self.HasConflictSchedule = function () {
        debugger;
        var errormessage = '';
        var valid = true;
        var url = self.UrlActions.data('hasconflictschedule');
        
        var selectedFrom = moment(self.ProcedureDate()).format("DD-MMM-YYYY") + " " + self.FromTime();
        var selectedTo = moment(self.ProcedureDate()).format("DD-MMM-YYYY") + " " + self.ToTime();
        var therapistId = self.CurrentSchedule.TherapistId();

        var param = {
            from: selectedFrom,
            to: selectedTo,
            therapistId: therapistId
        };

        hasexistingScheduleConflict = ajaxWrapper.Sync('GET', url, param);

        hasConflictInTheList = false;

        $.each(self.TimeSchedule(), function (i, data) {
            var _currentFrom = new Date(moment(data.ProcedureDate).format("DD-MMM-YYYY") +" "+ data.FromTime);
            var _currentTo = new Date(moment(data.ProcedureDate).format("DD-MMM-YYYY") + " " + data.ToTime);
            debugger;

            if (_currentFrom.getTime() < (new Date(selectedTo)).getTime() && _currentTo.getTime() > (new Date(selectedFrom)).getTime()) {
                hasConflictInTheList = true;
                return 0;
            }
           
        });
        debugger;
        if (hasConflictInTheList) {
            errormessage = "Conflict with the current selected time slot";
            valid = false;
        }
        else if ((new Date(selectedFrom)).getTime() <= (new Date()).getTime()) {
            errormessage = "Procedure start time is lesser than the current time";
            valid = false;
        }
        else if (hasexistingScheduleConflict) {
            errormessage = "Conflict with existing schedule please choose another time slot or therapist";
            valid = false;
        }
        else {

            valid = true;
            errormessage = "valid time";
        }

         
        return { isValid: valid, message: errormessage };

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

    self.SaveSchedule = function () {

        if (self.Validate()) {
            url = self.UrlActions.data("saveptschedule");
            entry = self.CurrentSchedule;
            timeslots =[];

            newsched = {
                Id: 0,
                PatientType: entry.PatientType(),
                IPIDOPID: self.RegistrationNo(),
                ReservedConfirmed: entry.ReservedConfirmed(),
                PatientName: entry.PatientName(),
                Age: entry.Age(),
                Sex: entry.Sex(),
                AgeType: entry.AgeType(),
                DoctorId: entry.DoctorId(),
                TherapistId: entry.TherapistId()
            }

            $.each(self.TimeSchedule(), function(i, item){
            
                from = moment(item.ProcedureDate).format("DD-MMM-YYYY") + " " + item.FromTime;
                to = moment(item.ProcedureDate).format("DD-MMM-YYYY") + " " + item.ToTime;
                timeslots.push({Id:item.Id, FromDateTime:from, ToDateTime:to });
            
            });
        
            param = { schedule: newsched,jsonTimeSlots: JSON.stringify(timeslots),jsonProcedures: JSON.stringify(entry.Procedures()) };
            ajaxWrapper.Post(url, param, function (data, callback) {

                if (data.returnid <= 0) {
                    self.ShowMessage("Error", 'error', data.message, 3000);
                    
                } else {
                    self.ResetFields();
                    self.ShowMessage("Success", 'success', data.message);
                }
            });
        }
    };

    self.SelectPatient = function (data) {
        
        self.OPPin(data.RegistrationNo);
        self.GetPatient();
        $("#SearchPatient").modal('hide');
    };

    self.SearchPatient = function () {
        $("#SearchPatient").modal('show');
    };

    self.FilterProcedure = ko.observable();

    self.SelectProcedure = function (data) {
        self.CurrentSchedule.Procedures.push(data);

        self.Procedures.remove(function (obj) {
            return obj.Id == data.Id;
        });
    };

    self.DeselectProcedure = function (data) {
        self.Procedures.push(data);

        self.CurrentSchedule.Procedures.remove(function (obj) {
            return obj.Id == data.Id;
        });
    };


    self.Validate = function () {
        valid = true;
        errors = '';

        if (self.CurrentSchedule.Procedures().length == 0) {
            errors += "Please select  atleast one procedure \n";
            valid = false;
        }

       if (self.RegistrationNo() == 0) {
              errors += "Please select patient \n";
              valid = false;
       }

       if (self.CurrentSchedule.DoctorId() == '') {
           errors += "Please select a doctor \n";
           valid = false;
       }
       if (self.CurrentSchedule.TherapistId() == '') {
           errors += "Please select a therapist \n";
           valid = false;
       }
       if (self.TimeSchedule().length <= 0) {
           errors += "No selected time slot \n";
           valid = false;
       }

       if (!valid) {

           self.ShowMessage("Validation Error", "error", errors, 3000);
       }

        return valid;
    }

    self.ResetTime = function () {

        var mindatetime = moment(self.ProcedureDate()).format("DD-MMM-YYYY") > moment(new Date()).format("DD-MMM-YYYY") ? new Date(moment(self.ProcedureDate()).format("DD-MMM-YYYY")) : new Date();
        curDateTime = mindatetime;
        curMin = curDateTime.getMinutes();

        minToAdd = (Math.floor(curMin / 15) + 1) * 15;

        from = new Date(moment(curDateTime).format("DD-MMM-YYYY HH") + ":00");
        from = new Date(from.setMinutes(from.getMinutes() + minToAdd));
        self.FromTime(moment(from).format("hh:mm A"));

        to = new Date(from.setMinutes(from.getMinutes() + 15));
        self.ToTime(moment(to).format("hh:mm A"));
    };

    self.AddTime = function () {

        validation = self.HasConflictSchedule();
        if (validation.isValid) {
            id = self.TimeSchedule().length + 1;
            self.TimeSchedule.push({ Id: id, ProcedureDate: moment(self.ProcedureDate()).format("DD-MMM-YYYY"), FromTime: self.FromTime(), ToTime: self.ToTime() });

        } else {
            self.ShowMessage("Validation Error", "error", validation.message);
        }
       
    };

    self.RemoveTime = function (data) {

        self.TimeSchedule.remove(function (obj) {
            return obj.Id == data.Id;
        });
    };

    self.ResetFields = function () {

        self.CurrentSchedule.Id(0);
        self.CurrentSchedule.TherapistId(0);
        self.CurrentSchedule.DoctorId(0);
        self.CurrentSchedule.IPIDOPID(0);
        self.CurrentSchedule.Age('');
        self.RegistrationNo(0)
        self.CurrentSchedule.Remarks('');
        self.CurrentSchedule.Sex('');
        self.CurrentSchedule.PatientName('');

        self.CurrentSchedule.Procedures([]);
        self.TimeSchedule([]);

        self.Procedures([]);
        ko.utils.arrayPushAll(self.Procedures, self.ProceduresClone());

        self.AgeStr('');
        self.OPPin('');
        self.WardName('');
        self.SelectedIPOPID('');
        self.SelectedBedId('');
 
        self.ProcedureDate(moment(new Date()).format("DD-MMM-YYYY"));

        self.ResetTime();
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

    self.ShowMessage = function (title, type, message) {

        swal({
            title: title,
            text: message,
            type: type,
            confirmButtonText: 'OK',
            closeOnConfirm: true,
            allowOutsideClick: false,
            timer: 1500
        })
    }

    self.ParseProcedure = function (procedures) {
        var procs = [];

        $.each(procedures, function (i, data) {
            data.Show =  ko.observable(false);
            procs.push(data);
        });

        return procs;
    };

    self.getMinTime = function (date) {

        var hours = date.getHours(),
            minutes = date.getMinutes(),
            ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    };

    self.initTimePickers = function (date) {

        $("#FromTime").timepicker({
            disableTimeRanges : [['12am', self.getMinTime(date)]],
            maxTime: '23:45', timeFormat: 'h:i A', step: 15
        })

        $("#ToTime").timepicker({
            //minTime: '00:15',
            disableTimeRanges: [['12am', self.getMinTime(new Date(date.setMinutes(date.getMinutes() + 15)))]],
            maxTime: '23:59', timeFormat: 'h:i A',
            step: function (i) {
                // note i = 1440 mins/ step(in mins)
                var tempstep = 0;
                if (i > 94) {
                    tempstep = 15 - 1;
                } else {
                    tempstep = 15
                }

                return tempstep;
            }
        })
    };

    self.init = function () {

        self.initTimePickers(new Date());
        self.ResetTime();
        self.AgeTypes.unshift({ Id: "", Name: "" });
        self.Countries.unshift({ Id: "", Name: "" });
        self.Cities.unshift({ Id: "", Name: "" });
        self.Sexes.unshift({ Id: "", Name: "" });

        self.Doctors.unshift({ Id: "", Text: "" });
        self.Therapist.unshift({ Id: "", Text: "" });
        self.ProcedureDate(moment(new Date()).format("DD-MMM-YYYY"));
   
        //change events
        self.hasDate.subscribe(function (val) {
            if (!val) {
                self.SearchParam.fromDate("");
                self.SearchParam.toDate("");
            }
        });
        self.ProcedureDate.subscribe(function (val) {
            var mindatetime = moment(self.ProcedureDate()).format("DD-MMM-YYYY") > moment(new Date()).format("DD-MMM-YYYY") ? new Date(moment(self.ProcedureDate()).format("DD-MMM-YYYY")) : new Date();

            $("#FromTime").timepicker('remove');
            $("#ToTime").timepicker('remove');

            self.initTimePickers(mindatetime);

            if (moment(self.ProcedureDate()).format("DD-MMM-YYYY") == moment(new Date()).format("DD-MMM-YYYY")) {
                self.ResetTime();
            }

            
        });
        self.FromTime.subscribe(function (value) {

            var fromDateTime = new Date(moment(new Date()).format("DD-MMM-YYYY") + " " + value);
            var toDateTime = new Date(moment(new Date()).format("DD-MMM-YYYY") + " " + self.ToTime());

            if (fromDateTime >= toDateTime || new Date(viewModel.ToTime()) == 'Invalid Date') {

                var newTime = "";

                if (moment(fromDateTime).format("HH:mm") == "23:45") {
                    newTime = new Date(fromDateTime.setMinutes(fromDateTime.getMinutes() + 14));
                }
                else {
                    newTime = new Date(fromDateTime.setMinutes(fromDateTime.getMinutes() + 15));
                }
                self.ToTime(moment(newTime).format("hh:mm A"));
            }

        });
        self.ToTime.subscribe(function (val) {
            var fromDateTime = new Date(moment(new Date()).format("DD-MMM-YYYY") + " " + self.FromTime());
            var toDateTime = new Date(moment(new Date()).format("DD-MMM-YYYY") + " " + val);

            if (fromDateTime >= toDateTime) {
                var newTime = "";
                if (moment(toDateTime).format("HH:mm") == "23:59") {
                    newTime = new Date(toDateTime.setMinutes(toDateTime.getMinutes() - 14));
                } else if (moment(toDateTime).format("HH:mm") == "00:00" && moment(fromDateTime).format("HH:mm") == "23:45") {
                    newTime = toDateTime;
                }
                else {
                    newTime = new Date(toDateTime.setMinutes(toDateTime.getMinutes() - 15));
                }
                self.FromTime(moment(newTime).format("hh:mm A"));
            }
        });
        self.CurrentSchedule.TherapistId.subscribe(function (val) {
            if (val == '') {

                self.TimeSchedule([]);
            }

        });

        ko.utils.arrayPushAll(self.Procedures, self.ParseProcedure(model.Procedures));
        ko.utils.arrayPushAll(self.ProceduresClone, self.ParseProcedure(model.Procedures));

        self.FilterProcedure.subscribe(function () {

            $.each(self.Procedures(), function (i, item) {

                if (item.Text.toLowerCase().indexOf(self.FilterProcedure().toLowerCase()) >= 0) {
                    self.Procedures()[i].Show(false);
                } else {
                    self.Procedures()[i].Show(true);
                }


            });

        });
       
    };

   

    self.init();

}


function Schedule(patientType) {
    that = this;
    that.Id = ko.observable(0);
    that.PatientType = ko.observable(patientType);
    that.IssueAuthorityCode = ko.observable();
    that.IPIDOPID = ko.observable();
    that.DateOfBooking = ko.observable();
    that.FromDateTime = ko.observable();
    that.ToDatetime = ko.observable();
    that.ReservedConfirmed = ko.observable(1);
    that.Remarks = ko.observable('');
    that.PatientName = ko.observable();
    that.Age = ko.observable();
    that.Sex = ko.observable();
    that.StationId = ko.observable();
    that.AgeType = ko.observable();
    that.DoctorId = ko.observable();
    that.TherapistId = ko.observable();

    that.Procedures = ko.observableArray();
}

function PatientSeachParam() {
    winks = this
    winks.firstName = ko.observable();
    winks.lastName = ko.observable();
    winks.middleName = ko.observable();
    winks.familyName = ko.observable();
    winks.fatherName = ko.observable();
    winks.fromDate = ko.observable();
    winks.toDate = ko.observable();
    winks.age = ko.observable();
    winks.ageType = ko.observable();
    winks.city = ko.observable();
    winks.country = ko.observable();
    winks.sex = ko.observable();
};


