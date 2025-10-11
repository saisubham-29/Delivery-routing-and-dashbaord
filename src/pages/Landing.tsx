import { motion } from "framer-motion";
import { Upload, Truck, Users, Package, ArrowRight, Sparkles, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CSVUploader } from "@/components/CSVUploader";
import { DeliveryData } from "@/types/delivery";
import { useState } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);

  const handleDataLoaded = (data: DeliveryData[]) => {
    // Store data in sessionStorage for the dashboard
    sessionStorage.setItem("deliveryData", JSON.stringify(data));
    navigate("/dashboard");
  };

  const stats = [
    { icon: Package, label: "Total Deliveries", value: "0", color: "text-primary" },
    { icon: Users, label: "Active Drivers", value: "0", color: "text-secondary" },
    { icon: Truck, label: "Fleet Vehicles", value: "0", color: "text-accent" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-secondary opacity-20 blur-3xl" />
      <div className="absolute top-20 right-20 w-96 h-96 gradient-primary opacity-10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 gradient-primary opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Logistics</span>
            </motion.div>

            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Smart Delivery Allocation,
              <br />
              Simplified.
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your delivery operations with intelligent routing, gamified driver tracking,
              and real-time analytics. Upload your data and watch the magic happen.
            </p>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-primary text-white glow hover:scale-105 transition-transform gap-2"
                onClick={() => setShowUpload(true)}
              >
                <Upload className="h-5 w-5" />
                Upload CSV
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/dashboard")}
              >
                View Dashboard
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </section>

        {/* CSV Upload Section */}
        {showUpload && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 pb-20"
          >
            <Card className="max-w-2xl mx-auto p-8 glass">
              <CSVUploader onDataLoaded={handleDataLoaded} />
            </Card>
          </motion.section>
        )}

        {/* Stats Section */}
        <section className="container mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="p-6 glass hover:glow transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg gradient-primary`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose DeliveryPro?</h2>
            <p className="text-muted-foreground">
              Everything you need for efficient delivery management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Smart Routing",
                description: "AI-powered algorithms optimize delivery routes based on distance and priority",
                icon: MapIcon,
              },
              {
                title: "Gamified Tracking",
                description: "Interactive road view makes monitoring deliveries fun and engaging",
                icon: Truck,
              },
              {
                title: "Real-time Analytics",
                description: "Get instant insights into your delivery operations and driver performance",
                icon: Package,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <Card className="p-6 glass h-full hover:glow transition-all duration-300">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Docs</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              © {new Date().getFullYear()} DeliveryPro. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
