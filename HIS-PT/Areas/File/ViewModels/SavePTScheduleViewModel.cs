using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer.Model;

namespace HIS_PT.Areas.File.ViewModels
{
    public class SavePTScheduleViewModel:PTSchedule 
    {
        public List<int> PTSTechnicians { get; set; }
        public List<int> PTSNurses { get; set; }
        public List<int> PTSProcedures { get; set; }
        public List<int> PTSPhysiotherapist { get; set; }
    }
}