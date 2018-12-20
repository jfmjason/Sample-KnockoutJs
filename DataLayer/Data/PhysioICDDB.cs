using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DataLayer.Model;
using System.Data.SqlClient;
using System.Data;
namespace DataLayer.Data
{
    public class PhysioICDDB
    {
        CustomDBHelper dbHelper = new CustomDBHelper();

        public List<PhysioICD> getICDByTabId(int tabId)
        {
            StringBuilder query = new StringBuilder();

            query.Append(" SELECT b.Id, b.Name From PhysioICd a ");
            query.Append(" JOIN physioexamination b ON a.Physioexamid=b.id and a.tableid=b.tabid ");
            query.Append(" WHERE a.icdid=0 and  b.tabid  = " + tabId + " and b.deleted=0 and  a.deleted=0 ");
           
            return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<PhysioICD>();

        }

        public List<PhysioICDDisplay> getICDDisplay(int tabid, int examid)
        {
            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@tabId", tabid),
                                    new SqlParameter("@examId", examid)
                                 };

            return dbHelper.ExecuteSPAndReturnDataTable("[PT].[GETPTICDDisplay]").ToListObject<PhysioICDDisplay>();
        }

        public List<JSTreeItem> getICDJSTreeItems()
        {
            dbHelper.param = new SqlParameter[]{};

            var data = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetICDJSTreeFormat]").ToListObject<JSTreeItem>();

           return data;
        }

        public List<JSTreeItem> getICD3And4JSTreeItems(int parentId)
        {
           dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@parentId", parentId)
                                 };

            var data = dbHelper.ExecuteSPAndReturnDataTable("[PT].[GetICD3and4]").ToListObject<JSTreeItem>();

            return data;
        }


        public int SaveIcd(int tabid, string physioexamjson, string icd10json, int operatorid)
        {

            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@TabId", tabid),
                                   new SqlParameter("@PhysioExamJson", physioexamjson),
                                   new SqlParameter("@Icd10Json", icd10json),
                                   new SqlParameter("@OperatorId", operatorid),
                                   new SqlParameter("@returnid", SqlDbType.Int)
                                 };

            var index = dbHelper.param.Count() - 1;

            dbHelper.param[index].Direction = ParameterDirection.Output;

            dbHelper.ExecuteNonQuerySP("[PT].[AddPhysioIcd]",false);

            return int.Parse(dbHelper.param[index].Value.ToString());   

        }

        public int Delete(int tabid, int physioexamid, int icdid, int operatorid)
        {
            StringBuilder query = new StringBuilder();
            query.Append(" UPDATE physioicd SET deleted=1,datetime=getdate(),operatorid =" + operatorid);
            query.Append(" WHERE icdid=" + icdid + " and tableid =" + tabid + " AND Physioexamid =" + physioexamid);
            query.Append(" SELECT CAST(scope_identity() AS int) ;");

            return dbHelper.ExecuteNonQuery(query.ToString());
        }

        public int Update(int tabid, string physioexamjson, string icd10json, int operatorid)
        {

            dbHelper.param = new SqlParameter[]{
                                   new SqlParameter("@TabId", tabid),
                                   new SqlParameter("@PhysioExamJson", physioexamjson),
                                   new SqlParameter("@Icd10Json", icd10json),
                                   new SqlParameter("@OperatorId", operatorid),
                                   new SqlParameter("@returnid", SqlDbType.Int)
                                 };

            var index = dbHelper.param.Count() - 1;

            dbHelper.param[index].Direction = ParameterDirection.Output;

            dbHelper.ExecuteNonQuerySP("[PT].[UpdatePhysioIcd]",false);


            return int.Parse(dbHelper.param[index].Value.ToString());
        }

        public List<PhysioExamination> getConfiguredPhysioExam(int icdid, int tabid)
        {
            StringBuilder query = new StringBuilder();

            query.Append(" SELECT Distinct a.Id, a.Name FROM physioexamination a ");
            query.Append(" JOIN  PhysioICd b ON a.Id = b.Physioexamid and b.tableid=a.TabId");
            query.Append(" WHERE a.Parent=0 and a.deleted = 0  and b.deleted = 0 and  b.icdid= " +icdid);
            query.Append(" AND a.TabId="+ tabid);

            return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<PhysioExamination>();

        }
    }
}
