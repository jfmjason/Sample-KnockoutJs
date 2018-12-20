//$.fn.dataTable.ext.errMode = 'none'; //temporary hide warning alert message for datatable

function Schedules(model) {
    self = this;
    self.FilterOn = ko.observable(false);
    self.UrlActions = $("#urlAcions");
    self.PatientTypes   = ko.observableArray([{ id: 0, text: 'ALL' }, { id: 1, text: 'INPATIENT' }, { id: 2, text: 'OUTPATIENT' }]);
    self.Schedules      = ko.observableArray(model.Schedules);
    self.Doctors        = ko.observableArray(model.Doctors);
    self.Nurses         = ko.observableArray(model.Nurses);
    self.Therapist = ko.observableArray(model.Therapist);
                              //copy and remove reference 
    self.FilterTherapist = ko.observableArray(model.Therapist.slice(0));
    self.Technicians    = ko.observableArray(model.Technicians);
    self.Procedures     = ko.observableArray(model.Procedures);
    self.Status         = ko.observableArray([{ id: 1, text: 'RESERVED' }, { id: 2, text: 'CONFIRMED' }]);
    self.Patients       = ko.observableArray();
    self.SearchedPatient= ko.observableArray();
    self.Sexes          = ko.observableArray(model.Sex);
    self.Cities         = ko.observableArray(model.Cities);
    self.Countries      = ko.observableArray(model.Countries);
    self.AgeTypes       = ko.observableArray(model.AgeTypes);
    self.RequestSchedule= ko.observableArray();
    self.LoginOperator  = ko.observable(model.Operator);
    self.Onload         = ko.observable(true);
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
   

    self.CurrentSchedule = new Schedule(1);
    self.SearchParam     = new PatientSeachParam();
    self.ReservedCount   = ko.computed(function () {
        var count = 0;

        ko.utils.arrayForEach(self.Schedules(), function (item) {
            if (item.ReservedConfirmed == 1)
                count++;
        });
        return count;
    }, this);
    self.ConfirmedCount  = ko.computed(function () {
        var count = 0;

        ko.utils.arrayForEach(self.Schedules(), function (item) {
            if (item.ReservedConfirmed == 2)
                count++;
        });

        return count;
    }, this);

    self.OPPin           = ko.observable();
    self.hasDate         = ko.observable(false);
    self.SelectedPatTientType = ko.observable(0);
    self.SelectedIPOPID  = ko.observable();
    self.SelectedBedId = ko.observable();

    self.SelectedRegNo = ko.observable();
    

    self.FilterSelectedTherapistId = ko.observable(0);

    self.CurrentDate = ko.observable(moment(new Date()).format("DD-MMM-YYYY"));

    self.init = function () {
        $("#FromTime").timepicker({
            maxTime: '23:45', timeFormat: 'h:i A', step: 15
        })

        $("#ToTime").timepicker({
            minTime: '00:15',
            maxTime: '23:59', timeFormat: 'h:i A',
            step:function (i) {
              // note i = 1440 mins/ step(in mins)
                var tempstep = 0;
                if (i > 94) {
                    tempstep = 15 - 1;
                }else{
                    tempstep = 15
                }

                return tempstep;
            }
        })

        self.AgeTypes.unshift({ Id: "", Name: "" });
        self.Countries.unshift({ Id: "", Name: "" });
        self.Cities.unshift({ Id: "", Name: "" });
        self.Sexes.unshift({ Id: "", Name: "" });

        self.FilterTherapist.unshift({ Id: "", Text: "" })
      
        self.GetInpatients();
        self.CurrentSchedule.Id(10);
    };

    self.GetPTSchedules = function () {
        
        url = self.UrlActions.data("getptschedules");
        param = {
            currentDate: self.CurrentDate(),
            patientType: self.SelectedPatTientType(),
            therapistId: self.FilterSelectedTherapistId()
        };
        ajaxWrapper.Post(url, param, function (data, callback) {
            self.Schedules([]);
            if (data.length > 0) {
                ko.utils.arrayPushAll(self.Schedules, data);
            } 
        }, 'PTSchedules', 'Searching', function () { alert('error') });

    };

    self.GetInpatients = function (selected) {
        url = self.UrlActions.data("getinpatients");
        ajaxWrapper.Post(url, null, function (data, callback) {
            self.Patients([]);
            if (data.length > 0) {
                ko.utils.arrayPushAll(self.Patients, data);

                self.Patients.unshift({ IPOPID: "", PatientName: "", RegistrationNo: "", IACRegno: "", BedId: 0, BedName: "" });
                if (selected) {
                    self.SelectedIPOPID(selected);
                } else {
                    self.SelectedIPOPID("");
                }
            }
        });
      
    };

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

    self.GetInpatientDetails = function (hasPTSDoctor) {
        url = self.UrlActions.data("getinpatientdetails");
        param = { ipid: self.SelectedIPOPID() };
        ajaxWrapper.Post(url, param, function (data, callback) {
          
                self.CurrentSchedule.PatientName(data.PatientName);
                self.CurrentSchedule.AgeType(data.AgeTypeId);
                self.CurrentSchedule.Age(data.Age);
                self.CurrentSchedule.Sex(data.SexId);
                
                if(!hasPTSDoctor)
                self.CurrentSchedule.DoctorId(data.DoctorId);
             

                self.AgeStr(data.AgeStr);
                self.SexStr(data.Sex)
                self.WardName(data.WardName);
                self.SelectedBedId(data.BedId);
           
        });

    };
   
    self.GetPTSDoctor = function (schedId) {
        url = self.UrlActions.data("getptsdoctor");
        param = { schedId: schedId }
        ajaxWrapper.Get(url, param, function (data, callback) {
            $.each(data, function (index, value) {

                
            });
        });

    };

    self.GetPTSTechnician = function (schedId) {
        url = self.UrlActions.data("getptstechnician");
        param = { schedId: schedId }

        self.CurrentSchedule.Technicians([])
        ajaxWrapper.Get(url, param, function (data, callback) {
            $.each(data, function (index, value) {
                 
                self.CurrentSchedule.Technicians.push(value.Id);
            });
        });

    };

    self.GetPTSPhysiotherapist = function (schedId) {
        url = self.UrlActions.data("getptsphysiotherapist");
        param = { schedId: schedId };
        self.CurrentSchedule.OtherTherapist([]);
        ajaxWrapper.Get(url, param, function (data, callback) {
            $.each(data, function (index, value) {

                self.CurrentSchedule.OtherTherapist.push(value.Id);
            });
        });

    };

    self.GetPTSNurse = function (schedId) {
        url = self.UrlActions.data("getptsnurse");
        param = { schedId: schedId };
        self.CurrentSchedule.Nurses([]);
        ajaxWrapper.Get(url, param, function (data, callback) {
            $.each(data, function (index, value) {
                self.CurrentSchedule.Nurses.push(value.Id);
            });
        });

    };

    self.GetPTSProcedure = function (schedId) {
        url = self.UrlActions.data("getptsprocedure");
        param = { schedId: schedId };
        self.CurrentSchedule.Procedures([]);
        ajaxWrapper.Get(url, param, function (data, callback) {
            $.each(data, function (index, value) {
                self.CurrentSchedule.Procedures.push(value.Id);
            });
        });

    };

    self.GetEmployee = function (id) {
        url = self.UrlActions.data("getemployee");
        param = { id: id };
        ajaxWrapper.Get(url, param, function (data, callback) {
            self.BookingOperator = data.Name;
            self.Operator(data.Name);
        });
    }

    self.GetPTSchedule = function (schedId) {
        url = self.UrlActions.data("getptschedule");
        param = { schedId: schedId };
        self.CurrentSchedule.Procedures([]);
        ajaxWrapper.Get(url, param, function (data, callback) {
            self.CurrentSchedule.PatientType(data.PatientType);
            self.CurrentSchedule.TherapistId(data.TherapistId);
            self.CurrentSchedule.ReservedConfirmed(data.ReservedConfirmed);
            self.CurrentSchedule.Remarks(data.Remarks);
            self.CurrentSchedule.IPIDOPID(data.IPIDOPID);
            self.CurrentSchedule.DoctorId(data.DoctorId);
            self.CurrentSchedule.DateOfBooking(moment(data.DateOfBooking).format("DD-MMM-YYYY"));
            self.CurrentSchedule.Id(schedId);
            self.FromTime(moment(data.FromDateTime).format("hh:mm A"));
            self.ToTime(moment(data.ToDatetime).format("hh:mm A"));
            self.ProcedureDate(moment(data.FromDateTime).format("DD-MMM-YYYY"));
            self.BookingDate(moment(data.DateOfBooking).format("DD-MMM-YYYY"));

            if(data.PatientType == 1)
            {
                self.SelectedIPOPID(data.IPIDOPID)
                self.GetInpatientDetails(true);
            }
            else
            {
                self.OPPin(data.IPIDOPID);
                self.GetPatient();
            }

            self.GetEmployee(data.OperatorId);
        });

    };

    self.GetPTSScheduleRequest = function (data, isnew) {
        url = self.UrlActions.data("getptschedulerequest");
        param = { from: moment(self.ProcedureDate()).format("DD-MMM-YYYY")};
       
        self.RequestSchedule([]);
        ajaxWrapper.Get(url, param, function (data, callback) {
            
            if (data.length > 0) {
                ko.utils.arrayPushAll(self.RequestSchedule, data);

                if (isnew == true && self.Onload() == true) {
                    swal({
                        title: 'Alert Info',
                        text: "Requested Schedule is available. You want to check it?",
                        type: "info",
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                        closeOnConfirm: true,
                        allowOutsideClick: false
                    }, function (isConfirm) {
                        if (isConfirm) {
                            $("#RequestedSchedule").modal('show');
                        }
                    });

                } else {
                    $("#RequestedSchedule").modal('show');
                }
            } else {

                if (!isnew) {

                    self.ShowMessage("Notification", 'warning', "No request for this day");
                }
            }

            self.Onload(false);

        });

       
    };

    self.SaveSchedule = function () {

        if (self.Validate()) {
            url = self.UrlActions.data("saveptschedule");
            newsched = self.CurrentSchedule;
            saveObject = {
                Id: newsched.Id(),
                PatientType: newsched.PatientType(),
                IssueAuthorityCode: "",
                IPIDOPID: newsched.PatientType() == 1 ? self.SelectedIPOPID() : self.RegistrationNo(),
                DateOfBooking: moment(new Date()).format("DD-MMM-YYYY"),
                FromDateTime: moment(new Date(moment(self.ProcedureDate()).format("DD-MMM-YYYY") + " " + self.FromTime())).format("DD-MMM-YYYY HH:mm"),
                ToDatetime: moment(new Date(moment(self.ProcedureDate()).format("DD-MMM-YYYY") + " " + self.ToTime())).format("DD-MMM-YYYY HH:mm"),
                ReservedConfirmed: newsched.ReservedConfirmed(),
                Remarks: newsched.Remarks(),
                PatientName: newsched.PatientName(),
                Age: newsched.Age(),
                Sex: newsched.Sex(),
                StationId: newsched.StationId(),
                AgeType: newsched.AgeType(),
                DoctorId: newsched.DoctorId(),
                TherapistId: newsched.TherapistId(),
                PTSTechnicians: newsched.Technicians(),
                PTSPhysiotherapist: newsched.OtherTherapist(),
                PTSNurses: newsched.Nurses(),
                PTSProcedures: newsched.Procedures()
            }


            param = { saveModel: saveObject };
            ajaxWrapper.Post(url, param, function (data, callback) {

                if (data.status == 0) {
                    self.ShowMessage("Error", 'error', data.message);
                } else {

                    self.ShowMessage("Success", 'success', data.message);
                    self.GetPTSchedules();
                    self.CurrentSchedule.Id(data.status);
                }
            });
        }
    };

    self.UpdateSchedule = function () {

        if (self.Validate()) {
            url = self.UrlActions.data("updateptschedule");
            sched = self.CurrentSchedule;
            updateObject = {
                Id: sched.Id(),
                PatientType: sched.PatientType(),
                IssueAuthorityCode: "",
                IPIDOPID: sched.PatientType() == 1 ? self.SelectedIPOPID() : self.RegistrationNo(),
                DateOfBooking: moment(new Date()).format("DD-MMM-YYYY"),
                FromDateTime: moment(new Date(moment(self.ProcedureDate()).format("DD-MMM-YYYY") + " " + self.FromTime())).format("DD-MMM-YYYY HH:mm"),
                ToDatetime: moment(new Date(moment(self.ProcedureDate()).format("DD-MMM-YYYY") + " " + self.ToTime())).format("DD-MMM-YYYY HH:mm"),
                ReservedConfirmed: sched.ReservedConfirmed(),
                Remarks: sched.Remarks(),
                PatientName: sched.PatientName(),
                Age: sched.Age(),
                Sex: sched.Sex(),
                StationId: sched.StationId(),
                AgeType: sched.AgeType(),
                DoctorId: sched.DoctorId(),
                TherapistId: sched.TherapistId(),
                PTSTechnicians: sched.Technicians(),
                PTSPhysiotherapist: sched.OtherTherapist(),
                PTSNurses: sched.Nurses(),
                PTSProcedures: sched.Procedures()
            }


            param = { updateModel: updateObject };
            ajaxWrapper.Post(url, param, function (data, callback) {

                if (data.status == 0) {
                    self.ShowMessage("Error", 'error', data.message);
                } else {

                    self.ShowMessage("Success", 'success', data.message);
                    self.GetPTSchedules();
                }
            });
        }
    };

    self.CancelSchedule = function () {
        url = self.UrlActions.data("cancelptschedule");
        sched = self.CurrentSchedule;
        param = { Id: sched.Id() };


        swal({
            title: 'Confirmation',
            text: "Are you sure you want to cancel this schedule?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: 'OK',
            closeOnConfirm: true,
            allowOutsideClick: false
        }, function (isConfirm) {
            if (isConfirm) {
                ajaxWrapper.Post(url, param, function (data, callback) {

                    if (data.status == 0) {
                        self.ShowMessage("Error", 'error', data.message);
                    } else {

                        self.ShowMessage("Success", 'success', data.message);
                        self.GetPTSchedules();
                        $("#SchedDetail").modal('hide');

                    }
                });

            } 
        });
    
    };


    self.SelectPatient = function (data) {
        
        self.OPPin(data.RegistrationNo);
        self.GetPatient();
        $("#SearchPatient").modal('hide');
    };

    self.SelectSchedule = function (data) {
        self.ShowPatDetails(data);
    };

    self.SelectRequestedSchedule = function (data) {

        self.ShowPatDetails(data);

        $("#RequestedSchedule").modal('hide');
    }

    self.SearchPatient = function () {
        $("#SearchPatient").modal('show');
    };
    self.ShowRequestPtSchedule = function () {
        //$("#RequestedSchedule").modal('show');
        self.GetPTSScheduleRequest();
    };


    self.Validate = function () {
        valid = true;

        if (self.CurrentSchedule.Procedures().length == 0) {
            self.ShowMessage("Validation Error", "error", "Please select procedure");

            valid = false;
        }

        else if (self.CurrentSchedule.PatientType() == 1 && self.SelectedIPOPID() == "") {
             self.ShowMessage("Validation Error", "error", "Please select patient");
             valid = false;
        }

        else if (self.CurrentSchedule.PatientType() == 2 && self.RegistrationNo() == 0) {
              self.ShowMessage("Validation Error", "error", "Please select patient");
              valid = false;
        }

        return valid;
    }

    self.ShowPatDetails = function (data) {

        $("#SchedDetail").modal('show');
      
        if (data.Id) {
           
            self.GetPTSNurse(data.Id);
            self.GetPTSPhysiotherapist(data.Id);
            self.GetPTSProcedure(data.Id);
            self.GetPTSTechnician(data.Id);
            self.GetPTSchedule(data.Id);
        } else {
            self.ResetSchedDetails();

            self.GetPTSScheduleRequest(null, true);
        }

    };

    self.ResetTime = function () {
        curDateTime = new Date();
        curMin = curDateTime.getMinutes();

        minToAdd = (Math.floor(curMin / 15) + 1) * 15;

        from = new Date(moment(curDateTime).format("DD-MMM-YYYY HH") + ":00");
        from = new Date(from.setMinutes(from.getMinutes() + minToAdd));
        self.FromTime(moment(from).format("hh:mm A"));

        to = new Date(from.setMinutes(from.getMinutes() + 15));
        self.ToTime(moment(to).format("hh:mm A"));
    };

    self.ResetSchedDetails = function () {

        self.CurrentSchedule.Id(0);
        self.CurrentSchedule.TherapistId(0);
        self.CurrentSchedule.DoctorId(0);
        self.CurrentSchedule.IPIDOPID(0);
        self.CurrentSchedule.Age('');
        self.CurrentSchedule.ReservedConfirmed(1);
        self.CurrentSchedule.Remarks('');
        self.CurrentSchedule.Sex('');
        self.CurrentSchedule.PatientName('');

        self.CurrentSchedule.OtherTherapist([]);
        self.CurrentSchedule.Technicians([]);
        self.CurrentSchedule.Nurses([]);
        self.CurrentSchedule.Procedures([]);

        self.AgeStr('');
        self.OPPin('');
        self.WardName('');
        self.SelectedIPOPID('');
        self.SelectedBedId('');
 
        self.BookingDate(moment(new Date()).format("DD-MMM-YYYY"));
        self.Operator(self.LoginOperator());
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

    self.SearchPin = function (query) {
        param = { searchString: query.term };
        url = self.UrlActions.data('searchpatientpin');
        ajaxWrapper.Get(url, param, function (data, e) {
            var filteredData = [];
            debugger;
            ko.utils.arrayForEach(data, function (patient) {
                filteredData.push({ id: patient.RegistrationNo, text: patient.IACRegno + ' - ' + patient.PatientName });

            });
            query.callback({
                results: filteredData
            });
        });
    };


    self.SearchSchedule = function () {

        url = self.UrlActions.data("searchschedule");
        param = {
            regNo: self.SelectedRegNo()
        };
        ajaxWrapper.Post(url, param, function (data, callback) {
            self.Schedules([]);
            if (data.length > 0) {
                ko.utils.arrayPushAll(self.Schedules, data);
            }
        }, 'PTSchedules', 'Searching', function () { alert('error') });
    }

    self.init();

    //change events
    self.hasDate.subscribe(function (val) {
        if (!val) {
            self.SearchParam.fromDate("");
            self.SearchParam.toDate("");
        }
    });
    self.CurrentDate.subscribe(function (i) {
        self.GetPTSchedules();
    });
    self.SelectedIPOPID.subscribe(function (i) {
        self.GetInpatientDetails();
    });

    self.SelectedPatTientType.subscribe(function (i) {
        self.GetPTSchedules();
    });

    self.FilterSelectedTherapistId.subscribe(function () {
        self.GetPTSchedules();
    });
    self.CurrentSchedule.PatientType.subscribe(function (i) {
     
        self.SelectedIPOPID("");
        self.SelectedBedId("");
        self.OPPin("");
        self.WardName("");
        self.AgeStr("");
        self.SexStr("");

        self.CurrentSchedule.PatientName("");
        self.CurrentSchedule.Age("");
        self.CurrentSchedule.Sex("");
  
    });

    self.FromTime.subscribe(function (value) {

        var fromDateTime = new Date( moment(new Date()).format("DD-MMM-YYYY") + " " + value);
        var toDateTime = new Date(moment(new Date()).format("DD-MMM-YYYY") + " " + self.ToTime());

        if (fromDateTime >= toDateTime) {

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

    self.ToggleFilter = function () {
        if (self.FilterOn() == true) {
            self.FilterOn(false)
            self.GetPTSchedules();
        }
        else {
            self.FilterOn(true);
        }
    };

    

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

    that.Technicians = ko.observableArray();
    that.OtherTherapist = ko.observableArray();
    that.Nurses = ko.observableArray();
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

function PTScheduleDisplay() {
 Id,
 PatientType,
 PatientName,
 ProcedureDate,
 FromTime,
 ToTime,
 Remarks,
 ReservedConfirmed,
 PIN
}
