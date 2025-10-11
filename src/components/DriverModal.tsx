import { motion, AnimatePresence } from "framer-motion";
import { X, Package, MapPin, Truck as TruckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssignedDelivery } from "@/types/delivery";

interface DriverModalProps {
  driver: string;
  vehicle: string;
  deliveries: AssignedDelivery[];
  onClose: () => void;
}

export const DriverModal = ({ driver, vehicle, deliveries, onClose }: DriverModalProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="glass p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">{driver}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TruckIcon className="h-4 w-4" />
                  <span>{vehicle}</span>
                  <span className="mx-2">•</span>
                  <Package className="h-4 w-4" />
                  <span>{deliveries.length} Deliveries</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Delivery List */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {deliveries.map((delivery, index) => (
                <motion.div
                  key={delivery.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 hover:glow transition-all duration-300">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          {delivery.id}
                        </span>
                        {delivery.priority && (
                          <Badge
                            variant={
                              delivery.priority === "High"
                                ? "destructive"
                                : delivery.priority === "Medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {delivery.priority}
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline">{delivery.cylinderType}</Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{delivery.address}</p>
                          <p className="text-sm text-muted-foreground">
                            Pincode: {delivery.pincode}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Customer: {delivery.customerId}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button className="flex-1 gradient-primary text-white">
                View Runsheet
              </Button>
              <Button variant="outline" className="flex-1">
                Reassign Deliveries
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
