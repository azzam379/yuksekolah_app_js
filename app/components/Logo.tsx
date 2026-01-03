'use client'

import Image from 'next/image'
import { useState } from 'react'

interface LogoProps {
    variant?: 'full' | 'icon'
    className?: string
}

export default function Logo({ variant = 'full', className = '' }: LogoProps) {
    // Logic: 
    // 1. Check if an image logo exists (e.g. /logo.png). 
    // 2. If yes, render Image. 
    // 3. If no, render the default text-based logo.

    // For now, we will assume image 'logo.png' MIGHT exist, but we default to the text version
    // because we haven't received the file yet. 
    // However, I will code this to prioritize the text version matching the previous design
    // but structred so it's easy to swap.

    const [imageError, setImageError] = useState(false)

    // Use the uploaded logo.svg
    const IconLogo = () => (
        <div className={`relative ${className} w-10 h-10`}>
            <Image
                src="/logo.svg"
                alt="Logo"
                fill
                className="object-contain"
            />
        </div>
    )

    if (variant === 'icon') {
        // Attempt to load image if we wanted to support it directly now, 
        // but for now let's stick to the CSS version to ensure no regression.
        return (
            <div className={`w-10 h-10 ${className}`}>
                <IconLogo />
            </div>
        )
    }

    // Determine text color based on className or default to gray-900
    const textColor = className.includes('text-white') ? 'text-white' : 'text-gray-900';

    return (
        <div className={`flex items-center space-x-3 ${className.replace('text-white', '')}`}>
            <div className="w-10 h-10">
                <IconLogo />
            </div>
            <span className={`text-xl font-bold tracking-tight ${textColor}`}>
                Yuksekolah
            </span>
        </div>
    )
}
