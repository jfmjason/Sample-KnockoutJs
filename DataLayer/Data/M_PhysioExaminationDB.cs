using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
    public class M_PhysioExaminationDB
    {
        CustomDBHelper dbHelper = new CustomDBHelper();

        public List<M_PhysioExamination> getList()
        {
            return dbHelper.ExecuteSQLAndReturnDataTable("select Id, TabName from M_PhysioExamination Order by TabName").ToListObject<M_PhysioExamination>();

        }
    }
}
