//$.fn.dataTable.ext.errMode = 'none'; //temporary hide warning alert message for datatable

function Employees(model) {
    self = this;
    self.UrlActions = $("#urlAcions");

    self.Nurses = ko.observableArray(model.Nurses);
    self.Therapist = ko.observableArray(model.Physiotherapist);
    self.Technicians = ko.observableArray(model.Technicians);

    self.SelectedEmployee = ko.observable();

    self.SearchEmployee = function (query) {
        if (query !== "") {
            param = { term: query.term };
            url = self.UrlActions.data('searchemployee');
            ajaxWrapper.Get(url, param, function (data, e) {
                var filteredData = [];
                ko.utils.arrayForEach(data, function (emp) {
                    var text = '';
                    if ($.trim(emp.Empcode) == '' || $.trim(emp.Empcode) == 0)
                        text = emp.Name;
                    else
                        text = emp.Empcode + ' - ' + emp.Name;

                    filteredData.push({ id: emp.Id, text: text });
                });
                query.callback({
                    results: filteredData
                });
            });
        }
    }

    self.AddTechnician = function () {

        param = { employeeId: self.SelectedEmployee(), type: 3 };
        url = self.UrlActions.data('add');

        ajaxWrapper.Post(url, param, function (data, callback) {
            debugger;
            if (data.returnid > 0) {
                self.Technicians([]);

                var data = self.GetPTEmployeeByType(3);
                ko.utils.arrayPushAll(self.Technicians, data);

                self.ShowMessage("Success Notification", "success", data.message);

            } else {
                self.ShowMessage("Error Notification", "error", data.message);
            }
        });
    };

    self.AddPhysiotherapist = function () {

        param = { employeeId: self.SelectedEmployee(), type: 2 };
        url = self.UrlActions.data('add');

        ajaxWrapper.Post(url, param, function (data, callback) {

            if (data.returnid > 0) {

                self.Therapist([]);

                var data = self.GetPTEmployeeByType(2);
                ko.utils.arrayPushAll(self.Therapist, data);

                self.ShowMessage("Success Notification", "success", data.message);
            } else {
                self.ShowMessage("Error Notification", "error", data.message);
            }
        });
    };

    self.AddNurses = function () {

        param = { employeeId: self.SelectedEmployee(), type: 4 };
        url = self.UrlActions.data('add');

        ajaxWrapper.Post(url, param, function (data, callback) {

            if (data.returnid > 0) {

                self.Nurses([]);

                var data = self.GetPTEmployeeByType(4);

                ko.utils.arrayPushAll(self.Nurses, data);


                self.ShowMessage("Success Notification", "success", data.message);
            } else {
                self.ShowMessage("Error Notification", "error", data.message);
            }
        });
    };

    self.GetPTEmployeeByType = function (type) {

        param = { type: type };
        url = self.UrlActions.data('getptemployee');

        return ajaxWrapper.Sync('GET', url, param);
    };

    self.RemoveTechnicians = function (data) {

        swal({
            title: 'Confirmation',
            text: "Are you sure you want to remove this Technician?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: 'OK',
            closeOnConfirm: true,
            allowOutsideClick: false
        }, function (isConfirm) {
            if (isConfirm) {
                param = { employeeId: data.Id, type: 3 };
                url = self.UrlActions.data('remove');

                ajaxWrapper.Post(url, param, function (data) {

                    if (data.returnid > 0) {
                        self.Technicians([]);

                        var data = self.GetPTEmployeeByType(3);
                        ko.utils.arrayPushAll(self.Technicians, data);

                        self.ShowMessage("Success Notification", "success", data.message);

                    } else {
                        self.ShowMessage("Error Notification", "error", data.message);
                    }
                });
            }
        });
    }

    self.RemoveTherapist = function (data) {

        swal({
            title: 'Confirmation',
            text: "Are you sure you want to remove this Therapist?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: 'OK',
            closeOnConfirm: true,
            allowOutsideClick: false
        }, function (isConfirm) {
            if (isConfirm) {
                param = { employeeId: data.Id, type: 2 };
                url = self.UrlActions.data('remove');

                ajaxWrapper.Post(url, param, function (data, callback) {

                    if (data.returnid > 0) {

                        self.Therapist([]);

                        var data = self.GetPTEmployeeByType(2);
                        ko.utils.arrayPushAll(self.Therapist, data);

                        self.ShowMessage("Success Notification", "success", data.message);
                    } else {
                        self.ShowMessage("Error Notification", "error", data.message);
                    }
                });
            }
        });
    };

    self.RemoveNurses = function (data) {

        swal({
            title: 'Confirmation',
            text: "Are you sure you want to remove this Therapist?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: 'OK',
            closeOnConfirm: true,
            allowOutsideClick: false
        }, function (isConfirm) {
            if (isConfirm) {
                param = { employeeId: data.Id, type: 4 };
                url = self.UrlActions.data('remove');

                ajaxWrapper.Post(url, param, function (data, callback) {

                    if (data.returnid > 0) {

                        self.Nurses([]);

                        var data = self.GetPTEmployeeByType(4);
                        ko.utils.arrayPushAll(self.Nurses, data);

                        self.ShowMessage("Success Notification", "success", data.message);
                    } else {
                        self.ShowMessage("Error Notification", "error", data.message);
                    }
                });

            }
        });
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
    };

    self.ClearSearch = function () {
        self.SelectedEmployee('');

        $('.select2-container').select2('data', null)
    };

}

