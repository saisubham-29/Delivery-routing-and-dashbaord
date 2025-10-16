import { useEffect, useState } from "react";
import { Truck, Package, Users, MapPin, Navigation, Activity, Search, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ManualEditor } from "@/components/ManualEditor";
import { AssignedDelivery, DeliveryData } from "@/types/delivery";
import { assignDeliveriesToDrivers } from "@/utils/deliveryProcessor";
import { useToast } from "@/hooks/use-toast";

const Vehicles = () => {
  const [assignedDeliveries, setAssignedDeliveries] = useState<AssignedDelivery[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showManualEditor, setShowManualEditor] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedData = sessionStorage.getItem("deliveryData");
    if (storedData) {
      const data: DeliveryData[] = JSON.parse(storedData);
      const assigned = assignDeliveriesToDrivers(data, false);
      setAssignedDeliveries(assigned);
    }
  }, []);

  const handleTrackVehicle = (vehicle: string) => {
    toast({
      title: "Tracking Vehicle",
      description: `Opening GPS tracker for ${vehicle}...`,
    });
  };

  const handleManualUpdate = (updatedDeliveries: AssignedDelivery[]) => {
    setAssignedDeliveries(updatedDeliveries);
    sessionStorage.setItem("deliveryData", JSON.stringify(updatedDeliveries));
    toast({
      title: "Success",
      description: "Manual assignments saved successfully",
    });
  };

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

  const vehicles = Object.values(vehicleGroups).filter(v =>
    v.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Array.from(v.drivers).some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Fleet Management</h1>
              <p className="text-muted-foreground">Track and manage your delivery vehicles</p>
            </div>
            <Button 
              onClick={() => setShowManualEditor(true)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Assignments
            </Button>
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles or drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
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
              const deliveredCount = vehicle.deliveries.filter(d => d.status === "Delivered").length;
              const inProgressCount = vehicle.deliveries.filter(d => d.status === "In Progress").length;
              const vehicleStatus = inProgressCount > 0 ? "Active" : "Idle";
              
              return (
                <Card key={vehicle.vehicle} className="glass hover:glow transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg gradient-primary">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{vehicle.vehicle}</CardTitle>
                          <Badge variant={vehicleStatus === "Active" ? "default" : "secondary"}>
                            <Activity className="h-3 w-3 mr-1" />
                            {vehicleStatus}
                          </Badge>
                        </div>
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
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicle.deliveries.length} total</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-success" />
                        <span>{deliveredCount} done</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{new Set(vehicle.deliveries.map(d => d.pincode)).size} pincodes</span>
                    </div>

                    <Button 
                      className="w-full gap-2" 
                      variant="outline"
                      onClick={() => handleTrackVehicle(vehicle.vehicle)}
                    >
                      <Navigation className="h-4 w-4" />
                      Track Location
                    </Button>

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

        {/* Manual Editor Dialog */}
        <Dialog open={showManualEditor} onOpenChange={setShowManualEditor}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <ManualEditor 
              deliveries={assignedDeliveries}
              onUpdate={handleManualUpdate}
              onClose={() => setShowManualEditor(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Vehicles;
