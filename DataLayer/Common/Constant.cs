using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
namespace DataLayer
{
  
    public static class Errors
    {

        public static string ExemptionMessage(Exception ex)
        {
            return "Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace;
        }

        public static string ReportContent(string msg)
        {
            return "<center><h2 style='color:white; margin-top:10%;color:#E6E7E8'>" + msg + "</h2></center>";
        }

        public static string ReportContent(string msg, string htmlAttribute)
        {
            return "<center><h2 " + htmlAttribute + ">" + msg + "</h2></center>";
        }

       
    }

    public static class Constant
    {
        public static int AvailablePhysiotherapistCount = 5;
    }
}
