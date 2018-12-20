using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer.Model;

namespace HIS_PT.Areas.File.ViewModels
{
    public class PTScheduleViewModel
    {
        public List<PTScheduleDisplay> Schedules { get; set; }

        public List<Employee> Therapist { get; set; }
        public List<Employee> Doctors { get; set; }
        public List<Employee> Technicians { get; set; }
        public List<Employee> Nurses { get; set; }
        public List<PTProcedure> Procedures { get; set; }
        public List<City> Cities { get; set; }
        public List<Sex> Sex { get; set; }
        public List<Country> Countries { get; set; }
        public List<AgeType> AgeTypes { get; set; }


        public string Operator    { get; set; }
        public int OperatorId  { get; set; }
        public string BookingDate { get; set; }
    }
}