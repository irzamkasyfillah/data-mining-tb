import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { withMainLayout } from '../../src/components/MainLayout'
import { useRouter, withRouter } from 'next/router'
import { Accordion } from '../../src/components/Accordion'

function Asosiasi() {
  const router = useRouter()

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const Map = dynamic(
    () => import('../../src/components/MapAsosiasi'), // replace '@components/map' with your component's location
    { ssr: false } // This line is important. It's what prevents server-side render
  )

  const handleGenerateData = () => {
    setLoading(true)
    const dataExist = localStorage.getItem("result")
     if (dataExist) {
      setData(JSON.parse(dataExist))
      setLoading(false)
    } else {

      const req = fetch(`http://127.0.0.1:80/asosiasi/`, {
        method: "GET",
      })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        localStorage.setItem("result", JSON.stringify(data))
        setData(data)
      // return req.json()
      })
    }

  }

  useEffect(() => {
     
    handleGenerateData() 
  }, [])

  const generateKec = () => {
    console.log("data", data?.dict_kec_rules_location)
    const result = data?.dict_kec_rules_location
    if (result) {
      return Object.keys(result)?.map(kec => {
        const rules = JSON.stringify(result[kec]?.rules)
        const rulesSplit = rules.split('\\n')
        const antecedent = rulesSplit[0].slice(rulesSplit[0].indexOf('(') + 1, rulesSplit[0].indexOf(')'))
        const consequent = rulesSplit[1].slice(rulesSplit[1].indexOf('(') + 1, rulesSplit[1].indexOf(')'))
        console.log("antecedent", antecedent)
        return (
          <Accordion title={kec} content={(
            <div>
              <p>antecedent : {antecedent}</p>
              <p>consequent : {consequent}</p>
            </div>
          )}/>
          
        )
      })
    }
    
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div>
          {loading && <p>Please Wait...</p>}
          {data && (
            <div style={{height: '93vh', overflowY: 'auto'}}>
              {generateKec()}
            </div>
          )}
        </div>
        <div className='col-span-2'>
          <Map />
        </div>
      </div>
    </>
  )
}

export default withMainLayout(Asosiasi)