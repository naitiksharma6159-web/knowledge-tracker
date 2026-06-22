from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import sqlite3
from typing import List

from backend.api.auth_routes import get_db
from backend.api.schemas.models import NoteCreate, NoteUpdate, NoteResponse
from backend.services import auth_service, notes_service
from backend.database.models import DBUser

router = APIRouter(prefix="/notes", tags=["Notes"])
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: sqlite3.Connection = Depends(get_db)
) -> DBUser:
    """
    Dependency to validate the Bearer token in Authorization header,
    decoding JWT and returning the DBUser object if valid.
    """
    token = credentials.credentials
    payload = auth_service.decode_jwt(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or expired session",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = auth_service.get_user_by_email(db, payload.get("email", ""))
    # Fallback to check by ID directly if email lookup isn't sufficient
    if not user:
        cursor = db.cursor()
        cursor.execute("SELECT id, name, email, password_hash, created_at FROM users WHERE id = ?", (payload["user_id"],))
        row = cursor.fetchone()
        if row:
            user = DBUser.from_row(row)
            
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user does not exist",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@router.get("", response_model=List[NoteResponse])
def read_notes(
    current_user: DBUser = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """
    Fetch all notes for the authenticated user.
    """
    notes = notes_service.get_notes_by_user(db, current_user.id)
    return [note.to_dict() for note in notes]

@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_new_note(
    payload: NoteCreate,
    current_user: DBUser = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """
    Create a new note for the authenticated user.
    """
    note = notes_service.create_note(
        db=db,
        user_id=current_user.id,
        title=payload.title,
        content=payload.content,
        tags=payload.tags
    )
    return note.to_dict()

@router.get("/{note_id}", response_model=NoteResponse)
def read_note(
    note_id: int,
    current_user: DBUser = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """
    Get a specific note by ID, verifying ownership.
    """
    note = notes_service.get_note_by_id(db, note_id, current_user.id)
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found or you do not have permission to access it."
        )
    return note.to_dict()

@router.put("/{note_id}", response_model=NoteResponse)
def update_existing_note(
    note_id: int,
    payload: NoteUpdate,
    current_user: DBUser = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """
    Update a specific note by ID, verifying ownership.
    """
    note = notes_service.update_note(
        db=db,
        note_id=note_id,
        user_id=current_user.id,
        title=payload.title,
        content=payload.content,
        tags=payload.tags
    )
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found or you do not have permission to access it."
        )
    return note.to_dict()

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_note(
    note_id: int,
    current_user: DBUser = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """
    Delete a specific note by ID, verifying ownership.
    """
    success = notes_service.delete_note(db, note_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found or you do not have permission to access it."
        )
    return None
