"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch } from "react-redux";
import { updateSelectedFilterReducer } from "@/redux/comicSlice";
import { useQuery } from "../../pages/AudioComicPage";

export interface AgeGroupPrototype {
  value: string;
  label: string;
}

const AgeGroup = [
  {
    value: "groupSmall",
    label: "Age 6 - 12",
  },
  {
    value: "groupMedium",
    label: "Age 13- 19",
  },
  {
    value: "groupLarge",
    label: "20+",
  },
  {
    value: "groupXLarge",
    label: "Parents",
  },
];

const FilterComics: React.FC = () => {
  const data = useQuery();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const dispatch = useDispatch();
  const queryParams = data.get("filter");

  const updateFilters = () => {
    dispatch(updateSelectedFilterReducer(queryParams));
  };

  const handleUpdate = (param: string) => {
    const selectedGroup = AgeGroup.find(group => group.value === param);
    if (selectedGroup) {
      setValue(selectedGroup.value);
    } else {
      setValue("groupSmall");
    }
  };

  React.useEffect(() => {
    if (queryParams) {
      updateFilters();
      handleUpdate(queryParams);
    }
  }, [queryParams]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[90%] lg:w-[200px] justify-between"
        >
          {value
            ? AgeGroup.find((item) => item.value === value)?.label
            : "Filters..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[310px] md:w-[600px] lg:w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {AgeGroup.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    dispatch(updateSelectedFilterReducer(currentValue));
                  }}
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FilterComics;
