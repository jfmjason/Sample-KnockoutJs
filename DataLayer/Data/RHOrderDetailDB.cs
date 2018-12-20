using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
   public class RHOrderDetailDB
   {
       CustomDBHelper dbHelper = new CustomDBHelper();

       public List<Employee> getStaffDetails(int orderType, int orderid)
       {

           StringBuilder query = new StringBuilder();
           query.Append(" select b.Id, b.Name  from RHOrderDetail a ");
           query.Append(" join employee b on b.id = a.typeid  ");
           query.Append(" where b.deleted=0 And a.type = " + orderType + " and a.orderid =" + orderid);

           return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<Employee>(); ;
       }



       public List<PTProcedure> getOrderProcedures(int orderType, int orderid)
       {

           StringBuilder query = new StringBuilder();
           query.Append(" select b.Id,b.Name from RHOrderDetail a ");
           query.Append(" Join PTProcedure  b on  b.id = a.typeid   ");
           query.Append(" where b.deleted=0  and a.type = "+orderType +"  and a.orderid  =" + orderid);

           return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<PTProcedure>(); ;
       }
           
   }
}
