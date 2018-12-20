using DataLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace DataLayer.Data
{
    public class OrganizationDetailsDB
    {

        public OrganizationDetails getOrganizationDetails()
        {
            CustomDBHelper dbHelper = new CustomDBHelper();
            try
            {
                var query = "SELECT TOP 1 * FROM OrganisationDetails";
                return dbHelper.ExecuteSQLAndReturnDataTable(query).ToModelObject<OrganizationDetails>();
            }
            catch (Exception ex)
            {
                throw new ApplicationException(Errors.ExemptionMessage(ex));
            }

        }

    }
}
