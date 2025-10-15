export interface DeliveryData {
  address: string;
  customerId: string;
  pincode: string;
  cylinderType: string;
  priority?: "High" | "Medium" | "Low";
  latitude?: number;
  longitude?: number;
  status?: "Pending" | "In Progress" | "Delivered" | "Failed";
  deliveredAt?: string;
}

export interface AssignedDelivery extends DeliveryData {
  driver: string;
  vehicle: string;
  id: string;
}

export interface GroupedDeliveries {
  pincode: string;
  deliveries: AssignedDelivery[];
}

export interface DriverAssignment {
  driver: string;
  vehicle: string;
  deliveryCount: number;
  deliveries: AssignedDelivery[];
}
