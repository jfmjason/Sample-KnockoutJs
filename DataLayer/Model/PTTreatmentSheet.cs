using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
   public class PTTreatmentSheet
    {
         public int Id {get;set;}
		 public int PatientType {get;set;}
		 public int IPIDOPID {get;set;}
         public int OperatorId{get;set;}
         public int TherapistId{get;set;}
		 
         public DateTime OrderDateTime{get;set;}
		 
         public string Diagnosis{get;set;}
		 public string BriefHistory{get;set;}
		 public string ObjEvalProblems{get;set;}
		 public string Assessment{get;set;}
		 public string PlanOfManagement{get;set;}
		 public string Goals{get;set;}
		 public string Treatment{get;set;}
		 public string ProgressNotes{get;set;}
		   
    }
}
