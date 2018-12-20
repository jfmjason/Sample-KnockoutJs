using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
   public class AgeTypeDB
    {
        CustomDBHelper dbHelper = new CustomDBHelper();

        public List<AgeType> getAgeTypes()
        {
            return dbHelper.ExecuteSQLAndReturnDataTable("select Id, Name from AgeType where Deleted = 0").ToListObject<AgeType>();

        }
    }
}
