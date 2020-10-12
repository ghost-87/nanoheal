import React, { Component } from "react";
import "./BikeTrack.css";
import List from "../List/List";
import Pagination from "../Pagination/Pagination";
import Header from "../Header/Header";
import Filter from "../Filter/Filter";

const INCIDENTS_URL = "https://bikewise.org:443/api/v2/incidents",
  QUERY_PARAMETERS = {
    PAGE: "page",
    PER_PAGE: "per_page",
    INCIDENT_TYPE: "incident_type",
    PROXIMITY: "proximity",
  };

const recordsPerPage = 10,
  incidentType = "theft",
  title = "Police Department Of Berlin",
  subtitle = "Stolen Bykes";

const formatDate = (dateString) => {
  return new Date(dateString).getTime().toString().slice(0, -3);
};

class BikeTrack extends Component {
  state = {
    current: {
      page: 1,
      loading: false,
      error: false,
      records: [],
    },
    all: {
      loading: false,
      error: false,
      records: [],
    },
    filter: {
      query: "",
      rangeStart: "",
      rangeEnd: "",
      applied: false
    },
    proximity: "berlin"
  };

  componentDidMount() {
    this.getCurrentPageIncidents();

    this.getTotalIncidents();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.current.page !== this.state.current.page ||
      prevState.filter.query !== this.state.filter.query ||
      prevState.filter.rangeStart !== this.state.filter.rangeStart ||
      prevState.filter.rangeEnd !== this.state.filter.rangeEnd 
    ) {
      this.getCurrentPageIncidents();
    }
  }

  setFilter = (query, rangeStart, rangeEnd) => {
    this.setState({
      filter: {
        ...this.state.filter,
        query: query ? query : "",
        rangeStart: rangeStart ? formatDate(rangeStart) : "",
        rangeEnd: rangeEnd ? formatDate(rangeEnd) : "",
        applied: (query || rangeStart || rangeEnd)
      },
    });
  };

  getTotalIncidents = () => {
    this.setState({
      all: {
        ...this.state.all,
        loading: true,
      },
    });

    const url = `${INCIDENTS_URL}?${QUERY_PARAMETERS.INCIDENT_TYPE}=${incidentType}&${QUERY_PARAMETERS.PROXIMITY}=${this.state.proximity}`;
    fetch(url)
      .then((data) => data.json())
      .then((response) => {
        this.setState({
          all: {
            ...this.state.all,
            records: response.incidents.length,
            loading: false,
            error: false,
          },
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          all: {
            ...this.state.all,
            records: [],
            loading: false,
            error: true,
          },
        });
      });
  };

  getCurrentPageIncidents = () => {
    this.setState({
      current: {
        ...this.state.current,
        loading: true,
      },
    });

    let url = `${INCIDENTS_URL}?${QUERY_PARAMETERS.PAGE}=${this.state.current.page}&${QUERY_PARAMETERS.PER_PAGE}=${recordsPerPage}&${QUERY_PARAMETERS.INCIDENT_TYPE}=${incidentType}&${QUERY_PARAMETERS.PROXIMITY}=${this.state.proximity}`;

    if (this.state.filter.query) url += `&query=${this.state.filter.query}`;

    if (this.state.filter.rangeStart)
      url += `&occurred_after=${this.state.filter.rangeStart}`;

    if (this.state.filter.rangeEnd)
      url += `&occurred_before=${this.state.filter.rangeEnd}`;

    fetch(url)
      .then((data) => data.json())
      .then((response) => {
        this.setState({
          current: {
            ...this.state.current,
            records: response.incidents,
            loading: false,
            error: false,
          },
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          current: {
            ...this.state.current,
            records: [],
            loading: false,
            error: true,
          },
        });
      });
  };

  setPage = (page) => {
    let newPage;
    switch (page) {
      case "next":
        newPage = this.state.current.page + 1;
        break;

      case "prev":
        newPage = this.state.current.page - 1;
        break;

      default:
        newPage = parseInt(page);
    }
    this.setState({
      current: {
        ...this.state.current,
        page: newPage,
      },
    });
  };

  render() {
    return (
      <div className="BikeTrack">
        <Header title={title} subtitle={subtitle} />

        <Filter setFilter={this.setFilter} />

        <div className="BikeTrack-location-total">
          <div className="BikeTrack-total">
            <span className="BikeTrack-total-label">Total: </span>
            <span className="BikeTrack-total-value">{this.state.filter.applied ? this.state.current.records.length : this.state.all.records}</span>
          </div>
        </div>

        <List {...this.state.current} />

        <Pagination
          currentPage={this.state.current.page}
          perPage={recordsPerPage}
          setPage={this.setPage}
          {...this.state.all}
          records={this.state.filter.applied ? this.state.current.records : this.state.all.records}
        />
      </div>
    );
  }
}

export default BikeTrack;
