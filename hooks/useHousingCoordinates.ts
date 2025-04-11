"use client"

import { useState, useEffect } from "react"
import fetchSearchResults from "@/lib/fetchSearchResults"

const useHousingCoordinates = () => {
  const [coordinates, setCoordinates] = useState<[number, number][]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await fetchSearchResults()
        setCoordinates(results.map(hit => hit._source.location))
      } catch (error) {
        console.error("Error fetching coordinates:", error)
      }
    }
    fetchData()
  }, [])

  return coordinates
}

export default useHousingCoordinates