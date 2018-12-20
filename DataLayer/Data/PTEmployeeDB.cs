using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
   public class PTEmployeeDB
   {
       CustomDBHelper dbHelper = new CustomDBHelper("PTEmployeeDB");
       
       public List<Employee> getEmployeeByType(int typeId)
       {
           StringBuilder  query     = new StringBuilder();

           query.Append("SELECT Distinct a.Id,Name,a.Empcode , a.EmpCode + ' - ' + Name Text , a.EmployeeId FROM  employee a ");
           query.Append("JOIN PTEmployee b ON a.id=b.Typeid  ");
           query.Append("WHERE  b.Type=" + typeId + " and b.deleted=0 and  a.deleted = 0  order by a.empcode, name");

           return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<Employee>();
       }


       public List<Employee> getPTDoctors()
       {
           StringBuilder query = new StringBuilder();

           query.Append("Select Id, Name, EmpCode, EmpCode + ' - ' + Name Text from employee where categoryid in (1,2) and deleted = 0 order by empcode, name");

           return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<Employee>();

       }

       public int Save(int employeeId, int type)
       {
           StringBuilder query = new StringBuilder();

           query.Append("INSERT INTO PTemployee(type,typeid,deleted) VALUES ("+type+","+employeeId+",0)");

           return dbHelper.ExecuteNonQuery(query.ToString());

       }
       public int Delete(int employeeId, int type)
        {
           StringBuilder query = new StringBuilder();

           query.Append("UPDATE PtEmployee  SET Deleted = 1 WHERE type = "+type+" and TypeID="+employeeId);

           return dbHelper.ExecuteNonQuery(query.ToString());

       }
       public bool isExisting(int employeeId, int type)
       {

           var result = dbHelper.ExecuteSQLScalar("SELECT count(*) FROM PTemployee WHERE type=" + type + " AND typeid =" + employeeId +" AND deleted = 0");

           return (int.Parse(result) > 0);
       }

   }
}
