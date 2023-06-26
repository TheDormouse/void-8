
import Box from './Box'
import {Common, View} from './client/View'
import styles from './index.module.css'

export default function Home(){
    return(
    <View className={styles.view}>
        <Box  position={[0, 0, 0]} />
        <Common />
    </View>
        )
}