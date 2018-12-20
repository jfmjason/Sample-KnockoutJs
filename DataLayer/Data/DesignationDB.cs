using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
   public class DesignationDB
    {

       CustomDBHelper DBHelper = new CustomDBHelper("DesignationDB");

       

        public List<Designation> getDesignations()
        {
            StringBuilder query = new StringBuilder();

            query.Append("SELECT  Id, Name FROM Designation");

            return DBHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<Designation>();
        }
    }
}
