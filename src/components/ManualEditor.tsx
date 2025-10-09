import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Save, X } from "lucide-react";
import { AssignedDelivery } from "@/types/delivery";
import { useToast } from "@/hooks/use-toast";

interface ManualEditorProps {
  deliveries: AssignedDelivery[];
  onUpdate: (deliveries: AssignedDelivery[]) => void;
  onClose: () => void;
}

export const ManualEditor = ({ deliveries, onUpdate, onClose }: ManualEditorProps) => {
  const [editedDeliveries, setEditedDeliveries] = useState<AssignedDelivery[]>(deliveries);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const uniqueDrivers = Array.from(new Set(deliveries.map(d => d.driver))).sort();
  const uniqueVehicles = Array.from(new Set(deliveries.map(d => d.vehicle))).sort();

  const filteredDeliveries = editedDeliveries.filter(
    (d) =>
      d.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.pincode.includes(searchTerm) ||
      d.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDriverChange = (deliveryId: string, newDriver: string) => {
    setEditedDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId ? { ...d, driver: newDriver } : d
      )
    );
  };

  const handleVehicleChange = (deliveryId: string, newVehicle: string) => {
    setEditedDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId ? { ...d, vehicle: newVehicle } : d
      )
    );
  };

  const handleSave = () => {
    onUpdate(editedDeliveries);
    toast({
      title: "Changes Saved",
      description: "Manual assignments have been updated",
    });
    onClose();
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Manual Runsheet Editor</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <Button onClick={onClose} variant="outline" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Customer ID, Address, Pincode, or Driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Pincode</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Vehicle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-mono text-xs">{delivery.id}</TableCell>
                  <TableCell className="font-medium">{delivery.customerId}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{delivery.address}</TableCell>
                  <TableCell>{delivery.pincode}</TableCell>
                  <TableCell>{delivery.cylinderType}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(delivery.priority)}>
                      {delivery.priority || "Medium"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={delivery.driver}
                      onValueChange={(value) => handleDriverChange(delivery.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueDrivers.map((driver) => (
                          <SelectItem key={driver} value={driver}>
                            {driver}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={delivery.vehicle}
                      onValueChange={(value) => handleVehicleChange(delivery.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueVehicles.map((vehicle) => (
                          <SelectItem key={vehicle} value={vehicle}>
                            {vehicle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredDeliveries.length} of {editedDeliveries.length} deliveries
        </div>
      </CardContent>
    </Card>
  );
};
