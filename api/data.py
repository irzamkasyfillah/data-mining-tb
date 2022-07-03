from sqlalchemy import Column, Integer, String, Float
from database import Base


class Data(Base):
    __tablename__ = "data"

    id = Column(Integer, primary_key=True, index=True)
    # code = Column(String(255), unique=True, index=True)
    code = Column(String(255))
    timestamp = Column(String(255))
    tanggal_lahir = Column(String(255))
    umur = Column(String(255))
    tinggi_badan = Column(Float)
    berat_badan = Column(Float)
    jenis_kelamin = Column(String(255))
    alamat_kelurahan = Column(String(255))
    alamat_kecamatan = Column(String(255))
    alamat_kota = Column(String(255))
    alamat_lengkap = Column(String(255))
    pekerjaan_ayah = Column(String(255))
    pekerjaan_ibu = Column(String(255))
    pendapatan = Column(String(255))
    pernah_sedang_tb = Column(String(10))
    diabetes_anak = Column(String(10))
    vaksin_bcg = Column(String(10))
    riwayat_opname_anak = Column(String(10))
    penyakit_anak = Column(String)
    asi_ekslusif = Column(String(10))
    tb_serumah = Column(String(10))
    diabetes_serumah = Column(String(10))
    penyakit_lainnya = Column(String(255))
    penyakit_serumah = Column(String(255))
    konsumsi_obat_tb = Column(String(10))
    luas_rumah = Column(String(255))
    jumlah_kamar = Column(Integer)
    jumlah_orang = Column(Integer)
    sistem_ventilasi = Column(String(255))