using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class JSTreeItem
    {
        public string id        { get; set; }
        public string parent    { get; set; }
        public string type      { get; set; }
        public string text      { get; set; }
        public string code      { get; set; }
        public string description { get; set; }
    }
}
