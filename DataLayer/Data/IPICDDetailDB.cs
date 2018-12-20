using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Data
{
    public class IPICDDetailDB
    {
        CustomDBHelper dbHelper = new CustomDBHelper();

        public List<ICDDetail> getLatestDetails(int ipid)
        {
            StringBuilder query = new StringBuilder();

            query.Append(" Select IpId, ICDId , ICDCode, ICDDescription,DateTime,OperatorId, Type FROM ipicddetail ");
            query.Append(" WHERE  icdid is not null and ipid = " + ipid +" order by DateTime");

            return dbHelper.ExecuteSQLAndReturnDataTable(query.ToString()).ToListObject<ICDDetail>();

        }

    }
}
