using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace DataLayer.Data
{
   public class StationDB
    {
       CustomDBHelper dbHelpers = new CustomDBHelper("StationDB");

       public Station getStationById(int stationId)
       {
           var station = new Station();
           try
           {
               station = dbHelpers.ExecuteSQLAndReturnDataTable("select Id ,LocationId , DepartmentId ,Name ,LocationId , Code from Station  where id = " + stationId).ToModelObject<Station>();
           }
           catch (Exception ex)
           {

               throw new ApplicationException(Errors.ExemptionMessage(ex));
           }

           return station;

       }


       public List<Station> getStations()
       {
           var station = new List<Station>();
           try
           {
               station = dbHelpers.ExecuteSQLAndReturnDataTable("SELECT distinct ID, Name FROM Station WHERE Deleted = 0 AND StationTypeID in(1) ORDER BY NAME").ToListObject<Station>();
           }
           catch (Exception ex)
           {

               throw new ApplicationException(Errors.ExemptionMessage(ex));
           }

           return station;

       }
    }
}
