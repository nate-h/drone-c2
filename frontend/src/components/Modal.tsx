import "./Modal.scss"

import { useEffect, useRef, useState, ReactNode } from 'react';
import ReactDOM from "react-dom";


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{title}
                    <button className="modal-close" onClick={onClose}>
                        &times;
                    </button>
                </h2>
                <div className="modal-body">{children}</div>
            </div>
        </div>,
        document.getElementById("modal-root") as HTMLElement // Ensure type safety

    );
}