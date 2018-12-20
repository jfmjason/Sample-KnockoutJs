using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HIS_PT.Areas.Report.ViewModels
{
    public class ProcedureReportViewModel
    {
        public List<Inpatient> Inpatients       { get; set; }
        public List<Employee> PTTherapist       { get; set; }
        public List<PTProcedure> PTProcedure    { get; set; }


    }
}