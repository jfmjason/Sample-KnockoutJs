//$.fn.dataTable.ext.errMode = 'none'; //temporary hide warning alert message for datatable

function PhycioICDs(model) {
    self = this;
    self.UrlActions = $("#urlAcions");

    self.ICDDisplay = ko.observableArray(model.PhysioICDS);
    self.PhysioTabs = ko.observableArray(model.MPhysioExaminations);
    self.PhysioExams = ko.observableArray([]);
    self.SelectedICDCodes = ko.observableArray([]);

    self.SelectedSearchICDs = ko.observableArray([]);
    self.SearchedICDs = ko.observableArray([]);

    self.SelectedPhysioTab = ko.observable();
    self.SelectedExam = ko.observable();

    self.SeachIcdOption = ko.observable(0);

    self.SearchIcdInput = ko.observable();

    self.SearchFocus = ko.observable(false);

    self.EditMode = ko.observable(false);

    //Entry
    self.ICDEntry = new ICDEntry();

    self.JSTree = new tree(model.JStreeData, this);

    self.SelectAvailableExam = function (data) {

        self.ICDEntry.SelectedPhysioExams.push(data);
        self.ICDEntry.AvailablePhysioExams.remove(data);
    };

    self.RemoveSelectedExam = function (data) {

        self.ICDEntry.AvailablePhysioExams.push(data);
        self.ICDEntry.SelectedPhysioExams.remove(data);
    };

    self.SelectAllExam = function () {

        var data = self.ICDEntry.AvailablePhysioExams();

        ko.utils.arrayPushAll(self.ICDEntry.SelectedPhysioExams, data);
        self.ICDEntry.AvailablePhysioExams([]);
    };

    self.RemoveAllExam = function () {

        var data = self.ICDEntry.SelectedPhysioExams();

        ko.utils.arrayPushAll(self.ICDEntry.AvailablePhysioExams, data);
        self.ICDEntry.SelectedPhysioExams([]);
    };

    self.SelectTreeCode = function () {
        var data = self.JSTree.selectedNode();

        var newdata = { Id: data.id, Code: data.original.code, Description: data.original.description };
        var searchselected = self.SelectedSearchICDs();
        var currentselected = self.SelectedICDCodes();

        var exist = false;
        $.each(searchselected, function (i, item) {
            if (newdata.Id == item.Id) {
                exist = true;
            }
        });

        $.each(currentselected, function (i, item) {
            if (newdata.Id == item.Id) {
                exist = true;
            }
        });

        if (!exist) {
            self.SelectedSearchICDs.push(newdata);
        } else if (currentselected.length > 0 || searchselected.length > 0) {
            self.ShowMessage('Error Notification', 'error', 'This code is already selected');
        }
    };

    self.SelectDeepSearchCode = function (data) {



        var searchselected = self.SelectedSearchICDs();
        var currentselected = self.SelectedICDCodes();

        var exist = false;
        $.each(searchselected, function (i, item) {
            if (data.Id == item.Id) {
                exist = true;
            }
        });

        $.each(currentselected, function (i, item) {
            if (data.Id == item.Id) {
                exist = true;
            }
        });

        if (!exist) {
            self.SelectedSearchICDs.push(data);
        } else if (currentselected.length > 0 || searchselected.length > 0) {
            self.ShowMessage('Error Notification', 'error', 'This code is already selected');
        }
    };

    self.RemoveTreeCode = function (data) {

        self.SelectedSearchICDs.remove(data);
    };

    self.RemoveSelectedCode = function (data) {

        if (self.EditMode() == false) {
            self.SelectedICDCodes.remove(data);
        }
    };

    self.NewEntry = function () {
        self.IcdEntry('show');
        self.ClearEntry();
        self.EditMode(false);

    };

    self.SelectSearchCode = function () {

        ko.utils.arrayPushAll(self.SelectedICDCodes,self.SelectedSearchICDs());
        self.SelectedSearchICDs([]);
        self.IcdSearch('hide');
    };

    self.SelectEditICD = function (data) {

        self.IcdEntry('show');
        self.SelectedICDCodes([]);
        self.SelectedICDCodes.push({ Id: data.ICDId, Code: data.Code, Description: data.Description });
        self.ICDEntry.PhysioTab(data.TabId);
         
        exams = self.GetConfiguredPhysioExams(data.ICDId);
        self.ICDEntry.SelectedPhysioExams([]);

        $.each(exams, function (i, item) {

            self.ICDEntry.AvailablePhysioExams.remove(function (obj) {
                return obj.Id == item.Id;
            });

            self.ICDEntry.SelectedPhysioExams.push(item);
        });

        self.EditMode(true);
    };

    self.SearchIcd10 = function () {
        self.SearchedICDs([]);

        if (self.SeachIcdOption() == 0) {

            param = { code: self.SearchIcdInput()};
            url = self.UrlActions.data('geticd10bycode');
            data = ajaxWrapper.Sync('GET', url, param);
            ko.utils.arrayPushAll(self.SearchedICDs, data);


        } else {

            param = { desc: self.SearchIcdInput() };
            url = self.UrlActions.data('geticd10bydesc');
            data = ajaxWrapper.Sync('GET', url, param);
            ko.utils.arrayPushAll(self.SearchedICDs, data);

        }
    };
    
    self.GetPhysioIcds = function () {
        param = { tabid: self.SelectedPhysioTab(), examid:self.SelectedExam() };
        url = self.UrlActions.data('getphysioicd');
        self.ICDDisplay([]);
        data = ajaxWrapper.Sync('GET', url, param);
        ko.utils.arrayPushAll(self.ICDDisplay, data);

    };

    self.GetConfiguredPhysioExams = function (val) {
        param = { icdid: val ,tabid: self.ICDEntry.PhysioTab()};
        url = self.UrlActions.data('getconfigphysioexam');

        data = ajaxWrapper.Sync('GET', url, param);
        return data;
    };

    self.GetPhysioExams = function (val) {
        param = { tabId: val };
        url = self.UrlActions.data('getphysioexam');
        self.PhysioExams(['']);
        data = ajaxWrapper.Sync('GET', url, param);


        return data;
    };

    self.IcdEntry = function (showhide) {

        $('#ICDEntry').modal(showhide);
    };

    self.IcdSearch = function (showhide) {

        $('#ICDSearch').modal(showhide);
    };

    self.AddICD10 = function () {

        if (self.Validate()) {
            url = self.UrlActions.data("addicd10");

            param = { tabid: self.ICDEntry.PhysioTab(), physioexamjson: JSON.stringify(self.ICDEntry.SelectedPhysioExams()), icd10json: JSON.stringify(self.SelectedICDCodes()) };

            ajaxWrapper.Post(url, param, function (data, callback) {

                if (data.retid > 0) {
                    self.ShowMessage('Notification', 'success', data.message);
                    self.ClearEntry();
                    self.GetPhysioIcds();

                } else {
                    self.ShowMessage('Error', 'error', data.message);
                }
            });
        }
    }

    self.UpdateICD10 = function () {

        if (self.Validate()) {

            swal({
                title: 'Warning',
                text: "Are you sure you want to update this ICD Parameter?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: 'OK',
                closeOnConfirm: false,
                allowOutsideClick: false
            }, function (isConfirm) {
                if (isConfirm) {
                    url = self.UrlActions.data("updateicd10");

                    param = { tabid: self.ICDEntry.PhysioTab(), physioexamjson: JSON.stringify(self.ICDEntry.SelectedPhysioExams()), icd10json: JSON.stringify(self.SelectedICDCodes()) };

                    ajaxWrapper.Post(url, param, function (data, callback) {

                        if (data.retid > 0) {
                            
                            self.ShowMessage('Notification', 'success', data.message);
                            self.GetPhysioIcds();

                        } else {
                            self.ShowMessage('Error', 'error', data.message);
                        }
                    });
                }
            });
        }
    }

    self.RemoveICD10 = function (data) {


        swal({
            title: 'Warning',
            text: "Are you sure you want to remove this ICD Parameter?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: 'OK',
            closeOnConfirm: true,
            allowOutsideClick: false
        }, function (isConfirm) {
            if (isConfirm) {
                url = self.UrlActions.data("removeicd10");

                param = { tabid: data.TabId, physioexamid: data.PhysioExamId, icdid: data.ICDId };

                ajaxWrapper.Post(url, param, function (data, callback) {

                    if (data.retid > 0) {
                        self.ShowMessage('Notification', 'success', data.message);
                        self.ClearEntry();
                        self.GetPhysioIcds();

                    } else {
                        self.ShowMessage('Error', 'error', data.message);
                    }
                });
            }
        });
     
           
       
    }

    self.ClearEntry = function () {

     self.SelectedICDCodes([])

     self.ICDEntry.PhysioTab('');
    
     self.ICDEntry.SelectedPhysioExams([]);
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

    self.Validate = function () {
        valid = true;

        errormessage = "";

        if (self.SelectedICDCodes().length == 0) {
            errormessage += "* No Selected ICD CODES \n"

            valid = false;
        }

        if (self.ICDEntry.PhysioTab() == '') {
            errormessage += "* Please select Tab Name \n"
            valid = false;
        }

       if (self.ICDEntry.SelectedPhysioExams().length ==0) {
           errormessage += "* No selected Physio Exam \n"
            valid = false;
        }

        if(!valid)
         self.ShowMessage("Validation Error", "error", errormessage);

        return valid;
    }

    self.init = function () {
        self.PhysioTabs.unshift({ Id: '', TabName: '' });

        self.SelectedPhysioTab.subscribe(function (val) {

            if (val !== "") {

                data = self.GetPhysioExams(val);

                ko.utils.arrayPushAll(self.PhysioExams, data);
            } else {
                self.PhysioExams(['']);
            }

            self.GetPhysioIcds();
            
        });

        self.SelectedExam.subscribe(function (va) {
            self.GetPhysioIcds();
        });

        self.ICDEntry.PhysioTab.subscribe(function (val) {
            self.ICDEntry.AvailablePhysioExams([]);
            self.ICDEntry.SelectedPhysioExams([]);
            if (val !== '') {
               
                data = self.GetPhysioExams(val);

                ko.utils.arrayPushAll(self.ICDEntry.AvailablePhysioExams, data);
            }
        });
    };

    self.init();

    
}


function ICDEntry() {
    that = this;
    that.PhysioTab = ko.observable();
    that.AvailablePhysioExams = ko.observableArray([]);
    that.SelectedPhysioExams = ko.observableArray([]);
}


function tree(model, parent) {
    var self = this;

    //display actions in fiddle
    self.consoleLine = "<p class=\"console-line\"></p>";
    self.consoleLog = function (text) {
        $("#console-log").append($(self.consoleLine).html(text));
    };
    self.clearConsoleLog = function () {
        $("#console-log").html('');
    };

    self.tree = $('#icdtree'); //get jstree div
    self.isNodeSelected = ko.observable(false);
    self.selectedNode = ko.observable({});

    //keep track of selected node
    self.tree.on("changed.jstree", function (e, data) {
        var node = self.tree.jstree().get_selected(true)[0]; //get current selected node
        if (typeof node !== 'undefined') {
            self.isNodeSelected(true);
            self.selectedNode(node);
            if (node.type == 'file') {

                if (node.children <= 0) {

                    url = parent.UrlActions.data('getphysioicd34');
                    param = { parentid: node.id };

                    data = ajaxWrapper.Sync('GET', url, param);
                    //self.tree.jstree("create_node", node, data, 'last');


                    $.each(data, function (index, item) {
                        self.tree.jstree("create_node", node, item, 'last');
                    });

                   
                }

            }

    
        } else {
            self.isNodeSelected(false);
        }
    });

    self.treeData = ko.observableArray(model);
};
