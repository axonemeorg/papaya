import { ScreenCalculator } from '@ui/components/other/ScreenCalculator'
import { CalculatorContext } from '@ui/contexts/CalculatorContext'
import { PropsWithChildren, useState } from 'react'

export default function CalculatorContextProvider(props: PropsWithChildren) {
  const [_isOpen, setIsOpen] = useState(true)
  const [_currentElement, setCurrentElement] = useState<HTMLElement | null>(null)

  const open = (element: HTMLElement) => {
    setCurrentElement(element)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  const contextValue = { open, close }

  return (
    <CalculatorContext.Provider value={contextValue}>
      {props.children}
      <ScreenCalculator open={false} />
    </CalculatorContext.Provider>
  )
}
