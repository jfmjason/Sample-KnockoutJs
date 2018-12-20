using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace HIS_PT.Common
{
    public class Helper
    {

        public static MemoryStream CreateMemoryStream(ReportViewer reportViewer, string format)
        {

            Warning[] warnings;
            string[] streamids;
            string mimeType;
            string encoding;
            string filenameExtension;

            byte[] _bytes = reportViewer.LocalReport.Render("PDF", null, out mimeType, out encoding, out filenameExtension, out streamids, out warnings);

            MemoryStream memoryStream = new MemoryStream(_bytes);
            memoryStream.Position = 0;

            return memoryStream;

        }
    }
}