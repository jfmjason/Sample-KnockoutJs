using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HIS.Controllers;
using HIS_PT.Areas.Master.ViewModels;
using DataLayer.Data;

namespace HIS_PT.Areas.Master.Controllers
{
    public class ICDParameterController : BaseController
    {
        M_PhysioExaminationDB m_physioexamDB = new M_PhysioExaminationDB();
        PhysioICDDB physioIcdDB = new PhysioICDDB();
        PhysioExaminationDB physioExamDB = new PhysioExaminationDB();
        ICD10DB icd10DB = new ICD10DB();

        //[IsSGHFeatureAuthorized(mFeatureID = "2337")]
        public ActionResult Index()
        {
            var model = new ICDParameterViewModel()
            {
                MPhysioExaminations = m_physioexamDB.getList(),
                PhysioICDS = physioIcdDB.getICDDisplay(0,0),
                JStreeData = physioIcdDB.getICDJSTreeItems()
            };
            return View(model);
        }

        [HttpPost]
        public ActionResult AddICD10(int tabid, string physioexamjson, string icd10json)
        {
            var id = 0;
            var message = "";

            try
            {
                id = physioIcdDB.SaveIcd(tabid, physioexamjson, icd10json, base.OperatorId);
                message = "ICD Saved";
            }
            catch (Exception e)
            {
                message = "Unable to save new ICD Please Contact IT Operator";
            }

            return Json(new { retid = id, message = message }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult UpdateICD10(int tabid, string physioexamjson, string icd10json)
        {
            var id = 0;
            var message = "";

            try
            {
                id = physioIcdDB.Update(tabid, physioexamjson, icd10json, base.OperatorId);
                message = "ICD Code Updated";
            }
            catch (Exception e)
            {
                message = "Unable to update this ICD Code Please Contact IT Operator";
            }

            return Json(new { retid = id, message = message }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult DeleteICD10(int tabid, int physioexamid, int icdid)
        {
            var id = 0;
            var message = "";

            try
            {
                id = physioIcdDB.Delete(tabid, physioexamid, icdid, base.OperatorId);
                message = "ICD Deleted";
            }
            catch (Exception e)
            {
                message = "Unable to Delete ICD Please Contact IT Operator";
            }

            return Json(new { retid = id, message = message }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetPhysioICDS(int tabid = 0, int examid=0)
        {

            return Json(physioIcdDB.getICDDisplay(tabid, examid), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetPhysioExam(int tabid = 0)
        {

            return Json(physioExamDB.getExamByTabId(tabid), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetConfiguredPhysioExams(int icdid, int tabid )
        {

            return Json(physioIcdDB.getConfiguredPhysioExam(icdid, tabid), JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetICD4and3(int parentid)
        {
            return Json(physioIcdDB.getICD3And4JSTreeItems(parentid), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetICD10ByCode(string code)
        {
            return Json(icd10DB.getCodeByCode(code), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetICD10ByDescription(string desc)
        {
            return Json(icd10DB.getCodeByDescription(desc), JsonRequestBehavior.AllowGet);
        }
    }
}
