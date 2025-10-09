import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RefreshCw, Edit } from "lucide-react";

interface AssignmentControlsProps {
  useDistanceClustering: boolean;
  onToggleDistanceClustering: (value: boolean) => void;
  onReassign: () => void;
  onManualEdit: () => void;
  hasCoordinates: boolean;
}

export const AssignmentControls = ({
  useDistanceClustering,
  onToggleDistanceClustering,
  onReassign,
  onManualEdit,
  hasCoordinates,
}: AssignmentControlsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="distance-clustering">Distance-Based Clustering</Label>
            <p className="text-sm text-muted-foreground">
              {hasCoordinates 
                ? "Group deliveries by proximity (requires lat/lng)"
                : "No coordinates found in CSV"}
            </p>
          </div>
          <Switch
            id="distance-clustering"
            checked={useDistanceClustering}
            onCheckedChange={onToggleDistanceClustering}
            disabled={!hasCoordinates}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={onReassign} variant="outline" className="flex-1 gap-2">
            <RefreshCw className="h-4 w-4" />
            Re-assign
          </Button>
          <Button onClick={onManualEdit} variant="outline" className="flex-1 gap-2">
            <Edit className="h-4 w-4" />
            Manual Edit
          </Button>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
          <p className="font-medium mb-1">Assignment Logic:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Priority: High → Medium → Low</li>
            <li>Max 35 deliveries per driver</li>
            <li>{useDistanceClustering ? "Grouped by distance (5km radius)" : "Grouped by pincode"}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
