import { useEffect, useState } from "react";
import { Truck, Package, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AssignedDelivery, DeliveryData } from "@/types/delivery";
import { assignDeliveriesToDrivers } from "@/utils/deliveryProcessor";

const Vehicles = () => {
  const [assignedDeliveries, setAssignedDeliveries] = useState<AssignedDelivery[]>([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("deliveryData");
    if (storedData) {
      const data: DeliveryData[] = JSON.parse(storedData);
      const assigned = assignDeliveriesToDrivers(data, false);
      setAssignedDeliveries(assigned);
    }
  }, []);

  // Group by vehicle
  const vehicleGroups = assignedDeliveries.reduce((acc, delivery) => {
    if (!acc[delivery.vehicle]) {
      acc[delivery.vehicle] = {
        vehicle: delivery.vehicle,
        drivers: new Set<string>(),
        deliveries: [],
      };
    }
    acc[delivery.vehicle].drivers.add(delivery.driver);
    acc[delivery.vehicle].deliveries.push(delivery);
    return acc;
  }, {} as Record<string, { vehicle: string; drivers: Set<string>; deliveries: AssignedDelivery[] }>);

  const vehicles = Object.values(vehicleGroups);

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Fleet Management</h1>
          <p className="text-muted-foreground">Track and manage your delivery vehicles</p>
        </div>

        {vehicles.length === 0 ? (
          <Card className="glass p-12 text-center">
            <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Vehicles Yet</h2>
            <p className="text-muted-foreground">
              Upload delivery data to see vehicle assignments
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => {
              const capacity = 35;
              const utilization = (vehicle.deliveries.length / capacity) * 100;
              
              return (
                <Card key={vehicle.vehicle} className="glass hover:glow transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg gradient-primary">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{vehicle.vehicle}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.drivers.size} {vehicle.drivers.size === 1 ? 'driver' : 'drivers'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Capacity</span>
                        <span className="text-sm font-medium">
                          {vehicle.deliveries.length}/{capacity}
                        </span>
                      </div>
                      <Progress value={utilization} className="h-2" />
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{vehicle.deliveries.length} deliveries</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{new Set(vehicle.deliveries.map(d => d.pincode)).size} pincodes</span>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Assigned Drivers:</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(vehicle.drivers).map(driver => (
                          <Badge key={driver} variant="outline" className="text-xs">
                            {driver}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;
