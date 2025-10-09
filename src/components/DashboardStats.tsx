import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Truck, MapPin } from "lucide-react";
import { AssignedDelivery } from "@/types/delivery";

interface DashboardStatsProps {
  deliveries: AssignedDelivery[];
}

export const DashboardStats = ({ deliveries }: DashboardStatsProps) => {
  const uniqueDrivers = new Set(deliveries.map((d) => d.driver)).size;
  const uniquePincodes = new Set(deliveries.map((d) => d.pincode)).size;
  const uniqueVehicles = new Set(deliveries.map((d) => d.vehicle)).size;

  const stats = [
    {
      title: "Total Deliveries",
      value: deliveries.length,
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Active Drivers",
      value: uniqueDrivers,
      icon: Users,
      color: "text-accent",
    },
    {
      title: "Vehicles Deployed",
      value: uniqueVehicles,
      icon: Truck,
      color: "text-success",
    },
    {
      title: "Pincodes Covered",
      value: uniquePincodes,
      icon: MapPin,
      color: "text-warning",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
