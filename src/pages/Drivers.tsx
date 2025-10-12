import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const Drivers = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Drivers Management</h1>
          <p className="text-muted-foreground">Manage and monitor your delivery drivers</p>
        </div>

        <Card className="glass p-12 text-center">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            Driver management features will be available here
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Drivers;
