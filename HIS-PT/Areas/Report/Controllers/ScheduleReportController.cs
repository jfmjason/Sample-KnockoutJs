using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HIS.Controllers;
using DataLayer.Data;
using HIS_PT.Areas.Report.ViewModels;
using HIS_PT.Common;
using Microsoft.Reporting.WebForms;
using System.Data;

namespace HIS_PT.Areas.Report.Controllers
{
    public class ScheduleReportController : BaseController
    {
        PTEmployeeDB ptEmployeeDB = new PTEmployeeDB();
        PTScheduleDB ptSchedule = new PTScheduleDB();
        StationDB stationDB = new StationDB();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult MonthlyWise()
        {
            var model = new ScheduleReportViewModel() {
             From = DateTime.Now
            };

            return View(model);
        }

        public ActionResult WardWise()
        {
            var model = new ScheduleReportViewModel()
            {
                From = DateTime.Now,
                To = DateTime.Now,
                Wards = stationDB.getStations()
            };

            return View(model);
        }

        public ActionResult TherapistWise()
        {
            var model = new ScheduleReportViewModel()
            {
                From = DateTime.Now,
                To = DateTime.Now,
                Therapist = ptEmployeeDB.getEmployeeByType((int) Enumerations.PTEmpoyeeType.THERAPIST)
            };

            return View(model);
        }

        public ActionResult MonthlyWisePreview(DateTime from)
        {
            DataTable data = new DataTable();
            var reportdocPath = @"\ReportFile\ScheduleMonthlyWise.rdl";

            data = ptSchedule.GetMonthlyReport(from);

            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;

            List<ReportParameter> parameters = new List<ReportParameter>();
            parameters.Add(new ReportParameter("operatorName", base.OperatorName));

            parameters.Add(new ReportParameter("FromDate", from.ToString("dd-MMM-yyyy")));
 

            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + reportdocPath;
            reportViewer.LocalReport.SetParameters(parameters);
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("Schedules", data));
            reportViewer.LocalReport.Refresh();

            return new FileStreamResult(Helper.CreateMemoryStream(reportViewer, "PDF"), "application/pdf");
        }

        public ActionResult WardWisePreview(DateTime from, DateTime to, int stationId = 0 )
        {
            DataTable data = new DataTable();
            var reportdocPath = @"\ReportFile\ScheduleWardWise.rdl";

            data = ptSchedule.GetWardWiseReport(from, to.AddDays(1), stationId);

            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;

            List<ReportParameter> parameters = new List<ReportParameter>();
            parameters.Add(new ReportParameter("operatorName", base.OperatorName));

            parameters.Add(new ReportParameter("FromDate", from.ToString("dd-MMM-yyyy")));
            parameters.Add(new ReportParameter("ToDate", from.ToString("dd-MMM-yyyy")));

            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + reportdocPath;
            reportViewer.LocalReport.SetParameters(parameters);
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("Schedules", data));
            reportViewer.LocalReport.Refresh();

            return new FileStreamResult(Helper.CreateMemoryStream(reportViewer, "PDF"), "application/pdf");
        }

        public ActionResult TherapistWisePreview(DateTime from, DateTime to, int therapistId = 0)
        {
            DataTable data = new DataTable();
            var reportdocPath = @"\ReportFile\ScheduleTherapistWise.rdl";

            data = ptSchedule.GetTherapistWiseReport(from, to.AddDays(1), therapistId);

            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;

            List<ReportParameter> parameters = new List<ReportParameter>();
            parameters.Add(new ReportParameter("operatorName", base.OperatorName));

            parameters.Add(new ReportParameter("FromDate", from.ToString("dd-MMM-yyyy")));
            parameters.Add(new ReportParameter("ToDate", from.ToString("dd-MMM-yyyy")));

            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + reportdocPath;
            reportViewer.LocalReport.SetParameters(parameters);
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("Schedules", data));
            reportViewer.LocalReport.Refresh();

            return new FileStreamResult(Helper.CreateMemoryStream(reportViewer, "PDF"), "application/pdf");
        }

    }
}
