//Modal.tsx
import React from 'react'
type Props = {
  children: React.ReactNode
  open: boolean
}

const Modal = ({ children, open }: Props) => {
  return (
    <div className={`modal modal-bottom sm:modal-middle ${open ? 'modal-open' : ''}`}>
      <div className="modal-box">{children}</div>
    </div>
  )
}

export default Modal
