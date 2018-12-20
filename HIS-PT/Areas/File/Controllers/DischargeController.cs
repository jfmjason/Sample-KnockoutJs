using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HIS.Controllers;
using DataLayer.Data;
using HIS_PT.Areas.File.ViewModels;
using HIS_PT.Common;
using DataLayer.Model;
using Microsoft.Reporting.WebForms;

namespace HIS_PT.Areas.File.Controllers
{
    public class DischargeController :BaseController
    {
     
        PTEmployeeDB ptEmployeeDB = new PTEmployeeDB();
        PTProcedureDB ptProcedureDB = new PTProcedureDB();
        PatientDB patientDB = new PatientDB();
        SexDB sexDB = new SexDB();
        CountryDB countryDB = new CountryDB();
        AgeTypeDB ageTypeDB = new AgeTypeDB();
        EmployeeDB employeeDB = new EmployeeDB();
        RHOrderDB rhOrderDB = new RHOrderDB();
        CityDB cityDB = new CityDB();
        RHOrderDetailDB rhOrderDetailDB = new RHOrderDetailDB();
        PhysioExaminationDB physioexamDB = new PhysioExaminationDB();
        ICDDetailDB icdDetailDB = new ICDDetailDB();
        IPICDDetailDB ipIcdDetailDB = new IPICDDetailDB();
        PTDischargeDB ptDischargeDB = new PTDischargeDB();
        PhysioExaminationDetailDB ptexamdetail = new PhysioExaminationDetailDB();
        RHOrderDetailDB rhorderdetailDB = new RHOrderDetailDB();


        //[IsSGHFeatureAuthorized(mFeatureID = "2335")]
        public ActionResult Index()
        {
            
            var viewmodel = new PTDischargeDisplayViewModel()
            {
                Therapist = ptEmployeeDB.getEmployeeByType((int)Enumerations.PTEmpoyeeType.THERAPIST),
                Operator = base.OperatorName,
                OperatorId = base.OperatorId,

                Sex = sexDB.getSex(),
                AgeTypes = ageTypeDB.getAgeTypes(),
                Countries = countryDB.getCountries(),
                Cities = cityDB.getCities()
            };
            return View(viewmodel);
        }

        [HttpPost]
        public ActionResult AddSummary(PTDischarge discharge, string jsonStrExamination, string jsonStrRhOrderIds, string jsonStrClinicalVisitIds)
        {
            int returnId = 0;
            string message = "";

            try
            {
                discharge.DateOfAdmission = discharge.PatientType == 0 ? DateTime.Now : discharge.DateOfAdmission;

                discharge.OperatorId = base.OperatorId;
                returnId = ptDischargeDB.addDischarge(discharge, jsonStrExamination, jsonStrRhOrderIds, jsonStrClinicalVisitIds);
                message = "New Discharge Summary Saved";
            }
            catch(Exception e)
            {
                message = "Cannot save summary. Please Contact IT Operator";

                returnId = 0;
            }


            return Json(new {returnid=returnId, message= message}, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult UpdateSummary(PTDischarge discharge, string jsonStrExamination, string jsonStrRhOrderIds, string jsonStrClinicalVisitIds)
        {
            int returnId = 0;
            string message = "";

            try
            {
                discharge.OperatorId = base.OperatorId;
                returnId = ptDischargeDB.updateDischarge(discharge, jsonStrExamination, jsonStrRhOrderIds, jsonStrClinicalVisitIds);
                message = "Discharge Summary Updated";
            }
            catch (Exception e)
            {
                message = "Cannot update summary. Please Contact IT Operator";

                returnId = 0;
            }


            return Json(new { returnid = returnId, message = message }, JsonRequestBehavior.AllowGet);
        }


        public ActionResult PrintDischarge(int dischargeId)
        {

            ReportViewer reportViewer = new ReportViewer();
            reportViewer.ProcessingMode = ProcessingMode.Local;
            List<ReportParameter> parameters = new List<ReportParameter>();
            parameters.Add(new ReportParameter("operatorName", base.OperatorName));

            reportViewer.LocalReport.ReportPath = Request.MapPath(Request.ApplicationPath) + @"\ReportFile\PTDischarge.rdl";
            reportViewer.LocalReport.SetParameters(parameters);
            reportViewer.LocalReport.DataSources.Add(new ReportDataSource("Discharge", ptDischargeDB.getDischargePrintView(dischargeId)));
            reportViewer.LocalReport.Refresh();

            return new FileStreamResult(Helper.CreateMemoryStream(reportViewer, "PDF"), "application/pdf");
        }

        public JsonResult getRHOrderById(int Id)
        {
            return Json(rhOrderDB.getRHOrderById(Id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getRHOrderDetailProcedure(int ipidopid, int patienttype)
        {
            return Json(ptDischargeDB.getOrderedProcedure(ipidopid, patienttype),JsonRequestBehavior.AllowGet);
        }

        public JsonResult getDischargeOPProcedure(int ptdischargeid)
        {
            return Json(ptDischargeDB.getDischargeOpOrderedProcedure(ptdischargeid), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPatient(int regNo = 0)
        {
            return Json(patientDB.getPatientsByRegNo(regNo), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInpatients()
        {
            return Json(patientDB.getInpatients(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPhysioExam(int tabId, string icdidjsonarray, int dischargeid = 0)
        {

            var data = physioexamDB.getDischargePhysioExam(tabId, icdidjsonarray, dischargeid);

            var physioexam = new List<PhysioExamination>();

           var tabs = data.Where(i=>i.Parent == 0).ToList();
           var exam = data.Where(i => i.Parent > 0).ToList();

           var X = data.Where(c => c.Description != "").ToList();

            foreach (var tab in tabs ) {
                tab.Child = new List<PhysioExamination>();
                foreach (var group in exam)
                {
                    if (tab.Id == group.Parent)
                    {
                        group.Child = new List<PhysioExamination>();

                        foreach (var subgroup in exam)
                        {
                            if (group.Id == subgroup.Parent)
                            {
                                if (subgroup.Description.Trim() != "")
                                {
                                    string[] parts = subgroup.Description.Trim().Split(new string[] { "*\r\n" }, StringSplitOptions.None);

                                    for (var i = 0; parts.Count() > i;i++ )
                                    {
                                        string[] item  = parts[i].Split(new string[] { ":" }, StringSplitOptions.None);

                                        if (item[0].Trim() == subgroup.Name)
                                        {
                                            subgroup.Description = item[1].Trim().Replace("*","");
                                            break;
                                        }

                                    }

                                }
                           
                               group.Child.Add(subgroup);
                              
                            }
                        }
                        tab.Child.Add(group);
                    }
                }
                physioexam.Add(tab);
            }




            return Json(physioexam, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInpatientDetails(int ipid = 0)
        {
            return Json(patientDB.getInPatientDetails(ipid), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLatestIcdDescriptionOP(int regno = 0)
        {
            return Json(icdDetailDB.getOPNewICDDetails(regno), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetOPDischargeIcdDescription(int ptdischargeId = 0)
        {
            return Json(ptDischargeDB.getOPIcdDetails(ptdischargeId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetLatestIcdDescriptionIP(int ipid = 0)
        {
            return Json(ipIcdDetailDB.getLatestDetails(ipid), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPTDischarge(int ipopid = 0 , int patienttype = -1)
        {
            return Json(ptDischargeDB.getDischarge(ipopid,patienttype), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPTExaminationDetails(int ptdischargeid = 0)
        {
            return Json(ptexamdetail.getExaminationDetails(ptdischargeid), JsonRequestBehavior.AllowGet);
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
