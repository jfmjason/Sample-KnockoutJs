﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
   public class RHOrderDisplay
   {
       public int SlNo { get; set; }
       public int Id   { get; set; }
       public int OperatorId { get; set; }
       public int PatientType { get; set; }
       public int IPIDOPID { get; set; }

       public string PIN { get; set; }
       public string PatientName { get; set; }
       public string OperatorName { get; set; }
       
       public DateTime ProcedureStartdateTime { get; set; }
       public DateTime ProcedureEnddateTime { get; set; }
       public DateTime OrderDateTime { get; set; }

   }
}