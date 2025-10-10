"use client";

import * as React from "react";
/* import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button"; */
import { Calendar } from "@/components/ui/calendar";
import { fr } from "react-day-picker/locale";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/app/common/types/common";

export function Calendar22({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleTriggerClick = () => {
    if (selectedDate) {
      setSelectedDate(null);
    } else {
      setOpen(true);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/*  <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button> */}
          <label
            onClick={handleTriggerClick}
            htmlFor="date"
            className="px-6 py-2 text-lg font-medium rounded-lg border border-primary text-primary cursor-pointer"
          >
            {selectedDate ? formatDate(selectedDate) : "Date"}
          </label>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            locale={fr}
            mode="single"
            selected={selectedDate ?? undefined}
            captionLayout="dropdown"
            onSelect={(date) => {
              setSelectedDate(date ?? null);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
