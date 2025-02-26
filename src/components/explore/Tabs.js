import { useEffect } from 'react'
import i18n from '@dhis2/d2-i18n'
import { TabBar, Tab } from '@dhis2/ui'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import exploreStore from '../../store/exploreStore'
import useExploreUri from '../../hooks/useExploreUri'
import styles from './styles/Tabs.module.css'

const tabs = [
    {
        id: 'forecast10days',
        label: i18n.t('10 days forecast'),
        pointOnly: true,
    },
    { id: 'temperature', label: i18n.t('Temperature') },
    { id: 'precipitation', label: i18n.t('Precipitation') },
    { id: 'humidity', label: i18n.t('Humidity') },
    { id: 'heat', label: i18n.t('Heat') },
    { id: 'climatechange', label: i18n.t('Climate change') },
    { id: 'vegetation', label: i18n.t('Vegetation') },
    { id: 'landcover', label: i18n.t('Land cover') },
]

const Tabs = () => {
    const { pathname } = useLocation()
    const { orgUnit, tab, setTab } = exploreStore()
    const uri = useExploreUri()
    const navigate = useNavigate()

    const isPoint = orgUnit?.geometry.type === 'Point'

    useEffect(() => {
        if (uri && uri !== pathname) {
            navigate(uri)
        }
    }, [pathname, uri, navigate])

    if (!orgUnit) {
        return null
    }

    return (
        <>
            <TabBar fixed>
                {tabs
                    .filter((t) => !t.pointOnly || t.pointOnly === isPoint)
                    .map(({ id, label }) => (
                        <Tab
                            key={id}
                            selected={tab === id}
                            onClick={() => setTab(id)}
                        >
                            {label}
                        </Tab>
                    ))}
            </TabBar>
            <div className={styles.tabContent}>
                <Outlet />
            </div>
        </>
    )
}

export default Tabs
