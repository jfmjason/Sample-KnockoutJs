using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer.Model;

namespace HIS_PT.Areas.File.ViewModels
{
    public class PTTreatmentViewModel
    {
        public List<PTTreatmentDislay> Treatments { get; set; }

        public List<Employee> Therapist { get; set; }
        public List<City> Cities { get; set; }
        public List<Sex> Sex { get; set; }
        public List<Country> Countries { get; set; }
        public List<AgeType> AgeTypes { get; set; }
       
        public string Operator    { get; set; }
        public int OperatorId  { get; set; }
        public string BookingDate { get; set; }
    }
}