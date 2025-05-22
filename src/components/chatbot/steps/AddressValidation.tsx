"use client"

import React from 'react'
import { useUserStore } from '@/store/user.store'
import { Button } from '@/components/ui/button'
import { useAddressValidation } from '@/hooks/useAddressValidation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useChatbotStore } from '@/store/chatbot.store'

interface AddressFormData {
  address: string
}

export default function AddressValidation() {
  const { setOperationStep, setUserAddress, setUserCoordinates } = useChatbotStore()
  const { user } = useUserStore()
  const form = useForm<AddressFormData>({
    defaultValues: {
      address: user?.address || "",
    },
  })

  const {
    suggestions,
    setSuggestions,
    setSearchTerm,
    addressFromSuggestion,
    addressRef,
    validateAddressWithPhoton
  } = useAddressValidation()

  const handleSubmit = async (data: AddressFormData) => {
    try {
      const result = await validateAddressWithPhoton(data.address)
      if (result.coordinates) {
        setUserAddress(data.address)
        setUserCoordinates(result.coordinates)
        setOperationStep("appointment_scheduling")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='flex flex-col gap-4 w-full'>
      <h3 className='text-lg font-medium'>Valider votre adresse</h3>
      <p>Voici l&apos;adresse renseignée dans votre profil, vous pouvez la modifier si nécessaire :</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            rules={{
              validate: async (value) => {
                const result = await validateAddressWithPhoton(value)
                return result.coordinates ? true : "Impossible de trouver les coordonnées pour cette adresse."
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <div className="relative" ref={addressRef}>
                    <Input
                      placeholder="123 rue de Paris"
                      {...field}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e)
                        setSearchTerm(e.target.value)
                      }}
                      autoComplete="off"
                    />
                    {suggestions.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white text-black border border-gray-300 rounded shadow-md max-h-48 overflow-y-auto text-sm">
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              addressFromSuggestion.current = true
                              form.setValue("address", suggestion)
                              form.trigger("address")
                              setSearchTerm(suggestion)
                              setSuggestions([])
                            }}
                            className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Valider</Button>
        </form>
      </Form>
    </div>
  )
}
