import {withMainLayout} from "../../src/components/MainLayout"
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {useEffect, useState} from 'react'

function Cluster() {
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [reg, setReg] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const Map = dynamic(
        () => import('../../src/components/MapClustering'), // replace '@components/map' with your component's location
        {ssr: false} // This line is important. It's what prevents server-side render
    )

    const handleGenerateData = () => {
        const dataExist = localStorage.getItem("result2")
        // console.log("tes")
        console.log(router?.query, reg)
        if (dataExist && !router?.query?.generate && !reg) {
            const data = JSON.parse(dataExist)
            setData(data)
            setLoading(false)
        } else {
            setLoading(true);
            const req = fetch(`http://127.0.0.1:8080/cluster/`, {
                method: "GET",
            })
                .then((res) => res.json())
                .then((data) => {
                    localStorage.setItem("result2", JSON.stringify(data))
                    setData(data)
                    setLoading(false)
                    console.log('sudah load')
                    setReg(false)
                })
        }
    }

    useEffect(() => {
        if(!router.isReady) return;
        handleGenerateData()
    }, [router.isReady, reg])

    const handleClick = (data) => {
        setSelectedData(data)
    }

    return (<Map
        data={data}
        selectedData={selectedData}
        loading={loading}
        setReg={setReg}
    />)
}

export default withMainLayout(Cluster)