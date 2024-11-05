import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import { MapPin } from 'lucide-react'

export default function CustomMap({ location }: { location: number }) {
  const [markerLocation, setMarkerLocation] = useState({ lat: 0.0, lng: -0.0 })
  const [area, setArea] = useState({ country: '', state: '', county: '' })

  const { isLoading } = useQuery({
    queryKey: ['location'],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?postcode=${location}&lang=en&limit=5&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`
      )
      const { lat, lon, country, county, state } = data.results.at(0)
      setMarkerLocation({ lat, lng: lon })
      setArea({ country, state, county })
      return data
    },
  })

  return (
    <div className='relative w-full'>
      {isLoading ? (
        <div className='space-y-4'>
          <Skeleton className='h-10 w-3/4 bg-secondary' />
          <Skeleton className='w-full-full h-64 bg-secondary' />
        </div>
      ) : (
        <div className=' space-y-4'>
          <iframe
            src={`https://maps.google.com/maps?q=${markerLocation.lat},${markerLocation.lng}&hl=en&z=14&amp&output=embed`}
            className='max-h-64 min-h-64 min-w-full max-w-full'
          ></iframe>
          <div className='flex items-center gap-2'>
            <MapPin />{' '}
            <span className='text-lg'>
              {area.county} {area.state ? `of ${area.state}` : ''} in {area.country}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
