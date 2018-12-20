using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
    public class PhysioExaminationDB
    {

        CustomDBHelper dbHelper = new CustomDBHelper();

        public List<PhysioExamination> getExamByTabId(int tabId)
        {
            StringBuilder query = new StringBuilder();

            query.Append(" SELECT Id, Name FROM physioexamination ");
            query.Append(" WHERE Parent=0 and tabid="+tabId+" and deleted=0 ");
       
            return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<PhysioExamination>();

        }

        public List<PhysioExamination> getExam(int tabId, int parentId)
        {
            StringBuilder query = new StringBuilder();

            query.Append(" SELECT Id, Name ,Parent FROM physioexamination ");
            query.Append(" WHERE  tabid=" + tabId + " and deleted=0 and parent=" + parentId);

            return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<PhysioExamination>();

        }

        public List<JSTreeItem> getJSTreeItems(int tabId)
        {
             dbHelper.param = new SqlParameter[] { 
              new SqlParameter("@tabId", tabId)
             };

             var data = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetTabJSTreeFormat]").ToListObject<JSTreeItem>();

            return data;
        }

        public List<PhysioExamination> getDischargePhysioExam(int tabId, string icdjsonArray, int dischargeid)
        {
            dbHelper.param = new SqlParameter[] { 
                new SqlParameter("@tabId", tabId),
                new SqlParameter("@jsonIcdsArray", icdjsonArray),
                new SqlParameter("@ptdischargeid", dischargeid)
             };
            var data = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetDischargePhysioExam]").ToListObject<PhysioExamination>();

            return data;
        }


    }
}
