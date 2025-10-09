export interface DeliveryData {
  address: string;
  customerId: string;
  pincode: string;
  cylinderType: string;
}

export interface AssignedDelivery extends DeliveryData {
  driver: string;
  vehicle: string;
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
