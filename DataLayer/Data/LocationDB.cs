using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
    public class LocationDB
    {
        CustomDBHelper DBHelper = new CustomDBHelper("LocationDB");

        public List<Location> getLocations()
        {
            var dt = DBHelper.ExecuteSQLAndReturnDataTable("Select Id, Name FROM Location where ID in (6,7,10)");

            return dt.ToListObject<Location>();
        }
    }
}
