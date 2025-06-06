"use client";

import React from "react";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useUserStore } from "@/store/user.store";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/actions/user";

interface ProfileFormData {
  lastName: string;
  firstName: string;
  address: string;
  phoneNumber: string;
}

export default function ProfilePage() {
  useFetchUser();
  const { user } = useUserStore();

  const form = useForm<ProfileFormData>({
    defaultValues: {
      lastName: user?.lastName || "",
      firstName: user?.firstName || "",
      address: user?.address || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        lastName: user.lastName,
        firstName: user.firstName,
        address: user.address,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user, form]);

  async function onSubmit(values: ProfileFormData) {
    try {
      if (!user?.id) return;
      await updateUser(values, user.id);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
    }
  }

  if (!user) return null;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-2xl w-full mx-auto p-6 shadow-lg rounded-md bg-white">
        <h1 className="text-2xl font-bold mt-2 mb-12 text-center">
          Mon Profil
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input value={user.email} disabled />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="hover:bg-blue-600 hover:text-white"
              >
                Mettre à jour
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
