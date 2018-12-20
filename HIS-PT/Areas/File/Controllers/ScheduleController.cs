using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer.Data;
using DataLayer.Model;
using HIS_PT.Areas.File.ViewModels;
using HIS_PT.Common;
using HIS.Controllers;

namespace HIS_PT.Areas.File.Controllers
{
    public class ScheduleController : BaseController
    {
        PTScheduleDB ptScheduleDB   = new PTScheduleDB();
        PTEmployeeDB ptEmployeeDB   = new PTEmployeeDB();
        PTProcedureDB ptProcedureDB = new PTProcedureDB();
        PatientDB patientDB         = new PatientDB();
        SexDB sexDB                 = new SexDB();
        CountryDB countryDB         = new CountryDB();
        AgeTypeDB ageTypeDB         = new AgeTypeDB();
        CityDB cityDB               = new CityDB();
        EmployeeDB employeeDB       = new EmployeeDB();

        //[IsSGHFeatureAuthorized(mFeatureID = "2332")]
        public ActionResult Index()
        {
            var currentDate = new DateTime(DateTime.Now.Year,DateTime.Now.Month,DateTime.Now.Day);
            var viewmodel = new PTScheduleViewModel()
            {
                //Schedules = ptScheduleDB.getPTSchedule(currentDate, currentDate.AddDays(1), 0, 0),
                Schedules = new List<PTScheduleDisplay>(),
                Doctors     = ptEmployeeDB.getPTDoctors(),
                Technicians = ptEmployeeDB.getEmployeeByType((int)Enumerations.PTEmpoyeeType.TECHNICIAN),
                Nurses      = ptEmployeeDB.getEmployeeByType((int)Enumerations.PTEmpoyeeType.NURSE),
                Therapist   = ptEmployeeDB.getEmployeeByType((int)Enumerations.PTEmpoyeeType.THERAPIST),
                Procedures = ptProcedureDB.getProcedures(),
                Operator    = base.OperatorName,
                OperatorId  = base.OperatorId,
                BookingDate = DateTime.Now.ToString("dd-MMM-yyyy"),
                Sex         = sexDB.getSex(),
                AgeTypes    = ageTypeDB.getAgeTypes(),
                Countries   = countryDB.getCountries(),
                Cities      = cityDB.getCities()
                                  
            };
            return View(viewmodel);
        }

        [IsSGHFeatureAuthorized(mFeatureID = "2333")]
        public ActionResult Multiple()
        {
            var currentDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
            var viewmodel = new PTScheduleViewModel()
            {
                Doctors = ptEmployeeDB.getPTDoctors(),
                Therapist = ptEmployeeDB.getEmployeeByType((int)Enumerations.PTEmpoyeeType.THERAPIST),
                Procedures = ptProcedureDB.getProcedures().OrderBy(i=>i.Text).ToList() ,
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
        public ActionResult Index(DateTime currentDate, int patientType ,int therapistId =0)
        {
            var schedules = new List<PTScheduleDisplay>();
            schedules = ptScheduleDB.getPTSchedule(currentDate, currentDate.AddDays(1), therapistId ,patientType);

            return Json(schedules, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult searchSchedule(int regNo = 0)
        {
            var schedules = new List<PTScheduleDisplay>();
            schedules = ptScheduleDB.searchPTSchedule(regNo);

            return Json(schedules, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Save(SavePTScheduleViewModel saveModel)
        {
            var id = 0;
            var message = "";
            if(saveModel.FromDateTime <  DateTime.Now)
            {
              message = "Procedure start time must greeter than the current time";
            }
            else if(ptScheduleDB.hasConflictSchedule(saveModel.FromDateTime, saveModel.ToDatetime,saveModel.TherapistId, null)){
              message = "Conflict schedule. Please choose another time slot";
            }else{

              
                var jsonStrPTSProcedures = Newtonsoft.Json.JsonConvert.SerializeObject(saveModel.PTSProcedures);
                var jsonStrPTSPhysiotherapist = Newtonsoft.Json.JsonConvert.SerializeObject(saveModel.PTSPhysiotherapist);
                    jsonStrPTSPhysiotherapist = jsonStrPTSPhysiotherapist == "null" ? "[]" : jsonStrPTSPhysiotherapist;
                var jsonStrPTSTechnicians = Newtonsoft.Json.JsonConvert.SerializeObject(saveModel.PTSTechnicians);
                    jsonStrPTSTechnicians = jsonStrPTSTechnicians == "null" ? "[]" : jsonStrPTSTechnicians;
                var jsonStrPTSNurses = Newtonsoft.Json.JsonConvert.SerializeObject(saveModel.PTSNurses);
                    jsonStrPTSNurses = jsonStrPTSNurses == "null" ? "[]" : jsonStrPTSNurses;

                var newAppointment = new PTSchedule(){
                    
                    FromDateTime        = saveModel.FromDateTime,
                    ToDatetime          = saveModel.ToDatetime,
                    ReservedConfirmed   = saveModel.ReservedConfirmed,
	                Age                 = saveModel.Age,
	                Sex                 = saveModel.Sex,
	                PatientType         = saveModel.PatientType,
	                IPIDOPID            = saveModel.IPIDOPID,
	                AgeType             = saveModel.AgeType,
	                DoctorId            = saveModel.DoctorId,
                    OperatorId          = base.OperatorId,
                    TherapistId         = saveModel.TherapistId,
    
	                Remarks             = saveModel.Remarks,
	                PatientName         = saveModel.PatientName

                };


                 id = ptScheduleDB.Save(newAppointment, jsonStrPTSProcedures, jsonStrPTSPhysiotherapist, jsonStrPTSTechnicians, jsonStrPTSNurses);

                  message = "Data saved";
            }

            return Json(new { status = id, message = message }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult MultipleSave(PTSchedule schedule, string jsonTimeSlots, string jsonProcedures)
        {
            var message = "";
            var id = 0;

             schedule.OperatorId = base.OperatorId;

            try{

                id = ptScheduleDB.MultipleSave(schedule , jsonProcedures, jsonTimeSlots);

                message = "Data saved";
            }catch(Exception e){
                message = e.Message;
            }

            return Json(new { returnid = id, message = message }, JsonRequestBehavior.AllowGet);

           
        }




        [HttpPost]
        public ActionResult Update(SavePTScheduleViewModel updateModel)
        {
            var id = 0;
            var message = "";
           
            if (ptScheduleDB.hasConflictSchedule(updateModel.FromDateTime, updateModel.ToDatetime,updateModel.TherapistId, updateModel.Id))
            {
                message = "Conflict schedule. Please choose another time slot";
            }
            else
            {


                var jsonStrPTSProcedures = Newtonsoft.Json.JsonConvert.SerializeObject(updateModel.PTSProcedures);
                var jsonStrPTSPhysiotherapist = Newtonsoft.Json.JsonConvert.SerializeObject(updateModel.PTSPhysiotherapist);
                jsonStrPTSPhysiotherapist = jsonStrPTSPhysiotherapist == "null" ? "[]" : jsonStrPTSPhysiotherapist;
                var jsonStrPTSTechnicians = Newtonsoft.Json.JsonConvert.SerializeObject(updateModel.PTSTechnicians);
                jsonStrPTSTechnicians = jsonStrPTSTechnicians == "null" ? "[]" : jsonStrPTSTechnicians;
                var jsonStrPTSNurses = Newtonsoft.Json.JsonConvert.SerializeObject(updateModel.PTSNurses);
                jsonStrPTSNurses = jsonStrPTSNurses == "null" ? "[]" : jsonStrPTSNurses;

                var newAppointment = new PTSchedule()
                {
                    Id                  = updateModel.Id,
                    FromDateTime        = updateModel.FromDateTime,
                    ToDatetime          = updateModel.ToDatetime,
                    ReservedConfirmed   = updateModel.ReservedConfirmed,
                    Age                 = updateModel.Age,
                    Sex                 = updateModel.Sex,
                    PatientType         = updateModel.PatientType,
                    IPIDOPID            = updateModel.IPIDOPID,
                    AgeType             = updateModel.AgeType,
                    DoctorId            = updateModel.DoctorId,
                    OperatorId          = base.OperatorId,
                    TherapistId         = updateModel.TherapistId,

                    Remarks             = updateModel.Remarks,
                    PatientName         = updateModel.PatientName

                };


                id = ptScheduleDB.Update(newAppointment, jsonStrPTSProcedures, jsonStrPTSPhysiotherapist, jsonStrPTSTechnicians, jsonStrPTSNurses);

                message = "Data updated";
            }

            return Json(new { status = id, message = message }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Cancel(int Id)
        {
            var affectdId = 0;
            var message = "Unable to delete record. Please Contact IT";

            affectdId = ptScheduleDB.Delete(Id);
            if (affectdId > 0)
            {
                message = "Record deleted";
            }
               
         return Json(new { status = affectdId, message = message }, JsonRequestBehavior.AllowGet);

        }


        public JsonResult HasConflictSchedule(DateTime from , DateTime to, int therapistId)
        {
         return Json(ptScheduleDB.hasConflictSchedule(from, to, therapistId, null), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInpatients()
        {
            return Json(patientDB.getInpatients(),JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInpatientDetails(int ipid = 0)
        {
            return Json(patientDB.getInPatientDetails(ipid), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPTScheduleRequest(DateTime from)
        {
            return Json(ptScheduleDB.getPTScheduleRequest(from, from.AddDays(1)), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getEmployee(int id)
        {
            return Json(employeeDB.getEmployeeById(id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPatient(int regNo =0)
        {
            return Json(patientDB.getPatientsByRegNo(regNo), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPTSDoctor(int schedId = 0)
        {
            return Json(ptScheduleDB.getPTSDoctor(schedId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPTSTechnician(int schedId = 0)
        {
            return Json(ptScheduleDB.getPTSTechnician(schedId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPTSPhysiotherapist(int schedId = 0)
        {
            return Json(ptScheduleDB.getPTSPhysiotherapist(schedId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPTSNurse(int schedId = 0)
        {
            return Json(ptScheduleDB.getPTSNurse(schedId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPTSProcedure(int schedId = 0)
        {
            var data = ptScheduleDB.getPTSProcedure(schedId);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPTSchedule(int schedId)
        {
            return Json(ptScheduleDB.getPTSchedule(schedId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SearchPatient(string firstName,
                                        string lastName,
                                        string middleName,
                                        string familyName,
                                        string fatherName,
                                        string fromDate,
                                        string toDate,
                                        int age=0,
                                        int ageType=0,
                                        int city=0,
                                        int country=0,
                                        int sex = 0)
        {

           

            return Json(patientDB.getPatients(0, firstName, lastName, middleName, familyName, fatherName, fromDate, toDate, age, ageType, city, country, sex), JsonRequestBehavior.AllowGet);
        
        }

        public JsonResult searchPatientPin(string searchString)
        {
            return Json(patientDB.searchPatientsByRegNo(searchString), JsonRequestBehavior.AllowGet);
        }

    }


}
