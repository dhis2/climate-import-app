import i18n from '@dhis2/d2-i18n'
import datasets, {
    dhisDataSets,
    dhisDataElementGroups,
} from '../../data/datasets.js'
import heatStressLegend from '../../data/heat-stress-legend.js'
import DataElement from './DataElement.jsx'
import DataElementGroup from './DataElementGroup.jsx'
import DataSet from './DataSet.jsx'
import Legend from './Legend.jsx'
import styles from './styles/SetupPage.module.css'

const SetupPage = () => {
    return (
        <div className={styles.container}>
            <h1>{i18n.t('How to configure this app')}</h1>
            <p>
                {i18n.t(
                    'Before you can import data, you need to make some configurations in the Maintenance app.'
                )}
            </p>
            <p>
                {i18n.t(
                    "When daily data is imported it can be aggregated to other period types in DHIS2. We don't recommend aggregating across organisation unit levels, especially when going from facility level to higher levels defined by a geographic boundary. To make sure the values remain at its own level, assign all org unit levels as Aggregation levels for each data element below."
                )}
            </p>
            <p>
                {i18n.t(
                    'Create DHIS2 data elements for the data you want to import. We recommend including the data source in the name to distinguish it from other sources (e.g. precepetation data is available from both ERA5-Land and CHIRPS, and there will be additional data providers in the future). If you use the same code specified below, we will preselect the data element in the import interface.'
                )}
            </p>
            {datasets.map((dataElement) => (
                <DataElement key={dataElement.id} {...dataElement} />
            ))}
            <p>
                {i18n.t(
                    'If you import daily data, you should assign the data elements to a daily data set (weather and climate). For weekly or monthly data, assign to a weekly or monthly data set (vegetation index). Assigning to a data set helps to maintain a quality metadata and data where integrity, consistency, approvals and protection are facilitated. How exactly to define such a data set depends on the available users and user groups. Similarly, which of the organisation units can collect this daily climate data set depends on situated contexts. However, since we can provide data for any administrative unit that has defined geographic boundaries we leave that decision to users. Most probable choice is all organisation units in your system.'
                )}
            </p>
            {dhisDataSets.map((dataSet) => (
                <DataSet key={dataSet.name} {...dataSet} />
            ))}
            <p>
                {i18n.t(
                    'To be able to select the data elements in all the DHIS2 analytics apps you also need to assign them to a data element group:'
                )}
            </p>
            {dhisDataElementGroups.map((group) => (
                <DataElementGroup key={group.name} {...group} />
            ))}
            <Legend {...heatStressLegend} />
            <p>
                {i18n.t(
                    'You should now be able to import climate data with this app. Please reach out to us on climate-app@dhis2.org if you have any questions or need help with the setup.'
                )}
            </p>
        </div>
    )
}

export default SetupPage
