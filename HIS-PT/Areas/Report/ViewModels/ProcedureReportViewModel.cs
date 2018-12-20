using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HIS_PT.Areas.Report.ViewModels
{
    public class OrderRefferedReportViewModel
    {
        public List<Inpatient> Inpatients       { get; set; }
        public List<Employee> Doctors       { get; set; }
        public List<PTProcedure> PTProcedure    { get; set; }


    }
}