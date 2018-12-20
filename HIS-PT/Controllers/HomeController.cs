using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using DataLayer;
using HIS.Controllers;

namespace HIS_PT.Controllers
{
    [Authorize]
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult ChangeStation(int stationId)
        {
            this.StationId = stationId;
            var result = new { };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public PartialViewResult GetMenu()
        {
            ApplicationVersionModel apps = new ApplicationVersionModel();
            ApplicationGlobal glob = new ApplicationGlobal();
            glob.UserID = this.OperatorId.ToString();
            List<ApplicationMenuModel> menu = glob.GetApplicationMenu();
            return PartialView("_Menu", menu ?? new List<ApplicationMenuModel>());
        }
        public JsonResult GetApplicationIssue()
        {
            ApplicationGlobal glob = new ApplicationGlobal();
            glob.UserID = this.OperatorId.ToString();
            List<ApplicationIssueModel> iss = glob.GetApplicationIssueDAL();
            return Json(iss, JsonRequestBehavior.AllowGet);
        }

        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Index");
        }


    }
}
