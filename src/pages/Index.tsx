import { useState } from "react";
import { Truck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CSVUploader } from "@/components/CSVUploader";
import { DashboardStats } from "@/components/DashboardStats";
import { DeliveryTable } from "@/components/DeliveryTable";
import { DeliveryChart } from "@/components/DeliveryChart";
import { AssignmentControls } from "@/components/AssignmentControls";
import { ManualEditor } from "@/components/ManualEditor";
import { DeliveryData, AssignedDelivery } from "@/types/delivery";
import { assignDeliveriesToDrivers, exportToCSV } from "@/utils/deliveryProcessor";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [deliveryData, setDeliveryData] = useState<DeliveryData[]>([]);
  const [assignedDeliveries, setAssignedDeliveries] = useState<AssignedDelivery[]>([]);
  const [useDistanceClustering, setUseDistanceClustering] = useState(false);
  const [showManualEditor, setShowManualEditor] = useState(false);
  const { toast } = useToast();

  const hasCoordinates = deliveryData.some(d => d.latitude && d.longitude);

  const handleDataLoaded = (data: DeliveryData[]) => {
    setDeliveryData(data);
    const assigned = assignDeliveriesToDrivers(data, false);
    setAssignedDeliveries(assigned);
    setUseDistanceClustering(false);
  };

  const handleReassign = () => {
    const assigned = assignDeliveriesToDrivers(deliveryData, useDistanceClustering);
    setAssignedDeliveries(assigned);
    toast({
      title: "Deliveries Re-assigned",
      description: `Using ${useDistanceClustering ? "distance-based" : "pincode-based"} clustering`,
    });
  };

  const handleToggleDistanceClustering = (value: boolean) => {
    setUseDistanceClustering(value);
    const assigned = assignDeliveriesToDrivers(deliveryData, value);
    setAssignedDeliveries(assigned);
    toast({
      title: value ? "Distance Clustering Enabled" : "Pincode Clustering Enabled",
      description: "Deliveries have been re-assigned",
    });
  };

  const handleExport = () => {
    const csv = exportToCSV(assignedDeliveries);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `delivery-assignments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: "Delivery assignments exported to CSV",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Delivery Manager</h1>
                <p className="text-sm text-muted-foreground">Smart delivery allocation system</p>
              </div>
            </div>
            {assignedDeliveries.length > 0 && (
              <Button onClick={handleExport} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {assignedDeliveries.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Upload Your Delivery Data</h2>
              <p className="text-muted-foreground">
                Start by uploading a CSV file with your delivery information
              </p>
            </div>
            <CSVUploader onDataLoaded={handleDataLoaded} />
          </div>
        ) : showManualEditor ? (
          <ManualEditor
            deliveries={assignedDeliveries}
            onUpdate={setAssignedDeliveries}
            onClose={() => setShowManualEditor(false)}
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Delivery Dashboard</h2>
                <p className="text-muted-foreground">
                  Overview of assigned deliveries and driver allocations
                </p>
              </div>
              <Button onClick={() => setAssignedDeliveries([])} variant="outline">
                Upload New File
              </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DashboardStats deliveries={assignedDeliveries} />
              </div>
              <AssignmentControls
                useDistanceClustering={useDistanceClustering}
                onToggleDistanceClustering={handleToggleDistanceClustering}
                onReassign={handleReassign}
                onManualEdit={() => setShowManualEditor(true)}
                hasCoordinates={hasCoordinates}
              />
            </div>
            
            <DeliveryChart deliveries={assignedDeliveries} />
            
            <DeliveryTable deliveries={assignedDeliveries} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Delivery Manager © {new Date().getFullYear()} - Efficient delivery allocation</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
