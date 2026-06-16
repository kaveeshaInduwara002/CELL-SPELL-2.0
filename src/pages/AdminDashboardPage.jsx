import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';
import { CellSpellLogo } from '../components/SVGIcons';

const FACULTIES = [
  'Faculty of Humanities and Science',
  'Faculty of Engineering',
  'Faculty of Computing',
  'Business School',
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Dashboard stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Registrations table
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [events, setEvents] = useState([]);

  const PAGE_SIZE = 20;

  // Fetch events list
  useEffect(() => {
    supabase.from('events').select('slug, name').then(({ data }) => {
      if (data) setEvents(data);
    });
  }, []);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data, error } = await supabase.rpc('admin_get_dashboard_stats');
      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch registrations
  const fetchRegistrations = useCallback(async () => {
    setTableLoading(true);
    try {
      const { data, error } = await supabase.rpc('admin_get_registrations', {
        p_event_slug: filterEvent || null,
        p_search: search || null,
        p_faculty: filterFaculty || null,
        p_limit: PAGE_SIZE,
        p_offset: page * PAGE_SIZE,
      });
      if (error) throw error;
      setRows(data.rows || []);
      setTotalRows(data.total || 0);
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setTableLoading(false);
    }
  }, [filterEvent, filterFaculty, search, page]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchRegistrations(); }, [fetchRegistrations]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  // CSV Export
  const handleExport = async () => {
    try {
      // Fetch ALL matching rows (no pagination)
      const { data, error } = await supabase.rpc('admin_get_registrations', {
        p_event_slug: filterEvent || null,
        p_search: search || null,
        p_faculty: filterFaculty || null,
        p_limit: 10000,
        p_offset: 0,
      });
      if (error) throw error;

      const allRows = data.rows || [];
      if (allRows.length === 0) {
        alert('No data to export.');
        return;
      }

      const headers = [
        'Registration ID', 'Event', 'Full Name', 'SLIIT Reg No',
        'Email', 'Telephone', 'NIC Number', 'Faculty', 'Registered At',
      ];
      const csvRows = [headers.join(',')];
      allRows.forEach((r) => {
        csvRows.push([
          r.registration_id,
          `"${r.event_name}"`,
          `"${r.full_name}"`,
          r.sliit_reg_number,
          r.email,
          r.telephone,
          r.nic_number,
          `"${r.faculty}"`,
          new Date(r.created_at).toLocaleString(),
        ].join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registrations_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Check console for details.');
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  return (
    <section className="admin-dashboard" id="admin-dashboard">
      <div className="container">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-brand">
            <CellSpellLogo size={28} className="nav-logo-svg" />
            <div>
              <h1 className="admin-header-title">Admin Dashboard</h1>
              <p className="admin-header-email">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="btn btn-secondary admin-signout-btn" id="admin-signout-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </header>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <StatCard
            label="Total Registrations"
            value={stats?.total ?? '—'}
            loading={statsLoading}
            accent
          />
          <StatCard
            label="Today"
            value={stats?.today ?? '—'}
            loading={statsLoading}
          />
          {stats?.per_event?.map((e) => (
            <StatCard
              key={e.slug}
              label={e.name}
              value={e.count}
              loading={statsLoading}
            />
          ))}
        </div>

        {/* Faculty Breakdown */}
        {stats?.per_faculty && stats.per_faculty.length > 0 && (
          <div className="admin-faculty-grid">
            <h3 className="admin-section-title">By Faculty</h3>
            <div className="admin-faculty-bars">
              {stats.per_faculty.map((f) => {
                const pct = stats.total > 0 ? Math.round((f.count / stats.total) * 100) : 0;
                return (
                  <div key={f.faculty} className="faculty-bar-row">
                    <span className="faculty-bar-label">{f.faculty.replace('Faculty of ', '')}</span>
                    <div className="faculty-bar-track">
                      <div className="faculty-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="faculty-bar-count">{f.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters + Search */}
        <div className="admin-controls">
          <div className="admin-controls-left">
            <input
              type="text"
              placeholder="Search name, email, NIC, reg ID..."
              className="admin-search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              id="admin-search"
            />
            <select
              className="admin-filter-select"
              value={filterEvent}
              onChange={(e) => { setFilterEvent(e.target.value); setPage(0); }}
              id="admin-filter-event"
            >
              <option value="">All Events</option>
              {events.map((ev) => (
                <option key={ev.slug} value={ev.slug}>{ev.name}</option>
              ))}
            </select>
            <select
              className="admin-filter-select"
              value={filterFaculty}
              onChange={(e) => { setFilterFaculty(e.target.value); setPage(0); }}
              id="admin-filter-faculty"
            >
              <option value="">All Faculties</option>
              {FACULTIES.map((f) => (
                <option key={f} value={f}>{f.replace('Faculty of ', '')}</option>
              ))}
            </select>
          </div>
          <button onClick={handleExport} className="btn btn-primary admin-export-btn" id="admin-export-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Data Table */}
        <div className="admin-table-wrapper">
          {tableLoading ? (
            <div className="admin-table-loading">
              <div className="btn-spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
              <span>Loading registrations...</span>
            </div>
          ) : rows.length === 0 ? (
            <div className="admin-table-empty">
              <p>No registrations found.</p>
            </div>
          ) : (
            <table className="admin-table" id="admin-registrations-table">
              <thead>
                <tr>
                  <th>Reg ID</th>
                  <th>Event</th>
                  <th>Name</th>
                  <th>SLIIT Reg</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>NIC</th>
                  <th>Faculty</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="admin-td-mono">{r.registration_id}</td>
                    <td>{r.event_name}</td>
                    <td>{r.full_name}</td>
                    <td className="admin-td-mono">{r.sliit_reg_number}</td>
                    <td>{r.email}</td>
                    <td className="admin-td-mono">{r.telephone}</td>
                    <td className="admin-td-mono">{r.nic_number}</td>
                    <td className="admin-td-faculty">{r.faculty.replace('Faculty of ', '')}</td>
                    <td className="admin-td-date">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalRows > PAGE_SIZE && (
          <div className="admin-pagination">
            <button
              className="btn btn-secondary"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              id="admin-prev-page"
            >
              Previous
            </button>
            <span className="admin-page-info">
              Page {page + 1} of {totalPages} ({totalRows} total)
            </span>
            <button
              className="btn btn-secondary"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              id="admin-next-page"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value, loading, accent }) {
  return (
    <div className={`admin-stat-card ${accent ? 'admin-stat-card--accent' : ''}`}>
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-value">
        {loading ? (
          <div className="btn-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
        ) : (
          value
        )}
      </div>
    </div>
  );
}
