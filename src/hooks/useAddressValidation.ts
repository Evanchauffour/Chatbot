"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'lodash.debounce'

interface AddressSuggestion {
  housenumber?: string
  street?: string
  name?: string
  postcode?: string
  city?: string
  country?: string
}

interface PhotonFeature {
  type: string
  properties: AddressSuggestion
  geometry: {
    type: string
    coordinates: [number, number] // [longitude, latitude]
  }
}

interface PhotonResponse {
  type: string
  features: PhotonFeature[]
}

interface ValidationResult {
  isValid: boolean;
  coordinates: { latitude: number; longitude: number } | null;
}

export const useAddressValidation = () => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null)
  const addressFromSuggestion = useRef(false)
  const userTypedAddress = useRef(false)
  const addressRef = useRef<HTMLDivElement>(null)

  const validateAddressWithPhoton = async (address: string): Promise<ValidationResult> => {
    if (!address) return { isValid: false, coordinates: null }

    try {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1&lang=fr`
      const res = await fetch(url)
      const data: PhotonResponse = await res.json()

      if (!data.features || data.features.length === 0) {
        return { isValid: false, coordinates: null }
      }

      const feature = data.features[0]
      const coords = feature.geometry.coordinates

      const newCoordinates = {
        latitude: coords[1],
        longitude: coords[0]
      }
      
      setCoordinates(newCoordinates)
      return { 
        isValid: true, 
        coordinates: newCoordinates 
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des coordonnées :", err)
      return { isValid: false, coordinates: null }
    }
  }

  const fetchSuggestions = useCallback(
    debounce(async (q: string) => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=fr`
        )
        const data: PhotonResponse = await res.json()
        const labels = data.features.map((f) => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressRef.current && !addressRef.current.contains(event.target as Node)) {
        setSuggestions([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return {
    suggestions,
    setSuggestions,
    searchTerm,
    setSearchTerm,
    addressFromSuggestion,
    userTypedAddress,
    addressRef,
    validateAddressWithPhoton,
    coordinates
  }
} 