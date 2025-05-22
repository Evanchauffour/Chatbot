// components/Map.tsx
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
// Dynamically import the map components with no SSR
const Map = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

// Custom marker icons
const createCustomIcon = (isSelected: boolean, dealership: Dealership) => {
  return L.divIcon({
    className: 'custom-marker',
    html: 
    `
    <div class="relative">
      ${isSelected 
        ? `
        <div class="absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-lg p-4 shadow-xl border border-gray-200 min-w-[250px] transform transition-all duration-300 ease-in-out">
          <div class="flex flex-col gap-2">
            <p class="text-base font-bold text-gray-800 whitespace-normal">${dealership.name}</p>
            ${dealership.address ? `<p class="text-sm text-gray-600 whitespace-normal">${dealership.address}</p>` : ''}
          </div>
        </div>
        `
        : `
        <div class="relative group z-50">
          <div class="w-4 h-4 bg-blue-500 rounded-full transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:bg-blue-600 shadow-lg"></div>
          <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg text-sm font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg border border-gray-100">
            ${dealership.name}
          </div>
        </div>
        `
      }
    </div>
    `,
    iconSize: isSelected ? [250, 100] : [16, 16],
    iconAnchor: isSelected ? [125, 100] : [8, 8],
    popupAnchor: isSelected ? [0, -100] : [0, -8]
  })
}

const userLocationIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div class="relative">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-500/30 rounded-full animate-ping"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-500/10 rounded-full animate-ping" style="animation-delay: 0.5s"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
})

interface Dealership {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

interface MapProps {
  dealerships: Dealership[];
  dealershipSelected: string;
  userLocation: {
    latitude: number;
    longitude: number;
  };
}

export default function MapComponent({ dealerships, dealershipSelected, userLocation }: MapProps) {

  if(userLocation.latitude === 0 && userLocation.longitude === 0 && dealerships.length === 0) {
    return (
      <div className='w-full h-full aspect-video flex items-center justify-center'>
        <p>Chargement de la position...</p>
      </div>
    )
  }

  return (
    <Map
      center={[userLocation.latitude, userLocation.longitude] as [number, number]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      className='aspect-video'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {dealerships.map((dealership) => (        
        <Marker
          key={dealership.id}
          position={[dealership.latitude, dealership.longitude] as [number, number]}
          icon={createCustomIcon(dealership.id === dealershipSelected, dealership)}
        >
          <div></div>
        </Marker>
      ))}
      <Marker
        position={[userLocation.latitude, userLocation.longitude] as [number, number]}
        icon={userLocationIcon}
      >
        <div></div>
      </Marker>
    </Map>
  )
}
