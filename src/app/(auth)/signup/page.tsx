import { Metadata } from "next"
import Link from "next/link"

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
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Inscription</CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Créez votre compte pour commencer
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm sm:text-base">Nom complet</Label>
            <Input id="name" type="text" placeholder="John Doe" className="h-9 sm:h-10" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
            <Input id="email" type="email" placeholder="m@exemple.com" className="h-9 sm:h-10" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city" className="text-sm sm:text-base">Ville</Label>
            <Input id="city" type="text" placeholder="Paris" className="h-9 sm:h-10" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-sm sm:text-base">Mot de passe</Label>
            <Input id="password" type="password" className="h-9 sm:h-10" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirmer le mot de passe</Label>
            <Input id="confirmPassword" type="password" className="h-9 sm:h-10" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full h-9 sm:h-10">S&apos;inscrire</Button>
          <div className="text-xs sm:text-sm text-muted-foreground text-center">
            Déjà un compte ?{" "}
            <Link href="/signin" className="text-primary underline-offset-4 hover:underline">
              Se connecter
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
