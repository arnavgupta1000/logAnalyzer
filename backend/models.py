from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class LogAnalysis(Base):
    __tablename__ = 'log_analysis'
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(256))
    summary = Column(Text)
    parts = Column(Text)  # Store as JSON string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
