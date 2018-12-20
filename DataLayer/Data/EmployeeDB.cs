using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
    public class EmployeeDB
    {
        CustomDBHelper dbHelper = new CustomDBHelper("EmployeeDB");

        public Employee getEmployeeById(int id)
        {
            var employee = new Employee();
            try
            {
                employee = dbHelper.ExecuteSQLAndReturnDataTable("SELECT Id, EmployeeId, EmpCode, Name  FROM Employee WHERE Id = " + id).ToModelObject<Employee>();
            }
            catch (Exception ex)
            {

                throw new ApplicationException(Errors.ExemptionMessage(ex));
            }

            return employee;

        }

        public List<Employee> getEmployeeByCategory(int categoryId)
        {
            var employees = new List<Employee>();
            try
            {
                employees = dbHelper.ExecuteSQLAndReturnDataTable("SELECT ID AS OperatorId, EmployeeId, EmpCode, FirstName, MiddleName, LastName , Name AS FullName FROM Employee WHERE CategoryID=" + categoryId + " AND Deleted=0 AND LEN(EMPCODE) = 4  ORDER BY EMPCODE").ToListObject<Employee>();
            }
            catch (Exception ex)
            {

                throw new ApplicationException(Errors.ExemptionMessage(ex));
            }

            return employees;

        }

        public List<Employee> getDoctors()
        {

            var doctors = new List<Employee>();

            try
            {
                doctors = dbHelper.ExecuteSQLAndReturnDataTable("SELECT Id,Name, EmpCode , EmpCode + ' - ' + Name Text FROM doctor WHERE deleted = 0 ORDER BY EmpCode ").ToListObject<Employee>();
            }
            catch (Exception ex)
            {

                throw new ApplicationException(Errors.ExemptionMessage(ex));
            }

            return doctors;

        }

        public List<Employee> findDoctors(string searchString)
        {

            var doctors = new List<Employee>();

            try
            {
                StringBuilder query = new StringBuilder();
                query.Append(" SELECT TOP 10 emp.Id, doc.Empcode, emp.Name ,d.Name DesignitionDesc , d.ID DesignitionId from  Employee Emp");
                query.Append(" JOIN doctor doc ON emp.EmployeeID = doc.EmployeeID");
                query.Append(" join Designation d on emp.DesignationID = d.ID ");
                query.Append(" WHERE (doc.EmpCode LIKE '%" + searchString + "%'");
                query.Append(" OR emp.Name LIKE '%" + searchString + "%')");
                query.Append(" AND emp.Deleted = 0");
                query.Append(" ORDER BY doc.EmpCode");

                doctors = dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<Employee>();
            }
            catch (Exception ex)
            {

                throw new ApplicationException(Errors.ExemptionMessage(ex));
            }

            return doctors;

        }

        public List<Employee> findEmployee(string searchString)
        {

            var employees = new List<Employee>();

            try
            {
                StringBuilder query = new StringBuilder();
                query.Append(" SELECT Distinct top 10  e.Id, e.EmployeeId, e.Name, d.Name DesignitionDesc, d.ID DesignitionId, e.Empcode +' - '+ e.Name Text , e.Empcode from employee e ");
                query.Append(" join Designation d on e.DesignationID = d.ID ");
                query.Append(" WHERE (e.EmployeeId LIKE '%" + searchString + "%' ");
                query.Append(" OR e.Name LIKE '%" + searchString + "%') ");
                query.Append(" AND e.Deleted = 0 ");
                query.Append(" ORDER BY e.Name ");

                employees = dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<Employee>();
            }
            catch (Exception ex)
            {

                throw new ApplicationException(Errors.ExemptionMessage(ex));
            }

            return employees;

        }

    }
}
