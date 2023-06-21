//Modal.tsx
import React from 'react'
type Props = {
  children: React.ReactNode
  open: boolean
  style?: React.CSSProperties
}

const Modal = ({ children, open, style }: Props) => {
  return (
    <div className={`modal modal-bottom sm:modal-middle ${open ? 'modal-open' : ''}`}>
      <div className="modal-box" style={style}>
        {children}
      </div>
    </div>
  )
}

export default Modal
