//$.fn.dataTable.ext.errMode = 'none'; //temporary hide warning alert message for datatable

function PhycioExams(model) {
    self = this;
    self.UrlActions = $("#urlAcions");

    self.PhysioTabs = ko.observableArray(model.MPhysioExaminations);

    self.SelectedPhysioTab = ko.observable();


    self.SeachIcdOption = ko.observable(0);

    self.SearchIcdInput = ko.observable();

    self.SearchFocus = ko.observable(false);

    self.EditMode = ko.observable(false);


    self.JSTree = new tree(model.JStreeData);


    self.init = function () {
        self.PhysioTabs.unshift({ Id: '', TabName: '' });

        self.SelectedPhysioTab.subscribe(function (val) {

            url = self.UrlActions.data('getjstreedata');
            debugger;
            param = { tabId: val };

            var data = ajaxWrapper.Sync('GET', url, param);
            self.JSTree.treeData(data);
        });


    };

    self.init();

    
}




function tree(model) {
    var self = this;

    //display actions in fiddle

    self.tree = $('#jstree'); //get jstree div

    self.treeData = ko.observableArray(model);
};
