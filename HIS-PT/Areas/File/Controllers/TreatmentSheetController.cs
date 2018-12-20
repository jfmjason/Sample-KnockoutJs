using DataLayer.Data;
using HIS.Controllers;
using HIS_PT.Areas.File.ViewModels;
using HIS_PT.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer.Model;
using Microsoft.Reporting.WebForms;

namespace HIS_PT.Areas.File.Controllers
{
    public class TreatmentSheetController : BaseController
    {

        PTEmployeeDB ptEmployeeDB = new PTEmployeeDB();
        PTProcedureDB ptProcedureDB = new PTProcedureDB();
        PatientDB patientDB = new PatientDB();
        SexDB sexDB = new SexDB();
        CountryDB countryDB = new CountryDB();
        AgeTypeDB ageTypeDB = new AgeTypeDB();
        EmployeeDB employeeDB = new EmployeeDB();
        CityDB cityDB = new CityDB();
        PTTreatmentDB ptTreatmentDB = new PTTreatmentDB();

        [IsSGHFeatureAuthorized(mFeatureID = "2334")]
        public ActionResult Index()
        {
            var currentDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
            var viewmodel = new PTTreatmentViewModel()
            {
                Treatments =  ptTreatmentDB.getTreatments(currentDate, currentDate.AddDays(1), -1,0),
               
                Therapist = ptEmployeeDB.getEmployeeByType((int)Enumerations.PTEmpoyeeType.THERAPIST),

                Operator = base.OperatorName,
                OperatorId = base.OperatorId,
                BookingDate = DateTime.Now.ToString("dd-MMM-yyyy"),
                Sex = sexDB.getSex(),
                AgeTypes = ageTypeDB.getAgeTypes(),
                Countries = countryDB.getCountries(),
                Cities = cityDB.getCities()

            };
            return View(viewmodel);
           
        }

        [HttpPost]
        public JsonResult AddTreatment(PTTreatmentSheet treatment)
        {
            var id = 0;
            var message = "";

            try{
                treatment.OperatorId = base.OperatorId;
                 
                id = ptTreatmentDB.Save(treatment);
                message = "New Treatment Sheet Saved";
            }catch {
                message = "An error occur please contact IT Operator";
            }

            return Json(new { id = id, message = message, operatorname = base.OperatorName }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult UpdateTreatment(PTTreatmentSheet treatment)
        {
            var id = 0;
            var message = "";

            try
            {
                treatment.OperatorId = base.OperatorId;

                id = ptTreatmentDB.Update(treatment);
                message = "Treatment Sheet Updated";
            }
            catch
            {
                message = "An error occur please contact IT Operator";
            }

            return Json(new { id = id, message = message, operatorname = base.OperatorName }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult PrintTreatmentSheet(int id)
        {

            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            List<ReportParameter> parameters = new List<ReportParameter>();
            parameters.Add(new ReportParameter("operatorName", base.OperatorName));

            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"\ReportFile\TreatmentSheet.rdl";
            reportViewer.LocalReport.SetParameters(parameters);
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("Treatment", ptTreatmentDB.GetTreatmentPrintView(id)));
            reportViewer.LocalReport.Refresh();

            return new FileStreamResult(Helper.CreateMemoryStream(reportViewer, "PDF"), "application/pdf"); 
        }

        public JsonResult GetPatient(int regNo = 0)
        {
            return Json(patientDB.getPatientsByRegNo(regNo), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInpatients()
        {
            return Json(patientDB.getInpatients(), JsonRequestBehavior.AllowGet);
        }

          public JsonResult GetInpatientDetails(int ipid = 0)
        {
            return Json(patientDB.getInPatientDetails(ipid), JsonRequestBehavior.AllowGet);
        }

          public JsonResult GetPTTreatments(DateTime from, DateTime to, int patienttype, int pin = 0)
          {
              return Json(ptTreatmentDB.getTreatments(from, to.AddDays(1), patienttype, pin), JsonRequestBehavior.AllowGet);
          }


          public JsonResult GetPTTreatmentById(int id)
          {
              return Json(ptTreatmentDB.getTreatmentById(id), JsonRequestBehavior.AllowGet);
          }



          public JsonResult searchPatientPin(string searchString)
          {
              return Json(patientDB.searchPatientsByRegNo(searchString), JsonRequestBehavior.AllowGet);
          }

        public JsonResult SearchPatient(string firstName,
                                       string lastName,
                                       string middleName,
                                       string familyName,
                                       string fatherName,
                                       string fromDate,
                                       string toDate,
                                       int age = 0,
                                       int ageType = 0,
                                       int city = 0,
                                       int country = 0,
                                       int sex = 0)
        {



            return Json(patientDB.getPatients(0, firstName, lastName, middleName, familyName, fatherName, fromDate, toDate, age, ageType, city, country, sex), JsonRequestBehavior.AllowGet);

        }
    }
  
}
