from sqlalchemy import Column, Integer, String, Float
from database import Base


class DataMahasiswa(Base):
    __tablename__ = "mahasiswa"

    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String(255))
    kelas = Column(String(255))