
import Box from './Box'
import { Common, View } from './client/View'
import { view } from './index.module.css'

export default function Home() {
    return (
        <>
            <View className={view}>
                <Box position={[0, 0, 0]} />
                <Common />
            </View>
            <p style={{ color: 'white', textAlign: 'center', paddingTop: '48vh' }}>The system is being configured. Please check back later.</p>

        </>
    )
}