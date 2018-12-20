using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
   public class ICDDetailDB
   {
       CustomDBHelper dbHelper = new CustomDBHelper();

       public List<ICDDetail> getLatestDetails(int regno)
       {
           StringBuilder query = new StringBuilder();

           query.Append(" Select VisitId, ICDId , ICDCode, ICDDescription,DateTime,OperatorId, Type FROM icddetail ");
           query.Append(" WHERE visitid IN(SELECT max(id) FROM clinicalvisit WHERE registrationno = " + regno + ") order by DateTime");

           return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<ICDDetail>();

       }


       public List<ICDDetail> getOPNewICDDetails(int regno)
       {

           var icddetails = new List<ICDDetail>();

           dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@regno", regno)
                                  
                                 };

           icddetails = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetOPNewIcdDetails]").ToListObject<ICDDetail>();

           return icddetails;

       }


 

   }
}
