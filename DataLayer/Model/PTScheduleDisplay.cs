using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class PTScheduleDisplay
    {
        public int Id                   { get; set; }
        public int SlNo                 { get; set; }
        public int ReservedConfirmed    { get; set; }
        
        public string PatientType       { get; set; }
        public string PatientName       { get; set; }
        public string Remarks           { get; set; }
        public string PIN               { get; set; }

        public DateTime ProcedureDate   { get; set; }
        public DateTime FromTime        { get; set; }
        public DateTime ToTime          { get; set; }


    }
}
