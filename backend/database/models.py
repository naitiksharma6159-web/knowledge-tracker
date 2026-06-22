from datetime import datetime
from typing import Optional, Any, Dict

class DBUser:
    def __init__(self, id: Optional[int], name: str, email: str, password_hash: str, created_at: Optional[str] = None):
        self.id = id
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.created_at = created_at or datetime.utcnow().isoformat()

    @classmethod
    def from_row(cls, row: Any) -> Optional['DBUser']:
        """
        Instantiate a DBUser from an sqlite3.Row object.
        """
        if not row:
            return None
        return cls(
            id=row["id"],
            name=row["name"],
            email=row["email"],
            password_hash=row["password_hash"],
            created_at=row["created_at"]
        )

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert DBUser fields to a dictionary for JSON responses (excluding sensitive password hashes).
        """
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at
        }


class DBNote:
    def __init__(
        self,
        id: Optional[int],
        user_id: int,
        title: str,
        content: str,
        tags: List[str],
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None
    ):
        self.id = id
        self.user_id = user_id
        self.title = title
        self.content = content
        self.tags = tags
        self.created_at = created_at or datetime.utcnow().isoformat()
        self.updated_at = updated_at or datetime.utcnow().isoformat()

    @classmethod
    def from_row(cls, row: Any) -> Optional['DBNote']:
        """
        Instantiate a DBNote from an sqlite3.Row object.
        """
        if not row:
            return None
        import json
        tags_raw = row["tags"]
        try:
            tags = json.loads(tags_raw) if tags_raw else []
        except Exception:
            tags = []
        return cls(
            id=row["id"],
            user_id=row["user_id"],
            title=row["title"],
            content=row["content"],
            tags=tags,
            created_at=row["created_at"],
            updated_at=row["updated_at"]
        )

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert DBNote fields to a dictionary with camelCase keys for frontend consumption.
        """
        return {
            "id": self.id,
            "userId": self.user_id,
            "title": self.title,
            "content": self.content,
            "tags": self.tags,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at
        }

