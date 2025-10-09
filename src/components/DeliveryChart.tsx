import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AssignedDelivery } from "@/types/delivery";
import { groupByDriver, groupByPincode } from "@/utils/deliveryProcessor";

interface DeliveryChartProps {
  deliveries: AssignedDelivery[];
}

export const DeliveryChart = ({ deliveries }: DeliveryChartProps) => {
  const driverData = groupByDriver(deliveries).map((group) => ({
    name: group.driver,
    deliveries: group.deliveryCount,
    vehicle: group.vehicle,
  }));

  const pincodeData = groupByPincode(deliveries)
    .slice(0, 10)
    .map((group) => ({
      name: group.pincode,
      deliveries: group.deliveries.length,
    }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Deliveries by Driver</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={driverData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="deliveries" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Pincodes by Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pincodeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="deliveries" fill="hsl(var(--accent))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
