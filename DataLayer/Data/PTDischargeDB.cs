using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
   public class PTDischargeDB
    {

        CustomDBHelper dbHelper = new CustomDBHelper();

        public List<PTDischarge> getDischarge(int ipidopid, int patienttype)
        {
             dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@ipidopid", ipidopid),
                                    new SqlParameter("@patienttype", patienttype)
                                 };

             return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetPTDischarge]").ToListObject<PTDischarge>();
        }

        public List<OrderedProcedure> getOrderedProcedure(int ipidopid, int patienttype)
        {
            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@ipopid", ipidopid),
                                    new SqlParameter("@patienttype", patienttype)
                                 };

            return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetOrderedProcedureDetails]").ToListObject<OrderedProcedure>();
        }


        public List<OrderedProcedure> getDischargeOpOrderedProcedure(int ptdischargeId)
        {
            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@ptdischargeId", ptdischargeId)
                                 };

            return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetDischargeOpOrderProcedureDetails]").ToListObject<OrderedProcedure>();
        }


        public List<ICDDetail> getOPIcdDetails(int ptdischargeId)
        {
            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@ptDischargeId", ptdischargeId)
                                 };

            return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetOPDischargedIcdDetails]").ToListObject<ICDDetail>();
        }



        public int addDischarge(PTDischarge ptdischarge, string jsonPhysioExamination, string jsonStrRhOrderIds, string jsonStrClinicalVisitIds)
        {
            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@patientType", ptdischarge.PatientType),
                                   new SqlParameter("@ipidopid", ptdischarge.IPIDOPID),
                                   new SqlParameter("@operatorid", ptdischarge.OperatorId),
                                   new SqlParameter("@therapistid", ptdischarge.TherapistId),
                                   new SqlParameter("@orderdatetime", ptdischarge.OrderdateTime.ToString("dd-MMM-yyyy hh:mm tt")),
                                   new SqlParameter("@dateofdischarge", ptdischarge.DateOfDischarge.ToString("dd-MMM-yyyy hh:mm tt")),
                                   new SqlParameter("@admitdate", ptdischarge.DateOfAdmission.ToString("dd-MMM-yyyy hh:mm tt")),
                                  
                                   new SqlParameter("@jsonStrPhysioExamDetails", jsonPhysioExamination),
                                   new SqlParameter("@jsonStrRhOrderIds", jsonStrRhOrderIds),
                                   new SqlParameter("@jsonStrClinicalVisitIds", jsonStrClinicalVisitIds),

                                   new SqlParameter("@returnid", SqlDbType.Int)
                                 };


            var index = dbHelper.param.Count() - 1;

            dbHelper.param[index].Direction = ParameterDirection.Output;

            dbHelper.ExecuteNonQuerySP("[PT].[AddPTDischarge]", false);

            return int.Parse(dbHelper.param[index].Value.ToString());
        }


        public int updateDischarge(PTDischarge ptdischarge, string jsonPhysioExamination, string jsonStrRhOrderIds, string jsonStrClinicalVisitIds)
        {
            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@dischargeId", ptdischarge.Id),
                                   new SqlParameter("@patientType", ptdischarge.PatientType),
                                   new SqlParameter("@ipidopid", ptdischarge.IPIDOPID),
                                   new SqlParameter("@operatorid", ptdischarge.OperatorId),
                                   new SqlParameter("@therapistid", ptdischarge.TherapistId),
                                   new SqlParameter("@dateofdischarge", ptdischarge.DateOfDischarge.ToString("dd-MMM-yyyy hh:mm tt")),
                                   new SqlParameter("@jsonStrPhysioExamDetails", jsonPhysioExamination),
                                   new SqlParameter("@jsonStrRhOrderIds", jsonStrRhOrderIds),
                                   new SqlParameter("@jsonStrClinicalVisitIds", jsonStrClinicalVisitIds),

                                   new SqlParameter("@returnid", SqlDbType.Int)
                                 };


            var index = dbHelper.param.Count() - 1;

            dbHelper.param[index].Direction = ParameterDirection.Output;

            dbHelper.ExecuteNonQuerySP("[PT].[UpdatePTDischarge]", false);

            return int.Parse(dbHelper.param[index].Value.ToString());
        }


        public DataTable getDischargePrintView(int dischargeId)
        {
            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@dischargeId", dischargeId),
                                 };

            return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetDischargedPrintSummary]");
        }
      
    }
}
