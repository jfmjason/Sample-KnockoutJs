using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class PhysioExamination
    {
        public int Id { get; set; }
        public int Parent { get; set; }
        public int SubGroup { get; set; }
        public int TabId { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        public virtual  List<PhysioExamination> Child { get; set; }
    }
}
