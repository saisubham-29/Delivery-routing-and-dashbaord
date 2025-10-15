import { useEffect, useState } from "react";
import { FileText, TrendingUp, Package, Users, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssignedDelivery, DeliveryData } from "@/types/delivery";
import { assignDeliveriesToDrivers } from "@/utils/deliveryProcessor";
import { DeliveryChart } from "@/components/DeliveryChart";

const Reports = () => {
  const [assignedDeliveries, setAssignedDeliveries] = useState<AssignedDelivery[]>([]);

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

  const stats = [
    { title: "Total Deliveries", value: assignedDeliveries.length, icon: Package, color: "text-primary" },
    { title: "Active Drivers", value: totalDrivers, icon: Users, color: "text-secondary" },
    { title: "Fleet Vehicles", value: totalVehicles, icon: Truck, color: "text-accent" },
    { title: "Avg per Driver", value: avgDeliveriesPerDriver, icon: TrendingUp, color: "text-success" },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">View detailed reports and insights</p>
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
            {/* Stats Grid */}
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

            {/* Charts */}
            <DeliveryChart deliveries={assignedDeliveries} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
