import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface EnhancedLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'pulse' | 'dots'
  text?: string
  className?: string
  fullScreen?: boolean
}

export function EnhancedLoading({
  size = 'md',
  variant = 'spinner',
  text,
  className,
  fullScreen = false,
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }

  const LoadingComponent = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div
            className={cn(
              'animate-pulse bg-gray-300 rounded',
              sizeClasses[size],
              className
            )}
          />
        )

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'bg-gray-400 rounded-full animate-pulse',
                  size === 'sm'
                    ? 'h-1 w-1'
                    : size === 'md'
                      ? 'h-2 w-2'
                      : size === 'lg'
                        ? 'h-3 w-3'
                        : 'h-4 w-4',
                  className
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s',
                }}
              />
            ))}
          </div>
        )

      default:
        return (
          <Loader2
            className={cn(
              'animate-spin text-gray-500',
              sizeClasses[size],
              className
            )}
          />
        )
    }
  }

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <LoadingComponent />
      {text && (
        <p className={cn('text-gray-600 font-medium', textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}

// Specific loading components for different use cases
export function PageLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <EnhancedLoading size="lg" text={text} />
    </div>
  )
}

export function InlineLoading({ text }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <EnhancedLoading size="sm" />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  )
}

export function ButtonLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <EnhancedLoading size="sm" />
      <span>{text}</span>
    </div>
  )
}

export function FullScreenLoading({ text = 'Loading...' }: { text?: string }) {
  return <EnhancedLoading fullScreen text={text} size="xl" />
}
