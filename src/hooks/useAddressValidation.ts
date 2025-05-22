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
  properties: AddressSuggestion
}

interface PhotonResponse {
  features: PhotonFeature[]
}

export const useAddressValidation = () => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const addressFromSuggestion = useRef(false)
  const userTypedAddress = useRef(false)
  const addressRef = useRef<HTMLDivElement>(null)

  const validateAddressWithPhoton = async (address: string): Promise<boolean> => {
    if (addressFromSuggestion.current) {
      return true
    }

    if (!address) return false

    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1&lang=fr`
      )
      const data: PhotonResponse = await res.json()

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
    validateAddressWithPhoton
  }
} 