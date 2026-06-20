from pydantic import BaseModel, Field, AliasChoices, ConfigDict
from typing import List, Optional

class RetentionRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    quiz_score: float = Field(..., validation_alias=AliasChoices('quiz_score', 'quizScore'))
    confidence: int = Field(..., validation_alias=AliasChoices('confidence', 'confidenceScore', 'confidence'))
    revision_count: int = Field(..., validation_alias=AliasChoices('revision_count', 'revisionCount'))
    difficulty: str = Field(default="Medium")
    days_since_last_study: int = Field(default=0, validation_alias=AliasChoices('days_since_last_study', 'daysSinceLastStudy'))

class RetentionResponse(BaseModel):
    retention: int

class RiskRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    retention: float
    days_since_last_study: int = Field(default=0, validation_alias=AliasChoices('days_since_last_study', 'daysSinceLastStudy'))

class RiskResponse(BaseModel):
    score: int
    category: str

class TopicRecord(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    title: str
    last_studied: str = Field(..., validation_alias=AliasChoices('last_studied', 'lastStudied'))
    duration: int
    confidence_score: int = Field(..., validation_alias=AliasChoices('confidence_score', 'confidenceScore', 'confidence'))
    quiz_score: float = Field(..., validation_alias=AliasChoices('quiz_score', 'quizScore'))
    revision_count: int = Field(..., validation_alias=AliasChoices('revision_count', 'revisionCount'))
    difficulty: str = Field(default="Medium")

class RecommendationsRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    records: List[TopicRecord] = Field(..., validation_alias=AliasChoices('records', 'topics'))
    reference_date: Optional[str] = Field(default=None, validation_alias=AliasChoices('reference_date', 'referenceDate'))
