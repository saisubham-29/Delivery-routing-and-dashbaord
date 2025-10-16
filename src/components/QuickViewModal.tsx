import { motion, AnimatePresence } from "framer-motion";
import { X, Package, MapPin, Truck, User, Phone, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssignedDelivery } from "@/types/delivery";

interface QuickViewModalProps {
  delivery: AssignedDelivery | null;
  onClose: () => void;
}

export const QuickViewModal = ({ delivery, onClose }: QuickViewModalProps) => {
  if (!delivery) return null;

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
          className="w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="glass p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Delivery Details</h2>
                <p className="text-sm text-muted-foreground font-mono">{delivery.id}</p>
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

            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={delivery.status === "Delivered" ? "default" : "secondary"}>
                    {delivery.status || "Pending"}
                  </Badge>
                </div>
              </div>

              {/* Priority */}
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge
                    variant={
                      delivery.priority === "High"
                        ? "destructive"
                        : delivery.priority === "Low"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {delivery.priority || "Medium"}
                  </Badge>
                </div>
              </div>

              {/* Customer */}
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{delivery.customerId}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Delivery Address</p>
                  <p className="font-medium">{delivery.address}</p>
                  <p className="text-sm text-muted-foreground">Pincode: {delivery.pincode}</p>
                </div>
              </div>

              {/* Cylinder Type */}
              <div className="flex items-start gap-2">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Cylinder Type</p>
                  <Badge variant="outline">{delivery.cylinderType}</Badge>
                </div>
              </div>

              {/* Driver & Vehicle */}
              <div className="flex items-start gap-2">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Assigned To</p>
                  <p className="font-medium">{delivery.driver}</p>
                  <p className="text-sm text-muted-foreground">{delivery.vehicle}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button className="flex-1 gradient-primary text-white gap-2">
                <Phone className="h-4 w-4" />
                Call Customer
              </Button>
              <Button variant="outline" className="flex-1">
                View on Map
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
