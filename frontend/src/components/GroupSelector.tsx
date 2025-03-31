import React, { useState, useEffect } from "react";
import '../styles/GroupSelector.css';
import { FaEdit, FaTrash, FaSpinner, FaPlus, FaChevronDown, FaSearch } from 'react-icons/fa';

interface Group {
    id: number;
    title: string;
}

interface GroupSelectorProps {
    groups: Group[];
    selectedGroupId: number | null;
    onSelectGroup: (groupId: number | null) => void;
    onEditGroup: (groupId: number, newTitle: string) => Promise<void>;
    onAddGroup: (title: string) => Promise<void>;
    onDeleteGroup: (groupId: number) => Promise<void>;
    showAllNotes: boolean;
    onToggleShowAll: (show: boolean) => void;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
    groups,
    selectedGroupId,
    onSelectGroup,
    onEditGroup,
    onAddGroup,
    onDeleteGroup,
    showAllNotes,
    onToggleShowAll
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [newGroupTitle, setNewGroupTitle] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar grupos basados en el término de búsqueda
    const filteredGroups = groups.filter(group =>
        group.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedGroup = groups.find(g => g.id === selectedGroupId) || { title: "Select a group..." };

    const handleEditClick = async (group: Group, e: React.MouseEvent) => {
        e.stopPropagation();
        if (editingGroupId === group.id) {
            try {
                setIsProcessing(true);
                await onEditGroup(group.id, editValue);
                setEditingGroupId(null);
            } finally {
                setIsProcessing(false);
            }
        } else {
            setEditValue(group.title);
            setEditingGroupId(group.id);
        }
    };

    const handleDeleteClick = async (groupId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setIsProcessing(true);
            await onDeleteGroup(groupId); // Esto llama a la función handleDeleteGroup del padre
            if (selectedGroupId === groupId) {
                onSelectGroup(null);
                onToggleShowAll(true); // Mostrar todas las notas después de eliminar el grupo
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddGroup = async () => {
        if (!newGroupTitle.trim()) return;

        try {
            setIsProcessing(true);
            await onAddGroup(newGroupTitle.trim());
            setNewGroupTitle("");
            setSearchTerm("");
        } finally {
            setIsProcessing(false);
        }
    };





    // Cerrar el dropdown cuando se hace clic fuera
    useEffect(() => {
        const handleClickOutside = () => setIsOpen(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="group-selector-container" onClick={(e) => e.stopPropagation()}>
            <div
                className="group-selector-dropdown"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                <span>{showAllNotes ? "All Notes" : selectedGroup.title}</span>
                <FaChevronDown className={`dropdown-icon ${isOpen ? 'open' : ''}`} />
            </div>

            {isOpen && (
                <div className="group-selector-menu">
                    {/* Barra de búsqueda */}
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            autoFocus
                        />
                    </div>

                    <div className="group-list">
                        {/* Opción para mostrar todas las notas */}
                        <div
                            className={`group-item ${showAllNotes ? 'selected' : ''}`}
                            onClick={() => {
                                onSelectGroup(null);
                                onToggleShowAll(true);
                                setIsOpen(false);
                            }}
                        >
                            <span className="group-title">All Notes</span>
                        </div>

                        {filteredGroups.length > 0 ? (
                            filteredGroups.map(group => (
                                <div
                                    key={group.id}
                                    className={`group-item ${selectedGroupId === group.id && !showAllNotes ? 'selected' : ''}`}
                                    onClick={() => {
                                        onSelectGroup(group.id);
                                        onToggleShowAll(false);
                                        setIsOpen(false);
                                    }}
                                >
                                    {editingGroupId === group.id ? (
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="group-edit-input"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <span className="group-title">{group.title}</span>
                                    )}

                                    <div className="group-actions">
                                        <button
                                            onClick={(e) => handleEditClick(group, e)}
                                            className="action-button edit"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing && editingGroupId === group.id ? (
                                                <FaSpinner className="spinner" />
                                            ) : (
                                                <FaEdit />
                                            )}
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteClick(group.id, e)}
                                            className="action-button delete"
                                            disabled={isProcessing}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                No groups found
                            </div>
                        )}
                    </div>

                    <div className="add-group-form">
                        <input
                            type="text"
                            value={newGroupTitle}
                            onChange={(e) => setNewGroupTitle(e.target.value)}
                            placeholder="New group name"
                            className="group-add-input"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={handleAddGroup}
                            className="add-button"
                            disabled={isProcessing || !newGroupTitle.trim()}
                        >
                            {isProcessing ? <FaSpinner className="spinner" /> : <FaPlus />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupSelector;