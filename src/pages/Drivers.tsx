import { useEffect, useState } from "react";
import { Users, Phone, MapPin, Package, Mail, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AssignedDelivery, DeliveryData } from "@/types/delivery";
import { assignDeliveriesToDrivers, groupByDriver } from "@/utils/deliveryProcessor";
import { useToast } from "@/hooks/use-toast";

const Drivers = () => {
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

  const driverGroups = groupByDriver(assignedDeliveries);

  const handleContact = (driver: string, method: string) => {
    toast({
      title: `Contact ${driver}`,
      description: `Opening ${method} communication...`,
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Drivers Management</h1>
          <p className="text-muted-foreground">Manage and monitor your delivery drivers</p>
        </div>

        {driverGroups.length === 0 ? (
          <Card className="glass p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Drivers Yet</h2>
            <p className="text-muted-foreground">
              Upload delivery data to see driver assignments
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {driverGroups.map((group) => {
              const deliveredCount = group.deliveries.filter(d => d.status === "Delivered").length;
              const successRate = group.deliveryCount > 0 ? (deliveredCount / group.deliveryCount) * 100 : 0;
              
              return (
                <Card key={group.driver} className="glass hover:glow transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg gradient-primary">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{group.driver}</CardTitle>
                        <p className="text-sm text-muted-foreground">{group.vehicle}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Deliveries</span>
                      <Badge variant={group.deliveryCount > 30 ? "destructive" : "secondary"}>
                        {group.deliveryCount}/35
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Success Rate</span>
                        <span className="text-sm font-medium">{successRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={successRate} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-success" />
                      <span>{deliveredCount} delivered</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 gap-2"
                        onClick={() => handleContact(group.driver, "call")}
                      >
                        <Phone className="h-3 w-3" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 gap-2"
                        onClick={() => handleContact(group.driver, "message")}
                      >
                        <MessageSquare className="h-3 w-3" />
                        SMS
                      </Button>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Top Pincodes:</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(new Set(group.deliveries.map(d => d.pincode))).slice(0, 3).map(pincode => (
                          <Badge key={pincode} variant="outline" className="text-xs">
                            {pincode}
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

export default Drivers;
