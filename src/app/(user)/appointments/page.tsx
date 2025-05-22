"use client";

import AppointmentCard from "@/components/appointments/AppointmentCard";
import React, { useEffect } from "react";
import { useState } from "react";
import dayjs from "dayjs";

interface Appointment {
  id: string;
  appointmentDate: Date;
  dealership: {
    name: string;
    city: string;
    address: string;
  };
  vehicle: {
    id: string;
    brand: string;
    model: string;
  };
}

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const today = dayjs().toDate();

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/user/appointments",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      const sortedData = data.sort(
        (a: Appointment, b: Appointment) =>
          dayjs(b.appointmentDate).valueOf() -
          dayjs(a.appointmentDate).valueOf()
      );
      setAppointments(sortedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Liste de mes rendez-vous</h1>
      <div className="grid grid-cols-2 gap-4 mt-10">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            dealership={appointment.dealership}
            date={appointment.appointmentDate}
            vehicle={appointment.vehicle}
            isPast={dayjs(appointment.appointmentDate)
              .startOf("day")
              .isBefore(dayjs(today).startOf("day"))}
          />
        ))}
      </div>
    </div>
  );
}
