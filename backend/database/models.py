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
