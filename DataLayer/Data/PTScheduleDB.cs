using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DataLayer.Model;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer.Data
{
   public class PTScheduleDB
   {
      CustomDBHelper dbHelper = new CustomDBHelper("Patient");

      public List<PTScheduleDisplay> getPTSchedule(DateTime startDate, DateTime endDate, int therapistId, int patientType)
      {
          var ptSchedules = new List<PTScheduleDisplay>();

          
              dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@startDate", startDate.ToString("dd-MMM-yyyy")),
                                   new SqlParameter("@endDate", endDate.ToString("dd-MMM-yyyy")),
                                   new SqlParameter("@patientType", patientType),
                                   new SqlParameter("@therapistId", therapistId)
                                 };

              ptSchedules = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetPTScheduleDisplay]").ToListObject<PTScheduleDisplay>();
        
          return ptSchedules;

      }


      public List<PTScheduleDisplay> searchPTSchedule(int regNo = 0)
      {
          var ptSchedules = new List<PTScheduleDisplay>();


          dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@regNo", regNo),
                   
                                 };

          ptSchedules = dbHelper.ExecuteSPAndReturnDataTable("[PT].[SearchPTScheduleDisplay]").ToListObject<PTScheduleDisplay>();

          return ptSchedules;

      }

      public List<ScheduleForOrder> getPTScheduleIds(int ipidopid, int patienttype)
      {
          StringBuilder query = new StringBuilder();
          query.Append(" select Id, CONVERT(date, convert(varchar, FromdateTime ,101)) ScheduleDate from PTSchedule ");
          query.Append(" where IPIDOPID = " + ipidopid);
          query.Append(" and  PatientType = " + patienttype);
          query.Append(" and  Deleted = 0  AND ReservedConfirmed <=4 order by Id desc ");
          return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<ScheduleForOrder>(); 
      }

      public PTSchedule getPTSchedule(int schedId)
      {
          var ptSchedule = new PTSchedule();


          dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@id", schedId),
                                 };

          ptSchedule = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetPTSchedule]").ToModelObject<PTSchedule>();

          return ptSchedule;

      }

      public List<PTScheduleRequest> getPTScheduleRequest(DateTime from , DateTime to)
      {
          var ptScheduleRequest = new List<PTScheduleRequest>();


          dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@from", from.ToString()),
                                   new SqlParameter("@to", to.ToString())
                                 };

          ptScheduleRequest = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetPTScheduleRequest]").ToListObject<PTScheduleRequest>();

          return ptScheduleRequest;

      }

      public bool hasConflictSchedule(DateTime from, DateTime to, int therapistId, int ? schedId )
      {
          StringBuilder query = new StringBuilder();
          query.Append(" SELECT 1 FROM PTSchedule WHERE FromDateTime < '"+ to.ToString()+"' ");
          query.Append(" AND ToDateTime >'"+ from.ToString()+"' ");
          query.Append(" AND TherapistId =" + therapistId.ToString() + " ");
          query.Append(" AND Deleted = 0  ");

          if (schedId.HasValue)
          {
              query.Append(" AND Id <> " + schedId.Value); 
          }
          
          return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).Rows.Count > 0;

      }

      public Employee getPTSDoctor(int scheduleId)
      {
          StringBuilder query = new StringBuilder();
          query.Append(" select b.Id,b.Name from PTSDoctor a ");
          query.Append(" join employee b on  a.doctorid=b.id  where a.PTScheduleid = " + scheduleId);


          return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToModelObject<Employee>(); ;
      }

      public List<Employee> getPTSTechnician(int scheduleId)
      {
          StringBuilder query = new StringBuilder();
          query.Append(" select b.Id,b.Name from PTSTechnician a ");
          query.Append(" join employee b on  a.technicianid=b.id  where a.PTScheduleid = " + scheduleId);


          return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<Employee>();
      }

      public List<Employee> getPTSPhysiotherapist(int scheduleId)
      {
          StringBuilder query = new StringBuilder();
          query.Append(" select b.Id,b.Name from PTSPhysiotherapist a ");
          query.Append(" join employee b on  a.Physiotherapistid=b.id  where a.PTScheduleid = " + scheduleId);


          return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<Employee>(); ;
      }

      public List<Employee> getPTSNurse(int scheduleId)
      {
          StringBuilder query = new StringBuilder();
          query.Append(" select b.Id,b.Name from PTSNurse a ");
          query.Append(" join employee b on  a.nurseid=b.id  where a.PTScheduleid = " + scheduleId);


          return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<Employee>(); 
      }

      public List<PTProcedure> getPTSProcedure(int scheduleId)
      {
          StringBuilder query = new StringBuilder();
          query.Append(" select b.Id,b.Name from PTSProcedure a ");
          query.Append(" join PTprocedure b on  a.procedureid=b.id  where a.PTScheduleid = " + scheduleId);

          return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<PTProcedure>(); ;
      }

      public int Save(PTSchedule ptSchedule, string jsonStrProcedures, string jsonStrPhysiotherapist, string jsonStrTechnicians, string jsonStrNurses)
      {
       
                dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@FromDateTime", ptSchedule.FromDateTime),
                                   new SqlParameter("@ToDatetime", ptSchedule.ToDatetime),
                                   new SqlParameter("@ReservedConfirmed", ptSchedule.ReservedConfirmed),
                                   new SqlParameter("@Age", ptSchedule.Age),
                                   new SqlParameter("@Sex", ptSchedule.Sex),
                                   new SqlParameter("@PatientType", ptSchedule.PatientType),
                                   new SqlParameter("@IPIDOPID", ptSchedule.IPIDOPID),
                                   new SqlParameter("@AgeType", ptSchedule.AgeType),
                                   new SqlParameter("@DoctorId", ptSchedule.DoctorId),
                                   new SqlParameter("@OperatorId", ptSchedule.OperatorId),
                                   new SqlParameter("@TherapistId", ptSchedule.TherapistId),
                                   new SqlParameter("@Remarks", ptSchedule.Remarks),
                                   new SqlParameter("@PatientName", ptSchedule.PatientName),
                                   new SqlParameter("@jsonStrProcedures", jsonStrProcedures),
                                   new SqlParameter("@jsonStrPhysiotherapist", jsonStrPhysiotherapist),
                                   new SqlParameter("@jsonStrTechnicians", jsonStrTechnicians),
                                   new SqlParameter("@jsonStrNurses", jsonStrNurses),
                                   new SqlParameter("@returnid", SqlDbType.Int)

                                 };

                var index = dbHelper.param.Count() - 1;

                dbHelper.param[index].Direction = ParameterDirection.Output;

                var id = dbHelper.ExecuteNonQuerySP("[PT].[AddPTSchedule]",false);

          return id;   
      }

      public int MultipleSave(PTSchedule ptSchedule, string jsonStrProcedures, string jsonTimeSlots)
      {

          dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@ReservedConfirmed", ptSchedule.ReservedConfirmed),
                                   new SqlParameter("@Age", ptSchedule.Age),
                                   new SqlParameter("@Sex", ptSchedule.Sex),
                                   new SqlParameter("@PatientType", ptSchedule.PatientType),
                                   new SqlParameter("@IPIDOPID", ptSchedule.IPIDOPID),
                                   new SqlParameter("@AgeType", ptSchedule.AgeType),
                                   new SqlParameter("@DoctorId", ptSchedule.DoctorId),
                                   new SqlParameter("@OperatorId", ptSchedule.OperatorId),
                                   new SqlParameter("@TherapistId", ptSchedule.TherapistId),
                                   new SqlParameter("@PatientName", ptSchedule.PatientName),
                                  
                                   new SqlParameter("@jsonStrProcedures", jsonStrProcedures),
                                   new SqlParameter("@jsonTimeSlots", jsonTimeSlots),
                                   new SqlParameter("@returnid", SqlDbType.Int)

                                 };

          var index = dbHelper.param.Count() - 1;

          dbHelper.param[index].Direction = ParameterDirection.Output;

          var id = dbHelper.ExecuteNonQuerySP("[PT].[AddMultiplePTSchedule]",true);

          return id;
      }


      public int Update(PTSchedule ptSchedule, string jsonStrProcedures, string jsonStrPhysiotherapist, string jsonStrTechnicians, string jsonStrNurses)
      {

          dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@Id", ptSchedule.Id),
                                   new SqlParameter("@FromDateTime", ptSchedule.FromDateTime),
                                   new SqlParameter("@ToDatetime", ptSchedule.ToDatetime),
                                   new SqlParameter("@ReservedConfirmed", ptSchedule.ReservedConfirmed),
                                   new SqlParameter("@Age", ptSchedule.Age),
                                   new SqlParameter("@Sex", ptSchedule.Sex),
                                   new SqlParameter("@PatientType", ptSchedule.PatientType),
                                   new SqlParameter("@IPIDOPID", ptSchedule.IPIDOPID),
                                   new SqlParameter("@AgeType", ptSchedule.AgeType),
                                   new SqlParameter("@DoctorId", ptSchedule.DoctorId),
                                   new SqlParameter("@OperatorId", ptSchedule.OperatorId),
                                   new SqlParameter("@TherapistId", ptSchedule.TherapistId),
                                   new SqlParameter("@Remarks", ptSchedule.Remarks),
                                   new SqlParameter("@PatientName", ptSchedule.PatientName),
                                   new SqlParameter("@jsonStrProcedures", jsonStrProcedures),
                                   new SqlParameter("@jsonStrPhysiotherapist", jsonStrPhysiotherapist),
                                   new SqlParameter("@jsonStrTechnicians", jsonStrTechnicians),
                                   new SqlParameter("@jsonStrNurses", jsonStrNurses)

                                 };

          var id = dbHelper.ExecuteNonQuerySP("[PT].[UpdatePTSchedule]",false);

          return id;
      }

      public int Delete(int ptScheduleId)
      {
          StringBuilder query = new StringBuilder();
          query.Append(" UPDATE PTSchedule SET Deleted = 1 ");
          query.Append("  WHERE ID = " + ptScheduleId);
          query.Append("  SELECT CAST(scope_identity() AS int) ;");

          return dbHelper.ExecuteNonQuery(query.ToString());
      }


      public DataTable GetMonthlyReport(DateTime from)
      {

          dbHelper.param = new SqlParameter[]{
                                   
                                   new SqlParameter("@FromDate", from.ToString("dd-MMM-yyyy"))
                                 };

          return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GETMonthlyPTScheduleReport]");
      }


      public DataTable GetWardWiseReport(DateTime from, DateTime to, int stationId)
      {

          dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@FromDate", from.ToString("dd-MMM-yyyy")),
                                   new SqlParameter("@ToDate", to.ToString("dd-MMM-yyyy")),
                                   new SqlParameter("@WardId", stationId)
                                 };

          return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GETWardsPTScheduleReport]");
      }

      public DataTable GetTherapistWiseReport(DateTime from, DateTime to, int therapistId)
      {

          dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@FromDate", from.ToString("dd-MMM-yyyy")),
                                   new SqlParameter("@ToDate", to.ToString("dd-MMM-yyyy")),
                                   new SqlParameter("@TherapistId", therapistId)
                                 };

          return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GETTherapistPTScheduleReport]");
      }

   }
}
