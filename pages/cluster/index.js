import {withMainLayout} from "../../src/components/MainLayout"
import dynamic from "next/dynamic";

function Cluster() {
    const Map = dynamic(
        () => import('../../src/components/Map'), // replace '@components/map' with your component's location
        {ssr: false} // This line is important. It's what prevents server-side render
    )
    return <Map/>
}

export default withMainLayout(Cluster)