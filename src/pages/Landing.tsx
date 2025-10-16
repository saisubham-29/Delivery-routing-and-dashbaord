import { motion } from "framer-motion";
import { Upload, Truck, Users, Package, ArrowRight, Sparkles, Map as MapIcon, BarChart3, Zap, Shield, Clock, Target, TrendingUp, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

            <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Transform Your Logistics
              <br />
              with AI-Powered Intelligence
            </h1>

            <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
              DeliveryPro revolutionizes your delivery operations with intelligent routing algorithms, 
              real-time driver tracking, comprehensive analytics, and seamless fleet management.
            </p>

            <div className="flex gap-3 justify-center mb-8 flex-wrap">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Clock className="h-4 w-4 mr-2" />
                Save 40% Time
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Target className="h-4 w-4 mr-2" />
                99% Accuracy
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                30% More Efficient
              </Badge>
            </div>

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
            <h2 className="text-5xl font-bold mb-4">Powerful Features for Modern Logistics</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run a world-class delivery operation from a single platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: "AI-Powered Routing",
                description: "Advanced algorithms optimize delivery routes based on distance, traffic, and priority for maximum efficiency",
                icon: MapIcon,
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                title: "Real-Time Tracking",
                description: "Monitor your entire fleet in real-time with live GPS tracking and delivery status updates",
                icon: Truck,
                gradient: "from-purple-500 to-pink-500",
              },
              {
                title: "Advanced Analytics",
                description: "Get actionable insights with comprehensive reports on driver performance, delivery success rates, and operational metrics",
                icon: BarChart3,
                gradient: "from-orange-500 to-red-500",
              },
              {
                title: "Lightning Fast",
                description: "Process thousands of deliveries in seconds with our optimized allocation engine",
                icon: Zap,
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                title: "Secure & Reliable",
                description: "Enterprise-grade security with data encryption and 99.9% uptime guarantee",
                icon: Shield,
                gradient: "from-green-500 to-emerald-500",
              },
              {
                title: "Smart Notifications",
                description: "Automated alerts and notifications keep drivers and customers informed at every step",
                icon: Package,
                gradient: "from-indigo-500 to-purple-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <Card className="p-8 glass h-full hover:glow transition-all duration-300 group">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.gradient} inline-block mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <Card className="p-8 glass">
              <h3 className="text-2xl font-bold mb-4">For Fleet Managers</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Reduce operational costs by up to 40% with optimized routing</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Monitor entire fleet performance in real-time dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Generate comprehensive reports with actionable insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Seamlessly scale from 10 to 10,000+ deliveries per day</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-8 glass">
              <h3 className="text-2xl font-bold mb-4">For Drivers</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                  </div>
                  <span>Get optimized routes that save time and fuel costs</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                  </div>
                  <span>Easy-to-use interface with clear delivery instructions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                  </div>
                  <span>Track performance metrics and earn recognition</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                  </div>
                  <span>Instant communication with dispatch and customers</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg gradient-primary">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">DeliveryPro</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Revolutionizing logistics with AI-powered delivery management solutions.
                </p>
                <div className="flex gap-3">
                  <Badge variant="secondary" className="text-xs">Trusted by 500+ companies</Badge>
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Press Kit</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-4">Get in Touch</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href="mailto:hello@deliverypro.com" className="hover:text-primary transition-colors">
                      hello@deliverypro.com
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                      +1 (234) 567-890
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1" />
                    <span>123 Logistics Ave, Tech City, TC 12345</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} DeliveryPro. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
