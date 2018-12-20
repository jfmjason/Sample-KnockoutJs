using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
    public class PTTreatmentDB
    {
        CustomDBHelper dbHelper = new CustomDBHelper();

        public List<PTTreatmentDislay> getTreatments(DateTime from, DateTime to, int patientType, int pin)
        {
            var treatment = new List<PTTreatmentDislay>();

            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@startDate", from.ToString()),
                                   new SqlParameter("@endDate", to.ToString()),
                                   new SqlParameter("@patientType", patientType),
                                   new SqlParameter("@pin", pin)
                                 };

            treatment = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetPTTreatmentSheetDisplay]").ToListObject<PTTreatmentDislay>();

            return treatment;

        }


        public PTTreatmentSheet getTreatmentById(int Id)
        {
            var treatment = new PTTreatmentSheet();

            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@Id", Id)
                                 };

            treatment = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetPTTreatmentSheet]").ToModelObject<PTTreatmentSheet>();

            return treatment;

        }


        public int Save(PTTreatmentSheet treatment)
        {

            dbHelper.param = new SqlParameter[]{
                                   
                                   new SqlParameter("@Id", treatment.Id),
                                   new SqlParameter("@PatientType", treatment.PatientType),
                                   new SqlParameter("@TherapistId", treatment.TherapistId),
                                   new SqlParameter("@OperatorId", treatment.OperatorId),
                                   new SqlParameter("@IPIDOPID", treatment.IPIDOPID),
                                   
                                   new SqlParameter("@Diagnosis", treatment.Diagnosis),
                                   new SqlParameter("@BriefHistory", treatment.BriefHistory),
                                   new SqlParameter("@ObjEvalProblems", treatment.ObjEvalProblems),
                                   new SqlParameter("@Assessment", treatment.Assessment),
                                   new SqlParameter("@PlanOfManagement", treatment.PlanOfManagement),
                                   new SqlParameter("@Goals", treatment.Goals),
                                   new SqlParameter("@Treatment", treatment.Treatment),
                                   new SqlParameter("@ProgressNotes", treatment.ProgressNotes),

                                   new SqlParameter("@returnid", SqlDbType.Int)

                                 };


            var index = dbHelper.param.Count() - 1;

            dbHelper.param[index].Direction = ParameterDirection.Output;

            dbHelper.ExecuteNonQuerySP("[PT].[AddPTTreatment]",false);


            return int.Parse(dbHelper.param[index].Value.ToString());
        }

        public int Update(PTTreatmentSheet treatment)
        {

            dbHelper.param = new SqlParameter[]{
                                   
                                   new SqlParameter("@Id", treatment.Id),
                                   new SqlParameter("@PatientType", treatment.PatientType),
                                   new SqlParameter("@TherapistId", treatment.TherapistId),
                                   new SqlParameter("@OperatorId", treatment.OperatorId),
                                   new SqlParameter("@IPIDOPID", treatment.IPIDOPID),
                                   
                                   new SqlParameter("@Diagnosis", treatment.Diagnosis),
                                   new SqlParameter("@BriefHistory", treatment.BriefHistory),
                                   new SqlParameter("@ObjEvalProblems", treatment.ObjEvalProblems),
                                   new SqlParameter("@Assessment", treatment.Assessment),
                                   new SqlParameter("@PlanOfManagement", treatment.PlanOfManagement),
                                   new SqlParameter("@Goals", treatment.Goals),
                                   new SqlParameter("@Treatment", treatment.Treatment),
                                   new SqlParameter("@ProgressNotes", treatment.ProgressNotes),

                                   new SqlParameter("@returnid", SqlDbType.Int)

                                 };


            var index = dbHelper.param.Count() - 1;

            dbHelper.param[index].Direction = ParameterDirection.Output;

            dbHelper.ExecuteNonQuerySP("[PT].[UpdatePTTreatment]",false);


            return int.Parse(dbHelper.param[index].Value.ToString());
        }

        public DataTable GetTreatmentPrintView(int Id)
        {
            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@Id", Id),
                                 };

            return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetPTTreatmentSheetPrintDisplay]");
        }
    }
}
