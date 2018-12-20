using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer.Model;
namespace HIS_PT.Areas.Master.ViewModels
{
    public class PhysioExamViewModel
    {
        public List<M_PhysioExamination> MPhysioExaminations { get; set; }

        public List<JSTreeItem> JStreeData { get; set; }
     
    }
}