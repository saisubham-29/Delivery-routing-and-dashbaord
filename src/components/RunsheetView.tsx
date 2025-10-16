import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search, Printer, FileText } from "lucide-react";
import { AssignedDelivery } from "@/types/delivery";
import { groupByDriver } from "@/utils/deliveryProcessor";
import { useToast } from "@/hooks/use-toast";

interface RunsheetViewProps {
  deliveries: AssignedDelivery[];
}

export const RunsheetView = ({ deliveries }: RunsheetViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredDeliveries = deliveries.filter(
    (d) =>
      d.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.pincode.includes(searchTerm)
  );

  const driverGroups = groupByDriver(filteredDeliveries);

  const downloadRunsheet = (driver: string) => {
    const driverDeliveries = deliveries.filter(d => d.driver === driver);
    const headers = ["Stop #", "Customer ID", "Address", "Pincode", "Type", "Priority", "Status", "Signature"];
    const rows = driverDeliveries.map((d, idx) => [
      (idx + 1).toString(),
      d.customerId,
      d.address,
      d.pincode,
      d.cylinderType,
      d.priority || "Medium",
      d.status || "Pending",
      "___________"
    ]);

    const csvContent = [
      [`RUNSHEET - ${driver}`, "", "", "", "", "", "", ""],
      [`Date: ${new Date().toLocaleDateString()}`, "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      headers,
      ...rows
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `runsheet_${driver.replace(/\s/g, "_")}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Runsheet Downloaded",
      description: `Runsheet for ${driver} has been downloaded`,
    });
  };

  const printRunsheet = () => {
    window.print();
    toast({
      title: "Print Dialog Opened",
      description: "Select your printer to print the runsheet",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Delivery Runsheets
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Organized delivery routes for each driver
            </p>
          </div>
          <Button onClick={printRunsheet} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print All
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by driver, vehicle, or pincode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="grid" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-4">
            {driverGroups.map((group) => (
              <Card key={group.driver} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{group.driver}</CardTitle>
                      <p className="text-sm text-muted-foreground">{group.vehicle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={group.deliveryCount > 30 ? "destructive" : "default"}>
                        {group.deliveryCount} stops
                      </Badge>
                      <Button 
                        onClick={() => downloadRunsheet(group.driver)}
                        size="sm"
                        className="gap-2"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {group.deliveries.map((delivery, idx) => (
                      <div
                        key={delivery.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{delivery.address}</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.customerId} • {delivery.pincode}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{delivery.cylinderType}</Badge>
                          {delivery.priority === "High" && (
                            <Badge variant="destructive">High</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-6">
              {driverGroups.map((group) => (
                <div key={group.driver}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{group.driver}</h3>
                      <p className="text-sm text-muted-foreground">{group.vehicle}</p>
                    </div>
                    <Button 
                      onClick={() => downloadRunsheet(group.driver)}
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Stop #</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Pincode</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.deliveries.map((delivery, idx) => (
                          <TableRow key={delivery.id}>
                            <TableCell className="font-bold">{idx + 1}</TableCell>
                            <TableCell className="font-medium">{delivery.customerId}</TableCell>
                            <TableCell>{delivery.address}</TableCell>
                            <TableCell>{delivery.pincode}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{delivery.cylinderType}</Badge>
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>
                              <Badge variant={delivery.status === "Delivered" ? "default" : "secondary"}>
                                {delivery.status || "Pending"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
