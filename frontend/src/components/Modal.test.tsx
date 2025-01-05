import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react'; // Import act from 'react'
import Modal from './Modal';

describe('Modal Component', () => {
    beforeEach(() => {
        // Create a div element for the modal-root if not present
        const modalRoot = document.getElementById('modal-root') || document.createElement('div');
        modalRoot.id = 'modal-root';
        document.body.appendChild(modalRoot);
    });

    afterEach(() => {
        // Clean up the modal-root after each test
        const modalRoot = document.getElementById('modal-root');
        if (modalRoot) {
            document.body.removeChild(modalRoot);
        }
    });

    it('renders modal content when isOpen is true', () => {
        render(
            <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('does not render anything when isOpen is false', () => {
        render(
            <Modal isOpen={false} onClose={jest.fn()} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('calls onClose when overlay is clicked', () => {
        const onClose = jest.fn();

        render(
            <Modal isOpen={true} onClose={onClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        fireEvent.click(screen.getByText('Modal Content').closest('.modal-overlay')!);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when close button is clicked', () => {
        const onClose = jest.fn();

        render(
            <Modal isOpen={true} onClose={onClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        fireEvent.click(screen.getByText('×'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when content is clicked', () => {
        const onClose = jest.fn();

        render(
            <Modal isOpen={true} onClose={onClose} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        fireEvent.click(screen.getByText('Modal Content'));
        expect(onClose).not.toHaveBeenCalled();
    });
});
