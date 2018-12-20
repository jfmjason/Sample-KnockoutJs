using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class PTDischarge
    {

         public int Id          {get;set;}
         public int TherapistId {get;set;}
         public int PatientType {get;set;}
         public int OperatorId  {get;set;}
         public int IPIDOPID    {get;set;}

         public DateTime OrderdateTime {get;set;}
         public DateTime DateOfAdmission {get;set;}
         public DateTime DateOfDischarge {get;set;}
       
    }
}
