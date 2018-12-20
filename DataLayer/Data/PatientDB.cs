using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
    public class PatientDB
    {
        CustomDBHelper DBHelper = new CustomDBHelper("Patient");

        public List<Patient> searchPatientsByRegNo(string regNo)
        {

            StringBuilder query = new StringBuilder();

            query.Append("Select Top 10 RegistrationNo, ");
            query.Append("IssueAuthorityCode+'.'+ convert(varchar,replicate('0', (10-len(RegistrationNo)))) + convert(varchar,RegistrationNo) IACRegno, Firstname+ ' '+ ISNULL(MiddleName,'') +' '+ ISNULL(LastName,'') PatientName ");
            query.Append("from Patient ");
            query.Append("where registrationno like '%" + regNo + "' order by registrationno");
           
            return DBHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<Patient>();

          
        }

        public Patient getPatientsByRegNo(int regNo)
        {

            DBHelper.param = new SqlParameter[]{
                                   new SqlParameter("@regNo ",regNo)
                                 };
            return DBHelper.ExecuteSPAndReturnDataTable("[PT].[GetPatient]").ToModelObject<Patient>();

            
        }

        public List<Patient> getPatients(int regNo,
                                   string firstName,
                                    string lastName,
                                    string middleName,
                                    string familyName,
                                    string fatherName,
                                    string fromDate,
                                    string toDate,
                                    int age,
                                    int ageType,
                                    int city,
                                    int country,
                                    int sex)
        {

            DBHelper.param = new SqlParameter[]{
                                   new SqlParameter("@regNo ",regNo),
                                   new SqlParameter("@firstName",firstName??""),
                                   new SqlParameter("@lastName",lastName??""),
                                   new SqlParameter("@middleName",middleName??""),
                                   new SqlParameter("@familyName",familyName??""),
                                   new SqlParameter("@fatherName",fatherName??""),
                                   new SqlParameter("@age",age),
                                   new SqlParameter("@ageType",ageType),
                                   new SqlParameter("@city",city),
                                   new SqlParameter("@country",country),
                                   new SqlParameter("@toDate",toDate??""),
                                   new SqlParameter("@fromDate",fromDate??""),
                                   new SqlParameter("@sex",sex)
                                 };

            return DBHelper.ExecuteSPAndReturnDataTable("[PT].[GetPatients]").ToListObject<Patient>();


        }

        public List<Inpatient> getInpatients()
        {
            return DBHelper.ExecuteSPAndReturnDataTable("[PT].[GetInPatients]").ToListObject<Inpatient>();
        }

        public PTPatient getInPatientDetails(int ipId)
        {
            DBHelper.param = new SqlParameter[]{
                                   new SqlParameter("@ipid ",ipId)
                                 };
            return DBHelper.ExecuteSPAndReturnDataTable("[PT].[GetInPatientDetails]").ToModelObject<PTPatient>();
        }
    }
}
