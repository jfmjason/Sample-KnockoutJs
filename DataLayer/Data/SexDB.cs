using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
    public class SexDB
    {
        CustomDBHelper dbHelper = new CustomDBHelper();

        public List<Sex> getSex()
        {
            return dbHelper.ExecuteSQLAndReturnDataTable("select Id, Name from Sex where Deleted = 0").ToListObject<Sex>();

        }
    }
}
