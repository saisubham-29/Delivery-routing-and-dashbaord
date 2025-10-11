import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import { AssignedDelivery } from "@/types/delivery";
import { useState } from "react";
import { DriverModal } from "./DriverModal";

interface AnimatedRoadProps {
  deliveries: AssignedDelivery[];
}

export const AnimatedRoad = ({ deliveries }: AnimatedRoadProps) => {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  // Group deliveries by driver
  const driverGroups = deliveries.reduce((acc, delivery) => {
    if (!acc[delivery.driver]) {
      acc[delivery.driver] = {
        driver: delivery.driver,
        vehicle: delivery.vehicle,
        deliveries: [],
      };
    }
    acc[delivery.driver].deliveries.push(delivery);
    return acc;
  }, {} as Record<string, { driver: string; vehicle: string; deliveries: AssignedDelivery[] }>);

  const drivers = Object.values(driverGroups);

  // Generate road path positions
  const roadPath = drivers.map((_, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const isReverse = row % 2 === 1;
    
    return {
      x: isReverse ? (2 - col) * 33.33 : col * 33.33,
      y: row * 25,
    };
  });

  return (
    <div className="relative w-full h-full min-h-[600px] p-8">
      {/* SVG Road Path */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <defs>
          <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d={roadPath
            .map((pos, i) => `${i === 0 ? "M" : "L"} ${pos.x}% ${pos.y}%`)
            .join(" ")}
          stroke="url(#roadGradient)"
          strokeWidth="60"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
        />
      </svg>

      {/* Trucks */}
      <div className="relative" style={{ zIndex: 1 }}>
        {drivers.map((driverData, index) => {
          const position = roadPath[index];
          
          return (
            <motion.div
              key={driverData.driver}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="absolute"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDriver(driverData.driver)}
                className="cursor-pointer"
              >
                <div className="relative">
                  {/* Truck Card */}
                  <div className="glass rounded-2xl p-6 shadow-xl glow hover:shadow-2xl transition-all duration-300 w-48">
                    <div className="flex flex-col items-center gap-3">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-4 rounded-xl gradient-primary"
                      >
                        <Truck className="h-8 w-8 text-white" />
                      </motion.div>
                      
                      <div className="text-center">
                        <p className="font-bold text-sm mb-1">{driverData.driver}</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {driverData.vehicle}
                        </p>
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                          {driverData.deliveries.length} stops
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connection Line to Next Stop */}
                  {index < drivers.length - 1 && (
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-primary/50 to-transparent" />
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Driver Modal */}
      {selectedDriver && (
        <DriverModal
          driver={driverGroups[selectedDriver].driver}
          vehicle={driverGroups[selectedDriver].vehicle}
          deliveries={driverGroups[selectedDriver].deliveries}
          onClose={() => setSelectedDriver(null)}
        />
      )}
    </div>
  );
};
