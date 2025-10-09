import { DeliveryData, AssignedDelivery, GroupedDeliveries, DriverAssignment } from "@/types/delivery";

export const parseCSV = (csvData: any[]): DeliveryData[] => {
  return csvData.map((row) => ({
    address: row.Address || row.address || "",
    customerId: row["Customer ID"] || row.customerId || row["Customer Id"] || "",
    pincode: row.Pincode || row.pincode || "",
    cylinderType: row["Cylinder type"] || row.cylinderType || row["Cylinder Type"] || "",
  }));
};

export const assignDeliveriesToDrivers = (deliveries: DeliveryData[]): AssignedDelivery[] => {
  const MAX_DELIVERIES_PER_DRIVER = 35;
  const assignedDeliveries: AssignedDelivery[] = [];
  
  // Group deliveries by pincode first for efficient routing
  const pincodeGroups = deliveries.reduce((acc, delivery) => {
    if (!acc[delivery.pincode]) {
      acc[delivery.pincode] = [];
    }
    acc[delivery.pincode].push(delivery);
    return acc;
  }, {} as Record<string, DeliveryData[]>);

  let driverIndex = 1;
  let currentDriverDeliveries = 0;

  // Assign deliveries maintaining pincode grouping where possible
  Object.entries(pincodeGroups).forEach(([pincode, pincodeDeliveries]) => {
    pincodeDeliveries.forEach((delivery) => {
      if (currentDriverDeliveries >= MAX_DELIVERIES_PER_DRIVER) {
        driverIndex++;
        currentDriverDeliveries = 0;
      }

      assignedDeliveries.push({
        ...delivery,
        driver: `Driver ${driverIndex}`,
        vehicle: `Vehicle ${String.fromCharCode(64 + driverIndex)}`,
      });

      currentDriverDeliveries++;
    });
  });

  return assignedDeliveries;
};

export const groupByPincode = (deliveries: AssignedDelivery[]): GroupedDeliveries[] => {
  const grouped = deliveries.reduce((acc, delivery) => {
    if (!acc[delivery.pincode]) {
      acc[delivery.pincode] = [];
    }
    acc[delivery.pincode].push(delivery);
    return acc;
  }, {} as Record<string, AssignedDelivery[]>);

  return Object.entries(grouped)
    .map(([pincode, deliveries]) => ({
      pincode,
      deliveries,
    }))
    .sort((a, b) => a.pincode.localeCompare(b.pincode));
};

export const groupByDriver = (deliveries: AssignedDelivery[]): DriverAssignment[] => {
  const grouped = deliveries.reduce((acc, delivery) => {
    if (!acc[delivery.driver]) {
      acc[delivery.driver] = {
        driver: delivery.driver,
        vehicle: delivery.vehicle,
        deliveryCount: 0,
        deliveries: [],
      };
    }
    acc[delivery.driver].deliveries.push(delivery);
    acc[delivery.driver].deliveryCount++;
    return acc;
  }, {} as Record<string, DriverAssignment>);

  return Object.values(grouped).sort((a, b) => a.driver.localeCompare(b.driver));
};

export const exportToCSV = (deliveries: AssignedDelivery[]): string => {
  const headers = ["Address", "Customer ID", "Pincode", "Cylinder Type", "Driver", "Vehicle"];
  const rows = deliveries.map((d) => [
    d.address,
    d.customerId,
    d.pincode,
    d.cylinderType,
    d.driver,
    d.vehicle,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
};
