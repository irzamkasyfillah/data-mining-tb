import dynamic from 'next/dynamic'
import { withMainLayout } from '../../src/components/MainLayout'

function Asosiasi() {
  const Map = dynamic(
    () => import('../../src/components/Map'), // replace '@components/map' with your component's location
    { ssr: false } // This line is important. It's what prevents server-side render
  )
  return <Map />
}

export default withMainLayout(Asosiasi)