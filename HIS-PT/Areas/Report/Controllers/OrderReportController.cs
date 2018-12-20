using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HIS_PT.Areas.Report.ViewModels;
using DataLayer.Model;
using DataLayer.Data;
using HIS_PT.Common;
using Microsoft.Reporting.WebForms;
using HIS.Controllers;
using System.Data;


namespace HIS_PT.Areas.Report.Controllers
{
    public class OrderReportController : BaseController
    {
        PTEmployeeDB ptEmployeeDB = new PTEmployeeDB();
        PTProcedureDB ptProcedureDB = new PTProcedureDB();
        PatientDB patientDB = new PatientDB();
        RHOrderDB rhOrderDB = new RHOrderDB();
        
        public ActionResult Index()
        {
            var model = new ProcedureReportViewModel()
            {
                PTTherapist = ptEmployeeDB.getEmployeeByType((int)Enumerations.PTEmpoyeeType.THERAPIST),
                PTProcedure = ptProcedureDB.getProcedures(),
                Inpatients = patientDB.getInpatients()
            };

            return View(model);
        }


        public ActionResult Referred()
        {
            var model = new OrderRefferedReportViewModel()
            {
                Doctors = ptEmployeeDB.getPTDoctors(),
                PTProcedure = ptProcedureDB.getProcedures(),
                Inpatients = patientDB.getInpatients()
            };

            return View(model);
        }


        public JsonResult searchPatientPin(string searchString)
        {
            return Json(patientDB.searchPatientsByRegNo(searchString), JsonRequestBehavior.AllowGet);
        }


        public ActionResult PrintPreview(
                                         DateTime from, 
                                         DateTime to,
                                         int patientType, 
                                         int ordermode, 
                                         int procedureId = 0, 
                                         int therapistId = 0, 
                                         int registrationNo = 0
                                         )
        {

            DataTable data = new DataTable();
            var reportdocPath = "";

            if(ordermode == 0){
                data = rhOrderDB.getORderProcedureReport(patientType,ordermode,0,0,registrationNo,from,to.AddDays(1));
                reportdocPath = @"\ReportFile\ProcedureByPatient.rdl";
            }else if(ordermode == 1){
                data = rhOrderDB.getORderProcedureReport(patientType,ordermode,procedureId,0,registrationNo,from,to.AddDays(1));
                reportdocPath = @"\ReportFile\ProcedureByPTProcedure.rdl";
            }else{
                data = rhOrderDB.getORderProcedureReport(patientType,ordermode,0,therapistId,registrationNo,from,to.AddDays(1));
                reportdocPath = @"\ReportFile\ProcedureByTherapist.rdl";
            }
            


            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
           
            List<ReportParameter> parameters = new List<ReportParameter>();
            parameters.Add(new ReportParameter("operatorName", base.OperatorName));
            parameters.Add(new ReportParameter("ReportSubHead", patientType==1?"IP":"OP"));
            parameters.Add(new ReportParameter("FromDate", from.ToString("dd-MMM-yyyy")));
            parameters.Add(new ReportParameter("ToDate", to.ToString("dd-MMM-yyyy")));

            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + reportdocPath;
            reportViewer.LocalReport.SetParameters(parameters);
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("Procedure",data ));
            reportViewer.LocalReport.Refresh();

            return new FileStreamResult(Helper.CreateMemoryStream(reportViewer, "PDF"), "application/pdf");
        }


        public ActionResult PrintPreviewReferredOrder( 
                                         DateTime from,
                                         DateTime to,
                                         string referredBy,
                                         int patientType,
                                         int doctorId = 0,
                                         int registrationNo = 0
                                         )
        {

            DataTable data = new DataTable();
            var reportdocPath = @"\ReportFile\RefferedRHOrderReport.rdl";

          
            data = rhOrderDB.getORderRefferedByReport(patientType,doctorId,registrationNo, referredBy, from, to.AddDays(1));

            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;

            List<ReportParameter> parameters = new List<ReportParameter>();
            parameters.Add(new ReportParameter("operatorName", base.OperatorName));
            parameters.Add(new ReportParameter("ReportSubHead", patientType == 1 ? "IP" : "OP"));
            parameters.Add(new ReportParameter("FromDate", from.ToString("dd-MMM-yyyy")));
            parameters.Add(new ReportParameter("ToDate", to.ToString("dd-MMM-yyyy")));

            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + reportdocPath;
            reportViewer.LocalReport.SetParameters(parameters);
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("Orders", data));
            reportViewer.LocalReport.Refresh();

            return new FileStreamResult(Helper.CreateMemoryStream(reportViewer, "PDF"), "application/pdf");
        }
        

    }
}
