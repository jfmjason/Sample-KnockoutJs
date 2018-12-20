using HIS_PT.Areas.Master.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DataLayer.Data;
using HIS.Controllers;

namespace HIS_PT.Areas.Master.Controllers
{
    public class PhysioExamController : BaseController
    {
        M_PhysioExaminationDB m_physioexamDB = new M_PhysioExaminationDB();
        PhysioExaminationDB physioeamDB = new PhysioExaminationDB();

        [IsSGHFeatureAuthorized(mFeatureID = "2336")]
        public ActionResult Index()
        {
            var model = new PhysioExamViewModel()
            {
                MPhysioExaminations = m_physioexamDB.getList(),

                JStreeData = physioeamDB.getJSTreeItems(0)
            };
            return View(model);
        }

        public ActionResult GetJSTree(int tabId = 0)
        {
            return Json(physioeamDB.getJSTreeItems(tabId), JsonRequestBehavior.AllowGet);
        }

    }
}
