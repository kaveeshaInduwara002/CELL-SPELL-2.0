import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';
import { CellSpellLogo, CodeIcon, FactoryIcon } from '../components/SVGIcons';

const FACULTIES = [
  'Faculty of Humanities and Science',
  'Faculty of Engineering',
  'Faculty of Computing',
  'Business School',
];

const YEAR_SEMESTERS = [
  '1st Year 1st Semester',
  '1st Year 2nd Semester',
  '2nd Year 1st Semester',
  '2nd Year 2nd Semester',
  '3rd Year 1st Semester',
  '3rd Year 2nd Semester',
  '4th Year 1st Semester',
  '4th Year 2nd Semester',
];

const FORM_EVENTS = [
  { key: 'workshop', label: 'Workshop', icon: <CodeIcon size={24} /> },
  { key: 'industry_visit', label: 'Industry Visit', icon: <FactoryIcon size={24} /> },
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
  const [filterYearSemester, setFilterYearSemester] = useState('');
  const [events, setEvents] = useState([]);

  // Form control state
  const [formConfigs, setFormConfigs] = useState({});
  const [formConfigsLoading, setFormConfigsLoading] = useState(true);
  const [statusLogs, setStatusLogs] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);
  const [showComingSoonModal, setShowComingSoonModal] = useState(null);
  const [comingSoonForm, setComingSoonForm] = useState({
    scheduled_open_at: '',
    title: '',
    description: '',
    schedule_info: '',
  });
  const [statusUpdating, setStatusUpdating] = useState(null);

  const PAGE_SIZE = 20;

  // Fetch events list
  useEffect(() => {
    supabase.from('events').select('slug, name').then(({ data }) => {
      if (data) setEvents(data);
    });
  }, []);

  // Fetch form configs
  const fetchFormConfigs = useCallback(async () => {
    setFormConfigsLoading(true);
    try {
      const { data, error } = await supabase
        .from('form_configs')
        .select('*')
        .order('form_key');
      if (!error && data) {
        const map = {};
        data.forEach((c) => { map[c.form_key] = c; });
        setFormConfigs(map);
      }
    } catch (err) {
      console.error('Failed to load form configs:', err);
    } finally {
      setFormConfigsLoading(false);
    }
  }, []);

  // Fetch status logs
  const fetchStatusLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('form_status_logs')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(10);
      if (!error && data) setStatusLogs(data);
    } catch (err) {
      console.error('Failed to load status logs:', err);
    }
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
        p_year_semester: filterYearSemester || null,
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
  }, [filterEvent, filterFaculty, filterYearSemester, search, page]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchRegistrations(); }, [fetchRegistrations]);
  useEffect(() => { fetchFormConfigs(); }, [fetchFormConfigs]);
  useEffect(() => { fetchStatusLogs(); }, [fetchStatusLogs]);

  // Subscribe to Realtime for form_configs + form_status_logs
  useEffect(() => {
    const channel = supabase
      .channel('admin-form-control')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'form_configs' },
        (payload) => {
          if (payload.new) {
            setFormConfigs((prev) => ({
              ...prev,
              [payload.new.form_key]: payload.new,
            }));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'form_status_logs' },
        () => {
          fetchStatusLogs();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchStatusLogs]);

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

  // Status update handler
  const handleStatusChange = async (formKey, newStatus) => {
    setStatusUpdating(formKey);
    try {
      const { error } = await supabase.rpc('update_form_config', {
        p_form_key: formKey,
        p_status: newStatus,
        p_scheduled_open_at: null,
        p_title: null,
        p_description: null,
        p_schedule_info: null,
      });
      if (error) throw error;
      await fetchFormConfigs();
      await fetchStatusLogs();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update form status: ' + err.message);
    } finally {
      setStatusUpdating(null);
      setShowConfirmDialog(null);
    }
  };

  // Coming Soon submit handler
  const handleComingSoonSubmit = async () => {
    const formKey = showComingSoonModal;
    setStatusUpdating(formKey);
    try {
      const scheduleInfoParsed = comingSoonForm.schedule_info
        ? (() => {
            try { return JSON.parse(comingSoonForm.schedule_info); }
            catch { return { info: comingSoonForm.schedule_info }; }
          })()
        : null;

      const { error } = await supabase.rpc('update_form_config', {
        p_form_key: formKey,
        p_status: 'coming_soon',
        p_scheduled_open_at: comingSoonForm.scheduled_open_at || null,
        p_title: comingSoonForm.title || null,
        p_description: comingSoonForm.description || null,
        p_schedule_info: scheduleInfoParsed,
      });
      if (error) throw error;
      await fetchFormConfigs();
      await fetchStatusLogs();
      setShowComingSoonModal(null);
      setComingSoonForm({ scheduled_open_at: '', title: '', description: '', schedule_info: '' });
    } catch (err) {
      console.error('Failed to set coming soon:', err);
      alert('Failed to update: ' + err.message);
    } finally {
      setStatusUpdating(null);
    }
  };

  // Check for sequential intelligence prompt
  const workshopConfig = formConfigs['workshop'];
  const industryConfig = formConfigs['industry_visit'];
  const showSequentialPrompt =
    workshopConfig?.status === 'closed' &&
    industryConfig?.status !== 'open' &&
    industryConfig?.status !== 'closed';

  // CSV Export
  const handleExport = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_get_registrations', {
        p_event_slug: filterEvent || null,
        p_search: search || null,
        p_faculty: filterFaculty || null,
        p_year_semester: filterYearSemester || null,
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
        'Email', 'Telephone', 'NIC Number', 'Faculty', 'Year & Semester', 'Registered At',
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
          `"${r.year_semester || ''}"`,
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

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear the activity log? This cannot be undone.')) return;
    try {
      const { error } = await supabase
        .from('form_status_logs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      setStatusLogs([]);
    } catch (err) {
      console.error('Failed to clear logs:', err);
      alert(
        'Failed to clear logs. Make sure you have run the updated SQL migration in Supabase SQL editor to allow delete operations. Details: ' +
          err.message
      );
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

        {/* ===== FORM CONTROL PANEL ===== */}
        <div className="form-control-panel" id="form-control-panel">
          <h2 className="admin-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 8 }}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            Form Control Center
          </h2>

          {/* Sequential Intelligence Prompt */}
          {showSequentialPrompt && (
            <div className="sequential-prompt" id="sequential-prompt">
              <div className="sequential-prompt__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))' }}>
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5.5 5.5 0 0 0 7 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </div>
              <div className="sequential-prompt__content">
                <strong>Workshop is closed.</strong> Ready to schedule Industry Visit?
              </div>
              <button
                className="btn btn-primary sequential-prompt__btn"
                onClick={() => {
                  setComingSoonForm({ scheduled_open_at: '', title: 'Industry Visit Registration', description: 'Registration opens soon. Stay tuned!', schedule_info: '' });
                  setShowComingSoonModal('industry_visit');
                }}
              >
                Schedule Now
              </button>
            </div>
          )}

          <div className="form-control-grid">
            {FORM_EVENTS.map((fe) => {
              const config = formConfigs[fe.key];
              const status = config?.status || 'coming_soon';
              const regCount = stats?.per_event?.find((e) =>
                (fe.key === 'workshop' && e.slug === 'workshop') ||
                (fe.key === 'industry_visit' && e.slug === 'industry-visit')
              )?.count ?? 0;
              const lastChange = config?.updated_at
                ? new Date(config.updated_at).toLocaleString()
                : '—';

              return (
                <div
                  className={`form-control-card form-control-card--${status}`}
                  key={fe.key}
                  id={`form-control-${fe.key}`}
                >
                  <div className="form-control-card__header">
                    <div className="form-control-card__title-row">
                      <span className="form-control-card__icon">{fe.icon}</span>
                      <h3 className="form-control-card__name">{fe.label}</h3>
                    </div>
                    <span className={`status-badge status-badge--${status}`}>
                      {status === 'open' ? 'Open' : status === 'closed' ? 'Closed' : 'Coming Soon'}
                    </span>
                  </div>

                  <div className="form-control-card__stats">
                    <div className="form-control-stat">
                      <span className="form-control-stat__label">Registrations</span>
                      <span className="form-control-stat__value">{statsLoading ? '—' : regCount}</span>
                    </div>
                    <div className="form-control-stat">
                      <span className="form-control-stat__label">Last Changed</span>
                      <span className="form-control-stat__value form-control-stat__value--small">{lastChange}</span>
                    </div>
                  </div>

                  <div className="form-control-card__actions">
                    <button
                      className={`fc-action-btn fc-action-btn--open ${status === 'open' ? 'fc-action-btn--active' : ''}`}
                      disabled={status === 'open' || statusUpdating === fe.key}
                      onClick={() => setShowConfirmDialog({ formKey: fe.key, action: 'open', label: fe.label })}
                      id={`fc-open-${fe.key}`}
                    >
                      {statusUpdating === fe.key ? <span className="btn-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : '●'} Open
                    </button>
                    <button
                      className={`fc-action-btn fc-action-btn--closed ${status === 'closed' ? 'fc-action-btn--active' : ''}`}
                      disabled={status === 'closed' || statusUpdating === fe.key}
                      onClick={() => setShowConfirmDialog({ formKey: fe.key, action: 'closed', label: fe.label })}
                      id={`fc-close-${fe.key}`}
                    >
                      {statusUpdating === fe.key ? <span className="btn-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : '●'} Close
                    </button>
                    <button
                      className={`fc-action-btn fc-action-btn--coming-soon ${status === 'coming_soon' ? 'fc-action-btn--active' : ''}`}
                      disabled={status === 'coming_soon' || statusUpdating === fe.key}
                      onClick={() => {
                        setComingSoonForm({
                          scheduled_open_at: config?.scheduled_open_at ? config.scheduled_open_at.slice(0, 16) : '',
                          title: config?.title || '',
                          description: config?.description || '',
                          schedule_info: config?.schedule_info ? JSON.stringify(config.schedule_info, null, 2) : '',
                        });
                        setShowComingSoonModal(fe.key);
                      }}
                      id={`fc-coming-soon-${fe.key}`}
                    >
                      {statusUpdating === fe.key ? <span className="btn-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : '●'} Coming Soon
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity Log */}
          <div className="activity-log" id="activity-log">
            <div className="activity-log__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 className="activity-log__title" style={{ margin: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 6 }}>
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Activity Log
              </h3>
              {statusLogs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                  id="btn-clear-logs"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: 'middle' }}>
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Clear Log
                </button>
              )}
            </div>
            {statusLogs.length === 0 ? (
              <p className="activity-log__empty">No status changes yet.</p>
            ) : (
              <ul className="activity-log__list">
                {statusLogs.map((log) => (
                  <li key={log.id} className="activity-log__item">
                    <div className="activity-log__dot" />
                    <div className="activity-log__content">
                      <span className="activity-log__event">
                        {FORM_EVENTS.find((e) => e.key === log.form_key)?.label || log.form_key}
                      </span>
                      <span className="activity-log__change">
                        <span className={`status-badge--inline status-badge--${log.old_status}`}>{log.old_status || '—'}</span>
                        {' → '}
                        <span className={`status-badge--inline status-badge--${log.new_status}`}>{log.new_status}</span>
                      </span>
                      <span className="activity-log__meta">
                        {log.changed_by && <span>{log.changed_by} · </span>}
                        {new Date(log.changed_at).toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

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
            <select
              className="admin-filter-select"
              value={filterYearSemester}
              onChange={(e) => { setFilterYearSemester(e.target.value); setPage(0); }}
              id="admin-filter-year-semester"
            >
              <option value="">All Semesters</option>
              {YEAR_SEMESTERS.map((ys) => (
                <option key={ys} value={ys}>{ys}</option>
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
                  <th>Year & Semester</th>
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
                     <td>{r.year_semester}</td>
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

      {/* ===== CONFIRM DIALOG MODAL ===== */}
      {showConfirmDialog && (
        <div className="confirm-overlay" onClick={() => setShowConfirmDialog(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()} id="confirm-dialog">
            <h3 className="confirm-dialog__title">Confirm Status Change</h3>
            <p className="confirm-dialog__text">
              Are you sure you want to <strong>{showConfirmDialog.action === 'open' ? 'open' : 'close'}</strong> registration for <strong>{showConfirmDialog.label}</strong>?
            </p>
            <div className="confirm-dialog__actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirmDialog(null)}
              >
                Cancel
              </button>
              <button
                className={`btn ${showConfirmDialog.action === 'open' ? 'btn-primary' : 'btn-danger'}`}
                onClick={() => handleStatusChange(showConfirmDialog.formKey, showConfirmDialog.action)}
                disabled={statusUpdating}
              >
                {statusUpdating ? (
                  <><span className="btn-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Updating...</>
                ) : (
                  `Yes, ${showConfirmDialog.action === 'open' ? 'Open' : 'Close'} it`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== COMING SOON MODAL ===== */}
      {showComingSoonModal && (
        <div className="confirm-overlay" onClick={() => setShowComingSoonModal(null)}>
          <div className="coming-soon-modal" onClick={(e) => e.stopPropagation()} id="coming-soon-modal">
            <h3 className="coming-soon-modal__title">
              Schedule Coming Soon
            </h3>
            <p className="coming-soon-modal__subtitle">
              Configure the coming soon page for{' '}
              <strong>{FORM_EVENTS.find((e) => e.key === showComingSoonModal)?.label}</strong>
            </p>

            <div className="coming-soon-modal__form">
              <div className="cs-modal-field">
                <label htmlFor="cs-scheduled-at">Scheduled Open Date & Time</label>
                <input
                  type="datetime-local"
                  id="cs-scheduled-at"
                  className="cs-modal-input"
                  value={comingSoonForm.scheduled_open_at}
                  onChange={(e) => setComingSoonForm((f) => ({ ...f, scheduled_open_at: e.target.value }))}
                />
              </div>
              <div className="cs-modal-field">
                <label htmlFor="cs-title">Event Title</label>
                <input
                  type="text"
                  id="cs-title"
                  className="cs-modal-input"
                  placeholder="e.g., Industry Visit Registration"
                  value={comingSoonForm.title}
                  onChange={(e) => setComingSoonForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="cs-modal-field">
                <label htmlFor="cs-description">Short Description</label>
                <textarea
                  id="cs-description"
                  className="cs-modal-input cs-modal-textarea"
                  placeholder="Brief message for visitors..."
                  rows={3}
                  value={comingSoonForm.description}
                  onChange={(e) => setComingSoonForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="cs-modal-field">
                <label htmlFor="cs-schedule-info">Schedule Info</label>
                <input
                  type="text"
                  id="cs-schedule-info"
                  className="cs-modal-input"
                  placeholder='e.g., Workshop: Dec 10 | Industry Visit: Dec 18'
                  value={comingSoonForm.schedule_info}
                  onChange={(e) => setComingSoonForm((f) => ({ ...f, schedule_info: e.target.value }))}
                />
              </div>
            </div>

            <div className="confirm-dialog__actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowComingSoonModal(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleComingSoonSubmit}
                disabled={statusUpdating}
              >
                {statusUpdating ? (
                  <><span className="btn-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
                ) : (
                  'Set Coming Soon'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
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
