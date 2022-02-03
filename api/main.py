import uvicorn
import shutil

from asosiasi import asosiasi
from fastapi import FastAPI, UploadFile, File
from datetime import datetime

app = FastAPI()
dataset = 'api/csv/databaru.csv'
start = datetime.today()
format = "%d%m%Y_%H%M%S_"


@app.get("/")
async def root(start_date: datetime = start):
    return {"start_date": start_date}



@app.post("/uploadfile/")
async def create_upload_file(uploaded_file: UploadFile = File(...)):
    date_time = start.strftime(format)
    file_location = f"{ date_time + uploaded_file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(uploaded_file.file, file_object)


    return {"info": f"file '{uploaded_file.filename}' saved at '{file_location}'",}


@app.get("/asosiasi")
def read_root():
    return asosiasi(dataset, 0.5, 0.99)


if __name__ == '__main__':
    uvicorn.run("main:app", host='127.0.0.1', port=80, reload=True)

