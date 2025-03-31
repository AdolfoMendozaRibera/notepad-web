import { useState } from 'react';
import Note from './Note';
import '../styles/List_notes.css';
import { FaPlus } from 'react-icons/fa';

interface NoteItem {
    id: number;
    title: string;
    description: string;
    groupId: number;
    groupTitle?: string;
}

interface List_notesProps {
    notes: NoteItem[];
    onEditNote: (id: number, title: string, description: string) => Promise<void>;
    onDeleteNote: (id: number) => Promise<void>;
    onAddNote: (title: string, description: string, groupId: number) => Promise<void>;
    currentGroupId: number | null;
    groups: Array<{ id: number; title: string }>;
    showAllNotes: boolean;
}

function List_notes({
    notes,
    onEditNote,
    onDeleteNote,
    onAddNote,
    currentGroupId,
    groups,
    showAllNotes
}: List_notesProps) {
    const [titleSearch, setTitleSearch] = useState('');
    const [contentSearch, setContentSearch] = useState('');
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);

    // Añadir groupTitle a cada nota
    const notesWithGroup = notes.map(note => ({
        ...note,
        groupTitle: groups.find(g => g.id === note.groupId)?.title || 'Unknown Group'
    }));

    const filteredNotes = notesWithGroup.filter(note => {
        const matchesTitle = note.title.toLowerCase().includes(titleSearch.toLowerCase());
        const matchesContent = note.description.toLowerCase().includes(contentSearch.toLowerCase());
        const matchesGroup = showAllNotes || (currentGroupId ? note.groupId === currentGroupId : true);
        return matchesTitle && matchesContent && matchesGroup;
    });

    const handleAddNote = async () => {
        if (!newNoteTitle.trim() || !currentGroupId) return;

        try {
            await onAddNote(newNoteTitle.trim(), newNoteContent.trim(), currentGroupId);
            setNewNoteTitle('');
            setNewNoteContent('');
            setIsAddingNote(false);
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    return (
        <div className="notes-container">
            <div className="notes-search">
                <div className="search-group">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={titleSearch}
                        onChange={(e) => setTitleSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="search-group">
                    <input
                        type="text"
                        placeholder="Search by content..."
                        value={contentSearch}
                        onChange={(e) => setContentSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="notes-actions">
                {currentGroupId !== null && (
                    <button
                        onClick={() => setIsAddingNote(true)}
                        className="add-note-button"
                        disabled={isAddingNote}
                    >
                        <FaPlus /> Add Note
                    </button>
                )}
            </div>

            {isAddingNote && currentGroupId && (
                <div className="add-note-form-container">
                    <div className="add-note-form">
                        <h3 className="form-title">New Note</h3>
                        <input
                            type="text"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            placeholder="Note title..."
                            className="form-input"
                            autoFocus
                        />
                        <textarea
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            placeholder="Write your note content here..."
                            className="form-textarea"
                            rows={5}
                        />
                        <div className="form-actions">
                            <button
                                onClick={() => setIsAddingNote(false)}
                                className="form-button cancel-button"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddNote}
                                className="form-button save-button"
                                disabled={!newNoteTitle.trim()}
                            >
                                Create Note
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {filteredNotes.length > 0 ? (
                <div className="list-notes">
                    {filteredNotes.map((note) => (
                        <div key={note.id} className="note-container">
                            {showAllNotes && (
                                <div className="note-group-badge">
                                    {note.groupTitle}
                                </div>
                            )}
                            <Note
                                id={note.id}
                                initialTitle={note.title}
                                initialContent={note.description}
                                onEditNote={onEditNote}
                                onDeleteNote={onDeleteNote}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-notes">
                    {notes.length === 0 ? 'No notes available' : 'No notes match your search'}
                </div>
            )}
        </div>
    );
}

export default List_notes;