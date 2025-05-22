"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useForm, ControllerRenderProps } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { createVehicle } from "@/actions/vehicle";
import { Plus } from "lucide-react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import DriversDialog from "./DriversDialog";
import useDriversStore from "@/store/drivers.store";

interface FormValues {
  brand: string;
  model: string;
  registrationNumber: string;
  vin: string;
  firstRegistrationDate: string;
  mileage: number;
}

export default function CreateVehicleDialog() {
  const [open, setOpen] = useState(false);
  const [isCurrentDriver, setIsCurrentDriver] = useState(true);
  const [driversDialogOpen, setDriversDialogOpen] = useState(false);
  const driversSelected = useDriversStore((state) => state.drivers);

  const form = useForm<FormValues>({
    defaultValues: {
      brand: "",
      model: "",
      registrationNumber: "",
      vin: "",
      firstRegistrationDate: "",
      mileage: 0,
    },
  });

  const handleConfirm = async (data: FormValues) => {
    try {
      await createVehicle({
        ...data,
        drivers: driversSelected.map((driver) => `/api/drivers/${driver.id}`),
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating vehicle:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="p-4">
        <DialogTrigger asChild>
          <Button className="w-fit hover:bg-blue-600 hover:text-white">
            <Plus className="w-4 h-4 mr-2" /> Ajouter un véhicule
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un véhicule</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Label htmlFor="isCurrentDriver">Je suis le conducteur</Label>
          <Switch
            id="isCurrentDriver"
            checked={isCurrentDriver}
            onCheckedChange={setIsCurrentDriver}
          />
        </div>

        {!isCurrentDriver && (
          <Button className="w-full" onClick={() => setDriversDialogOpen(true)}>
            Ajouter un conducteur
          </Button>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleConfirm)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="brand"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "brand">;
              }) => (
                <FormItem>
                  <FormLabel>Marque</FormLabel>
                  <FormControl>
                    <Input placeholder="Mercedes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "model">;
              }) => (
                <FormItem>
                  <FormLabel>Modèle</FormLabel>
                  <FormControl>
                    <Input placeholder="Classe E" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationNumber"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "registrationNumber">;
              }) => (
                <FormItem>
                  <FormLabel>Numéro d&apos;immatriculation</FormLabel>
                  <FormControl>
                    <Input placeholder="AD230BR" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vin"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "vin">;
              }) => (
                <FormItem>
                  <FormLabel>Numéro de série (VIN)</FormLabel>
                  <FormControl>
                    <Input placeholder="1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstRegistrationDate"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  FormValues,
                  "firstRegistrationDate"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Date de première immatriculation</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileage"
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "mileage">;
              }) => (
                <FormItem>
                  <FormLabel>Kilométrage</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2">
              <Button variant="outline">Annuler</Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      <DriversDialog
        open={driversDialogOpen}
        onOpenChange={setDriversDialogOpen}
        onSubmit={() => {
          setDriversDialogOpen(false);
        }}
      />
    </Dialog>
  );
}
