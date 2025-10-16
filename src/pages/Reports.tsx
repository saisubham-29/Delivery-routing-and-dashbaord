import { useEffect, useState } from "react";
import { FileText, TrendingUp, Package, Users, Truck, CheckCircle, Clock, AlertCircle, Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AssignedDelivery, DeliveryData } from "@/types/delivery";
import { assignDeliveriesToDrivers } from "@/utils/deliveryProcessor";
import { DeliveryChart } from "@/components/DeliveryChart";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const [assignedDeliveries, setAssignedDeliveries] = useState<AssignedDelivery[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedData = sessionStorage.getItem("deliveryData");
    if (storedData) {
      const data: DeliveryData[] = JSON.parse(storedData);
      const assigned = assignDeliveriesToDrivers(data, false);
      setAssignedDeliveries(assigned);
    }
  }, []);

  const totalDrivers = new Set(assignedDeliveries.map(d => d.driver)).size;
  const totalVehicles = new Set(assignedDeliveries.map(d => d.vehicle)).size;
  const totalPincodes = new Set(assignedDeliveries.map(d => d.pincode)).size;
  const avgDeliveriesPerDriver = totalDrivers > 0 ? (assignedDeliveries.length / totalDrivers).toFixed(1) : "0";
  
  const deliveredCount = assignedDeliveries.filter(d => d.status === "Delivered").length;
  const inProgressCount = assignedDeliveries.filter(d => d.status === "In Progress").length;
  const pendingCount = assignedDeliveries.filter(d => !d.status || d.status === "Pending").length;
  const successRate = assignedDeliveries.length > 0 ? (deliveredCount / assignedDeliveries.length) * 100 : 0;

  const stats = [
    { title: "Total Deliveries", value: assignedDeliveries.length, icon: Package, color: "text-primary" },
    { title: "Successfully Delivered", value: deliveredCount, icon: CheckCircle, color: "text-success" },
    { title: "In Progress", value: inProgressCount, icon: Clock, color: "text-warning" },
    { title: "Success Rate", value: `${successRate.toFixed(1)}%`, icon: TrendingUp, color: "text-success" },
  ];

  const operationalStats = [
    { title: "Active Drivers", value: totalDrivers, icon: Users, color: "text-secondary" },
    { title: "Fleet Vehicles", value: totalVehicles, icon: Truck, color: "text-accent" },
    { title: "Coverage Areas", value: totalPincodes, icon: Package, color: "text-primary" },
    { title: "Avg per Driver", value: avgDeliveriesPerDriver, icon: TrendingUp, color: "text-success" },
  ];

  const downloadReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      totalDeliveries: assignedDeliveries.length,
      delivered: deliveredCount,
      inProgress: inProgressCount,
      pending: pendingCount,
      successRate: successRate.toFixed(2),
      drivers: totalDrivers,
      vehicles: totalVehicles,
      coverageAreas: totalPincodes,
      avgPerDriver: avgDeliveriesPerDriver,
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `delivery-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Analytics report exported successfully",
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">View detailed reports and insights</p>
          </div>
          {assignedDeliveries.length > 0 && (
            <Button onClick={downloadReport} className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          )}
        </div>

        {assignedDeliveries.length === 0 ? (
          <Card className="glass p-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Data Yet</h2>
            <p className="text-muted-foreground">
              Upload delivery data to see analytics and reports
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Delivery Stats Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Delivery Performance</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.title} className="glass hover:glow transition-all">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <div className="p-2 rounded-lg gradient-primary">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stat.value}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Success Rate Visual */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Overall Success Rate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Completion Progress</span>
                    <span className="text-2xl font-bold">{successRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={successRate} className="h-3" />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Delivered</span>
                    </div>
                    <p className="text-2xl font-bold">{deliveredCount}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">In Progress</span>
                    </div>
                    <p className="text-2xl font-bold">{inProgressCount}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                    <p className="text-2xl font-bold">{pendingCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operational Stats Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Operational Metrics</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {operationalStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.title} className="glass hover:glow transition-all">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <div className="p-2 rounded-lg gradient-primary">
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stat.value}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Charts */}
            <DeliveryChart deliveries={assignedDeliveries} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
