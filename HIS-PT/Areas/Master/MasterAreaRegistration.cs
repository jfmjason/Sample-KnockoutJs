using System.Web.Mvc;

namespace HIS_PT.Areas.Master
{
    public class MasterAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Master";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Master_default",
                "Master/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
