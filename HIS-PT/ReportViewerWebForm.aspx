<%@ Page Language="C#" AutoEventWireup="True" CodeBehind="ReportViewerWebForm.aspx.cs" Inherits="ReportViewerForMvc.ReportViewerWebForm" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body style="margin: 0px; padding: 0px;">
    <form id="form1" runat="server">
        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server">
                <Scripts>
                    <asp:ScriptReference Assembly="ReportViewerForMvc" Name="ReportViewerForMvc.Scripts.PostMessage.js" />
                </Scripts>
            </asp:ScriptManager>
            <rsweb:ReportViewer ID="ReportViewer1" runat="server"></rsweb:ReportViewer>
        </div>
    </form>
</body>
</html>
<script src="Scripts/jquery-1.9.1.js"></script>
<script type="text/javascript">
    $(window).load(function () {

        function AdjustPrintPopupPosition() {

            if ($(".msrs-printdialog-setting").is(":visible")) {
                $(".msrs-printdialog-main").css("top", "60px");
            } else {
                setTimeout(AdjustPrintPopupPosition, 50);
            }
        }

        function AdjustPrintPopupPositionOnGeneratingPDF() {

            if ($(".msrs-printdialog-loading").is(":visible")) {
                $(".msrs-printdialog-main").css("top", "70px");
                AdjustPrintPopupPositionAfterGeneratingPDF();
            } else {
                setTimeout(AdjustPrintPopupPositionOnGeneratingPDF, 50);
            }
        }

        function AdjustPrintPopupPositionAfterGeneratingPDF() {

            if (!$(".msrs-printdialog-loading").is(":visible")) {
                $(".msrs-printdialog-main").css("top", "70px");
            } else {
                setTimeout(AdjustPrintPopupPositionAfterGeneratingPDF, 100);
            }
        }

        $(".ToolbarPrint").on("click", function (e) {
            AdjustPrintPopupPosition();
        });

        $(".msrs-printdialog-divprintbutton").on("click", function (e) {
            AdjustPrintPopupPositionOnGeneratingPDF();
        });

    });
</script>
