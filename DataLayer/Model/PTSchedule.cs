using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
    public class PTSchedule
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public int TherapistId { get; set; }
        public int PatientType { get; set; }
        public int IPIDOPID {get;set;}
        public int ReservedConfirmed {get;set;}
        public int Age {get;set;}
        public int Sex {get;set;}
        public int StationId {get;set;}
        public int AgeType {get;set;}
        public int OperatorId { get; set; }
        
        public DateTime DateOfBooking { get; set; }
        public DateTime FromDateTime  { get; set; }
        public DateTime ToDatetime    { get; set; }

        public string Remarks  { get; set; }
        public string PatientName {get;set;}

    }
}
