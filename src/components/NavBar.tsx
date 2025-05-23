"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Calendar, Car, House, LogOut, Menu, User } from "lucide-react";
import { logout } from "@/actions/auth";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useUserStore } from "@/store/user.store";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function NavBar() {
  useFetchUser();
  const { user } = useUserStore();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} h-full bg-gray-100 flex flex-col justify-between relative transition-all duration-300 shadow-lg`}>
      <div className="flex flex-col">
        {/* Logo */}
        <div className={`flex items-center py-6 w-full px-4 border-b border-gray-200 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <Image
              src="/logo.jpg"
              alt="Logo de la société"
              width={100}
              height={40}
            />
          )}
          <Button 
            variant="ghost" 
            className={`${isCollapsed ? '' : 'absolute right-0'} hover:bg-gray-200`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="size-6" />
          </Button>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-grow py-4">
          <ul className="flex flex-col gap-2">
            <Button
              variant="ghost"
              asChild
              className={`group rounded-md transition-colors ${
                isCollapsed ? 'flex items-center justify-center p-2 w-10 h-10 mx-auto' : 'flex justify-start p-4 w-full'
              } ${
                pathname === "/"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
            >
              <Link href="/" className="flex items-center">
                <House className="w-5 h-5 group-hover:text-blue-600" />
                {!isCollapsed && <span className="ml-3 group-hover:text-blue-600">Accueil</span>}
              </Link>
            </Button>

            <Button
              variant="ghost"
              asChild
              className={`group rounded-md transition-colors ${
                isCollapsed ? 'flex items-center justify-center p-2 w-10 h-10 mx-auto' : 'flex justify-start p-4 w-full'
              } ${
                pathname.startsWith("/appointments")
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
            >
              <Link href="/appointments" className="flex items-center">
                <Calendar className="w-5 h-5 group-hover:text-blue-600" />
                {!isCollapsed && <span className="ml-3 group-hover:text-blue-600">Rendez-vous</span>}
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className={`group rounded-md transition-colors ${
                isCollapsed ? 'flex items-center justify-center p-2 w-10 h-10 mx-auto' : 'flex justify-start p-4 w-full'
              } ${
                pathname.startsWith("/vehicles")
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-200"
              }`}
            >
              <Link href="/vehicles" className="flex items-center">
                <Car className="w-5 h-5 group-hover:text-blue-600" />
                {!isCollapsed && <span className="ml-3 group-hover:text-blue-600">Véhicules</span>}
              </Link>
            </Button>
          </ul>
        </nav>
      </div>

      {/* Profil + déconnexion */}
      <div className="border-t border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-4`}>
          <Button
            variant="ghost"
            asChild
            className={`group rounded-md transition-colors ${
              isCollapsed ? 'flex items-center justify-center p-2 w-10 h-10' : 'flex justify-start p-4 w-full'
            } ${
              pathname.startsWith("/profile")
                ? "text-blue-600"
                : ""
            }`}
          >
            <Link href="/profile" className="flex items-center">
              <User className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3 group-hover:text-blue-600">{user?.firstName} {user?.lastName}</span>}
            </Link>
          </Button>
        </div>
        <div className={`py-2 ${isCollapsed ? 'flex justify-center' : 'px-4'}`}>
          <Button 
            variant="ghost" 
            onClick={logout} 
            className={`rounded-md hover:bg-red-50 group ${isCollapsed ? 'flex items-center justify-center p-2 w-10 h-10' : 'w-full justify-start p-4'}`}
          >
            <LogOut className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition-colors duration-200" />
            {!isCollapsed && <span className="ml-3 text-gray-700 group-hover:text-red-600">Déconnexion</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
