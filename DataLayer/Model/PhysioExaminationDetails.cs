using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
   public class PhysioExaminationDetails
    {
        public int TableId { get; set; }
        public int MainSymptomId { get; set; }
        public int SubSymptomId { get; set; }
        public int PTDischargeId { get; set; }
        public string Description { get; set; }
    }
}
