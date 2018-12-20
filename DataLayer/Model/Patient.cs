using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class Patient
    {
      public int    SlNo { get; set; }
      public int    RegistrationNo{get;set;}    
      public int    Age{get;set;}
      public int    AgeTypeId{get;set;}
      public int    SexId {get;set;}
      public int    IPOPID { get; set; }
      public int CategoryId { get; set; }
      public int CompanyId { get; set; }

      public string IssueAuthorityCode { get; set; }
      public string Sex {get;set;}
      public string AgeStr { get; set; }
      public string AgeType { get; set; }
      public string PatientName { get; set; }
      public string IACRegno { get; set; }
      public string Phone { get; set; }
      public string CityName { get; set; }
      public string CountryName { get; set; }
      public string CategoryName { get; set; }
      public string CompanyCode { get; set; }
      public string CompanyName { get; set; }
      public string Address1 { get; set; }
      public string Address2 { get; set; }
      public string Address3 { get; set; }
      public string ZipCode { get; set; }

      public DateTime RegDateTime { get; set; }
    }
}
