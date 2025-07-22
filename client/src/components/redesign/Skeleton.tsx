import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
      {/* Skeleton thumbnail */}
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            translateX: ['100%', '100%', '-100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Skeleton content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-32" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}
