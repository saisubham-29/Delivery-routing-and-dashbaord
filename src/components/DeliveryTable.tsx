import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { AssignedDelivery } from "@/types/delivery";
import { groupByPincode, groupByDriver } from "@/utils/deliveryProcessor";
import { useToast } from "@/hooks/use-toast";

interface DeliveryTableProps {
  deliveries: AssignedDelivery[];
}

export const DeliveryTable = ({ deliveries }: DeliveryTableProps) => {
  const [activeTab, setActiveTab] = useState("pincode");
  const { toast } = useToast();
  
  const pincodeGroups = groupByPincode(deliveries);
  const driverGroups = groupByDriver(deliveries);

  const downloadCSV = () => {
    const headers = ["ID", "Customer ID", "Address", "Pincode", "Cylinder Type", "Priority", "Driver", "Vehicle", "Status"];
    const rows = deliveries.map(d => [
      d.id,
      d.customerId,
      d.address,
      d.pincode,
      d.cylinderType,
      d.priority || "Medium",
      d.driver,
      d.vehicle,
      d.status || "Pending"
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deliveries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Complete",
      description: "Delivery data exported successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Delivery Assignments</CardTitle>
          <Button onClick={downloadCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pincode">By Pincode</TabsTrigger>
            <TabsTrigger value="driver">By Driver</TabsTrigger>
            <TabsTrigger value="all">All Deliveries</TabsTrigger>
          </TabsList>

          <TabsContent value="pincode" className="space-y-4">
            {pincodeGroups.map((group) => (
              <div key={group.pincode} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">Pincode: {group.pincode}</h3>
                  <Badge variant="secondary">{group.deliveries.length} deliveries</Badge>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Cylinder Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Vehicle</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.deliveries.map((delivery, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-xs">{delivery.id}</TableCell>
                          <TableCell className="font-medium">{delivery.customerId}</TableCell>
                          <TableCell>{delivery.address}</TableCell>
                          <TableCell>{delivery.cylinderType}</TableCell>
                          <TableCell>
                            <Badge variant={
                              delivery.priority === "High" ? "destructive" :
                              delivery.priority === "Low" ? "secondary" : "default"
                            }>
                              {delivery.priority || "Medium"}
                            </Badge>
                          </TableCell>
                          <TableCell>{delivery.driver}</TableCell>
                          <TableCell>{delivery.vehicle}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="driver" className="space-y-4">
            {driverGroups.map((group) => (
              <div key={group.driver} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{group.driver}</h3>
                    <p className="text-sm text-muted-foreground">{group.vehicle}</p>
                  </div>
                  <Badge 
                    variant={group.deliveryCount > 30 ? "destructive" : "secondary"}
                  >
                    {group.deliveryCount}/35 deliveries
                  </Badge>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Pincode</TableHead>
                        <TableHead>Cylinder Type</TableHead>
                        <TableHead>Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.deliveries.map((delivery, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-xs">{delivery.id}</TableCell>
                          <TableCell className="font-medium">{delivery.customerId}</TableCell>
                          <TableCell>{delivery.address}</TableCell>
                          <TableCell>{delivery.pincode}</TableCell>
                          <TableCell>{delivery.cylinderType}</TableCell>
                          <TableCell>
                            <Badge variant={
                              delivery.priority === "High" ? "destructive" :
                              delivery.priority === "Low" ? "secondary" : "default"
                            }>
                              {delivery.priority || "Medium"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="all">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Pincode</TableHead>
                    <TableHead>Cylinder Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">{delivery.id}</TableCell>
                      <TableCell className="font-medium">{delivery.customerId}</TableCell>
                      <TableCell>{delivery.address}</TableCell>
                      <TableCell>{delivery.pincode}</TableCell>
                      <TableCell>{delivery.cylinderType}</TableCell>
                      <TableCell>
                        <Badge variant={
                          delivery.priority === "High" ? "destructive" :
                          delivery.priority === "Low" ? "secondary" : "default"
                        }>
                          {delivery.priority || "Medium"}
                        </Badge>
                      </TableCell>
                      <TableCell>{delivery.driver}</TableCell>
                      <TableCell>{delivery.vehicle}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
