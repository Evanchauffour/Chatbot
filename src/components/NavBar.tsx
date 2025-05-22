"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Calendar, Car, House, LogOut, User } from "lucide-react";
import { logout } from "@/actions/auth";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useUserStore } from "@/store/user.store";
import { usePathname } from "next/navigation"; // 👈 import du hook

export default function NavBar() {
  useFetchUser();
  const { user } = useUserStore();
  const pathname = usePathname(); // 👈 obtenir le chemin courant

  return (
    <aside className="w-64 h-full bg-gray-100 flex flex-col justify-between">
      <div className="flex flex-col">
        {/* Logo */}
        <div className="flex justify-center items-center py-6">
          <img
            src="/logo.jpg"
            alt="Logo de la société"
            width={120}
            height={40}
          />
        </div>

        {/* Liens de navigation */}
        <nav className="flex-grow">
          <ul className="flex flex-col">
            <Button
              variant="ghost"
              asChild
              className={`group justify-start p-6 rounded-md transition-colors ${
                pathname === "/"
                  ? "bg-gray-300 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
            >
              <Link href="/" className="flex items-center">
                <House className="w-4 h-4 mr-2 group-hover:text-blue-600" />
                <span className="group-hover:text-blue-600">Accueil</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              asChild
              className={`group justify-start p-6 rounded-md transition-colors ${
                pathname.startsWith("/appointments")
                  ? "bg-gray-300 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
            >
              <Link href="/appointments" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 group-hover:text-blue-600" />
                <span className="group-hover:text-blue-600">Rendez-vous</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className={`group justify-start p-6 rounded-md transition-colors ${
                pathname.startsWith("/vehicles")
                  ? "bg-gray-300 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
            >
              <Link href="/vehicles" className="flex items-center">
                <Car className="w-4 h-4 mr-2 group-hover:text-blue-600" />
                <span className="group-hover:text-blue-600">Véhicules</span>
              </Link>
            </Button>
          </ul>
        </nav>
      </div>

      {/* Profil + déconnexion */}
      <div className="flex justify-between items-center px-4 py-6">
        <Button
          variant="ghost"
          asChild
          className={`group justify-start p-6 rounded-md transition-colors ${
            pathname.startsWith("/profile")
              ? "text-blue-600"
              : ""
          }`}
        >
          <Link href="/profile">
            <User className="w-4 h-4 mr-2" />
            {user?.firstName} {user?.lastName}
          </Link>
        </Button>
        <Button variant="ghost" onClick={logout} className="group">
          <LogOut className="w-4 h-4 mr-2 text-gray-700 group-hover:text-red-600 transition-colors duration-200" />
        </Button>
      </div>
    </aside>
  );
}
