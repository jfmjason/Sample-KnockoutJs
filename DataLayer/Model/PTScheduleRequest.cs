using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class PTScheduleRequest
    {
        public int Id               {get;set;}
		public int PatientType      {get;set;}
		public int Age              {get;set;}
        public int IPIDOPID         {get;set;}
          
        public DateTime FromdateTime{get;set;}
		public DateTime Todatetime  {get;set;}
        
        public string PIN           {get;set;}
        public string PatientName   {get;set;}
	    public string DoctorName    {get;set;}
	    public string WardName      {get;set;}
	    public string RoomNo        {get;set;}
        public string Procedures    {get;set;}
    }
}
