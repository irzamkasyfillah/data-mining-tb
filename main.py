# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import uvicorn

from asosiasi import asosiasi
from fastapi import FastAPI

app = FastAPI()
dataset = 'databaru.csv'


@app.get("/asosiasi")
def read_root():
    return asosiasi(dataset, 0.5, 0.99)


if __name__ == '__main__':
    uvicorn.run("main:app", host='127.0.0.1', port=80, reload=True)

