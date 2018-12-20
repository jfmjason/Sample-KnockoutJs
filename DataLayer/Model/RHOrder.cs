using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
   public class RHOrder
   {
       public int Id   { get; set; }
       public int DoctorId   { get; set; }
       public int ShiftingNurseId   { get; set; }
       public int OperatorId { get; set; }
       public int BedId { get; set; }
       public int PatientType { get; set; }
       public int IPIDOPID { get; set; }
      
       public DateTime ProcedureStartdateTime { get; set; }
       public DateTime ProcedureEnddateTime { get; set; }

       public string Remarks { get; set; }
       public string Diagnosis { get; set; }
       public string ReferredDoctor { get; set; }
       public string OpVisitNo { get; set; }
       public string Treatment { get; set; }
      

   }
}
