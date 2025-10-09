import { useCallback, useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DeliveryData } from "@/types/delivery";
import { parseCSV } from "@/utils/deliveryProcessor";

interface CSVUploaderProps {
  onDataLoaded: (data: DeliveryData[]) => void;
}

export const CSVUploader = ({ onDataLoaded }: CSVUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const validateCSV = (data: any[]): boolean => {
    if (!data || data.length === 0) {
      toast({
        title: "Invalid CSV",
        description: "The CSV file is empty",
        variant: "destructive",
      });
      return false;
    }

    const requiredFields = ["address", "customerid", "pincode", "cylindertype"];
    const headers = Object.keys(data[0]).map((h) => h.toLowerCase().replace(/\s/g, ""));
    const hasRequiredFields = requiredFields.every((field) => 
      headers.some((h) => h.includes(field.toLowerCase()))
    );

    if (!hasRequiredFields) {
      toast({
        title: "Invalid CSV Format",
        description: "CSV must contain: Address, Customer ID, Pincode, Cylinder type",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const processFile = useCallback(
    (file: File) => {
      setIsProcessing(true);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (validateCSV(results.data)) {
            const parsedData = parseCSV(results.data);
            onDataLoaded(parsedData);
            toast({
              title: "Success!",
              description: `Loaded ${parsedData.length} deliveries`,
            });
          }
          setIsProcessing(false);
        },
        error: () => {
          toast({
            title: "Error",
            description: "Failed to parse CSV file",
            variant: "destructive",
          });
          setIsProcessing(false);
        },
      });
    },
    [onDataLoaded, toast]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type === "text/csv") {
        processFile(file);
      } else {
        toast({
          title: "Invalid file",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
      }
    },
    [processFile, toast]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  return (
    <Card
      className={`p-8 border-2 border-dashed transition-all duration-200 ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="p-4 bg-primary/10 rounded-full">
          {isProcessing ? (
            <Upload className="h-8 w-8 text-primary animate-pulse" />
          ) : (
            <FileText className="h-8 w-8 text-primary" />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Delivery CSV</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your CSV file here, or click to browse
          </p>
        </div>

        <Button
          variant="default"
          disabled={isProcessing}
          onClick={() => document.getElementById("csv-upload")?.click()}
        >
          {isProcessing ? "Processing..." : "Select CSV File"}
        </Button>

        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex items-start gap-2 text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <p className="font-medium mb-1">Required CSV columns:</p>
            <p>Address, Customer ID, Pincode, Cylinder type</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
