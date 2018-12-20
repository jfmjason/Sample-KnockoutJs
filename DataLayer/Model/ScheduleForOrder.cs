using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class ScheduleForOrder
    {
        public int Id { get; set; }
        public DateTime ScheduleDate { get; set; }

        public string Text { get { return this.Id.ToString() + "   ( " + this.ScheduleDate.ToString("dd-MMM-yyyy") + " ) "; } }
    }
}
