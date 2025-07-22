import React from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface FloatingActionButtonProps {
  onClick: () => void
  label?: string
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  label = "Create new list"
}) => {
  return (
    <motion.button
      className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 z-50 group"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }}
    >
      <Plus className="w-6 h-6" />

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
          {label}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </motion.button>
  )
}
