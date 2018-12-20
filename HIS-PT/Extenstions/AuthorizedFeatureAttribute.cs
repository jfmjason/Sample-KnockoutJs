using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using DataLayer.Model;
using DataLayer;
using Newtonsoft.Json;
using System.Web.Security;
using DataLayer.Data;
using Newtonsoft.Json.Linq;
using HIS_XRYRECPT.Models;


namespace HIS_XRYRECPT.Extenstions
{

    public class AuthorizedFeatureAttribute : AuthorizeAttribute
    {
        XrayReceptionDAL dal = new XrayReceptionDAL();


        public int    FeatureId    { get; set; }

        public string ErrorMessage { get; set; }
        public string FeatureName { get; set; }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {

            //var featuresAccess = (List<ModuleAccessModel>)System.Web.HttpContext.Current.Session["FeatureAccess"];
         

           var isAuthorized = base.AuthorizeCore(httpContext);
            if (!isAuthorized)
            {
                return false;
            }

            if (System.Web.HttpContext.Current.Session.Contents["AuthorizationAttributeParam"] != null)
            {
                var param = (AuthorizeAttributeParam)System.Web.HttpContext.Current.Session.Contents["AuthorizationAttributeParam"];

                var featuresAccess = dal.getModuleAccessFeature(param.ModuleId, param.UserId);

                if (featuresAccess.Count() > 0)
                {
                    if (featuresAccess.Any(i => (i.FeatureName == this.FeatureName || i.FeatureId == this.FeatureId) && i.HasAccess == true))
                        return true;
                    else
                        return false;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return true;
            }
        }

        protected override void HandleUnauthorizedRequest(System.Web.Mvc.AuthorizationContext filterContext)
        {
            if (filterContext.RequestContext.HttpContext.Request.IsAjaxRequest())
            {
                var urlHelper = new UrlHelper(filterContext.RequestContext);
                filterContext.HttpContext.Response.StatusCode = 403;
                filterContext.Result = new JsonResult
                {
                    Data = new
                    {
                        Error = "NotAuthorized",
                        Message = this.ErrorMessage
                    },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }
            else
            {
                filterContext.Result = new RedirectToRouteResult(
                                        new RouteValueDictionary(
                                            new
                                            {
                                                controller = "Error",
                                                action = "Unauthorised",
                                                area = ""

                                            })
                                          );
                HttpContext.Current.Session["ErrorMessage"] = this.ErrorMessage;
            }

        }

    }
}