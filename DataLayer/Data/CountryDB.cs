using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
    public class CountryDB
    {
        CustomDBHelper dbHelper = new CustomDBHelper();

        public List<Country> getCountries()
        {
            return dbHelper.ExecuteSQLAndReturnDataTable("select Id, Name from Country where Deleted = 0 order by Name").ToListObject<Country>();
            
        }
    }

}
