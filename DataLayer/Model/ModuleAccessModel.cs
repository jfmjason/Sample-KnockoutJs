using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataLayer.Model
{
   public class ModuleAccessModel
    {
       public int FeatureId      {get;set;}
       public int ModuleId       {get;set;}
       public int ParentSeq      {get;set;}
       public int FeatureSequence{get;set;}
       public int FId            {get;set;}
       
       public string ModuleName  {get;set;}
       public string ParentName  {get;set;}
       public string FeatureName {get;set;}
       public string Uri         {get;set;}

       public bool HasAccess  {get;set;}

      

    }
}
