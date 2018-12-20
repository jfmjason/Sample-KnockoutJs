using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
   public class RHOrderDB
    {
       CustomDBHelper dbHelper = new CustomDBHelper();

       public List<RHOrderDisplay> getRHOrder(DateTime from, DateTime to, int patientType, int pin)
       {
           var orders = new List<RHOrderDisplay>();

           dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@startDate", from.ToString()),
                                   new SqlParameter("@endDate", to.ToString()),
                                   new SqlParameter("@patientType", patientType),
                                   new SqlParameter("@pin", pin)
                                 };

           orders = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetRHOrderDisplay]").ToListObject<RHOrderDisplay>();

           return orders;

       }

       public RHOrder getRHOrderById(int Id)
       {
          

           dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@Id", Id)
                                 };

           var order = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetRHOrder]").ToModelObject<RHOrder>();

           return order;

       }


       public int Save(RHOrder order, string jsonStrProcedures, string jsonStrPhysiotherapist, string jsonStrTechnicians, string jsonStrNurses, int ptScheduleId)
       {

           dbHelper.param = new SqlParameter[]{
                                   
                                   new SqlParameter("@PTScheduleId", ptScheduleId),

                                   new SqlParameter("@PatientType", order.PatientType),
                                   new SqlParameter("@IPIDOPID", order.IPIDOPID),
                                   new SqlParameter("@OperatorId", order.OperatorId),
                                   new SqlParameter("@BedId", order.BedId),
                                   new SqlParameter("@ShiftingNurseId", order.ShiftingNurseId.ToString()),
                                   new SqlParameter("@DoctorId", order.DoctorId.ToString()),
                                   
                                   new SqlParameter("@ProcedureStartdateTime", order.ProcedureStartdateTime),
                                   new SqlParameter("@ProcedureEnddateTime", order.ProcedureEnddateTime),
                                   new SqlParameter("@Remarks", order.Remarks),
                                   new SqlParameter("@Diagnosis", order.Diagnosis),
                                   new SqlParameter("@Treatment", order.Treatment),
                                   new SqlParameter("@ReferredDoctor", order.ReferredDoctor),
                                   new SqlParameter("@OpVisitNo", order.OpVisitNo),

                                   new SqlParameter("@jsonStrProcedures", jsonStrProcedures),
                                   new SqlParameter("@jsonStrPhysiotherapist", jsonStrPhysiotherapist),
                                   new SqlParameter("@jsonStrTechnicians", jsonStrTechnicians),
                                   new SqlParameter("@jsonStrNurses", jsonStrNurses),
                                   new SqlParameter("@returnid", SqlDbType.Int)

                                 };


               var index = dbHelper.param.Count() - 1;

               dbHelper.param[index].Direction = ParameterDirection.Output;

               dbHelper.ExecuteNonQuerySP("[PT].[AddRHOrder]",false);



            return int.Parse(dbHelper.param[index].Value.ToString());
       }


       public int Update(RHOrder order)
       {

           dbHelper.param = new SqlParameter[]{
                                   
                                   new SqlParameter("@Id", order.Id),
                                   new SqlParameter("@PatientType", order.PatientType),
                                   new SqlParameter("@IPIDOPID", order.IPIDOPID),
                                   new SqlParameter("@OperatorId", order.OperatorId),
                                   new SqlParameter("@BedId", order.BedId),
                                   new SqlParameter("@ShiftingNurseId", order.ShiftingNurseId.ToString()),
                                   new SqlParameter("@DoctorId", order.DoctorId.ToString()),
                                   
                                   new SqlParameter("@ProcedureStartdateTime", order.ProcedureStartdateTime.ToString("dd-MMM-yyyy HH:mm")),
                                   new SqlParameter("@ProcedureEnddateTime", order.ProcedureEnddateTime.ToString("dd-MMM-yyyy HH:mm")),
                                   new SqlParameter("@Remarks", order.Remarks),
                                   new SqlParameter("@Diagnosis", order.Diagnosis),
                                   new SqlParameter("@Treatment", order.Treatment),
                                   new SqlParameter("@ReferredDoctor", order.ReferredDoctor),
                                   new SqlParameter("@OpVisitNo", order.OpVisitNo),
                                  
                                   new SqlParameter("@returnid", SqlDbType.Int)

                                 };


           var index = dbHelper.param.Count() - 1;

           dbHelper.param[index].Direction = ParameterDirection.Output;

           dbHelper.ExecuteNonQuerySP("[PT].[UpdateRHOrder]",false);

           return int.Parse(dbHelper.param[index].Value.ToString());
       }

       public int Cancel(int orderid, int operatorid)
       {

           dbHelper.param = new SqlParameter[]{
                                   
                                   new SqlParameter("@Id", orderid),
                                   new SqlParameter("@OperatorId", operatorid),
                                   new SqlParameter("@returnid", SqlDbType.Int)

                                 };


           var index = dbHelper.param.Count() - 1;

           dbHelper.param[index].Direction = ParameterDirection.Output;

           dbHelper.ExecuteNonQuerySP("[PT].[DeleteRHOrder]", false);

           return int.Parse(dbHelper.param[index].Value.ToString());
       }

       public bool hasConflict(DateTime from, DateTime to, int ipidopid, int patienttype, int? orderid)
       {
           StringBuilder query = new StringBuilder();
           query.Append(" SELECT 1 FROM RHOrder WHERE ProcedureStartdateTime < '" + to.ToString() + "' ");
           query.Append(" AND ProcedureEnddateTime >'" + from.ToString() + "' ");
           query.Append(" AND IpIdOpId =" + ipidopid.ToString() + " ");
           query.Append(" AND PatientType =" + patienttype.ToString() + " ");
           if (orderid.HasValue)
           {
               query.Append(" AND Id <> " + orderid.Value);
           }

           return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).Rows.Count > 0;

       }


       public DataTable getORderProcedureReport(int patientType, int ordermode, int procedureId, int therapistId,int registrationNo, DateTime from, DateTime to)
       {

           dbHelper.param = new SqlParameter[]{
                                   
                                   new SqlParameter("@PatientType", patientType),
                                   new SqlParameter("@OrderMode ", ordermode),
                                   new SqlParameter("@PTProcedureId", procedureId),
                                   new SqlParameter("@Therapistid", therapistId),
                                   new SqlParameter("@RegistrationNo", registrationNo),
                                  
                                   new SqlParameter("@FromDate", from),
                                   new SqlParameter("@ToDate", to)
                                 };

           return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GETProcedureReport]");
       }


       public DataTable getORderRefferedByReport(int patientType, int doctorId, int registrationNo, string refferedby, DateTime from, DateTime to)
       {

           dbHelper.param = new SqlParameter[]{
                                   
                                   new SqlParameter("@PatientType", patientType),
                                   new SqlParameter("@Refferedby", refferedby),
                                   new SqlParameter("@DoctorId", doctorId),
                                   new SqlParameter("@RegistrationNo", registrationNo),
                                  
                                   new SqlParameter("@FromDate", from),
                                   new SqlParameter("@ToDate", to)
                                 };

           return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GETRHOrderRefferedReport]");
       }
    }
}
