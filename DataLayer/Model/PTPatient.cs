using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class PTPatient:Patient
    {
        public string BedName   { get; set; }
        public string WardName  { get; set; }
        public string DoctorName{ get; set; }
        public string CategoryName { get; set; }
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }

        public int CategoryId   { get; set; }
        public int CompanyId    { get; set; }
        public int DoctorId     { get; set; }
        public int StationId    { get; set; }
        public int BedId        { get; set; }

        public DateTime AdmitDateTime { get; set; }
    }
}
