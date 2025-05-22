import { useState } from 'react'

interface Coordinates {
  latitude: number
  longitude: number
}

export const useGeocoding = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getCoordinatesFromAddress = async (address: string): Promise<Coordinates | null> => {
    if (!address) {
      setError('Adresse manquante')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      const data = await res.json()

      if (!data || data.length === 0) {
        setError('Adresse introuvable')
        return null
      }

      const coordinates = {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      }
      
      setCoordinates(coordinates)
      return coordinates
    } catch (err) {
      setError('Erreur lors de la récupération des coordonnées')
      console.error('Erreur de géocodage :', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    coordinates,
    error,
    isLoading,
    getCoordinatesFromAddress
  }
} 