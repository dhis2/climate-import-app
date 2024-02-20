import { useDataEngine, useDataQuery } from "@dhis2/app-runtime";
import { useState, useEffect } from "react";

// Fetches the root org units associated with the current user with fallback to data capture org units
const ORG_UNITS_QUERY = {
  roots: {
    resource: "organisationUnits",
    params: () => ({
      fields: ["id", "displayName~rename(name)", "path"],
      userDataViewFallback: true,
    }),
  },
};

const useOrgUnitRoots = () => {
  const { loading, error, data } = useDataQuery(ORG_UNITS_QUERY);

  // const [data, setData] = useState();
  // const [error, setError] = useState();
  // const engine = useDataEngine();

  /*
  useEffect(() => {
    console.log("useOrgUnitRoots");
    engine.query(ORG_UNITS_QUERY, {
      onComplete: setData,
      onError: setError,
    });
  }, [engine]);
  */

  return {
    roots: data?.roots?.organisationUnits,
    error,
    loading: !data && !error,
  };
};

export default useOrgUnitRoots;
