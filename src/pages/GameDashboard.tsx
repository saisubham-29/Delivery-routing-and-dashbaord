import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Users, Truck, Upload, Table as TableIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnimatedRoad } from "@/components/AnimatedRoad";
import { DeliveryTable } from "@/components/DeliveryTable";
import { AssignedDelivery, DeliveryData } from "@/types/delivery";
import { assignDeliveriesToDrivers } from "@/utils/deliveryProcessor";
import { useNavigate } from "react-router-dom";

const GameDashboard = () => {
  const [assignedDeliveries, setAssignedDeliveries] = useState<AssignedDelivery[]>([]);
  const [showTableView, setShowTableView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = sessionStorage.getItem("deliveryData");
    if (storedData) {
      const data: DeliveryData[] = JSON.parse(storedData);
      const assigned = assignDeliveriesToDrivers(data, false);
      setAssignedDeliveries(assigned);
    }
  }, []);

  const totalDrivers = new Set(assignedDeliveries.map(d => d.driver)).size;
  const totalVehicles = new Set(assignedDeliveries.map(d => d.vehicle)).size;
  const avgDeliveries = totalDrivers > 0 ? (assignedDeliveries.length / totalDrivers).toFixed(1) : "0";

  const stats = [
    { icon: Users, label: "Total Drivers", value: totalDrivers.toString(), color: "primary" },
    { icon: Package, label: "Total Deliveries", value: assignedDeliveries.length.toString(), color: "secondary" },
    { icon: Truck, label: "Avg Deliveries/Driver", value: avgDeliveries, color: "accent" },
  ];

  if (assignedDeliveries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Deliveries Yet</h2>
          <p className="text-muted-foreground mb-6">Upload a CSV file to get started</p>
          <Button onClick={() => navigate("/")} className="gradient-primary text-white gap-2">
            <Upload className="h-4 w-4" />
            Upload CSV
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* KPI Bar */}
      <div className="sticky top-0 z-40 glass border-b backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 glass border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg gradient-primary">
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Road View */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass p-8 min-h-[600px]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Delivery Route Map</h2>
                <p className="text-muted-foreground">
                  Click on any truck to view driver details and delivery list
                </p>
              </div>
              <Button 
                onClick={() => setShowTableView(true)}
                className="gap-2 gradient-primary text-white"
              >
                <TableIcon className="h-4 w-4" />
                Table View
              </Button>
            </div>
            
            <AnimatedRoad deliveries={assignedDeliveries} />
          </Card>
        </motion.div>
      </div>

      {/* Table View Dialog */}
      <Dialog open={showTableView} onOpenChange={setShowTableView}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delivery Assignments - Table View</DialogTitle>
          </DialogHeader>
          <DeliveryTable deliveries={assignedDeliveries} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameDashboard;
