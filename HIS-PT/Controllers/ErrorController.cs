using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HIS_XRYRECPT.Controllers
{
    public class ErrorController : Controller
    {
        //
        // GET: /Error/

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Unauthorised()
        {

            if(System.Web.HttpContext.Current.Session["ErrorMessage"] != null)
            {
                ViewBag.ErrorMessage = System.Web.HttpContext.Current.Session["ErrorMessage"].ToString();
                System.Web.HttpContext.Current.Session.Remove("ErrorMessage");
            }
            return View();
        }
    }
}
