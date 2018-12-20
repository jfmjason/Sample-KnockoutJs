using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer.Model;
namespace HIS_PT.Areas.Master.ViewModels
{
    public class ICDParameterViewModel
    {
        public List<M_PhysioExamination> MPhysioExaminations { get; set; }

        public List<PhysioICDDisplay> PhysioICDS { get; set; }

        public List<JSTreeItem> JStreeData { get; set; }
     
    }
}