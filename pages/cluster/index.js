import {withMainLayout} from "../../src/components/MainLayout"
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'

function Cluster() {
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [reg, setReg] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [center, setCenter] = useState(null)

    const Map = dynamic(
        () => import('../../src/components/MapClustering'), // replace '@components/map' with your component's location
        {ssr: false} // This line is important. It's what prevents server-side render
    )

    const handleGenerateData = async () => {
        const dataExist = localStorage.getItem("result2")
        // console.log("tes")
        // console.log(router?.query, reg)
        if (!dataExist) {
            //     const data = JSON.parse(dataExist)
            //     setData(data)
            //     setLoading(false)
            // } else {
            setLoading(true);
            const req = await fetch(`http://127.0.0.1:8080/cluster`, {
                method: "GET",
            })
                .then((res) => res.json())
                .then((data) => {
                    // localStorage.setItem("result2", JSON.stringify(data))
                    if (data) {
                        setData(data)
                        setLoading(false)
                        console.log('sudah load', data)
                        setReg(false)
                    }
                })
            // router.reload(window.location.pathname)
        }
    }

    useEffect(() => {
        if (!router.isReady) return;
        handleGenerateData()
    }, [router.isReady, reg])

    const handleClick = (kec, kab) => {
        setSelectedData(kec)
        // let pink = document.querySelectorAll('.circle-marker')
        // for (let i = 0; i < pink.length; i++) {
        //     if (kec !== '' && !pink[i].classList.contains(kec.replace(' ', '-'))) {
        //         console.log('if 1')
        //         pink[i].classList.remove('visible')
        //         pink[i].classList.add('hidden')
        //     } else if (kec === '' && pink[i].classList.contains('hidden')) {
        //         pink[i].classList.remove('hidden')
        //         pink[i].classList.add('visible')
        //     } else {
        //         pink[i].classList.remove('hidden')
        //         pink[i].classList.add('visible')
        //     }
        // }
        // Set center if kec clicked
        const coord1 = data?.cluster1_df
        const resultKec1 = coord1[`${kec} (${kab})`]
        const position1 = resultKec1?.coord

        setCenter(position1)
    }

    const generateKec = () => {
        const listKab = {}
        const locations = Object.keys(data?.cluster1_df).map(key => {
            const split = key.split(' (')
            const kab = split[1].slice(0, -1)
            if (!listKab[kab]) {
                listKab[kab] = [split[0]]
            } else {
                listKab[kab] = [...listKab[kab], split[0]]
            }
        })
        console.log("locations", listKab)

            const listKabView = {}
            Object.keys(listKab).map(kab => {
                listKab[kab].map(kec => {
                    const view = (
                        <div key={kec} onClick={() => handleClick(kec, kab)}>
                            <div className="rounded overflow-hidden shadow-lg">
                                <div className="px-4 pt-4">
                                    <div className="flex flex-col">
                                        <button
                                            className="text-left box-border appearance-none cursor-pointer focus:outline-none"
                                        >
                                            <p className="font-semibold text-lg mb-2 inline-block">{kec}</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    if (!listKabView[kab]) {
                        listKabView[kab] = [view]
                    } else {
                        listKabView[kab] = [...listKabView[kab], view]
                    }
                })
            })
            return Object.keys(listKabView).map(kab => (
                <div key={kab}>
                    <h2 style={{fontWeight: "bold", fontSize: 16, margin: "8px 0px 0px 8px"}}>{kab.toUpperCase()}</h2>
                    {listKabView[kab]}
                </div>
            ))
    }

    return (
        <div className="grid grid-cols-5 gap-4">

                {data && (
                    <div style={{height: '93vh', overflowY: 'auto',}}>
                        <div className="flex items-center justify-center">
                            <Button className="ml-2 mr-2 bg-blue-500 hover:bg-blue-700 text-sm text-white font-semibold py-2 px-3 rounded mt-5 mb-2"
                                onClick={() => setSelectedData('')}>
                                Tampilkan semua kecamatan
                            </Button>
                        </div>
                        <h2 className="ml-2 mt-1" style={{fontWeight: "bold", fontSize: 20}}> Daftar Kecamatan</h2>
                        {generateKec()}
                    </div>
                )}

            <div className='col-span-4'>
                <Map
                    data={data}
                    selectedData={selectedData}
                    loading={loading}
                    setReg={setReg}
                    center={center}
                />
            </div>
        </div>
    )
}

export default withMainLayout(Cluster)