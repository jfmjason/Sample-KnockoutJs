using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class Inpatient:Patient
    {
        public int BedId        { get; set; }
        public string BedName   { get; set; }
    }
}
