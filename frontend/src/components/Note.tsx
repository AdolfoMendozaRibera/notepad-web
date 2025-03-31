import React, { useState } from 'react';
import { FaEdit, FaEye, FaTrash, FaTimes, FaSpinner, FaExpandAlt } from 'react-icons/fa';
import '../styles/Note.css';

interface NoteProps {
    id: number;
    initialTitle: string;
    initialContent: string;
    onEditNote: (id: number, title: string, content: string) => Promise<void>;
    onDeleteNote: (id: number) => Promise<void>;
}

function Note({ id, initialTitle, initialContent, onEditNote, onDeleteNote }: NoteProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [isModalEditing, setIsModalEditing] = useState(false);
    const [modalTitle, setModalTitle] = useState(initialTitle);
    const [modalContent, setModalContent] = useState(initialContent);

    const handleModalEdit = async () => {
        if (isModalEditing) {
            try {
                setIsProcessing(true);
                await onEditNote(id, modalTitle, modalContent);
                setIsModalEditing(false);
                setTitle(modalTitle);
                setContent(modalContent);
            } finally {
                setIsProcessing(false);
            }
        } else {
            setIsModalEditing(true);
        }
    };

    const handleModalCancel = () => {
        setModalTitle(title);
        setModalContent(content);
        setIsModalEditing(false);
    };

    /*
    const handleEditClick = async () => {
        if (isEditing) {
            try {
                setIsProcessing(true);
                await onEditNote(id, title, content);
                setIsEditing(false);
            } finally {
                setIsProcessing(false);
            }
        } else {
            setIsEditing(true);
        }
    };
    */

    const handleCancel = () => {
        setTitle(initialTitle);
        setContent(initialContent);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        try {
          setIsProcessing(true);
          await onDeleteNote(id);
          // Cierra el modal si está abierto
          if (showModal) {
            setShowModal(false);
          }
        } catch (error) {
          console.error("Error deleting note:", error);
        } finally {
          setIsProcessing(false);
        }
      };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <>
            <div className={`note ${isEditing ? 'editing' : ''}`}>
                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="note-title-input"
                    />
                ) : (
                    <h3 className="note-title">{title}</h3>
                )}

                {isEditing ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content"
                        className="note-content-input"
                    />
                ) : (
                    <p className="note-content-preview">
                        {content.length > 200 ? `${content.substring(0, 200)}...` : content}
                    </p>
                )}

                <div className="note-actions">
                    {!isEditing && (
                        <button
                            onClick={toggleModal}
                            className="action-button expand-button"
                            disabled={isProcessing}
                        >
                            <FaExpandAlt />
                        </button>
                    )}

                    {isEditing ? (
                        <button
                            onClick={handleCancel}
                            className="action-button cancel-button"
                            disabled={isProcessing}
                        >
                            <FaTimes />
                        </button>
                    ) : (
                        <button
                            onClick={handleDelete}
                            className="action-button delete-button"
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <FaSpinner className="spinner" />
                            ) : (
                                <FaTrash />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="note-modal-overlay">
                    <div className="note-modal">
                        <div className="note-modal-header">
                            {isModalEditing ? (
                                <input
                                    type="text"
                                    value={modalTitle}
                                    onChange={(e) => setModalTitle(e.target.value)}
                                    className="modal-title-input"
                                    autoFocus
                                />
                            ) : (
                                <h3>{modalTitle}</h3>
                            )}
                            <button onClick={toggleModal} className="modal-close-button">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="note-modal-content">
                            {isModalEditing ? (
                                <textarea
                                    value={modalContent}
                                    onChange={(e) => setModalContent(e.target.value)}
                                    className="modal-content-input"
                                />
                            ) : (
                                <p>{modalContent}</p>
                            )}
                        </div>

                        <div className="note-modal-actions">
                            <button
                                onClick={handleModalEdit}
                                className="modal-action-button modal-edit-button"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <FaSpinner className="spinner" />
                                ) : isModalEditing ? (
                                    <FaEye />
                                ) : (
                                    <FaEdit />
                                )}
                            </button>

                            {isModalEditing ? (
                                <button
                                    onClick={handleModalCancel}
                                    className="modal-action-button modal-cancel-button"
                                    disabled={isProcessing}
                                >
                                    <FaTimes />
                                </button>
                            ) : (
                                <button
                                    onClick={handleDelete}
                                    className="modal-action-button modal-delete-button"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <FaSpinner className="spinner" />
                                    ) : (
                                        <>
                                            <FaTrash />
                                            <span>Delete</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Note;