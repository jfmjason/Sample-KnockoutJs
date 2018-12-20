using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class Station
    {
        public int Id { get; set; }
        public int LocationId { get; set; }
        public int DepartmentId { get; set;}

        public string Name { get; set; }
        public string LocationName { get; set; }
        public string Code { get; set; }
    }
}
