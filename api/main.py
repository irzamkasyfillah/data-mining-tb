import uvicorn
import shutil
import json
import os
import pandas as pd
import numpy as np

from fastapi.middleware.cors import CORSMiddleware
from os import path
from sqlalchemy.orm import Session
from asosiasi import asosiasi
from fastapi import FastAPI, UploadFile, File, Depends, BackgroundTasks
from datetime import datetime
from clustering import cluster
from data import Data
from database import get_db

app = FastAPI()
dataset = "./dataset/dataset_TB_anak.csv"
start = datetime.today()
format = "%d%m%Y_%H%M%S_"


origins = [
    "*"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root(start_date: datetime = start):
    return {"start_date": start_date}


@app.post("/uploadfile")
async def create_upload_file(background_task: BackgroundTasks, db: Session = Depends(get_db), uploaded_file: UploadFile = File(...)):
    print(uploaded_file, "uploaded_file")
    allowedFiles = {"application/vnd.ms-excel", "text/csv"}
    if uploaded_file.content_type in allowedFiles:
        date_time = start.strftime(format)
        file_location = path.join("./dataset", date_time + uploaded_file.filename)
        with open(file_location, "wb") as file_object:
            shutil.copyfileobj(uploaded_file.file, file_object)

        global dataset
        dataset = file_location
        print(dataset, "dataset")

        df = pd.read_csv(dataset)

        df['Jika pernah, anak diopname karena penyakit apa saja?'] = df[
            'Jika pernah, anak diopname karena penyakit apa saja?'].replace(np.nan, 'Tidak Pernah')
        df['Jika ada, penyakit apa saja?'] = df['Jika ada, penyakit apa saja?'].replace(np.nan, 'Tidak Ada')

        for index, df_data in df.iterrows():
            existing_data = db.query(Data).filter(Data.code == df_data['code']).first()
            if not existing_data:
                db_data = Data(
                    code=df_data['code'],
                    timestamp=df_data['Timestamp'],
                    tanggal_lahir=df_data['Tanggal Lahir'],
                    umur=df_data['Umur'],
                    tinggi_badan=df_data['Tinggi badan (dalam cm)'],
                    berat_badan=df_data['Berat badan (dalam kg)'],
                    jenis_kelamin=df_data['Jenis Kelamin'],
                    alamat_kelurahan=df_data['Alamat (Kelurahan)'],
                    alamat_kecamatan=df_data['Alamat (Kecamatan)'],
                    alamat_kota=df_data['Alamat (Kab/Kota)'],
                    alamat_lengkap=df_data['Alamat (mohon sertakan nama kelurahan dan kecamatan)'],
                    pekerjaan_ayah=df_data['Pekerjaan Ayah'],
                    pekerjaan_ibu=df_data['Pekerjaan Ibu'],
                    pendapatan=df_data['Pendapatan Orang Tua'],
                    pernah_sedang_tb=df_data['Apakah anak pernah atau sedang dalam pengobatan tuberkulosis?'],
                    diabetes_anak=df_data['Apakah anak pernah mengalami penyakit diabetes?'],
                    vaksin_bcg=df_data[
                        'Apakah anak telah menerima imunisasi BCG (Bacillus Calmette-Guérin, imunisasi untuk mencegah penyakit TB)?'],
                    riwayat_opname_anak=df_data['Apakah anak pernah di opname sebelumnya?'],
                    penyakit_anak=df_data['Jika pernah, anak diopname karena penyakit apa saja?'],
                    asi_ekslusif=df_data[
                        'Apakah anak mengkonsumsi ASI secara eksklusif? (ASI Eksklusif adalah pemberian ASI tanpa makanan/minuman (susu formula) tambahan hingga berusia 6 bulan)'],
                    tb_serumah=df_data['Apakah ada riwayat penyakit tuberkulosis dalam orang serumah?'],
                    diabetes_serumah=df_data['Apakah ada riwayat penyakit diabetes dalam keluarga (orang tua)?'],
                    penyakit_lainnya=df_data[
                        'Apakah ada riwayat penyakit lainnya selain tuberkulosis, diabetes dalam orang  serumah?'],
                    penyakit_serumah=df_data['Jika ada, penyakit apa saja?'],
                    konsumsi_obat_tb=df_data[
                        'Apakah ada yang pernah atau sedang mengkonsumsi obat tuberkulosis dalam orang serumah?'],
                    luas_rumah=df_data['Berapa luas rumah tempat anak tinggal?'],
                    jumlah_kamar=df_data['Berapa jumlah kamar tidur dalam rumah?'],
                    jumlah_orang=df_data['Berapa jumlah orang yang tinggal dalam satu rumah?'],
                    sistem_ventilasi=df_data['Bagaimana sistem ventilasi di rumah Anda? ']
                )

                db.add(db_data)
        db.commit()

        return {"info": f"file '{uploaded_file.filename}' saved at '{file_location}'"}

    else:
        return {"info": 'Hanya menerima file CSV'}


@app.get("/get_data")
def read_root(db: Session = Depends(get_db)):
    return db.query(Data).all()


@app.get("/asosiasi")
def read_data():
    if os.path.exists("./rules/location.json") and os.path.exists("./rules/data.json"):
        with open('./rules/location.json', 'r') as data1:
            data_lokasi = json.load(data1)
        with open('./rules/data.json', 'r') as data:
            data_asosiasi = json.load(data)
        with open('./rules/data_highest.json', 'r') as data:
            data_highest = json.load(data)
        with open('./rules/list_antecedents_unique.json', 'r') as data:
            data_list_antecedents = json.load(data)
        with open('./rules/list_consequents_unique.json', 'r') as data:
            data_list_consequents = json.load(data)
        with open('./rules/list_aturan.json', 'r') as data:
            data_list_aturan = json.load(data)

        return {
            'locations': data_lokasi,
            'dict_kec_rules_location': data_asosiasi,
            'highest_kec': data_highest,
            'list_antecedents_unique': data_list_antecedents,
            'list_consequents_unique': data_list_consequents,
            'list_aturan': data_list_aturan
        }
    else:
        return False


@app.post("/run_asosiasi")
async def read_root(background_task: BackgroundTasks, db: Session = Depends(get_db)):
    if os.path.exists('./rules/location.json'):
        os.remove('./rules/location.json')
    if os.path.exists('./rules/data.json'):
        os.remove('./rules/data.json')
    background_task.add_task(asosiasi, dataset, 0.35, 0.9)
    return {
        'message': 'Running association...',
        'dataset': dataset
    }


@app.get("/cluster")
async def do_cluster():
    if os.path.exists("./result/data_cluster.json") and os.path.exists("./result/data_kecamatan.json") and os.path.exists("./result/df.json"):
        with open("./result/data_cluster.json", "r") as j:
            cluster = json.load(j)
        with open("./result/data_kecamatan.json", "r") as k:
            kecamatan = json.load(k)
        with open("./result/df.json", "r") as k:
            df = json.load(k)
        return {
            'data_cluster': cluster,
            'data_kecamatan': kecamatan,
            'df': df,
        }
    else:
        return False


@app.get("/run_cluster")
async def do_cluster(background_task: BackgroundTasks):
    if os.path.exists("./result/data_cluster.json"):
        os.remove("./result/data_cluster.json")
    if os.path.exists("./result/data_kecamatan.json"):
        os.remove("./result/data_kecamatan.json")
    if os.path.exists("./result/df.json"):
        os.remove("./result/df.json")

    background_task.add_task(cluster, dataset)
    return {
        'message': 'Running cluster...',
        'dataset': dataset
    }
if __name__ == '__main__':
    uvicorn.run("main:app", host='127.0.0.1', port=8080, reload=True)