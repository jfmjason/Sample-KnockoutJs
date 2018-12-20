using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
   public class PhysioExaminationDetailDB
    {
       
       CustomDBHelper dbHelper = new CustomDBHelper();

       public List<PhysioExaminationDetails> getExaminationDetails(int ptDischargeId)
       {
           dbHelper.param = new SqlParameter[] { 
                new SqlParameter("@ptDischargeId", ptDischargeId)
           };

           var data = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetPhysioExaminationDetails]").ToListObject<PhysioExaminationDetails>();

           return data;
       }

    }
}
