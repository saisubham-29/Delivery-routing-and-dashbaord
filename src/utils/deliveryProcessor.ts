import { DeliveryData, AssignedDelivery, GroupedDeliveries, DriverAssignment } from "@/types/delivery";

export const parseCSV = (csvData: any[]): DeliveryData[] => {
  return csvData.map((row) => {
    const priority = row.Priority || row.priority || "Medium";
    const lat = parseFloat(row.Latitude || row.latitude || row.Lat || row.lat || "0");
    const lng = parseFloat(row.Longitude || row.longitude || row.Lng || row.lng || "0");
    
    return {
      address: row.Address || row.address || "",
      customerId: row["Customer ID"] || row.customerId || row["Customer Id"] || "",
      pincode: row.Pincode || row.pincode || "",
      cylinderType: row["Cylinder type"] || row.cylinderType || row["Cylinder Type"] || "",
      priority: priority === "High" || priority === "Low" ? priority : "Medium",
      latitude: lat !== 0 ? lat : undefined,
      longitude: lng !== 0 ? lng : undefined,
    };
  });
};

// Calculate distance between two points using Haversine formula (in km)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Cluster deliveries by distance
const clusterByDistance = (deliveries: DeliveryData[], maxClusterRadius: number = 5): DeliveryData[][] => {
  const clusters: DeliveryData[][] = [];
  const unassigned = [...deliveries];

  while (unassigned.length > 0) {
    const cluster: DeliveryData[] = [];
    const seed = unassigned.shift()!;
    cluster.push(seed);

    if (seed.latitude && seed.longitude) {
      // Find nearby deliveries
      for (let i = unassigned.length - 1; i >= 0; i--) {
        const delivery = unassigned[i];
        if (delivery.latitude && delivery.longitude) {
          const distance = calculateDistance(
            seed.latitude, seed.longitude,
            delivery.latitude, delivery.longitude
          );
          if (distance <= maxClusterRadius) {
            cluster.push(delivery);
            unassigned.splice(i, 1);
          }
        }
      }
    }
    clusters.push(cluster);
  }

  return clusters;
};

export const assignDeliveriesToDrivers = (
  deliveries: DeliveryData[],
  useDistanceClustering: boolean = false
): AssignedDelivery[] => {
  const MAX_DELIVERIES_PER_DRIVER = 35;
  const assignedDeliveries: AssignedDelivery[] = [];
  
  // Sort by priority first (High > Medium > Low)
  const priorityOrder = { High: 0, Medium: 1, Low: 2 };
  const sortedDeliveries = [...deliveries].sort((a, b) => {
    const aPriority = priorityOrder[a.priority || "Medium"];
    const bPriority = priorityOrder[b.priority || "Medium"];
    return aPriority - bPriority;
  });

  let driverIndex = 1;
  let currentDriverDeliveries = 0;
  let deliveryIdCounter = 1;

  if (useDistanceClustering && sortedDeliveries.some(d => d.latitude && d.longitude)) {
    // Distance-based clustering
    const clusters = clusterByDistance(sortedDeliveries);
    
    clusters.forEach((cluster) => {
      cluster.forEach((delivery) => {
        if (currentDriverDeliveries >= MAX_DELIVERIES_PER_DRIVER) {
          driverIndex++;
          currentDriverDeliveries = 0;
        }

        assignedDeliveries.push({
          ...delivery,
          id: `DEL-${String(deliveryIdCounter).padStart(4, '0')}`,
          driver: `Driver ${driverIndex}`,
          vehicle: `Vehicle ${String.fromCharCode(64 + driverIndex)}`,
        });

        currentDriverDeliveries++;
        deliveryIdCounter++;
      });
    });
  } else {
    // Pincode-based grouping
    const pincodeGroups = sortedDeliveries.reduce((acc, delivery) => {
      if (!acc[delivery.pincode]) {
        acc[delivery.pincode] = [];
      }
      acc[delivery.pincode].push(delivery);
      return acc;
    }, {} as Record<string, DeliveryData[]>);

    Object.entries(pincodeGroups).forEach(([pincode, pincodeDeliveries]) => {
      pincodeDeliveries.forEach((delivery) => {
        if (currentDriverDeliveries >= MAX_DELIVERIES_PER_DRIVER) {
          driverIndex++;
          currentDriverDeliveries = 0;
        }

        assignedDeliveries.push({
          ...delivery,
          id: `DEL-${String(deliveryIdCounter).padStart(4, '0')}`,
          driver: `Driver ${driverIndex}`,
          vehicle: `Vehicle ${String.fromCharCode(64 + driverIndex)}`,
        });

        currentDriverDeliveries++;
        deliveryIdCounter++;
      });
    });
  }

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
  const headers = [
    "Delivery ID",
    "Address", 
    "Customer ID", 
    "Pincode", 
    "Cylinder Type",
    "Priority",
    "Latitude",
    "Longitude",
    "Driver", 
    "Vehicle"
  ];
  const rows = deliveries.map((d) => [
    d.id,
    d.address,
    d.customerId,
    d.pincode,
    d.cylinderType,
    d.priority || "Medium",
    d.latitude || "",
    d.longitude || "",
    d.driver,
    d.vehicle,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
};
