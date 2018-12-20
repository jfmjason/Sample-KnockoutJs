using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
using System.Web;
using System.Configuration;
using System.Diagnostics;


namespace DataLayer
{
    public class CustomDBHelper : DataLayer.DBHelper
    {
        
        public new SqlParameter[] param = null;

        public new Boolean Successful { get; private set; }
        public new  string ErrorMessage { get; private set; }
        public new string ErrorStackTrace { get; private set; }

       
        string _ModuleName;

        public CustomDBHelper(string ModuleName = "SGH_HIS") 
        {
            
        }

        public new string ExecuteSQLScalar(string sql = "")
        {
            using (SqlConnection CN = new SqlConnection(base.SqlConnectionString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    this.Successful = true;
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;

                        var ret = cmd.ExecuteScalar();
                        return ret.ToString();
                    }
                }
                catch (Exception ex)
                {
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> Query<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return false;
                }
            }
        }

        public int ExecuteNonQuery(string sql = "")
        {
            using (SqlConnection CN = new SqlConnection(base.SqlConnectionString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    this.Successful = true;
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;
                        return cmd.ExecuteNonQuery();
                    }
                }
                catch (Exception ex)
                {
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> Query<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return false;
                }
            }
        }


        public int ExecuteNonQuerySP(string spName, bool withcustomerror)
        {
            using (SqlConnection CN = new SqlConnection(base.SqlConnectionString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(spName, CN))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 300;
                        if (param != null)
                        {
                            foreach (SqlParameter item in param)
                            {
                                cmd.Parameters.Add(item);
                            }
                        }

                        this.Successful = true;


                        return cmd.ExecuteNonQuery();
                    }
                }
                catch (Exception ex)
                {
                    try
                    {
                        EventLog log = new EventLog();
                        log.Source = _ModuleName;
                        log.WriteEntry("<b>From:</b> Query<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    }
                    catch { };
                    if (withcustomerror)
                    {
                        throw ex;
                    }
                    else {

                        this.Successful = false;
                        this.ErrorMessage = ex.Message;
                        this.ErrorStackTrace = ex.StackTrace;
                        throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    }

                }
            }
        }


        public new Boolean ExecuteSQL(string sql = "")
        {
            using (SqlConnection CN = new SqlConnection(base.SqlConnectionString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        this.Successful = true;
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;
                        cmd.ExecuteNonQuery();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> Query<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return false;
                }
            }
        }

        public  new Boolean  ExecuteSP(string spName = "")
        {
            using (SqlConnection CN = new SqlConnection(base.SqlConnectionString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(spName, CN))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 300;
                        if (param != null)
                        {
                            foreach (SqlParameter item in param)
                            {
                                cmd.Parameters.Add(item);
                            }
                        }

                        this.Successful = true;
                        cmd.ExecuteNonQuery();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + spName + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + spName + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return false;
                }
            }
        }

        public new DataTable ExecuteSPAndReturnDataTable(string SPName = "")
        {
            using (SqlConnection CN = new SqlConnection(base.SqlConnectionString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(SPName, CN))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 300;
                        if (param != null)
                        {
                            foreach (SqlParameter item in param)
                            {
                                cmd.Parameters.Add(item);
                            }
                        }

                        this.Successful = true;
                        SqlDataReader rs = cmd.ExecuteReader();
                        dt.Load(rs);
                        rs.Close();
                        rs.Dispose();
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + SPName + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + SPName + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                }
            }
        }

        public new DataTable ExecuteSQLAndReturnDataTable(string sql)
        {
            using (SqlConnection CN = new SqlConnection(base.SqlConnectionString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;

                        this.Successful = true;
                        SqlDataReader rs = cmd.ExecuteReader();
                        dt.Load(rs);
                        rs.Close();
                        rs.Dispose();
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + sql + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + sql + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return null;
                }
            }
        }

        public DataTable ExecuteSQLAndReturnDataTable(string sql ,string _constring)
        {
            using (SqlConnection CN = new SqlConnection(_constring))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(sql, CN))
                    {
                        cmd.CommandType = CommandType.Text;
                        cmd.CommandTimeout = 300;

                        this.Successful = true;
                        SqlDataReader rs = cmd.ExecuteReader();
                        dt.Load(rs);
                        rs.Close();
                        rs.Dispose();
                        return dt;
                    }
                }
                catch (Exception ex)
                {
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + sql + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + sql + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                    //return null;
                }
            }
        }

        public DataSet ExecuteSPAndReturnDataSet(string SPName = "")
        {
            using (SqlConnection CN = new SqlConnection(base.SqlConnectionString))
            {
                try
                {
                    CN.Open();

                    DataTable dt = new DataTable();
                    using (SqlCommand cmd = new SqlCommand(SPName, CN))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandTimeout = 3000;
                        if (param != null)
                        {
                            foreach (SqlParameter item in param)
                            {
                                cmd.Parameters.Add(item);
                            }
                        }

                        this.Successful = true;
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        DataSet ds = new DataSet();
                        da.Fill(ds);
                        return ds;
                    }
                }
                catch (Exception ex)
                {
                    EventLog log = new EventLog();
                    log.Source = _ModuleName;
                    log.WriteEntry("<b>From:</b> " + SPName + "<br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace, EventLogEntryType.Error);
                    this.Successful = false;
                    this.ErrorMessage = ex.Message;
                    this.ErrorStackTrace = ex.StackTrace;
                    throw new ApplicationException("<b>From:</b> " + SPName + "<br/><br/><b>Error Message:</b> <br /> " + ex.Message + "<br /><br /><b>Stack Trace:</b><br /> " + ex.StackTrace);
                }
            }
        }
    }
}
