
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getStaffBookings,
  updateBookingStatus,
  getStaffAnalytics,
} from "../services/api";


const STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

function StaffDashboard() {
  const [bookings, setBookings] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
    const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [analyticsStartDate, setAnalyticsStartDate] = useState("");
  const [analyticsEndDate, setAnalyticsEndDate] = useState("");

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {};

      if (dateFilter) filters.date = dateFilter;
      if (statusFilter) filters.status = statusFilter;

      const response = await getStaffBookings(filters);
      setBookings(response.bookings || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [dateFilter, statusFilter]);

   const loadAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      setAnalyticsError("");

      const response = await getStaffAnalytics(
        analyticsStartDate,
        analyticsEndDate
      );

      setAnalytics(response);
    } catch (err) {
      setAnalyticsError(
        err.response?.data?.message ||
          "Unable to load booking analytics. Please try again."
      );
    } finally {
      setAnalyticsLoading(false);
    }
  }, [analyticsStartDate, analyticsEndDate]);


  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

    useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const filteredBookings = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return bookings;

    return bookings.filter((booking) =>
      [
        booking.customerName,
        booking.customerEmail,
        booking.customerPhone,
        booking.service?.name,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchText))
    );
  }, [bookings, search]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      setError("");
      setSuccess("");

      const response = await updateBookingStatus(
        bookingId,
        newStatus
      );

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId
            ? response.booking
            : booking
        )
      );

      setSuccess("Booking status updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update booking status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const countByStatus = (status) =>
    bookings.filter((booking) => booking.status === status).length;

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };


  return (
    <main className="staff-dashboard">
      <section className="staff-dashboard-header">
        <div>
          <span className="staff-eyebrow">SPICE ROUTE MANAGEMENT</span>
          <h1>Staff Dashboard</h1>
          <p>Manage restaurant reservations and booking statuses.</p>
        </div>

        <button
          type="button"
          className="staff-refresh-button"
          onClick={loadBookings}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Bookings"}
        </button>
      </section>

      {error && (
        <div className="staff-message staff-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="staff-message staff-success" role="status">
          {success}
        </div>
      )}

      <section className="staff-stat-grid">
        <article className="staff-stat-card">
          <span>Total Bookings</span>
          <strong>{bookings.length}</strong>
        </article>

        <article className="staff-stat-card">
          <span>Pending</span>
          <strong>{countByStatus("pending")}</strong>
        </article>

        <article className="staff-stat-card">
          <span>Confirmed</span>
          <strong>{countByStatus("confirmed")}</strong>
        </article>

        <article className="staff-stat-card">
          <span>Completed</span>
          <strong>{countByStatus("completed")}</strong>
        </article>
      </section>

      <section className="staff-analytics-section">
        <div className="staff-panel-heading">
          <div>
            <h2>Booking Analytics</h2>
            <p>Overview of restaurant booking performance.</p>
          </div>
        </div>

        <div className="staff-filters">
          <div className="staff-filter-field">
            <label htmlFor="analytics-start-date">Start Date</label>
            <input
              id="analytics-start-date"
              type="date"
              value={analyticsStartDate}
              max={analyticsEndDate || undefined}
              onChange={(event) =>
                setAnalyticsStartDate(event.target.value)
              }
            />
          </div>

          <div className="staff-filter-field">
            <label htmlFor="analytics-end-date">End Date</label>
            <input
              id="analytics-end-date"
              type="date"
              value={analyticsEndDate}
              min={analyticsStartDate || undefined}
              onChange={(event) =>
                setAnalyticsEndDate(event.target.value)
              }
            />
          </div>

          <button
            type="button"
            className="staff-clear-button"
            onClick={() => {
              setAnalyticsStartDate("");
              setAnalyticsEndDate("");
            }}
          >
            Clear Date Range
          </button>
        </div>

        {analyticsLoading ? (
          <div className="staff-empty-state">
            Loading booking analytics...
          </div>
        ) : analyticsError ? (
          <div className="staff-message staff-error" role="alert">
            {analyticsError}
          </div>
        ) : analytics ? (
          <>
          <div className="staff-stat-grid">
            <article className="staff-stat-card">
              <span>Total Bookings</span>
              <strong>{analytics.totalBookings}</strong>
            </article>

            <article className="staff-stat-card">
              <span>Pending</span>
              <strong>{analytics.statusCounts.pending}</strong>
            </article>

            <article className="staff-stat-card">
              <span>Confirmed</span>
              <strong>{analytics.statusCounts.confirmed}</strong>
            </article>

            <article className="staff-stat-card">
              <span>Completed</span>
              <strong>{analytics.statusCounts.completed}</strong>
            </article>

            <article className="staff-stat-card">
              <span>Cancelled</span>
              <strong>{analytics.statusCounts.cancelled}</strong>
            </article>
                   </div>

          <div className="staff-trends-grid">
            <article className="staff-stat-card">
              <h3>Daily Booking Trends</h3>

              {analytics.dailyTrend.length === 0 ? (
                <p>No daily booking data available.</p>
              ) : (
                analytics.dailyTrend.map((item) => {
                  const maxCount = Math.max(
                    ...analytics.dailyTrend.map((entry) => entry.count),
                    1
                  );

                  return (
                    <div className="staff-trend-item" key={item.date}>
                      <div className="staff-trend-label">
                        <span>{item.date}</span>
                        <strong>{item.count}</strong>
                      </div>

                      <div className="staff-trend-track">
                        <div
                          className="staff-trend-bar"
                          style={{
                            width: `${(item.count / maxCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
                       </article>

            <article className="staff-stat-card">
              <h3>Monthly Booking Trends</h3>

              {analytics.monthlyTrend.length === 0 ? (
                <p>No monthly booking data available.</p>
              ) : (
                analytics.monthlyTrend.map((item) => {
                  const maxCount = Math.max(
                    ...analytics.monthlyTrend.map(
                      (entry) => entry.count
                    ),
                    1
                  );

                  return (
                    <div className="staff-trend-item" key={item.month}>
                      <div className="staff-trend-label">
                        <span>{item.month}</span>
                        <strong>{item.count}</strong>
                      </div>

                      <div className="staff-trend-track">
                        <div
                          className="staff-trend-bar"
                          style={{
                            width: `${(item.count / maxCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </article>

            <article className="staff-stat-card">
              <h3>Popular Services</h3>

              {analytics.popularServices.length === 0 ? (
                <p>No service booking data available.</p>
              ) : (
                analytics.popularServices.map((item) => (
                  <div className="staff-trend-item" key={item.service}>
                    <div className="staff-trend-label">
                      <span>{item.service}</span>
                      <strong>{item.count}</strong>
                    </div>
                  </div>
                ))
              )}
            </article>
          </div>
          </>
        ) : null}
      </section>

      <section className="staff-bookings-panel">
        <div className="staff-panel-heading">
          <div>
            <h2>Restaurant Bookings</h2>
            <p>Search reservations and manage their status.</p>
          </div>

          <span className="staff-result-count">
            {filteredBookings.length} results
          </span>
        </div>

        <div className="staff-filters">
          <div className="staff-filter-field">
            <label htmlFor="staff-search">Search bookings</label>
            <input
              id="staff-search"
              type="search"
              placeholder="Customer, email, phone or service"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="staff-filter-field">
            <label htmlFor="staff-date">Booking date</label>
            <input
              id="staff-date"
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </div>

          <div className="staff-filter-field">
            <label htmlFor="staff-status">Booking status</label>
            <select
              id="staff-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="staff-clear-button"
            onClick={() => {
              setSearch("");
              setDateFilter("");
              setStatusFilter("");
            }}
          >
            Clear Filters
          </button>
        </div>

        {loading ? (
          <div className="staff-empty-state">
            Loading restaurant bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="staff-empty-state">
            <h3>No bookings found</h3>
            <p>
              There are no bookings matching your search or selected filters.
              Try changing the filters or clearing them.
            </p>
          </div>
        ) : (
          <div className="staff-table-wrapper">
            <table className="staff-bookings-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Contact</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <strong>{booking.customerName}</strong>
                    </td>

                    <td>{booking.service?.name || "Service unavailable"}</td>

                    <td>{formatDate(booking.date)}</td>

                    <td>{booking.slot || "—"}</td>

                    <td>
                      <span>{booking.customerEmail}</span>
                      <small>{booking.customerPhone}</small>
                    </td>

                    <td>
                      <select
                        className={`staff-status-select status-${booking.status}`}
                        value={booking.status || "pending"}
                        disabled={updatingId === booking._id}
                        onChange={(event) =>
                          handleStatusChange(
                            booking._id,
                            event.target.value
                          )
                        }
                        aria-label={`Status for ${booking.customerName}`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() +
                              status.slice(1)}
                          </option>
                        ))}
                      </select>

                      {updatingId === booking._id && (
                        <small>Updating...</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default StaffDashboard;
