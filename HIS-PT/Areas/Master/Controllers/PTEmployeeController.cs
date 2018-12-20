using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HIS.Controllers;
using HIS_PT.Areas.Master.ViewModels;
using DataLayer.Data;
using DataLayer.Model;
using HIS_PT.Common;

namespace HIS_PT.Areas.Master.Controllers
{
    public class PTEmployeeController : BaseController
    {
        PTEmployeeDB ptemployeeDB = new PTEmployeeDB();
        EmployeeDB employeeDB = new EmployeeDB();

        [IsSGHFeatureAuthorized(mFeatureID = "2338")]
        public ActionResult Index()
        {
            var model = new PTEmployeeViewModel()
            {
                Nurses = ptemployeeDB.getEmployeeByType(4).OrderBy(i => i.Name).ToList(),
                Technicians = ptemployeeDB.getEmployeeByType(3).OrderBy(i => i.Name).ToList(),
                Physiotherapist = ptemployeeDB.getEmployeeByType(2).OrderBy(i=>i.Name).ToList()
            };
            return View(model);
        }


        public JsonResult GetPTEmployee(int type)
        {
            return Json(ptemployeeDB.getEmployeeByType(type), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SearchEmployee(string term)
        {
            return Json(employeeDB.findEmployee(term), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Add(int employeeId, int type)
        {
          
            int returnid = 0;
            var message = "";
            try
            {
                if (!ptemployeeDB.isExisting(employeeId, type))
                {
                    returnid = ptemployeeDB.Save(employeeId, type);
                    message = "Data saved";
                }
                else
                {
                    message = "Already exist";
                }
            }
            catch {
                    message = "An error occur please contact IT Operator";
            }

            return Json(new { returnid = returnid, message=message }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Remove(int employeeId, int type)
        {
            int returnid = 0;
            var message = "";
            try
            {
                    returnid = ptemployeeDB.Delete(employeeId, type);
                    message = "Data deleted";
            }
            catch
            {
                message = "An error occur please contact IT Operator";
            }

            return Json(new { returnid = returnid, message = message }, JsonRequestBehavior.AllowGet);
        }


    }
}
