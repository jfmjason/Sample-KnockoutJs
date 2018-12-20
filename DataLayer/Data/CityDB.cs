using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
    public class CityDB
    {
        CustomDBHelper dbHelper = new CustomDBHelper();

        public List<City> getCities()
        {
            return dbHelper.ExecuteSQLAndReturnDataTable("select Id, Name from City where Deleted = 0 order by Name").ToListObject<City>();

        }
    }
}
