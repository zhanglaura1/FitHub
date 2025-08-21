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
                <div className="rounded-xl p-6 w-screen h-[100px] backdrop:bg-black/50 flex flex-col">
                    <p>Are you sure you want to delete this post?</p>
                    <div className="flex justify-center gap-x-5 mt-3">
                        <button className="cursor-pointer text-text" onClick={handleClose}>Cancel</button>
                        <button className="cursor-pointer text-red-700" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default ConfirmDelete