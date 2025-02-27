import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { DAILY, periodTypes, SIXTEEN_DAYS } from '../../utils/time.js'

const PeriodType = ({ periodType, datasetPeriodType, onChange }) => (
    <SingleSelectField
        label={i18n.t('Period type')}
        selected={
            datasetPeriodType === SIXTEEN_DAYS && periodType === DAILY
                ? undefined
                : periodType
        }
        onChange={({ selected }) => onChange(selected)}
    >
        {periodTypes
            ?.filter((type) =>
                datasetPeriodType === SIXTEEN_DAYS && type.id === DAILY
                    ? false
                    : true
            )
            .map((type) => (
                <SingleSelectOption
                    key={type.id}
                    value={type.id}
                    label={type.name}
                />
            ))}
    </SingleSelectField>
)

PeriodType.propTypes = {
    periodType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    datasetPeriodType: PropTypes.string,
}

export default PeriodType
