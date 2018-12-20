function tree() {
    var self = this;

    //display actions in fiddle
    self.consoleLine = "<p class=\"console-line\"></p>";
    self.consoleLog = function (text) {
        $("#console-log").append($(self.consoleLine).html(text));
    };
    self.clearConsoleLog = function () {
        $("#console-log").html('');
    };


    self.tree = $('#jstree_demo_div'); //get jstree div
    self.isNodeSelected = ko.observable(false);
    self.selectedNode = ko.observable({});

    //deselect all nodes
    self.deselectAllNodes = function () {
        self.tree.jstree('deselect_all');
    }

    //keep track of selected node
    self.tree.on("changed.jstree", function (e, data) {
        var node = self.tree.jstree().get_selected(true)[0]; //get current selected node
        if (typeof node !== 'undefined') {
            self.isNodeSelected(true);
            self.selectedNode(node);
            self.consoleLog('selected node id: ' + node.id + ', type: ' + node.type);
        } else {
            self.isNodeSelected(false);
        }
    });

    self.createFolderNode = function (data) {
        //node can be created on a preselected node or pass # to create a root node
        var node;
        var data;
        if (self.isNodeSelected()) {
            node = self.selectedNode();
            data = {
                'id': Math.floor((Math.random() * 10000) + 1),
                'text': 'iPhone', 'type': 'folder'
            };
        }
        else {
            node = '#';
            data = {
                'id': Math.floor((Math.random() * 100000) + 1),
                'parent': '#',
                'text': 'New Root Node',
                'type': 'root'
            };
        }
        //create node
        var id = self.tree.jstree("create_node", node, data, 'last');
        self.tree.jstree('open_node', node);
        self.tree.jstree('edit', id);

    };

    self.createFileNode = function (data) {
        //Below code only allows files to be created within folders.
        //Structure it as per createFolder method to create files at root
        var data = {
            'id': Math.floor((Math.random() * 100000) + 1),
            'text': 'iOS 8',
            'type': 'file'
        }
        //create file node
        var id = self.tree.jstree("create_node", self.selectedNode(), data, 'last');
        self.tree.jstree('open_node', self.selectedNode());
        self.tree.jstree('edit', id);
    };

    self.renameNode = function (data) {
        if (self.isNodeSelected()) {
            self.tree.jstree('edit', self.selectedNode());
        }
        else {
            alert('please select a node to rename!');
        }
    };

    self.deleteNode = function (data) {
        if (self.isNodeSelected()) {
            self.tree.jstree('delete_node', self.selectedNode());
        }
        else {
            alert('please select a node to delete!');
        }
    };

    self.treeData = ko.observableArray([{
        'id': 1,
        'parent': '#',
        'text': 'Animals',
        'type': '#'
    }, {
        'id': 2,
        'parent': '#',
        'text': 'Devices',
        'type': '#'
    }, {
        'id': 'dog',
        'parent': 1,
        'text': 'Dogs',
        'type': 'folder'
    }]);
};
