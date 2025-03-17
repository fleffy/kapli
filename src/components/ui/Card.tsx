import { ReactNode } from 'react'

interface CardProps {
	children: ReactNode
	className?: string
}

export function Card({ children, className = '' }: CardProps) {
	return (
		<div className={`bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
			{children}
		</div>
	)
}
