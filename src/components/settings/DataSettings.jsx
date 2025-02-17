import i18n from '@dhis2/d2-i18n'
import { InputField } from '@dhis2/ui'
import useAppSettings from '../../hooks/useAppSettings.js'

const ChartSettings = () => {
    const { settings, changeSetting } = useAppSettings()

    if (!settings) {
        return null
    }

    const { airqoToken } = settings

    return (
        <>
            <h2>Data settings</h2>
            <InputField
                label={i18n.t('AirQo token')}
                value={airqoToken}
                onChange={({ value }) =>
                    changeSetting(
                        'airqoToken',
                        value !== '' ? value : undefined
                    )
                }
            />
        </>
    )
}

export default ChartSettings
