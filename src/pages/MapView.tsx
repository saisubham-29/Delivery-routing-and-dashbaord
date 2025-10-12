import { Map } from "lucide-react";
import { Card } from "@/components/ui/card";

const MapView = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Map View</h1>
          <p className="text-muted-foreground">Visualize delivery routes on an interactive map</p>
        </div>

        <Card className="glass p-12 text-center">
          <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            Interactive map with real-time tracking will be available here
          </p>
        </Card>
      </div>
    </div>
  );
};

export default MapView;
