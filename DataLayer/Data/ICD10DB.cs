using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DataLayer.Model;
using System.Data.SqlClient;
namespace DataLayer.Data
{
    public class ICD10DB
    {
        CustomDBHelper dbHelper = new CustomDBHelper();

        public List<ICD10> getCodeByCode(string code)
        {
            StringBuilder query = new StringBuilder();

            query.Append(" select top 50 Id,Description, Code from ICD10CODE ");
            query.Append(" where Code like '%" + code + "%' order by code");

         return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<ICD10>();

        }

        public List<ICD10> getCodeByDescription(string desc)
        {
            StringBuilder query = new StringBuilder();

            query.Append(" select top 50 Id,Description, Code from ICD10CODE ");
            query.Append(" where Description like '%" + desc + "%' order by description");

            return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<ICD10>();

        }

       

    }
}
