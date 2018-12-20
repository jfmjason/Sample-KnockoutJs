using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class OrderedProcedure
    {
        public int OrderId { get; set; }
        public DateTime ProcedureStartDatetime { get; set; }
        public DateTime ProcedureEndDatetime { get; set; }

        public string Procedures { get; set; }
        public string Therapist { get; set; }

    }
}
