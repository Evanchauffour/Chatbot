"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useCallback, useEffect, useRef, useState } from "react"
import debounce from "lodash.debounce"


interface SignupFormData {
  email: string
  plainPassword: string
  title: string
  lastName: string
  firstName: string
  address: string
  phoneNumber: string
}

export default function SignupPage() {
  const addressFromSuggestion = useRef(false)
  const userTypedAddress = useRef(false)

  const router = useRouter()
  const form = useForm<SignupFormData>({
    defaultValues: {
      email: "",
      plainPassword: "",
      title: "",
      lastName: "",
      firstName: "",
      address: "",
      phoneNumber: "",
    },
  })

  async function onSubmit(values: SignupFormData) {
    try {
      const response = await fetch("http://localhost:8000/api/public/user", {
        method: "POST",
        headers: {
          'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription")
      }

      router.push("/signin")
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      // Vous pouvez ajouter ici la gestion des erreurs dans le formulaire si nécessaire
    }
  }

  const validateAddressWithPhoton = async (address: string) => {
    // ✅ Si l'adresse vient d'une suggestion, on l'accepte directement
    if (addressFromSuggestion.current) {
      return true // ne PAS le reset ici ❌
    }

    if (!address) return false

    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1&lang=fr`
      )
      const data = await res.json()

      if (!data.features || data.features.length === 0) return false

      const props = data.features[0].properties

      const hasCompleteInfo =
        props.housenumber &&
        (props.street || props.name) &&
        props.postcode &&
        props.city &&
        props.country

      if (!hasCompleteInfo) return false

      const normalize = (str: string) =>
        str.toLowerCase().replace(/\s+/g, " ").trim()

      const formattedAddress = [
        props.housenumber,
        props.street || props.name,
        props.postcode,
        props.city,
        props.country
      ]
        .filter(Boolean)
        .join(", ")

      return normalize(formattedAddress) === normalize(address)
    } catch (err) {
      console.error("Erreur lors de la validation d'adresse :", err)
      return false
    }
  }




  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const fetchSuggestions = useCallback(
    debounce(async (q: string) => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=fr`
        )
        const data = await res.json()
        const labels = data.features.map((f: any) => {
          const props = f.properties

          const street = props.street || props.name || ""
          const housenumber = props.housenumber ? `${props.housenumber} ` : ""

          return [
            `${housenumber}${street}`.trim(),
            props.postcode,
            props.city,
            props.country
          ].filter(Boolean).join(", ")
        })
        setSuggestions(labels)
      } catch (err) {
        console.error("Erreur d'autocomplétion Photon :", err)
      }
    }, 400),
    []
  )

  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([])
      return
    }
    fetchSuggestions(searchTerm)
  }, [searchTerm, fetchSuggestions])
  const addressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressRef.current && !addressRef.current.contains(event.target as Node)) {
        setSuggestions([]) // ferme les suggestions
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Inscription</CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Créez votre compte pour commencer
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              const isValid = await form.trigger()

              // 🧼 On reset le flag après usage

              if (isValid) {
                onSubmit(form.getValues())

              }
            }}
            className="space-y-4"
          >            
          <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="M." {...field} />
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
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                rules={{
                  validate: async (value) => {
                    const isValid = await validateAddressWithPhoton(value)
                    return isValid || "Adresse introuvable. Veuillez choisir une adresse valide."
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
                                  userTypedAddress.current = false
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
              <FormField
                control={form.control}
                name="plainPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-9 sm:h-10">
                S&apos;inscrire
              </Button>
              <div className="text-xs sm:text-sm text-muted-foreground text-center">
                Déjà un compte ?{" "}
                <Link href="/signin" className="text-primary underline-offset-4 hover:underline">
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
