import uvicorn
import shutil
import json
import os

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


@app.post("/uploadfile/")
async def create_upload_file(db: Session = Depends(get_db), uploaded_file: UploadFile = File(...)):
    print(uploaded_file)
    allowedFiles = {"application/vnd.ms-excel"}
    if uploaded_file.content_type in allowedFiles:
        date_time = start.strftime(format)
        file_location = path.join("./dataset", date_time + uploaded_file.filename)
        with open(file_location, "wb") as file_object:
            shutil.copyfileobj(uploaded_file.file, file_object)

        global dataset
        dataset = file_location

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
        return {
            'locations': data_lokasi,
            'dict_kec_rules_location': data_asosiasi
        }
    else:
        return False


@app.post("/run_asosiasi")
async def read_root(background_task: BackgroundTasks, db: Session = Depends(get_db)):
    if os.path.exists('./rules/location.json'):
        os.remove('./rules/location.json')
    if os.path.exists('./rules/data.json'):
        os.remove('./rules/data.json')
    background_task.add_task(asosiasi, db, dataset, 0.3, 0.9)
    # asosiasi(db, dataset, 0.3, 0.9)
    return {
        'message': 'Running association...'
    }


@app.get("/cluster")
async def do_cluster(db: Session = Depends(get_db)):
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


@app.post("/run_cluster")
async def do_cluster(background_task: BackgroundTasks, db: Session = Depends(get_db)):
    if os.path.exists("./result/data_cluster.json"):
        os.remove("./result/data_cluster.json")
    if os.path.exists("./result/data_kecamatan.json"):
        os.remove("./result/data_kecamatan.json")
    if os.path.exists("./result/df.json"):
        os.remove("./result/df.json")
    background_task.add_task(cluster, db, dataset)
    # cluster(db, dataset)
    return {
        'message': 'Running cluster...'
    }
if __name__ == '__main__':
    uvicorn.run("main:app", host='127.0.0.1', port=8080, reload=True)