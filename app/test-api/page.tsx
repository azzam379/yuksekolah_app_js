'use client'

import { useEffect } from 'react'
import { authApi } from '@/lib/api'

export default function TestApiPage() {
  useEffect(() => {
    // Test simple GET request
    fetch('http://localhost:8000/api/test')
      .then(res => res.json())
      .then(data => console.log('Test API:', data))
      .catch(err => console.error('API Error:', err))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Testing API Connection</h1>
      <p className="mt-4">Check browser console for results.</p>
    </div>
  )
}