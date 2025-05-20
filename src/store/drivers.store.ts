import { create } from 'zustand'

interface Driver {
  "@id": string
  id: string
  firstName: string
  lastName: string
}

interface DriversStore {
  drivers: Driver[]
  setDrivers: (drivers: Driver[]) => void
}

const useDriversStore = create<DriversStore>((set) => ({
  drivers: [],
  setDrivers: (drivers: Driver[]) => set({ drivers }),
}))

export default useDriversStore