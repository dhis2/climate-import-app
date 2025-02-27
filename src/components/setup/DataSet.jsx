import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

const DataSet = ({ name, shortName, periodType }) => (
    <table>
        <caption>
            {i18n.t('Data set: "{{-name}}"', { name, nsSeparator: '%' })}
        </caption>
        <tbody>
            <tr>
                <th>{i18n.t('Name')}</th>
                <td>{name}</td>
            </tr>
            <tr>
                <th>{i18n.t('Short name')}</th>
                <td>{shortName}</td>
            </tr>
            <tr>
                <th>{i18n.t('Period type')}</th>
                <td>{periodType}</td>
            </tr>
            <tr>
                <th>{i18n.t('Data elements')}</th>
                <td>
                    <em>
                        {i18n.t(
                            'Assign above data elements with the same period type'
                        )}
                    </em>
                </td>
            </tr>
            <tr>
                <th>{i18n.t('Organisation units')}</th>
                <td>
                    <em>
                        {i18n.t('Select all organisation units in your system')}
                    </em>
                </td>
            </tr>
        </tbody>
    </table>
)

DataSet.propTypes = {
    name: PropTypes.string.isRequired,
    periodType: PropTypes.string.isRequired,
    shortName: PropTypes.string.isRequired,
}

export default DataSet
