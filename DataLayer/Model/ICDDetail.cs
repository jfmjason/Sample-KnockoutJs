using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
   public class ICDDetail
   {
       public int VisitId { get; set; }
       public int ICDId { get; set; }
       public int OperatorId { get; set; }
       public int Type { get; set; }
       public int IpId { get; set; }

       public string ICDDescription { get; set; }
       public string ICDCode { get; set; }
       public DateTime DateTime { get; set; }

   }
}
