import { useState, useEffect } from "react";
import List_notes from "./List_notes";
import GroupSelector from "./GroupSelector";
import { groupService } from "../api/groupService";
import { noteService } from "../api/noteService";
import { Group, Note } from "../types"
import '../styles/GroupOfNotes.css';

function GroupOfNotes() {
    const [showAllNotes, setShowAllNotes] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Obtener grupos y notas en paralelo
                const [groupsData, notesData] = await Promise.all([
                    groupService.getAllGroups(),
                    noteService.getAllNotes()
                ]);

                setGroups(groupsData);
                setNotes(notesData);

                // Seleccionar el primer grupo por defecto si hay grupos
                if (groupsData.length > 0) {
                    setSelectedGroupId(groupsData[0].id);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEditGroup = async (groupId: number, newTitle: string) => {
        try {
            // Validación básica
            if (!newTitle.trim()) {
                setError("El nombre del grupo no puede estar vacío");
                return;
            }

            await groupService.updateGroup({
                id: groupId,
                title: newTitle.trim()
            });

            // Actualiza el estado local manteniendo el orden
            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group.id === groupId ? { ...group, title: newTitle.trim() } : group
                )
            );
        } catch (error) {
            console.error("Error updating group:", error);
            setError("Failed to update group");
            throw error; // Importante para que GroupSelector sepa que falló
        }
    };

    const handleAddGroup = async (title: string) => {
        try {
            const newGroup = await groupService.createGroup({ title });
            setGroups([...groups, newGroup]);
            setSelectedGroupId(newGroup.id); // Selecciona el nuevo grupo automáticamente
        } catch (error) {
            console.error("Error adding group:", error);
            setError("Failed to add group");
            throw error;
        }
    };

    const handleEditNote = async (id: number, title: string, description: string) => {
        try {
            // Validación básica
            if (!title.trim() || !description.trim()) {
                setError("Title and description cannot be empty");
                return;
            }

            // Obtener la nota actual para el groupId
            const currentNote = notes.find(note => note.id === id);
            if (!currentNote) {
                setError("Note not found");
                return;
            }

            // Llamar al servicio con todos los campos requeridos
            const updatedNote = await noteService.updateNote({
                id,
                title: title.trim(),
                description: description.trim(),
                groupId: currentNote.groupId
            });

            // Actualizar el estado con la respuesta del servidor
            setNotes(notes.map(note =>
                note.id === id ? updatedNote : note
            ));
        } catch (error) {
            console.error("Error updating note:", error);
            setError("Failed to update note");
            throw error;
        }
    };

    const handleDeleteNote = async (id: number) => {
        try {
            await noteService.deleteNote(id);
            setNotes(notes.filter(note => note.id !== id));
        } catch (error) {
            console.error("Error deleting note:", error);
            setError("Failed to delete note");
            throw error;
        }
    };

    const handleAddNote = async (title: string, description: string, groupId: number) => {
        try {
            const newNote = await noteService.createNote({
                title,
                description,
                groupId
            });
            setNotes([...notes, newNote]);
        } catch (error) {
            console.error("Error adding note:", error);
            setError("Failed to add note");
            throw error;
        }
    };

    const handleDeleteGroup = async (groupId: number) => {
        try {
            // Primero eliminamos todas las notas del grupo
            const notesToDelete = notes.filter(note => note.groupId === groupId);
            await Promise.all(notesToDelete.map(note => noteService.deleteNote(note.id)));

            // Luego eliminamos el grupo
            await groupService.deleteGroup(groupId);

            // Actualizamos el estado
            setGroups(groups.filter(group => group.id !== groupId));
            setNotes(notes.filter(note => note.groupId !== groupId));

            if (selectedGroupId === groupId) {
                setSelectedGroupId(null);
            }
        } catch (error) {
            console.error("Error deleting group:", error);
            setError("Failed to delete group");
            throw error;
        }
    };

    if (loading) return <div className="loading">Loading groups and notes...</div>;
    if (error) return <div className="error">{error}</div>;

    // Modifica el return statement:
    return (
        <div className="group-of-notes-container">
            <div className="group-header">
                <div className="group-selector-wrapper">
                    <GroupSelector
                        groups={groups}
                        selectedGroupId={selectedGroupId}
                        onSelectGroup={setSelectedGroupId}
                        onEditGroup={handleEditGroup}
                        onAddGroup={handleAddGroup}
                        onDeleteGroup={handleDeleteGroup}
                        showAllNotes={showAllNotes}
                        onToggleShowAll={setShowAllNotes}
                    />
                </div>
                {!showAllNotes && selectedGroupId && (
                    <h1 className="group-title-display">
                        {groups.find(g => g.id === selectedGroupId)?.title}
                    </h1>
                )}
                {showAllNotes && (
                    <h1 className="group-title-display">All Notes</h1>
                )}
            </div>

            <div className="notes-main">
                <List_notes
                    notes={notes}
                    onEditNote={handleEditNote}
                    onDeleteNote={handleDeleteNote}
                    onAddNote={handleAddNote}
                    currentGroupId={selectedGroupId}
                    groups={groups}
                    showAllNotes={showAllNotes}
                />
            </div>
        </div>
    );
}

export default GroupOfNotes;



/*
interface Note {
    id: number;
    title: string;
    content: string;
    groupId: number;
}

interface Group {
    id: number;
    title: string;
}

const list: Note[] = [
    {id: 1, title: "Note 1", content: "Content of Note 1", groupId: 1},
    {id: 2, title: "Note 2", content: "Content of Note 2", groupId: 1},
    {id: 3, title: "Note 3", content: "Content of Note 3", groupId: 2},
    {id: 4, title: "Note 4", content: "Content of Note 4", groupId: 3}
];

const listGroup: Group[] = [
    {id: 1, title: "Group 1"},
    {id: 2, title: "Group 2"},
    {id: 3, title: "Group 3"}
];

function GroupOfNotes() {
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    const filteredNotes = selectedGroupId 
        ? list.filter(note => note.groupId === selectedGroupId)
        : list;

    return (
        <>
            
            <GroupSelector 
                groups={listGroup} 
                selectedGroupId={selectedGroupId}
                onSelectGroup={setSelectedGroupId}
            />

            {selectedGroupId && (
                <h2>{listGroup.find(g => g.id === selectedGroupId)?.title}</h2>
            )}

            <List_notes notes={filteredNotes} />
        </>
    )
}

export default GroupOfNotes;

*/