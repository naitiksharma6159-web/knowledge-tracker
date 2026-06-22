from fastapi import APIRouter, Depends, HTTPException, status, Query
import sqlite3
from typing import List, Dict, Any

from backend.api.auth_routes import get_db
from backend.api.routes.notes import get_current_user
from backend.database.models import DBUser
from backend.services import ir_service

router = APIRouter(tags=["Search & IR"])

@router.get("/search", response_model=List[Dict[str, Any]])
def search_notes(
    q: str = Query(..., description="Query string for semantic search"),
    current_user: DBUser = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """
    Search the authenticated user's notes using TF-IDF and Cosine Similarity.
    """
    try:
        results = ir_service.search_user_notes(db, current_user.id, q)
        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during search: {str(e)}"
        )

@router.post("/index/rebuild")
def rebuild_index(
    current_user: DBUser = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """
    Rebuild the TF-IDF matrix and Inverted Index from database notes for the authenticated user.
    """
    try:
        index = ir_service.rebuild_user_index(db, current_user.id)
        note_count = len(index.note_ids)
        return {
            "status": "success",
            "message": f"Index rebuilt successfully for {note_count} notes."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while rebuilding index: {str(e)}"
        )
