import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatItem {
  label: string
  value: number | string
  icon: LucideIcon
  color: string
  bgColor: string
}

interface StatisticsProps {
  stats: StatItem[]
}

export const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="stats-container">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className={`stat-icon ${stat.bgColor}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
