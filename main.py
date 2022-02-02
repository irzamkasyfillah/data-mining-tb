import uvicorn
import shutil

from asosiasi import asosiasi
from fastapi import FastAPI, UploadFile, File

app = FastAPI()
dataset = 'databaru.csv'


@app.post("/files/")
async def create_file(file: bytes = File(...)):
    return {"file_size": len(file)}


@app.post("/upload-file/")
async def create_upload_file(uploaded_file: UploadFile = File(...)):
    file_location = f"files/{uploaded_file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(uploaded_file.file, file_object)
    return {"info": f"file '{uploaded_file.filename}' saved at '{file_location}'"}


@app.get("/asosiasi")
def read_root():
    return asosiasi(dataset, 0.5, 0.99)


if __name__ == '__main__':
    uvicorn.run("main:app", host='127.0.0.1', port=80, reload=True)

