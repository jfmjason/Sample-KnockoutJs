using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class PTProcedure
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Text { get; set; }

        public Decimal CostPrice { get; set; }
    }
}
