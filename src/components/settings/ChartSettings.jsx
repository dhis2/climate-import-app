import i18n from '@dhis2/d2-i18n'
import useAppSettings from '../../hooks/useAppSettings.js'
import HeatCategory from './HeatCategory.jsx'
import NumberInput from './NumberInput.jsx'

const ChartSettings = () => {
    const { settings, changeSetting } = useAppSettings()

    if (!settings) {
        return null
    }

    const {
        tempMin,
        tempMax,
        tempChange,
        heatMin,
        heatMax,
        precipMonthlyMax,
        precipDailyMax,
    } = settings

    return (
        <>
            <h2>Chart settings</h2>
            <p>
                {i18n.t(
                    'Set y-axis values for charts in the Explore data section to make it easier to compare different org units. Leave blank to calculate based on data shown.'
                )}
            </p>
            <NumberInput
                id="tempMax"
                label={i18n.t('Max temperature in °C')}
                value={tempMax}
                onChange={changeSetting}
            />
            <NumberInput
                id="tempMin"
                label={i18n.t('Min temperature in °C')}
                value={tempMin}
                onChange={changeSetting}
                validationText={
                    tempMin !== undefined &&
                    tempMax !== undefined &&
                    tempMin >= tempMax
                        ? i18n.t(
                              'Min temperature must be less than max temperature'
                          )
                        : undefined
                }
            />
            <NumberInput
                id="tempChange"
                label={i18n.t('Max change in temperature in +/- °C')}
                value={tempChange}
                onChange={changeSetting}
            />
            <NumberInput
                id="precipMonthlyMax"
                label={i18n.t('Max monthly precipitation in mm')}
                value={precipMonthlyMax}
                onChange={changeSetting}
            />
            <NumberInput
                id="precipDailyMax"
                label={i18n.t('Max daily precipitation in mm')}
                value={precipDailyMax}
                onChange={changeSetting}
            />
            <HeatCategory
                id="heatMax"
                label={i18n.t('Heat stress upper category')}
                value={heatMax}
                onChange={changeSetting}
            />
            <HeatCategory
                id="heatMin"
                label={i18n.t('Heat stress lower category')}
                value={heatMin}
                onChange={changeSetting}
            />
        </>
    )
}

export default ChartSettings
