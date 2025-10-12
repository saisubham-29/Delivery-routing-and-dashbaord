import { motion, AnimatePresence } from "framer-motion";
import { Truck, MapPin, Package, Play, Eye } from "lucide-react";
import { AssignedDelivery } from "@/types/delivery";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AnimatedRoadProps {
  deliveries: AssignedDelivery[];
}

export const AnimatedRoad = ({ deliveries }: AnimatedRoadProps) => {
  const [currentStop, setCurrentStop] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [visitedStops, setVisitedStops] = useState<number[]>([]);

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

  const stops = Object.values(driverGroups);

  // Generate curved road path
  const generateCurvedPath = () => {
    const points = stops.map((_, index) => {
      const progress = index / (stops.length - 1 || 1);
      const x = 10 + progress * 80; // 10% to 90% width
      const y = 50 + Math.sin(progress * Math.PI * 2) * 20; // Wave pattern
      return { x, y };
    });

    if (points.length === 0) return "";
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cp1x = prev.x + (curr.x - prev.x) / 3;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) * 2 / 3;
      const cp2y = curr.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    return path;
  };

  const roadPath = generateCurvedPath();
  
  const stopPositions = stops.map((_, index) => {
    const progress = index / (stops.length - 1 || 1);
    return {
      x: 10 + progress * 80,
      y: 50 + Math.sin(progress * Math.PI * 2) * 20,
    };
  });

  const startAnimation = () => {
    setIsAnimating(true);
    setCurrentStop(0);
    setVisitedStops([]);
  };

  useEffect(() => {
    if (isAnimating && currentStop < stops.length) {
      const timer = setTimeout(() => {
        setVisitedStops(prev => [...prev, currentStop]);
        if (currentStop < stops.length - 1) {
          setCurrentStop(currentStop + 1);
        } else {
          setIsAnimating(false);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStop, stops.length]);

  return (
    <div className="relative w-full h-full min-h-[700px]">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Button
          onClick={startAnimation}
          disabled={isAnimating}
          className="gradient-primary text-white gap-2"
        >
          <Play className="h-4 w-4" />
          {isAnimating ? "Playing..." : "Start Animation"}
        </Button>
        <Button
          onClick={() => setShowQuickView(!showQuickView)}
          variant={showQuickView ? "default" : "outline"}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Quick View
        </Button>
      </div>

      {/* Road and Animation */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <defs>
          <filter id="roadShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>
        
        {/* Black Road */}
        <path
          d={roadPath}
          stroke="#1a1a1a"
          strokeWidth="80"
          fill="none"
          strokeLinecap="round"
          filter="url(#roadShadow)"
        />
        
        {/* Road Center Line */}
        <path
          d={roadPath}
          stroke="#fbbf24"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="20,15"
          opacity="0.6"
        />
      </svg>

      {/* Stop Markers */}
      {stopPositions.map((pos, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: visitedStops.includes(index) ? 1.2 : 1 }}
          transition={{ type: "spring" }}
        >
          <div className={`relative ${visitedStops.includes(index) ? 'z-20' : 'z-10'}`}>
            {/* Stop Pin */}
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                visitedStops.includes(index)
                  ? 'bg-gradient-to-br from-green-400 to-green-600'
                  : 'bg-gradient-to-br from-gray-400 to-gray-600'
              }`}
              animate={visitedStops.includes(index) ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <MapPin className="h-6 w-6 text-white" />
            </motion.div>
            
            {/* Stop Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs font-semibold bg-background/80 px-2 py-1 rounded">
                Stop {index + 1}
              </span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Animated Truck */}
      {isAnimating && stopPositions[currentStop] && (
        <motion.div
          className="absolute"
          initial={currentStop === 0 ? { 
            left: `${stopPositions[0].x}%`,
            top: `${stopPositions[0].y}%`,
          } : false}
          animate={{
            left: `${stopPositions[currentStop].x}%`,
            top: `${stopPositions[currentStop].y}%`,
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            transform: "translate(-50%, -50%)",
            zIndex: 15,
          }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="p-4 rounded-xl gradient-primary shadow-2xl"
          >
            <Truck className="h-10 w-10 text-white" />
          </motion.div>
        </motion.div>
      )}

      {/* Delivery Popups */}
      <AnimatePresence>
        {visitedStops.map((stopIndex) => {
          const stop = stops[stopIndex];
          const pos = stopPositions[stopIndex];
          
          return (
            <motion.div
              key={`popup-${stopIndex}`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, calc(-100% - 80px))",
                zIndex: 10,
              }}
            >
              <Card className="glass p-4 w-64 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{stop.driver}</p>
                    <p className="text-xs text-muted-foreground">{stop.vehicle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{stop.deliveries.length} deliveries</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Quick View Panel */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute right-0 top-0 bottom-0 w-96 glass border-l z-30 overflow-y-auto"
          >
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold mb-4">All Stops Overview</h3>
              {stops.map((stop, index) => (
                <Card key={index} className="p-4 hover:glow transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-sm">{stop.driver}</p>
                      <p className="text-xs text-muted-foreground">{stop.vehicle}</p>
                    </div>
                    <Badge variant={visitedStops.includes(index) ? "default" : "outline"}>
                      Stop {index + 1}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stop.deliveries.length} deliveries
                  </div>
                  <div className="mt-2 space-y-1">
                    {stop.deliveries.slice(0, 3).map((delivery, idx) => (
                      <div key={idx} className="text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{delivery.address}</span>
                      </div>
                    ))}
                    {stop.deliveries.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{stop.deliveries.length - 3} more
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
