"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Heart, Activity, Thermometer, Droplets } from "lucide-react";

interface EditableVitalProps {
  label: string;
  value: string;
  unit?: string;
  placeholder?: string;
  onSave: (value: string) => void;
}

const getIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case "heart rate":
      return <Heart className="h-5 w-5 text-red-500" />;
    case "blood pressure":
      return <Activity className="h-5 w-5 text-blue-500" />;
    case "temperature":
      return <Thermometer className="h-5 w-5 text-orange-500" />;
    case "blood glucose":
      return <Droplets className="h-5 w-5 text-purple-500" />;
    default:
      return null;
  }
};

export function EditableVital({
  label,
  value,
  unit,
  placeholder,
  onSave,
}: EditableVitalProps) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleBlur = () => {
    setEditing(false);
    if (tempValue !== value) {
      onSave(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setTempValue(value);
      setEditing(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {getIcon(label)}
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
        </div>
        <Pencil
          className="h-4 w-4 text-gray-500 cursor-pointer hover:text-[#00AD9B]"
          onClick={() => setEditing(true)}
        />
      </CardHeader>
      <CardContent>
        {editing ? (
          <Input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder={placeholder}
            className="text-2xl font-bold h-10"
          />
        ) : (
          <div className="text-2xl font-bold">
            {value}
            {unit && <span className="ml-1">{unit}</span>}
          </div>
        )}
        <p className="text-xs text-muted-foreground">Normal range</p>
      </CardContent>
    </Card>
  );
}
