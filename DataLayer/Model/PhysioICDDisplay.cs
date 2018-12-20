using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class PhysioICDDisplay
    {
        public string Code      { get; set; }
        public string Description   { get; set; }
        public string TabName   { get; set; }
        public string ExamName  { get; set; }

        public int ICDId { get; set; }
        public int TabId { get; set; }
        public int PhysioExamId { get; set; }
    }
}
