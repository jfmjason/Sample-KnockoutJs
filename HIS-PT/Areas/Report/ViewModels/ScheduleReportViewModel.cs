using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HIS_PT.Areas.Report.ViewModels
{
    public class ScheduleReportViewModel
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }

        public List<Station> Wards { get; set; }

        public List<Employee> Therapist       { get; set; }
    
    }
}