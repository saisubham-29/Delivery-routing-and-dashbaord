import { Truck } from "lucide-react";
import { Card } from "@/components/ui/card";

const Vehicles = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Fleet Management</h1>
          <p className="text-muted-foreground">Track and manage your delivery vehicles</p>
        </div>

        <Card className="glass p-12 text-center">
          <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            Vehicle tracking and management features will be available here
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Vehicles;
