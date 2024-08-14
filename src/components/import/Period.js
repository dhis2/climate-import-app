import PropTypes from "prop-types";
import i18n from "@dhis2/d2-i18n";
import DatePicker from "../shared/DatePicker";
import TimeZone from "../shared/TimeZone";
import styles from "./styles/Period.module.css";

const Period = ({ period, onChange }) => {
  const { startTime, endTime } = period;

  return (
    <div className={styles.container}>
      <h2>{i18n.t("Period")}</h2>
      <p>
        {i18n.t("Daily values will be imported between start and end dates")}
      </p>
      <div className={styles.pickers}>
        <DatePicker
          label={i18n.t("Start date")}
          defaultVal={startTime}
          onBlur={(startTime) => onChange({ ...period, startTime })}
        />
        <DatePicker
          label={i18n.t("End date")}
          defaultVal={endTime}
          onBlur={(endTime) => onChange({ ...period, endTime })}
        />
        <TimeZone period={period} onChange={onChange} />
      </div>
    </div>
  );
};

Period.propTypes = {
  period: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default Period;
