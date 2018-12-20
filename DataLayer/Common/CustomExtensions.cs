using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Data;
using System.ComponentModel;
using System.Reflection;

namespace DataLayer
{
    public static class CustomExtension
    {
      
  
        public static List<T> ToListObject<T>(this DataTable table) where T : class, new()
        {
            try
            {
                List<T> list = new List<T>();

                foreach (var row in table.AsEnumerable())
                {
                    T obj = new T();

                    foreach (var prop in obj.GetType().GetProperties())
                    {
                        try
                        {
                            if (table.Columns.Contains(prop.Name))
                            {
                                if (row[prop.Name] != DBNull.Value)
                                {
                                    PropertyInfo propertyInfo = obj.GetType().GetProperty(prop.Name);
                                    propertyInfo.SetValue(obj, ChangeType(row[prop.Name], propertyInfo.PropertyType), null);
                                }
                            }

                        }
                        catch (Exception ex)
                        {
                            throw new ApplicationException(ex.Message, ex.InnerException);
                            //continue;
                        }
                    }

                    list.Add(obj);
                }

                return list;
            }
            catch
            {
                return null;
            }
        }
        
        public static T ToModelObject<T>(this DataTable table) where T : class, new()
        {
            try
            {
                T list = new T();

                foreach (var row in table.AsEnumerable())
                {
                    T obj = new T();

                    foreach (var prop in obj.GetType().GetProperties())
                    {
                        try
                        {
                            if (table.Columns.Contains(prop.Name))
                            {
                                if (row[prop.Name] != DBNull.Value)
                                {
                                    PropertyInfo propertyInfo = obj.GetType().GetProperty(prop.Name);
                                    //propertyInfo.SetValue(obj, Convert.ChangeType(row[prop.Name], propertyInfo.PropertyType), null);
                                    propertyInfo.SetValue(obj, ChangeType(row[prop.Name], propertyInfo.PropertyType), null);
                                }
                            }
                        }
                        catch
                        {
                            //throw new ApplicationException(ex.Message, ex.InnerException);
                            continue;
                        }
                    }

                    list = obj;
                }

                return list;
            }
            catch
            {
                return null;
            }
        }



       
        public static object ChangeType(object value, Type conversionType)
        {
            if (conversionType == null)
            {
                throw new ArgumentNullException("conversionType");
            }

            if (conversionType.IsGenericType &&
              conversionType.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
            {
                if (value == null)
                {
                    return null;
                }
                NullableConverter nullableConverter = new NullableConverter(conversionType);
                conversionType = nullableConverter.UnderlyingType;
            }

            return Convert.ChangeType(value, conversionType);
        }


    }
}
