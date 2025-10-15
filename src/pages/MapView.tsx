import { useEffect, useState } from "react";
import { Map, MapPin, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssignedDelivery, DeliveryData } from "@/types/delivery";
import { assignDeliveriesToDrivers, groupByPincode } from "@/utils/deliveryProcessor";

const MapView = () => {
  const [assignedDeliveries, setAssignedDeliveries] = useState<AssignedDelivery[]>([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("deliveryData");
    if (storedData) {
      const data: DeliveryData[] = JSON.parse(storedData);
      const assigned = assignDeliveriesToDrivers(data, false);
      setAssignedDeliveries(assigned);
    }
  }, []);

  const pincodeGroups = groupByPincode(assignedDeliveries);

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Map View</h1>
          <p className="text-muted-foreground">Visualize delivery routes by pincode</p>
        </div>

        {pincodeGroups.length === 0 ? (
          <Card className="glass p-12 text-center">
            <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Routes Yet</h2>
            <p className="text-muted-foreground">
              Upload delivery data to visualize routes
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pincodeGroups.map((group) => {
              const uniqueDrivers = new Set(group.deliveries.map(d => d.driver));
              
              return (
                <Card key={group.pincode} className="glass hover:glow transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg gradient-primary">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">Pincode {group.pincode}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {group.deliveries.length} deliveries
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span>{uniqueDrivers.size} drivers assigned</span>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Cylinder Types:</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(new Set(group.deliveries.map(d => d.cylinderType))).map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Priority Breakdown:</p>
                      <div className="flex gap-2">
                        <Badge variant="destructive" className="text-xs">
                          High: {group.deliveries.filter(d => d.priority === "High").length}
                        </Badge>
                        <Badge variant="default" className="text-xs">
                          Medium: {group.deliveries.filter(d => d.priority === "Medium" || !d.priority).length}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Low: {group.deliveries.filter(d => d.priority === "Low").length}
                        </Badge>
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

export default MapView;
