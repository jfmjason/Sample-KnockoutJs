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


namespace HIS_PT.Areas.File.Controllers
{
    public class OrderController : BaseController
    {
        PTScheduleDB ptScheduleDB = new PTScheduleDB();
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


        //[IsSGHFeatureAuthorized(mFeatureID = "2335")]
        public ActionResult Index()
        {
            var currentDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day);
            var viewmodel = new RHOrderDisplayViewModel()
            {
                Orders = rhOrderDB.getRHOrder(currentDate, currentDate.AddDays(1), 0,0),
                Doctors = employeeDB.getDoctors(),
                Technicians = ptEmployeeDB.getEmployeeByType((int)Enumerations.PTEmpoyeeType.TECHNICIAN),
                Nurses = ptEmployeeDB.getEmployeeByType((int)Enumerations.PTEmpoyeeType.NURSE),
                Therapist = ptEmployeeDB.getEmployeeByType((int)Enumerations.PTEmpoyeeType.THERAPIST),
                Procedures = ptProcedureDB.getProcedures(),
                Operator = base.OperatorName,
                OperatorId = base.OperatorId,
                From    = currentDate,
                To      = currentDate,
                Sex = sexDB.getSex(),
                AgeTypes = ageTypeDB.getAgeTypes(),
                Countries = countryDB.getCountries(),
                Cities = cityDB.getCities()
            };
            return View(viewmodel);
        }

        [HttpPost]
        public JsonResult Create(RHOrder rhOrder, int[] therapist, int[] technicians, int[] nurses, List<PTProcedure> procedures, int ptscheduleid = 0)
        {
            var id = 0;
            var message = "Unable to create new order please contact IT Operator";

            var jsonStrProcedures = Newtonsoft.Json.JsonConvert.SerializeObject(procedures);
            var jsonStrPhysiotherapist = Newtonsoft.Json.JsonConvert.SerializeObject(therapist);
            var jsonStrTechnicians = Newtonsoft.Json.JsonConvert.SerializeObject(technicians);
            var jsonStrNurses = Newtonsoft.Json.JsonConvert.SerializeObject(nurses);

            jsonStrPhysiotherapist = jsonStrPhysiotherapist == "null" ? "[]" : jsonStrPhysiotherapist;
            jsonStrTechnicians = jsonStrTechnicians == "null" ? "[]" : jsonStrTechnicians;
            jsonStrNurses = jsonStrNurses == "null" ? "[]" : jsonStrNurses;

            rhOrder.OperatorId = base.OperatorId;

            if (rhOrderDB.hasConflict(rhOrder.ProcedureStartdateTime,
                                    rhOrder.ProcedureEnddateTime,
                                    rhOrder.IPIDOPID,
                                    rhOrder.PatientType, null))
            {
                message = "Conflict procedure time. Please choose another time range";
            }
            else
            {
                id = rhOrderDB.Save(rhOrder, jsonStrProcedures, jsonStrPhysiotherapist, jsonStrTechnicians, jsonStrNurses, ptscheduleid);
                message = "New order has been saved";
            }
           

            return Json(new { retid = id, message = message }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(RHOrder rhOrder)
        {
            var id = 0;
            var message = "Unable to update please contact IT Operator";



            rhOrder.OperatorId = base.OperatorId;

            try
            {
                id = rhOrderDB.Update(rhOrder);
                message = "Order updated";
            }
            catch (Exception e){
                //message = e.InnerException.ToString();
            }

            return Json(new { retid = id, message = message }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Cancel(int orderid)
        {
            var id = 0;
            var message = "";

            try
            {
                id = rhOrderDB.Cancel(orderid, base.OperatorId);
                message = "Order cancelled";
            }
            catch (Exception e)
            {
                message = "Unable to cancel please contact IT Operator";
            }

            return Json(new { retid = id, message = message }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult getRHOrders(DateTime from, DateTime to, int patienttype = 0, int pin = 0)
        {

            return Json(rhOrderDB.getRHOrder(from, to.AddDays(1), patienttype, pin), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPTSDoctor(int schedId = 0)
        {
            return Json(ptScheduleDB.getPTSDoctor(schedId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPTSTechnician(int schedId = 0)
        {
           
            return Json(ptScheduleDB.getPTSTechnician(schedId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getRHOrderById(int Id)
        {
            return Json(rhOrderDB.getRHOrderById(Id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getRHOrderNurse(int orderId)
        {
           
            var data = rhOrderDetailDB.getStaffDetails((int)Enumerations.PTRHOrderDetailType.NURSE, orderId);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getRHOrderTherapist(int orderId)
        {

            var data = rhOrderDetailDB.getStaffDetails((int)Enumerations.PTRHOrderDetailType.THERAPIST, orderId);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getRHOrderTechnicians(int orderId)
        {

            var data = rhOrderDetailDB.getStaffDetails((int)Enumerations.PTRHOrderDetailType.TECHNICIAN, orderId);
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getRHOrderProcedures(int orderId)
        {
       
            var data = rhOrderDetailDB.getOrderProcedures((int)Enumerations.PTRHOrderDetailType.PROCEDURE, orderId);
            return Json(data, JsonRequestBehavior.AllowGet);
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

        public JsonResult searchPatientPin(string searchString)
        {
            return Json(patientDB.searchPatientsByRegNo(searchString), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPatient(int regNo = 0)
        {
            return Json(patientDB.getPatientsByRegNo(regNo), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInpatients()
        {
            return Json(patientDB.getInpatients(), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getPTSchedIds(int ipopid = 0, int patienttype = 0)
        {
            //patient type op is 0 in rhorder and 2 in ptschedule
            return Json(ptScheduleDB.getPTScheduleIds(ipopid, patienttype == 0 ? 2 : patienttype), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetInpatientDetails(int ipid = 0)
        {
            return Json(patientDB.getInPatientDetails(ipid), JsonRequestBehavior.AllowGet);
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
