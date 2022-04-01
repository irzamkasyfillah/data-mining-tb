import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import { withMainLayout } from '../../src/components/MainLayout'
import { useRouter, withRouter } from 'next/router'
import { Accordion } from '../../src/components/Accordion'
import LoadingOverlay from 'react-loading-overlay';

function Asosiasi() {
  const router = useRouter()

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [center, setCenter] = useState(null)

  const Map = dynamic(
    () => import('../../src/components/MapAsosiasi'), // replace '@components/map' with your component's location
    { ssr: false } // This line is important. It's what prevents server-side render
  )

  const handleGenerateData = () => {
    setLoading(true)
    const dataExist = localStorage.getItem("result")
     if (dataExist && !router.query?.generate) {
       const data = JSON.parse(dataExist)
       const result = data?.dict_kec_rules_location

        const markers = Object.keys(result)?.map(kec => {
          const resultKec = result[kec]
          return [resultKec?.lat, resultKec?.long]
        })
        console.log("markers", markers)
        setData(data)
        setMarkers(markers)
        setLoading(false)
    } else {

      const req = fetch(`http://127.0.0.1:8080/asosiasi/`, {
        method: "GET",
      })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("result", JSON.stringify(data))
        setData(data)
        const result = data?.dict_kec_rules_location

        const markers = Object.keys(result)?.map(kec => {
          const resultKec = result[kec]
          return [resultKec?.lat, resultKec?.long]
        })
        console.log("markers", markers)

        setMarkers(markers)
        setLoading(false)
      // return req.json()
      })
    }

  }

  useEffect(() => {
    handleGenerateData() 
  }, [])

  const handleClick = (data) => {
    setSelectedData(data)
    const center = [data?.lat, data?.long]
    setCenter(center)
        console.log("center", center, data?.index)

  }

  const generateKec = () => {
    console.log("data", data?.dict_kec_rules_location)
    const result = data?.dict_kec_rules_location
    if (result) {
      const sortedResult = Object.keys(result).sort()
      return sortedResult?.map(kec => {
        const resultKec = result[kec]
        const antecedent = resultKec?.antecedents?.join(', ')
        const consequent = resultKec?.consequents?.join(', ')
        return (
          <div key={resultKec?.index} onClick={() => handleClick(resultKec)}>
            <Accordion title={kec} content={(
              <div>
                <p>antecedent : {antecedent}</p>
                <p>consequent : {consequent}</p>
              </div>
            )}/>
          </div>
          
        )
      })
    }
    
  }

  return (
    <LoadingOverlay
          active={loading}
          spinner
          text='Creating Association Rules, Please wait!'
    >
      <div className="grid grid-cols-3 gap-4">
        <div>
          
            {data && (
            <div style={{height: '93vh', overflowY: 'auto'}}>
              <h2 style={{fontWeight: "bold", fontSize: 25}}>Daftar Kecamatan</h2>
              {generateKec()}
            </div>
          )}
          
        </div>
        <div className='col-span-2'>
          <Map 
            data={data} 
            selectedData={selectedData} 
            center={center || [-5.136143, 119.469370]}
            />
        </div>
      </div>
    </LoadingOverlay>
  )
}

export default withMainLayout(Asosiasi)