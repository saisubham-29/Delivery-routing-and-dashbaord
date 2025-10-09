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
import { AssignedDelivery } from "@/types/delivery";
import { groupByPincode, groupByDriver } from "@/utils/deliveryProcessor";

interface DeliveryTableProps {
  deliveries: AssignedDelivery[];
}

export const DeliveryTable = ({ deliveries }: DeliveryTableProps) => {
  const [activeTab, setActiveTab] = useState("pincode");
  
  const pincodeGroups = groupByPincode(deliveries);
  const driverGroups = groupByDriver(deliveries);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Assignments</CardTitle>
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
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Cylinder Type</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Vehicle</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.deliveries.map((delivery, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{delivery.customerId}</TableCell>
                          <TableCell>{delivery.address}</TableCell>
                          <TableCell>{delivery.cylinderType}</TableCell>
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
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Pincode</TableHead>
                        <TableHead>Cylinder Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.deliveries.map((delivery, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{delivery.customerId}</TableCell>
                          <TableCell>{delivery.address}</TableCell>
                          <TableCell>{delivery.pincode}</TableCell>
                          <TableCell>{delivery.cylinderType}</TableCell>
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
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Pincode</TableHead>
                    <TableHead>Cylinder Type</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{delivery.customerId}</TableCell>
                      <TableCell>{delivery.address}</TableCell>
                      <TableCell>{delivery.pincode}</TableCell>
                      <TableCell>{delivery.cylinderType}</TableCell>
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
