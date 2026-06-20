import React, { useState } from "react";
import { Search, Plus, Trash2, FileText, UploadCloud, Tag, X } from "lucide-react";
import useLocalStorage from "../hooks/useLocalStorage";
import { INITIAL_NOTES } from "../utils/mockData";
import Card from "../components/Card";
import Button from "../components/Button";

const Notes = () => {
  const [notes, setNotes] = useLocalStorage("notes", INITIAL_NOTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  // Form states for adding notes manually
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTagsStr, setNewTagsStr] = useState("");

  // Detailed view note modal state
  const [viewingNote, setViewingNote] = useState(null);

  // File upload drag state
  const [dragActive, setDragActive] = useState(false);

  // Add notes manually
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Please enter a title and content.");
      return;
    }

    const parsedTags = newTagsStr
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const newNote = {
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ["General"],
      updatedAt: new Date().toISOString().split("T")[0]
    };

    setNotes([newNote, ...notes]);
    
    // Reset Form states
    setNewTitle("");
    setNewContent("");
    setNewTagsStr("");
    setIsCreating(false);
  };

  // Delete note
  const handleDeleteNote = (id, e) => {
    e.stopPropagation(); // Stop click from triggering parent card open
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((note) => note.id !== id));
      if (viewingNote && viewingNote.id === id) {
        setViewingNote(null);
      }
    }
  };

  // Parse files dropped / uploaded on the client side
  const handleFile = (file) => {
    if (!file) return;

    // Check if it's text or markdown
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const content = e.target.result;
      const cleanName = file.name.replace(/\.[^/.]+$/, ""); // strip extension

      const newUploadedNote = {
        id: `note-${Date.now()}`,
        title: cleanName,
        content: content || "No text content found inside file.",
        tags: ["Imported", file.type ? file.type.split("/")[1] : "txt"],
        updatedAt: new Date().toISOString().split("T")[0]
      };

      setNotes([newUploadedNote, ...notes]);
    };
    fileReader.readAsText(file);
  };

  // File Drag & Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Extract all distinct tags for filtering
  const allTags = ["All", ...new Set(notes.flatMap((note) => note.tags))];

  // Filter notes based on tag select & text search
  const filteredNotes = notes.filter((note) => {
    const matchesTag = selectedTag === "All" || note.tags.includes(selectedTag);
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h1>Summaries & Notes Catalog</h1>
        <p className="subtitle">Search, organize, or upload text materials to support revision sessions.</p>
      </div>

      {/* Main Layout Grid */}
      <div className="notes-layout">
        {/* Left column: Search, upload, and lists */}
        <div className="notes-main-side">
          {/* Controls Bar */}
          <div className="notes-controls">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search notes by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="primary" onClick={() => setIsCreating(true)}>
              <Plus size={16} style={{ marginRight: "6px" }} /> Write Note
            </Button>
          </div>

          {/* Tags Filter Row */}
          <div className="tags-container">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`tag-btn ${selectedTag === tag ? "active" : ""}`}
              >
                <Tag size={12} style={{ marginRight: "4px" }} /> {tag}
              </button>
            ))}
          </div>

          {/* Drop Uploader Module */}
          <div
            className={`dropzone-card ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-input-notes"
              style={{ display: "none" }}
              onChange={handleFileInputChange}
              accept=".txt,.md,.json"
            />
            <label htmlFor="file-input-notes" className="dropzone-label">
              <UploadCloud size={32} className="text-primary icon-bounce" />
              <span>Drag & drop study summary notes here (.txt, .md) or <strong className="text-primary cursor-pointer">browse</strong></span>
            </label>
          </div>

          {/* Catalog grid */}
          <div className="notes-catalog-grid">
            {filteredNotes.length === 0 ? (
              <div className="empty-panel text-center py-6 col-span-all">
                <FileText size={48} className="text-muted mb-2" />
                <p>No matching notes found. Clear filter or add a summary to start.</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className="note-summary-card cursor-pointer"
                  onClick={() => setViewingNote(note)}
                >
                  <div className="note-card-header">
                    <h4>{note.title}</h4>
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="delete-note-btn-small"
                      title="Delete note"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="note-card-preview">{note.content.substring(0, 120)}...</p>
                  <div className="note-card-footer">
                    <div className="card-tags-list">
                      {note.tags.map((tag) => (
                        <span key={tag} className="badge-tag">{tag}</span>
                      ))}
                    </div>
                    <span className="note-date">{note.updatedAt}</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right column: Note Viewer / Note Editor */}
        <div className="notes-sidebar-side">
          {/* Creating manual note layout */}
          {isCreating ? (
            <Card title="Write New Summary">
              <form onSubmit={handleAddNote} className="note-creation-form">
                <div className="form-group">
                  <label htmlFor="note-title-input">Title</label>
                  <input
                    type="text"
                    id="note-title-input"
                    placeholder="e.g., Graph Algorithms BFS Summary"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="note-tags-input">Tags (comma-separated)</label>
                  <input
                    type="text"
                    id="note-tags-input"
                    placeholder="Algorithms, Graphs, BFS"
                    value={newTagsStr}
                    onChange={(e) => setNewTagsStr(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="note-body-input">Content Notes</label>
                  <textarea
                    id="note-body-input"
                    rows="8"
                    placeholder="Write detailed study concepts, rules, or questions..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="note-form-actions">
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Note
                  </Button>
                </div>
              </form>
            </Card>
          ) : viewingNote ? (
            /* Reading note details */
            <Card
              title={viewingNote.title}
              actions={
                <button onClick={() => setViewingNote(null)} className="close-viewer-btn" title="Close reader">
                  <X size={18} />
                </button>
              }
            >
              <div className="note-viewer">
                <div className="viewer-meta">
                  <div className="card-tags-list">
                    {viewingNote.tags.map((tag) => (
                      <span key={tag} className="badge-tag">{tag}</span>
                    ))}
                  </div>
                  <span className="note-date">Updated: {viewingNote.updatedAt}</span>
                </div>
                <div className="viewer-content">
                  {viewingNote.content.split("\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            /* Standby side screen */
            <div className="notes-viewer-placeholder">
              <FileText size={48} className="text-muted mb-2" />
              <h3>Note Reader Pane</h3>
              <p className="text-muted">
                Select any summary note from the list on the left to read its contents, or create a new text sheet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
