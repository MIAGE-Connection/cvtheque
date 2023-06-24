//Modal.tsx
import React, { HTMLAttributes } from 'react'
type Props = {
  children: React.ReactNode
  open: boolean
  style?: HTMLAttributes<HTMLDivElement>['className']
}

const Modal = ({ children, open, style }: Props) => {
  return (
    <div
      className={`modal !mt-0 modal-bottom sm:modal-middle place-items-center ${
        open ? 'modal-open' : ''
      }`}
    >
      <div className={`modal-box ${style}`}>{children}</div>
    </div>
  )
}

export default Modal
