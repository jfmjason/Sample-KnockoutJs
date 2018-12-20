//$.fn.dataTable.ext.errMode = 'none'; //temporary hide warning alert message for datatable

function Orders(model) {
    self = this;
    self.UrlActions = $("#urlAcions");

    self.PatientTypes   = ko.observableArray([{ id: -1, text: 'ALL' }, { id: 1, text: 'INPATIENT' }, { id: 0, text: 'OUTPATIENT' }]);
    self.Orders         = ko.observableArray(model.Orders);
    self.Doctors        = ko.observableArray(model.Doctors);
    self.Nurses         = ko.observableArray(model.Nurses);
    self.Therapist      = ko.observableArray(model.Therapist);
    self.Technicians    = ko.observableArray(model.Technicians);
    self.Procedures     = ko.observableArray(model.Procedures);
    self.Sexes          = ko.observableArray(model.Sex);
    self.Cities         = ko.observableArray(model.Cities);
    self.Countries      = ko.observableArray(model.Countries);
    self.AgeTypes       = ko.observableArray(model.AgeTypes);
    self.Patients       = ko.observableArray();
    self.PTSchedules    = ko.observableArray();
    self.SearchedPatient= ko.observableArray();

    self.TimingDoctors  = ko.observableArray(model.Doctors);
    self.TimingNurses   = ko.observableArray(model.Nurses);

    self.LoginOperator  = ko.observable(model.Operator);
    self.BookingOperator= "";
    self.Operator       = ko.observable(model.Operator);
    self.OrderDate      = ko.observable();
    self.FromDateTime   = ko.observable(model.From);
    self.ToDateTime     = ko.observable(model.To);
    self.RegistrationNo = ko.observable(0);

    //New Order
    self.OrderPatientName    = ko.observable();
    self.OrderPin            = ko.observable();
    self.OrderRegno          = ko.observable();
    self.OrderBedId          = ko.observable();
    self.OrderIPIDOPID       = ko.observable();
    self.OrderBedId          = ko.observable();
    self.OrderId             = ko.observable(0);
    self.OrderAgeStr         = ko.observable();
    self.OrderWardStr        = ko.observable();
    self.OrderSexStr         = ko.observable();
    self.OrderSex            = ko.observable();
    self.OrderAgeStr         = ko.observable();
    self.OrderAge            = ko.observable();
    self.OrderAgeType        = ko.observable();
 
    self.OrderCategory       = ko.observable();
    self.OrderConsultant1    = ko.observable();
    self.OrderCompanyCode    = ko.observable();
    self.OrderCompanyName    = ko.observable();
    self.OrderDateTime       = ko.observable();
    self.OrderPatientType    = ko.observable(1);
    self.OrderOperator       = ko.observable();
    self.OrderPTSchedule     = ko.observable('');
    self.OrderDoctorId       = ko.observable();
    self.OrderShiftNurseId   = ko.observable();
    self.OrderTreatmentDetails    = ko.observable();
    self.OrderOPVisitNo      = ko.observable();
    self.OrderDiagnosis      = ko.observable();
    self.OrderRemarks        = ko.observable();
    self.OrderProcedureStartTime = ko.observable(new Date());
    self.OrderProcedureEndTime = ko.observable('');
    self.OrderRefferedBy      = ko.observable('');

    self.OrderProcedures    = ko.observableArray();
    self.OrderTherapist     = ko.observableArray();
    self.OrderTechnicians   = ko.observableArray();
    self.OrderNurses = ko.observableArray();

    self.OrderPTSchedIds = ko.observableArray();

    self.OrderHasFromTime = ko.observable(true);
    self.OrderHasToTime = ko.observable(true);

    //Search Patient
    self.SearchParam     = new PatientSeachParam();

    self.SelectedRegNo   = ko.observable();
    self.OPPin           = ko.observable();
    self.hasDate         = ko.observable(false);
    self.SelectedPatTientType = ko.observable(-1);
    self.SelectedIPOPID  = ko.observable();
    self.SelectedBedId   = ko.observable();


    self.init = function () {
        self.GetInpatients();
        self.OrderOperator(self.LoginOperator());
        self.OrderDateTime(moment(new Date()).format("DD-MMM-YYYY hh:mm A"));
        self.FromDateTime(moment(new Date()).format("DD-MMM-YYYY"));
        self.ToDateTime(moment(new Date()).format("DD-MMM-YYYY"));

        self.AgeTypes.unshift({ Id: "", Name: "" });
        self.Countries.unshift({ Id: "", Name: "" });
        self.Cities.unshift({ Id: "", Name: "" });
        self.Sexes.unshift({ Id: "", Name: "" });

        self.TimingDoctors.unshift({ Id: "", Text: "" });
        self.TimingNurses.unshift({ Id: "", Text: "" });
    };

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

    self.GetRHOrders = function () {

        url = self.UrlActions.data("getrhorders");
        param = {
            from: moment(self.FromDateTime()).format("DD-MMM-YYYY"),
            to: moment(self.ToDateTime()).format("DD-MMM-YYYY"),
            patienttype: self.SelectedPatTientType(),
            pin: self.SelectedRegNo()
        };
        ajaxWrapper.Get(url, param, function (data, callback) {
            self.Orders([]);
            if (data.length > 0) {
                ko.utils.arrayPushAll(self.Orders, data);
            } 
        }, 'RHOrders', 'Searching', function () { alert('error') });

    };

    self.GetInpatients = function (selected) {
        url = self.UrlActions.data("getinpatients");
        ajaxWrapper.Post(url, null, function (data, callback) {
            self.Patients([]);
            if (data.length > 0) {
                ko.utils.arrayPushAll(self.Patients, data);

                self.Patients.unshift({ IPOPID: "", PatientName: "", RegistrationNo: "", IACRegno: "", BedId: 0, BedName: "" });
                if (selected) {
                    self.OrderIPIDOPID(selected);
                } else {
                    self.OrderIPIDOPID(''); ("");
                }
            }
        });
      
    };

    self.GetPatient = function () {
        url = self.UrlActions.data("getpatient");
        param = { regNo: self.OrderPin() }
        
        ajaxWrapper.Post(url, param, function (data, callback) {

            if (data.RegistrationNo > 0) {
                self.OrderRegno(self.OrderPin())
                self.OrderPin(data.IACRegno);
                self.OrderPatientName(data.PatientName);
                self.OrderAgeType(data.AgeTypeId);
                self.OrderAge(data.Age);
                self.OrderSex(data.SexId);
                self.OrderBedId(0);
                self.OrderCompanyCode(data.CompanyCode);
                self.OrderCompanyName(data.CompanyName);
                self.OrderCategory(data.CategoryName);
                self.OrderConsultant1('');
                self.OrderAgeStr(data.AgeStr);
                self.OrderSexStr(data.Sex)
                self.OrderWardStr(data.WardName);
               
            } else {
                self.ShowMessage('Error Alert', 'error', 'Patient not found');
                self.ClearPatientDetails();
                self.OrderPin(0)
            }


        }, 'SchedDetail', 'Please wait');

        if (self.OrderId() == 0)
        self.GetPTSchedIs(self.OrderPin());
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

    self.GetPTSchedIs = function (ipopid, selected) {
       
        self.OrderPTSchedIds([]);
        self.OrderPTSchedIds.push({ Id: "" });
        self.OrderPTSchedule('');
        if (ipopid) {
            url = self.UrlActions.data("getptschedids");

            param = {
                ipopid: ipopid,
                patienttype: self.OrderPatientType()
            }
            
            ajaxWrapper.Post(url, param, function (data, callback) {
                if (data.length > 0) {
                    ko.utils.arrayPushAll(self.OrderPTSchedIds, data);
                    
                }
                if (selected) {
                    self.OrderPTSchedule(selected);
                }
               
            }, '', 'Searching', function () { alert('error') });

        }
    };

    self.GetRHOrderById = function (id) {
        url = self.UrlActions.data("getrhorderbyid");
        param = { Id: id }
        ajaxWrapper.Get(url, param, function (data, callback) {
            self.OrderRefferedBy(data.ReferredDoctor);
            self.OrderShiftNurseId(data.ShiftingNurseId);
            self.OrderDoctorId(data.DoctorId);
            self.OrderRemarks(data.Remarks);
            self.OrderDiagnosis(data.Diagnosis);
            self.OrderOPVisitNo(data.OpVisitNo);
            self.OrderProcedureStartTime(moment(data.ProcedureStartdateTime).format("DD-MMM-YYYY hh:mm A"));
            self.OrderProcedureEndTime(moment(data.ProcedureEnddateTime).format("DD-MMM-YYYY hh:mm A"));
            self.OrderTreatmentDetails(data.Treatment);

        });

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

    self.GetInpatientDetails = function () {
        url = self.UrlActions.data("getinpatientdetails");
        param = { ipid: self.OrderIPIDOPID() };
        ajaxWrapper.Post(url, param, function (data, callback) {
                self.OrderPatientName(data.PatientName);
                self.OrderAgeType(data.AgeTypeId);
                self.OrderAge(data.Age);
                self.OrderSex(data.SexId);
                self.OrderBedId(data.BedId);
                self.OrderCompanyCode(data.CompanyCode);
                self.OrderCompanyName(data.CompanyName);
                self.OrderCategory(data.CategoryName);
                self.OrderConsultant1(data.DoctorName);
                self.OrderAgeStr(data.AgeStr);
                self.OrderSexStr(data.Sex)
                self.OrderWardStr(data.WardName);
                self.OrderBedId(data.BedId);
        });

        if (self.OrderId() == 0)
            self.GetPTSchedIs(self.OrderIPIDOPID());
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
        if (schedId) {
            url = self.UrlActions.data("getptstechnician");
            param = { schedId: schedId }
                
            self.OrderTechnicians([]);

            ajaxWrapper.Get(url, param, function (data, callback) {
                ko.utils.arrayForEach(data, function (tech) {
                    self.OrderTechnicians.push(tech.Id);
                });
            });
        }
    };

    self.GetPTSPhysiotherapist = function (schedId) {
        url = self.UrlActions.data("getptsphysiotherapist");
        param = { schedId: schedId };
        self.OrderTherapist([]);
        ajaxWrapper.Get(url, param, function (data, callback) {
            $.each(data, function (index, value) {
               self.OrderTherapist.push(value.Id);
            });
        });

    };

    self.GetPTSNurse = function (schedId) {
        url = self.UrlActions.data("getptsnurse");
        param = { schedId: schedId };
        self.OrderNurses([]);
        ajaxWrapper.Get(url, param, function (data, callback) {
            $.each(data, function (index, value) {
                self.OrderNurses.push(value.Id);
            });
        });

    };

    self.GetPTSProcedure = function (schedId) {
        url = self.UrlActions.data("getptsprocedure");
        param = { schedId: schedId };
        self.OrderProcedures([]);
        ajaxWrapper.Get(url, param, function (data, callback) {
            $.each(data, function (index, value) {
                self.OrderProcedures.push(value.Id);
            });
        });

    };


    self.GetRHOrderTherapist = function (orderid) {
        url = self.UrlActions.data("getrhordertherapist");
        param = { orderId: orderid }

        self.OrderTherapist([]);

        var data =  ajaxWrapper.Sync('GET', url,param);

        ko.utils.arrayForEach(data, function (item) {
            self.OrderTherapist.push(item.Id);
        });
      
    };

    self.GetRHOrderTechnicians = function (orderid) {
        url = self.UrlActions.data("getrhordertechnicians");
        param = { orderId: orderid }

        self.OrderTechnicians([]);

        var data = ajaxWrapper.Sync('GET', url, param);

        ko.utils.arrayForEach(data, function (item) {
           self.OrderTechnicians.push(item.Id);
        });

    };

    self.GetRHOrderNurses = function (orderid) {
        url = self.UrlActions.data("getrhordernurses");
        param = { orderId: orderid }

       self.OrderNurses([]);

      var data = ajaxWrapper.Sync('GET', url, param);

      ko.utils.arrayForEach(data, function (item) {
        self.OrderNurses.push(item.Id);
      });
     

    };

    self.GetRHOrderProcedures = function (orderid) {
        url = self.UrlActions.data("getrhorderprocedures");
        param = { orderId: orderid }

        self.OrderProcedures([]);

        var data = ajaxWrapper.Sync('GET', url, param);

         ko.utils.arrayForEach(data, function (item) {
             self.OrderProcedures.push(item.Id);
        });

    };



    self.ClearPatientDetails = function () {
        self.OrderPatientName('');
 
        self.OrderAgeType('');
        self.OrderAge('');
        self.OrderSex('');
        self.OrderBedId(0);
        self.OrderCompanyCode('');
        self.OrderCompanyName('');
        self.OrderCategory('');
        self.OrderConsultant1('');
        self.OrderAgeStr('');
        self.OrderSexStr('')
        self.OrderWardStr('');
        self.OrderPTSchedule('');
        self.OrderOperator(self.LoginOperator());
        self.OrderDateTime(moment(new Date()).format("DD-MMM-YYYY"));
        self.OrderPTSchedIds([]);
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

    self.NewOrder = function () {
        self.OrderModal('show');
        self.OrderId(0);
        self.ClearPatientDetails();
        self.ClearProcedureDetails();
        self.OrderPatientType(1);
        self.OrderIPIDOPID('');
        self.OrderPin('');

    }

    self.OrderModal = function (showhide) {
        $("#OrderEntry").modal(showhide);
    };

    self.SelectOrder = function (data) {
        self.OrderModal('show');
        self.OrderPatientType(data.PatientType);
        self.OrderId(data.Id);
        if (data.PatientType == 1) {
            self.OrderIPIDOPID(data.IPIDOPID);
        } else {           
            self.OrderPin(data.IPIDOPID);
            self.OrderRegno(data.IPIDOPID);
            self.GetPatient();
        }

        self.GetRHOrderById(data.Id);
        self.GetRHOrderNurses(data.Id);
        self.GetRHOrderProcedures(data.Id);
        self.GetRHOrderTechnicians(data.Id);
        self.GetRHOrderTherapist(data.Id);

       
    };
    self.GetEmployee = function (id) {
        url = self.UrlActions.data("getemployee");
        param = { id: id };
        ajaxWrapper.Get(url, param, function (data, callback) {
            self.BookingOperator = data.Name;
            self.Operator(data.Name);
        });
    }

    self.SelectPatient = function (data) {
        
        self.OPPin(data.RegistrationNo);
        self.GetPatient();
        $("#SearchPatient").modal('hide');
    };

    self.SearchPatient = function () {
        $("#SearchPatient").modal('show');
    };

    self.CreateOrder = function () {

        var errors = self.Validate('create');
      
       if (errors.length > 0) {
            self.ShowErrors(errors);
        } else {
            self.Create();
        }

    }

    self.UpdateOrder = function () {

        var errors = self.Validate('update');

        if (errors.length > 0) {
            self.ShowErrors(errors);
        } else {
            self.Update();
        }

    }

    self.CancelOrder = function () {

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
                self.Cancel();
            }
        });


    };

    self.ShowErrors = function (errors) {
        var messages = '';
        $.each(errors, function (i, item) {
            messages += item + "\n \n";
        });

        self.ShowMessage('Validation Error(s)', 'error', messages, 3000);
    };

    self.Create = function () {

        url = self.UrlActions.data("saverhorder");
        
        rhorder = new RHOrder();
        rhorder.Id = 0;
        rhorder.DoctorId = self.OrderDoctorId();
        rhorder.ShiftingNurseId = self.OrderShiftNurseId();
        rhorder.OperatorId = 0;
        rhorder.BedId = self.OrderBedId();
        rhorder.PatientType = self.OrderPatientType();
        rhorder.IPIDOPID = self.OrderPatientType() == 1? self.OrderIPIDOPID():self.OrderRegno();

        rhorder.ProcedureStartdateTime =self.OrderProcedureStartTime();
        rhorder.ProcedureEnddateTime = self.OrderProcedureEndTime();

        rhorder.Remarks = self.OrderRemarks();
        rhorder.Diagnosis = self.OrderDiagnosis();
        rhorder.ReferredDoctor = self.OrderRefferedBy();
        rhorder.OpVisitNo = self.OrderOPVisitNo();
        rhorder.Treatment = self.OrderTreatmentDetails();

        var procedures = [];

        $.each(self.Procedures(), function (index, item) {
            if ($.inArray(item.Id, self.OrderProcedures()) > -1) {
                procedures.push(item);
            }
        });

        param = {
            rhOrder: rhorder,
            therapist: self.OrderTherapist(),
            technicians: self.OrderTechnicians(),
            nurses: self.OrderNurses(),
            ptscheduleid: self.OrderPTSchedule(),
            procedures: procedures
        }

        ajaxWrapper.Post(url, param, function (data, callback) {
            self.BookingOperator = data.Name;
            self.OrderOperator(data.Name);
            self.OrderId(data.retid);
            if (data.retid > 0) {
                self.ShowMessage('Notification', 'success', data.message);
                self.GetRHOrders();
            } else {
                self.ShowMessage('Error', 'error', data.message, 3000);
            }
           

        });
    }


    self.Update = function () {

        url = self.UrlActions.data("updaterhorder");
        
        rhorder = new RHOrder();
        rhorder.Id = self.OrderId();
        rhorder.DoctorId = self.OrderDoctorId();
        rhorder.ShiftingNurseId = self.OrderShiftNurseId();
        rhorder.OperatorId = 0;
        rhorder.BedId = self.OrderBedId();
        rhorder.PatientType = self.OrderPatientType();
        rhorder.IPIDOPID = self.OrderPatientType() == 1 ? self.OrderIPIDOPID() : self.OrderRegno();

        rhorder.ProcedureStartdateTime = self.OrderProcedureStartTime();
        rhorder.ProcedureEnddateTime = self.OrderProcedureEndTime();

        rhorder.Remarks = self.OrderRemarks();
        rhorder.Diagnosis = self.OrderDiagnosis();
        rhorder.ReferredDoctor = self.OrderRefferedBy();
        rhorder.OpVisitNo = self.OrderOPVisitNo();
        rhorder.Treatment = self.OrderTreatmentDetails();

        var procedures = [];

        $.each(self.Procedures(), function (index, item) {
            if ($.inArray(item.Id, self.OrderProcedures()) > -1) {
                procedures.push(item);
            }
        });

        param = {
            rhOrder: rhorder
        }

        ajaxWrapper.Post(url, param, function (data, callback) {
            self.BookingOperator = data.Name;
            self.OrderOperator(data.Name);
            if (data.retid > 0) {
                self.ShowMessage('Notification', 'success', data.message);
                self.GetRHOrders();
            } else {
                self.ShowMessage('Error', 'error', data.message);
            }

        });
    }

    self.Cancel = function () {

        url = self.UrlActions.data("cancelrhorder");
        param = { orderid: self.OrderId() }
      
        ajaxWrapper.Post(url, param, function (data, callback) {
            if (data.retid > 0) {
                self.ShowMessage('Notification', 'success', data.message);
                self.OrderId(0);
                self.GetRHOrders();
                self.OrderModal('hide');
            } else {
                self.ShowMessage('Error', 'error', data.message);
            }

        });
    }

    self.ResetOrder = function () {
        self.OrderPin('');
        self.OrderIPIDOPID('');
        self.OrderRegno('');
        self.OrderId(0);
        self.ClearPatientDetails();
        self.ClearProcedureDetails();
    };

    self.Validate = function (action) {

        var errors = [];


        if (action == 'create') {
            if (self.OrderTherapist().length == 0) {
                errors.push("Please select atleast 1 Therapist");
            }

            if (self.OrderProcedures().length == 0) {
                errors.push("Please select atleast 1 procedure");
            }

        }
        if (self.OrderPatientType() == 1 && self.OrderIPIDOPID() == "") {
              errors.push("Please select patient details");

        }

       if (self.OrderPatientType() == 0 && (self.OrderRegno == 0 || self.OrderRegno()=='')) {
             errors.push("Please select patient details");
       }

       if (self.OrderPatientType() == 0 && $.trim(self.OrderOPVisitNo()) == '') {
           errors.push("Please input OPBill visit no");
       }

       
       if ($("#ProcedureStartTime").val() == '' || $("#ProcedureEndTime").val() == '' ) {

           errors.push("Please select procedure date and time");
       
       }else {

           if (new Date(self.OrderProcedureStartTime()).getTime() > new Date(self.OrderProcedureEndTime()).getTime()) {
               errors.push("Invalid procedure date combination");
           }
       }


       return errors;
    }

  
    self.ResetTime = function () {
        curDateTime = new Date();
        curMin = curDateTime.getMinutes();

        minToAdd = (Math.floor(curMin / 15) + 1) * 15;

        from = new Date(moment(curDateTime).format("DD-MMM-YYYY HH") + ":00");
        from = new Date(from.setMinutes(from.getMinutes() + minToAdd));

        to = new Date(from)
        to = new Date(to.setMinutes(to.getMinutes() + 15));

        from = moment(from).format("DD-MMM-YYYY hh:mm A");
        to = moment(to).format("DD-MMM-YYYY hh:mm A")

        self.OrderProcedureStartTime(from);
        self.OrderProcedureEndTime(to);
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

    self.init();

    //change events
    self.FromDateTime.subscribe(function (val) {
        if (val) {
            self.GetRHOrders();
        }
    });

    self.ToDateTime.subscribe(function (val) {
        if (val) {
            self.GetRHOrders();
        }
    });

  
    self.SelectedRegNo.subscribe(function (i) {
        self.GetRHOrders();
    });

    self.SelectedPatTientType.subscribe(function (i) {
        self.GetRHOrders();
    });

    self.OrderPatientType.subscribe(function (i) {
        self.OrderIPIDOPID('');
        self.OrderPin('');
        self.ClearPatientDetails();
    });

    self.OrderIPIDOPID.subscribe(function (val) {
            self.GetInpatientDetails();
    });
   
    self.OrderPTSchedule.subscribe(function (val) {
        if (val && val != '') {
            self.GetPTSchedule(val);
            self.GetPTSTechnician(val);
            self.GetPTSProcedure(val);
            self.GetPTSNurse(val);
            self.GetPTSPhysiotherapist(val);
        }
        else {
            self.ClearProcedureDetails();
        }
    });

    self.OrderHasFromTime.subscribe(function (val) {
        if (!val) {
            self.OrderProcedureStartTime('');
            $("#ProcedureStartTime").val('')
        }
       
    });
    self.OrderHasToTime.subscribe(function (val) {
        if (!val) {
            self.OrderProcedureEndTime('');
            $("#ProcedureEndTime").val('')
        } 

    });


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


function RHOrder() {
    this.Id = '';
    this.DoctorId = '';
    this.ShiftingNurseId = '';
    this.OperatorId = '';
    this.BedId = '';
    this.PatientType = '';
    this.IPIDOPID = '';

    this.ProcedureStartdateTime = '';
    this.ProcedureEnddateTime = '';

    this.Remarks = '';
    this.Diagnosis = '';
    this.ReferredDoctor = '';
    this.OpVisitNo = '';
    this.Treatment = '';
};

