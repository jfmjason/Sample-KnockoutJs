using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
   public class DoctorVisit
    {
       public int Id { get; set; }
       public int DoctorId { get; set; }
       public DateTime VisitDateTime { get; set; }
       public string EmpCode { get; set; }
    }
}
