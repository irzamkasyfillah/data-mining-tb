import dynamic from 'next/dynamic'
import { React, useState, useEffect, useRef } from 'react'
import { withMainLayout } from '../../src/components/MainLayout'
import { useRouter, withRouter } from 'next/router'
import { Accordion } from '../../src/components/Accordion'
import LoadingOverlay from 'react-loading-overlay';
import { TextField } from '@mui/material'
import ReactDOM from 'react-dom';
import { AturanAsosiasi } from '../../src/components/AturanAsosiasi'

function Asosiasi() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [center, setCenter] = useState(null);
  const [inputText, setInputText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({antecedent: "", consequent:"", resultKec: []})

  const Map = dynamic(
    () => import('../../src/components/MapAsosiasi'), // replace '@components/map' with your component's location
    { ssr: false } // This line is important. It's what prevents server-side render
  )

  const handleGenerateData = () => {
    setLoading(true)
    const dataExist = localStorage.getItem("result")
     if (!dataExist) {
      //  const data = JSON.parse(dataExist)
      //  const result = data?.dict_kec_rules_location

      //   const markers = Object.keys(result)?.map(kec => {
      //     const resultKec = result[kec]
      //     return [resultKec?.lat, resultKec?.long]
      //   })
      //   setData(data)
      //   setMarkers(markers)
    //     setLoading(false)
    // } else {

      const req = fetch(`http://127.0.0.1:8080/asosiasi`, {
        method: "GET",
      })
      .then((res) => res.json())
      .then((data) => {
        // localStorage.setItem("result", JSON.stringify(data))
        if (data) {
          setData(data)
          const result = data?.dict_kec_rules_location

          const markers = Object.keys(result)?.map(kec => {
            const resultKec = result[kec]
            return [resultKec?.lat, resultKec?.long]
            // return resultKec?.polygons?.coordinates
          })

          setMarkers(markers)
          setLoading(false)
        // return req.json()
        }
      })
    }

  }

  useEffect(() => {
    handleGenerateData()
  }, [])

  const handleClick = (data, kec) => {
    setSelectedData(data)
    const center = [data?.lat, data?.long]
    setCenter(center)
  }

  const getKota = (kec, locations) => {
    const kota = locations.find(location => location.split(',')[0] == kec)
    return kota.split(',')[1]
  }

  const generateKec = (keyword) => {
    const locations = data?.locations
    const result = data?.dict_kec_rules_location
    if (result) {
      const sortedResult = Object.keys(result).sort()
      const listkota = {}
      sortedResult?.map(kec => {
        if (!keyword || kec.toLowerCase().includes(keyword)) {
          const resultKec = result[kec]
          const kota = getKota(kec, locations)
          const antecedent = resultKec?.antecedents?.join(', ')
          const consequent = resultKec?.consequents?.join(', ')

          // Pass data to modal
          setModalData({antecedent, consequent, resultKec})

          if (listkota[kota] === undefined) listkota[kota] = []
          listkota[kota].push(
            <div key={resultKec?.index} onClick={() => handleClick(resultKec, kec)}>
              <Accordion title={kec} content={(
                <div>
                  <p>Aturan Asosiasi yang terbentuk:</p>
                  <p>antecedent : {antecedent}</p>
                  <p>consequent : {consequent}</p>
                </div>
              )}/>
            </div>

          )
        }

      })

    const filteredData = Object.keys(listkota).filter((el) => {
      //if no input the return the original
      if (inputText === '') {
          return el;
      }
      //return the item which contains the user input
      else {
          // return el.toLowerCase().includes(inputText)
      }
    })

    return Object.keys(listkota, filteredData).map(kota => (
      <div key={kota}>
        <h2 style={{fontWeight: "bold", fontSize: 20, margin: "4px 0px 0px 8px"}}>{kota}</h2>
        {listkota[kota]}
      </div>

    ))
    }

  }

  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  return (
  <>
    <LoadingOverlay
          active={loading}
          spinner
          text='Creating Association Rules, Please wait!'
    >
      <div className="grid grid-cols-4 gap-4">
        <div>

            {data && (
            <div style={{height: '93vh', overflowY: 'auto'}}>
              <div className="justify-center items-center flex px-8 py-4">
                <button
                  className="bg-blue-500 text-white active:bg-blue-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowModal(true)}
                >
                  Show All
                </button>
              </div>
              <h2 style={{fontWeight: "bold", fontSize: 25}}>Daftar Kecamatan</h2>
              <div className="px-8">
                <TextField
                  id="outlined-basic"
                  onChange={inputHandler}
                  variant="outlined"
                  fullWidth
                  label="Search"
                />
              </div>
              {generateKec(inputText)}
            </div>
          )}

        </div>
        <div className='col-span-3'>
          <Map
            data={data}
            selectedData={selectedData}
            center={center || [-5.136143, 119.469370]}
            />
        </div>
      </div>
    </LoadingOverlay>

    {showModal ? (
      <>
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto">
                <AturanAsosiasi modalData={modalData}/>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    ) : null}
  </>

  )
}

export default withMainLayout(Asosiasi)
