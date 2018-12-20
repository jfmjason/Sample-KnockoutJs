using System.Web;
using System.Web.Optimization;

namespace HIS_PT
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = true;
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            /**Standard CSS Plugins by the group**/
            bundles.Add(new StyleBundle("~/Styles/plugins/global").Include(
                "~/Content/plugins/bootstrap/css/bootstrap.min.css",
                 //"~/Content/plugins/bootstrap-3.3.6-dist/css/bootstrap.min.css",
                "~/Content/plugins/datatable/css/datatables.bootstrap.css"
                ));

            ///Standard JS Plugins by the group
            bundles.Add(new ScriptBundle("~/Scripts/plugins/global").Include(
                "~/Content/plugins/bootstrap/js/bootstrap.min.js",
                //"~/Content/plugins/bootstrap-3.3.6-dist/js/bootstrap.min.js",
                "~/Content/plugins/datatable/js/jquery.dataTables.js", 
                "~/Content/plugins/datatable/js/dataTables.bootstrap.js",
                "~/Content/plugins/caret/jquery.migrate.js",
                "~/Content/plugins/blockui/jquery.blockUI.js",
                "~/Content/plugins/alphanum/jquery.alphanum.js"
                ));


            ///Standard CSS by the group
            bundles.Add(new StyleBundle("~/Styles/global").Include(
                "~/Content/styles/customererror.css",
                "~/Content/styles/globalstyle.css",
                "~/Content/styles/loading.css",
                "~/Content/styles/login.css",
                "~/Content/styles/mainstyles.css",
                "~/Content/styles/menu.css"
                ));

            ///Standard scripts by the group
            bundles.Add(new ScriptBundle("~/Scripts/global").Include(
                "~/Scripts/dialogwrapper.js",
                "~/Scripts/ajaxWrapper.js",
                "~/Scripts/jqSecurity.js"
                ));

            /**Customize CSS-Style-Plugin per programmer-global**/
            bundles.Add(new StyleBundle("~/Styles/custom").Include(
                "~/Content/styles/Site.css",
                "~/Content/plugins/select2/select2.min.css",
                "~/Content/plugins/sweetalert/sweet-alert.css",
                "~/Content/plugins/toastr/content/toastr.min.css",
                //"~/Content/plugins/datepicker/css/bootstrap-datetimepicker.min.css",
                "~/Content/plugins/datetime-picker/css/bootstrap-datetimepicker.css",
                "~/Content/plugins/datepicker/css/datepicker.css",
                "~/Content/plugins/timepicker1.8.9/css/jquery.timepicker.min.css",
                "~/Content/plugins/timepicker/css/bootstrap-timepicker.css",
                "~/Content/plugins/jstree/css/jstree.css",
                 "~/Content/plugins/treeview/jquery.treeview.css"

                ));

            /**Customize JS-Scripts-Plugin per programmer-global**/
            bundles.Add(new ScriptBundle("~/Scripts/custom").Include(
                "~/Content/plugins/select2/select2.js",
                "~/Content/plugins/select2/underscore.js",
                "~/Content/plugins/sweetalert/sweet-alert.min.js",
                "~/Content/plugins/jstree/js/jstree.js"
                //, "~/Content/plugins/treeview/jquery.treeview.js"
            ));

         
            bundles.Add(new ScriptBundle("~/Scripts/DateTimePlugins").Include(
              "~/Content/plugins/datepicker/js/moment.js",
              //"~/Content/plugins/datepicker/js/bootstrap-datepicker.js",
              "~/Content/plugins/datetime-picker/js/bootstrap-datetimepicker.js",
              "~/Content/plugins/timepicker1.8.9/js/jquery.timepicker.min.js",
              "~/Content/plugins/datepair/datepair.js",
              "~/Content/plugins/datepair/jquery.datepair.js"
            ));

            bundles.Add(new ScriptBundle("~/Scripts/knockoutjs").Include(
                 "~/Scripts/knockout-3.3.0.js",
                 "~/Scripts/knockout-bindinghandler.js"
                 //, "~/Scripts/knockout-select2.js"
           ));

       }
    }
}