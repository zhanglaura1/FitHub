import { useEffect, useRef } from 'react'

const ConfirmDelete = ({ isOpen, onClose, deletePost }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (dialogRef.current) {
            if (isOpen) {
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }
    }, [isOpen]);

    const handleClose = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        onClose();
    }

    const handleDelete = () => {
        deletePost();
        handleClose();
    }

    return (
        <div>
            <dialog ref={dialogRef} onCancel={handleClose}>
                <p>Are you sure you want to delete this post?</p>
                <button className="delete" onClick={handleDelete}>Delete</button>
                <button className="cancel" onClick={handleClose}>Cancel</button>
            </dialog>
        </div>
    )
}

export default ConfirmDelete