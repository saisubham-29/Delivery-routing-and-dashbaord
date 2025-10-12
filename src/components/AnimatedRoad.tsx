import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Package, Eye, X, FileText, Flag } from "lucide-react";
import { AssignedDelivery } from "@/types/delivery";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DriverModal } from "./DriverModal";
import truckImage from "@/assets/truck.png";

interface AnimatedRoadProps {
  deliveries: AssignedDelivery[];
}

export const AnimatedRoad = ({ deliveries }: AnimatedRoadProps) => {
  const [currentStop, setCurrentStop] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [visitedStops, setVisitedStops] = useState<number[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<{ driver: string; vehicle: string; deliveries: AssignedDelivery[] } | null>(null);
  const [clickedStop, setClickedStop] = useState<number | null>(null);

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
    setClickedStop(null);
  };

  const playHornSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaJ0fDQgzcFJXPD7+OZQQ0XYLPl6qNTEwlCnN7vwXAiBjaI0O/RfzYEKHPB7eWWPgsXYLLk6aFSEglDnN7vw3AiBjaI0PDRgDYEJ3K/7eSVPgsWX7Ll6qFRDQhEnt/vwnAiBzaI0PDSgDYEKHLB7uSWPwoWXrLm6p9SDghDnd/vwm8hBjaI0O/SgTcEJ3PC7uSWQQwXYLPl6qFREglDnt/vwm8hBjaI0PDSgTUEJ3HB7uWWQAsWX7Pl6qJRDwlEnN/vwm8hBjaI0PDRgTYEJ3LD7uWWQQsWYLLl6qFSEQlEnt/vwXAiBjaIz/DRgTYFJ3LD7eWWQQsWX7Ll6qFSEQlDnN/vwXAiBjaIz+/RgDYFJ3LD7eWWQQsWX7Ll6qFREQlDnt/vwW8hBzaI0O/SgTYFJ3LD7uWWQAsWYLPl6qBSEQlEnt/vwW8hBjaI0O/RgTYFKHLD7uWWQAsWYLPl6qBSEQlEnt/vwW8hBjaI0O/RgTYFKHPD7eWWQAsWX7Pl6qFREglDnN/vwW8hBjaI0O/RgDYFKHPD7eWXQAsWX7Ll6qFREglDnN/vwW8hBjaIz+/RgDYFKHPD7eWXQAsWX7Ll6qFREglDnN/vwW8hBjaIz+/RgDYFKHPD7eWXQAsWX7Ll6qFREQlDnN/vwXAhBjaIz+/RgTUFKHPD7eWXQAwWX7Ll6qFREQlDnN/vwXAhBjaIz+/RgTUFKHPD7eWXQAwWX7Ll6qFREQlDnN/vwXAhBjaI0O/RgTUFKHPD7eWXQAwWX7Ll6qFREQlDnN/vwXAhBjaI0O/RgTUFKHPD7eWXQAwWX7Ll6qFREglDnN/vwXAhBjaI0O/RgTYFKHPD7eWXQAsWX7Ll6qFREglDnN/vwXAhBjaI0O/RgTYFKHPD7eWXQAsWX7Ll6qFSEglDnN/vwXAhBjaI0O/RgTYFKHPD7eWXQAsWX7Ll6qFSEglDnN/vwXAhBjaI0O/RgTYFKHPD7eWXQAsWX7Ll6qFSEQlDnN/vwXAhBjaI0O/RgTYFKHPD7eWXQAsWX7Ll6qFSEQlDnN/vwXAhBjaI0O/RgTYFKHPD7eWXQAsWX7Ll6qFSEQlDnN/vwXAhBjaI0O/RgTYFKHPD7eWXQAsWX7Ll6qFSEQlD');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore errors if autoplay is blocked
  };

  // Auto-start animation on mount
  useEffect(() => {
    if (stops.length > 0 && !isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stops.length]);

  useEffect(() => {
    if (isAnimating && currentStop < stops.length) {
      const timer = setTimeout(() => {
        setVisitedStops(prev => [...prev, currentStop]);
        playHornSound();
        if (currentStop < stops.length - 1) {
          setCurrentStop(currentStop + 1);
        } else {
          setIsAnimating(false);
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStop, stops.length]);

  const handleStopClick = (index: number) => {
    if (!isAnimating && visitedStops.includes(index)) {
      setClickedStop(index);
      setSelectedDriver(stops[index]);
    }
  };

  const handleQuickViewDriverClick = (stop: typeof stops[0]) => {
    setSelectedDriver(stop);
  };

  return (
    <div className="relative w-full h-full min-h-[700px]">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
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
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 0 }}>
        <defs>
          <filter id="roadShadow">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.4" />
          </filter>
          <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0a0a" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
        
        {/* Black Road */}
        <path
          d={roadPath}
          stroke="url(#roadGradient)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          filter="url(#roadShadow)"
        />
        
        {/* Road Center Line */}
        <path
          d={roadPath}
          stroke="#fbbf24"
          strokeWidth="0.3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="2,1.5"
          opacity="0.8"
        />
        
        {/* Road Edge Lines */}
        <path
          d={roadPath}
          stroke="#ffffff"
          strokeWidth="0.4"
          fill="none"
          strokeLinecap="round"
          opacity="0.3"
          style={{ transform: 'translateY(-5.5%)' }}
        />
        <path
          d={roadPath}
          stroke="#ffffff"
          strokeWidth="0.4"
          fill="none"
          strokeLinecap="round"
          opacity="0.3"
          style={{ transform: 'translateY(5.5%)' }}
        />
      </svg>
      
      {/* Start Point */}
      {stopPositions[0] && (
        <motion.div
          className="absolute"
          style={{
            left: `${stopPositions[0].x}%`,
            top: `${stopPositions[0].y}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl border-4 border-white">
              <Flag className="h-8 w-8 text-white" />
            </div>
            <div className="mt-2 bg-background/90 px-3 py-1 rounded-full shadow-lg">
              <span className="text-sm font-bold text-green-600">START</span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* End Point */}
      {stopPositions[stops.length - 1] && (
        <motion.div
          className="absolute"
          style={{
            left: `${stopPositions[stops.length - 1].x}%`,
            top: `${stopPositions[stops.length - 1].y}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-2xl border-4 border-white">
              <Flag className="h-8 w-8 text-white" />
            </div>
            <div className="mt-2 bg-background/90 px-3 py-1 rounded-full shadow-lg">
              <span className="text-sm font-bold text-red-600">END</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stop Markers */}
      {stopPositions.map((pos, index) => {
        if (index === 0 || index === stops.length - 1) return null; // Skip start and end
        return (
          <motion.div
            key={index}
            className="absolute cursor-pointer"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: clickedStop === index ? 20 : 5,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: visitedStops.includes(index) ? 1.2 : 1 }}
            transition={{ type: "spring" }}
            onClick={() => handleStopClick(index)}
          >
            <div className={`relative ${visitedStops.includes(index) ? 'z-20' : 'z-10'}`}>
              {/* Stop Pin */}
              <motion.div
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white ${
                  visitedStops.includes(index)
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 cursor-pointer hover:scale-110'
                    : 'bg-gradient-to-br from-gray-400 to-gray-600'
                }`}
                animate={visitedStops.includes(index) ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.5 }}
                whileHover={visitedStops.includes(index) ? { scale: 1.1 } : {}}
              >
                <MapPin className="h-7 w-7 text-white" />
              </motion.div>
              
              {/* Driver Label */}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs font-bold bg-background/90 px-3 py-1.5 rounded-full shadow-lg border border-border">
                  {stops[index].driver}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}

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
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            transform: "translate(-50%, -50%)",
            zIndex: 15,
          }}
        >
          <div className="relative">
            {/* Smoke Effect */}
            <motion.div
              className="absolute -left-8 top-1/2 transform -translate-y-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0],
                scale: [0, 1.5, 2],
                x: [-20, -40, -60]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            >
              <div className="w-8 h-8 rounded-full bg-gray-400 blur-md" />
            </motion.div>
            
            {/* Headlights */}
            <motion.div
              className="absolute -right-6 top-1/2 transform -translate-y-1/2"
              animate={{ 
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <div className="w-16 h-2 bg-yellow-300 blur-sm rounded-full" />
            </motion.div>
            
            {/* Truck Image */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="relative"
            >
              <img 
                src={truckImage} 
                alt="Delivery Truck" 
                className="w-20 h-20 object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Delivery Popups - Only show if not in quick view and not clicked */}
      <AnimatePresence>
        {!showQuickView && clickedStop === null && visitedStops.map((stopIndex) => {
          const stop = stops[stopIndex];
          const pos = stopPositions[stopIndex];
          
          return (
            <motion.div
              key={`popup-${stopIndex}`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="absolute cursor-pointer hover:scale-105 transition-transform"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, calc(-100% - 100px))",
                zIndex: 10,
              }}
              onClick={() => {
                setSelectedDriver(stop);
                setClickedStop(stopIndex);
              }}
            >
              <Card className="glass p-4 w-64 shadow-2xl border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <img src={truckImage} alt="truck" className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{stop.driver}</p>
                    <p className="text-xs text-muted-foreground">{stop.vehicle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs mb-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{stop.deliveries.length} deliveries</span>
                </div>
                <Button size="sm" className="w-full gap-2" variant="outline">
                  <FileText className="h-3 w-3" />
                  View Runsheet
                </Button>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">All Runsheets</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQuickView(false)}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {stops.map((stop, index) => (
                <Card 
                  key={index} 
                  className="p-4 hover:glow transition-all cursor-pointer hover:scale-[1.02]"
                  onClick={() => handleQuickViewDriverClick(stop)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <img src={truckImage} alt="truck" className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{stop.driver}</p>
                        <p className="text-xs text-muted-foreground">{stop.vehicle}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {index === 0 ? "START" : index === stops.length - 1 ? "END" : `Stop ${index}`}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {stop.deliveries.length} deliveries
                  </div>
                  <div className="space-y-2">
                    {stop.deliveries.slice(0, 3).map((delivery, idx) => (
                      <div key={idx} className="text-xs flex items-start gap-2 bg-muted/50 p-2 rounded">
                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{delivery.address}</p>
                          <p className="text-muted-foreground">{delivery.cylinderType}</p>
                        </div>
                      </div>
                    ))}
                    {stop.deliveries.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{stop.deliveries.length - 3} more deliveries
                      </p>
                    )}
                  </div>
                  <Button size="sm" className="w-full mt-3 gap-2" variant="outline">
                    <FileText className="h-3 w-3" />
                    View Full Runsheet
                  </Button>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Driver Modal */}
      {selectedDriver && (
        <DriverModal
          driver={selectedDriver.driver}
          vehicle={selectedDriver.vehicle}
          deliveries={selectedDriver.deliveries}
          onClose={() => {
            setSelectedDriver(null);
            setClickedStop(null);
          }}
        />
      )}
    </div>
  );
};
