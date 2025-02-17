import { useDataQuery } from '@dhis2/app-runtime'

const ROUTE_QUERY = {
    routes: {
        resource: 'routes',
        params: {
            paging: false,
            filter: `code:eq:airqo`,
            fields: '*',
        },
    },
}

const useGetRoute = () => {
    const { loading, error, data } = useDataQuery(ROUTE_QUERY)

    return {
        route: data?.routes?.routes[0],
        error,
        loading,
    }
}

export default useGetRoute
