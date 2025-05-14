"use client";

import { useFormContext } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateSearchParams } from "@/hooks/use-search-params";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFetchFilter } from "../api/use-fetch-filter";
import { useToast } from "@/hooks/use-toast";
import { FilterSchema } from "../form/filter";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const budget = [
  { label: "All", gte: 0, lte: undefined },
  { label: "< 100K", gte: 0, lte: 100000 },
  { label: "100K - 300K", gte: 100000, lte: 300000 },
  { label: "300K - 500K", gte: 300000, lte: 500000 },
  { label: "> 500K", gte: 500000, lte: undefined },
];

export const size = [
  { key: "S", name: "Small" },
  { key: "M", name: "Medium" },
  { key: "L", name: "Large" },
  { key: "XL", name: "Extra Large" },
];

export function ProductFilterForm({
  onSubmit,
  className,
  variant = "default",
}: {
  onSubmit: (values: FilterSchema) => void;
  className?: string;
  variant?: "default" | "floating";
}) {
  const { toast } = useToast();
  const { resetParams } = useUpdateSearchParams();

  const { data: filters, isLoading } = UseFetchFilter({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useFormContext<FilterSchema>();

  const handleReset = () => {
    form.reset({
      search: "",
      categories: [],
      types: [],
      objectives: [],
      colors: [],
      size: [],
      budget: { gte: 0, lte: undefined },
    });
    resetParams();
  };

  const allFilters = {
    ...filters,
    size: size,
  };

  const adminFilter = {
    ...(filters?.categories && { categories: filters.categories }),
    ...(filters?.types && { types: filters.types }),
    ...(size && { size }),
  };

  if (isLoading || !filters || Object.keys(filters).length === 0) {
    return (
      <p className="text-center text-muted-foreground">Loading filters...</p>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-4", className)}
      >
        {variant === "floating" ? (
          <React.Fragment>
            <div className="p-4 pb-0 flex items-center justify-between">
              <h4 className="font-medium">Filter Produk</h4>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Reset
              </Button>
            </div>
            <Accordion type="multiple" className="w-full px-4 -mt-3">
              {Object.entries(adminFilter).map(([key, options]) => (
                <React.Fragment key={key}>
                  <AccordionItem value={key}>
                    <AccordionTrigger>
                      Filter Berdasarkan {key} Produk
                    </AccordionTrigger>
                    <AccordionContent>
                      <FormField
                        key={key}
                        control={form.control}
                        name={key as keyof FilterSchema}
                        render={({ field }) => {
                          const fieldValue = Array.isArray(field.value)
                            ? field.value
                            : [];

                          return (
                            <FormItem className="flex flex-col gap-2">
                              <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                {Array.isArray(options) &&
                                  options.map((option) => (
                                    <FormItem
                                      key={option.key}
                                      className="flex flex-row items-center space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          className="border-border"
                                          checked={fieldValue.includes(
                                            option.key
                                          )}
                                          onCheckedChange={(checked) => {
                                            const newValue =
                                              checked === true
                                                ? [...fieldValue, option.key]
                                                : fieldValue.filter(
                                                    (v) => v !== option.key
                                                  );

                                            field.onChange(newValue);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.name}
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </React.Fragment>
              ))}
            </Accordion>
            <div className="px-4 pb-4">
              <Button className="w-full" type="submit">
                Terapkan Filter
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="flex items-center gap-3">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Search Bouquet..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Cari</Button>
            </div>

            <h2 className="text-lg font-semibold text-foreground">Filter</h2>
            <Separator />

            {Object.entries(allFilters).map(([key, options]) => (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof FilterSchema}
                render={({ field }) => {
                  const fieldValue = Array.isArray(field.value)
                    ? field.value
                    : [];

                  return (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="capitalize">{key}</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {Array.isArray(options) &&
                          options.map((option) => (
                            <FormItem
                              key={option.key}
                              className="flex flex-row items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  className="border-border"
                                  checked={fieldValue.includes(option.key)}
                                  onCheckedChange={(checked) => {
                                    const newValue =
                                      checked === true
                                        ? [...fieldValue, option.key]
                                        : fieldValue.filter(
                                            (v) => v !== option.key
                                          );

                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.name}
                              </FormLabel>
                            </FormItem>
                          ))}
                      </div>
                      <Separator />
                    </FormItem>
                  );
                }}
              />
            ))}

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Budget</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(label) => {
                        const selected = budget.find((b) => b.label === label);
                        if (selected) {
                          field.onChange({
                            gte: selected.gte,
                            lte: selected.lte,
                          }); // simpan sebagai object
                        }
                      }}
                      value={
                        budget.find(
                          (option) =>
                            option.gte === field.value?.gte &&
                            option.lte === field.value?.lte
                        )?.label // cari label berdasarkan object yang tersimpan
                      }
                      className="flex flex-col space-y-1"
                    >
                      {budget.map((option) => (
                        <FormItem
                          key={option.label}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={option.label} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button type="submit" className="w-full">
                Apply
              </Button>
            </div>
          </React.Fragment>
        )}
      </form>
    </Form>
  );
}
