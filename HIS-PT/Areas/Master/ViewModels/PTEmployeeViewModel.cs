using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer.Model;

namespace HIS_PT.Areas.Master.ViewModels
{
    public class PTEmployeeViewModel
    {
        public List<Employee> Technicians { get; set; }

        public List<Employee> Nurses { get; set; }

        public List<Employee> Physiotherapist { get; set; }

    }
}