using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
   public class Employee
    {
        public int Id { get; set; }
        [Display(Name = "Employee")]
        public string Name { get; set; }
        public string EmployeeId { get; set; }
        public string Empcode { get; set; }
        public string DesignitionId { get; set; }
        [Display(Name="Designition / Position")]
        public string DesignitionDesc { get; set; }

        public string Text { get; set; }
    }
}
