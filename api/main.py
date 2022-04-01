import uvicorn
import shutil

from fastapi.middleware.cors import CORSMiddleware
from os import path
from asosiasi import asosiasi
from fastapi import FastAPI, UploadFile, File
from datetime import datetime


app = FastAPI()
dataset = "api/dataset/databaru.csv"
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
async def create_upload_file(uploaded_file: UploadFile = File(...)):
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


@app.get("/asosiasi")
def read_root():
    return asosiasi(dataset, 0.3, 0.9)

@app.get("/cluster")
async def do_cluster():
    return cluster()


if __name__ == '__main__':
    uvicorn.run("main:app", host='127.0.0.1', port=8080, reload=True)