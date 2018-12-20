using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
    public class PTProcedureDB
    {
        CustomDBHelper dbHelper = new CustomDBHelper("PTEmployeeDB");

        public List<PTProcedure> getProcedures()
        {
            StringBuilder query = new StringBuilder();

            query.Append("SELECT DISTINCT Code,Id,Name, Code+' - ' +Name Text, CostPrice from  PTprocedure Where   deleted = 0");

            return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<PTProcedure>();
        }


        
    }
}
