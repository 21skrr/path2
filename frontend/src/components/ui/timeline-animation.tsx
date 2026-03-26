import * as React from "react"
import { motion, HTMLMotionProps, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

export interface TimelineContentProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  as?: any
  animationNum?: number
  timelineRef?: React.RefObject<any>
  customVariants?: Variants
  className?: string
  children?: React.ReactNode
}

export const TimelineContent = React.forwardRef<HTMLElement, TimelineContentProps>(
  (
    {
      as: Component = "div",
      animationNum = 0,
      timelineRef,
      customVariants,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Determine which variants to use
    const defaultVariants: Variants = {
      hidden: { opacity: 0, y: 20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
      }),
    }
    const variants = customVariants || defaultVariants

    const MotionComponent = motion(Component)

    return (
      <MotionComponent
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, root: timelineRef }}
        custom={animationNum}
        variants={variants}
        className={cn(className)}
        {...(props as any)}
      >
        {children}
      </MotionComponent>
    )
  }
)

TimelineContent.displayName = "TimelineContent"
