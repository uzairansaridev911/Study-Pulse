import React, { useState } from 'react';
import {
  FaUser, FaBell, FaPaintBrush, FaShieldAlt, FaBook,
  FaCreditCard, FaQuestionCircle, FaInfoCircle, FaExclamationTriangle,
  FaSignOutAlt, FaChevronRight, FaChevronDown, FaGoogle, FaGithub,
  FaExternalLinkAlt, FaDownload, FaCheck, FaTimes, FaThLarge, FaBars
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db } from '../src/Firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useUser, useClerk } from '@clerk/clerk-react';
import book from '../Images/Book.webp';

const Toggle = ({ checked: initialChecked = false }) => {
  const [on, setOn] = React.useState(initialChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      style={{
        width: 42, height: 24, borderRadius: 12,
        background: on ? '#16a34a' : '#d1d5db',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: on ? 21 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
        display: 'block'
      }} />
    </button>
  );
};

const Badge = ({ label, color }) => {
  const colors = {
    green: { bg: '#dcfce7', text: '#15803d' },
    amber: { bg: '#fef9c3', text: '#a16207' },
    red: { bg: '#fee2e2', text: '#b91c1c' },
    blue: { bg: '#dbeafe', text: '#1d4ed8' },
  };
  const c = colors[color] || colors.green;
  return (
    <span style={{
      background: c.bg, color: c.text,
      fontSize: 11, fontWeight: 600,
      padding: '3px 9px', borderRadius: 20,
    }}>{label}</span>
  );
};

const Row = ({ icon, title, sub, right, danger }) => (
  <div className="settings-row" style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid #f3f4f6',
    flexWrap: 'wrap', gap: 10
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
      {icon && (
        <span style={{
          width: 34, height: 34, borderRadius: 8,
          background: danger ? '#fee2e2' : '#f0fdf4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: danger ? '#dc2626' : '#16a34a', fontSize: 15, flexShrink: 0
        }}>{icon}</span>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: danger ? '#dc2626' : '#111827' }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
    {right && <div style={{ marginLeft: 16, flexShrink: 0 }}>{right}</div>}
  </div>
);

const Card = ({ label, children, noPad }) => (
  <div style={{
    background: '#fff', borderRadius: 14,
    border: '1px solid #e5e7eb',
    marginBottom: 16, overflow: 'hidden'
  }}>
    {label && (
      <div style={{
        padding: '10px 20px', background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        fontSize: 11, fontWeight: 700,
        color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase'
      }}>{label}</div>
    )}
    {children}
  </div>
);

const Btn = ({ children, variant = 'outline', onClick, small }) => {
  const styles = {
    outline: { background: '#fff', color: '#374151', border: '1px solid #d1d5db' },
    primary: { background: '#16a34a', color: '#fff', border: '1px solid #16a34a' },
    danger: { background: '#fff', color: '#dc2626', border: '1px solid #fca5a5' },
    warning: { background: '#fff', color: '#d97706', border: '1px solid #fcd34d' },
  };
  return (
    <button onClick={onClick} style={{
      ...styles[variant],
      fontSize: small ? 11 : 12, fontWeight: 600,
      padding: small ? '5px 10px' : '7px 14px',
      borderRadius: 8, cursor: 'pointer',
      transition: 'opacity 0.15s',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap'
    }}>{children}</button>
  );
};

const Inp = ({ value, placeholder, type = 'text', style = {} }) => {
  const [val, setVal] = React.useState(value || '');
  return (
    <input
      type={type} value={val}
      onChange={e => setVal(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: '8px 12px', fontSize: 13,
        border: '1px solid #d1d5db', borderRadius: 8,
        background: '#f9fafb', color: '#111827',
        outline: 'none', fontFamily: 'inherit',
        width: '100%', boxSizing: 'border-box', ...style
      }}
    />
  );
};

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

const SectionAccount = () => (
  <div>
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Account</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>Manage your profile and personal information</p>
    </div>

    <Card label="Profile">
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #f3f4f6', flexWrap: 'wrap' }}>
        <div style={{
          width: 58, height: 58, borderRadius: '50%',
          background: 'linear-gradient(135deg,#16a34a,#15803d)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0
        }}>UA</div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Uzair Ansari</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>uzair@gmail.com</div>
          <Badge label="Pro Member" color="green" />
        </div>
        <Btn>Edit photo</Btn>
      </div>
      <div className="profile-grid" style={{ padding: '14px 20px', display: 'grid', gap: 12, borderBottom: '1px solid #f3f4f6' }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>First name</label>
          <div style={{ marginTop: 5 }}><Inp value="Uzair" /></div>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last name</label>
          <div style={{ marginTop: 5 }}><Inp value="Ansari" /></div>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
          <div style={{ marginTop: 5 }}><Inp value="uzair@gmail.com" type="email" /></div>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</label>
          <div style={{ marginTop: 5 }}><Inp value="uzair_ansari" /></div>
        </div>
      </div>
      <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Btn>Cancel</Btn>
        <Btn variant="primary">Save changes</Btn>
      </div>
    </Card>

    <Card label="Password & security">
      <Row icon={<FaShieldAlt />} title="Password" sub="Last changed 3 months ago" right={<Btn>Change</Btn>} />
      <Row icon={<FaCheck />} title="Two-factor authentication" sub="Authenticator app connected" right={<Badge label="Enabled" color="green" />} />
      <Row icon={<FaUser />} title="Active sessions" sub="3 devices signed in" right={<Btn>Manage</Btn>} />
    </Card>

    <Card label="Connected accounts">
      <Row icon={<FaGoogle />} title="Google" sub="uzair@gmail.com" right={<Btn variant="danger">Disconnect</Btn>} />
      <Row icon={<FaGithub />} title="GitHub" sub="Not connected" right={<Btn variant="primary">Connect</Btn>} />
    </Card>
  </div>
);

const SectionNotifications = () => (
  <div>
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Notifications</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>Control what you hear about and how</p>
    </div>
    <Card label="Channels">
      <Row icon={<FaBell />} title="Email notifications" sub="Course updates, reminders, weekly digest" right={<Toggle checked={true} />} />
      <Row icon={<FaBell />} title="Push notifications" sub="In-app alerts on your device" right={<Toggle checked={true} />} />
      <Row icon={<FaBell />} title="SMS notifications" sub="Critical alerts via text message" right={<Toggle />} />
    </Card>
    <Card label="Activity alerts">
      <Row title="New course available" sub="When a course in your interest is published" right={<Toggle checked />} />
      <Row title="Assignment deadlines" sub="Reminders 24h and 1h before due" right={<Toggle checked />} />
      <Row title="Quiz results" sub="Notify when your result is ready" right={<Toggle checked />} />
      <Row title="Daily streak reminder" sub="Nudge to keep your streak alive" right={<Toggle />} />
      <Row title="Promotional emails" sub="Offers, discounts, new features" right={<Toggle />} />
    </Card>
    <Card label="Quiet hours">
      <Row title="Do not disturb" sub="Pause all notifications during a window" right={<Toggle />} />
      <div style={{ padding: '12px 20px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: '#6b7280' }}>From</span>
        <input type="time" defaultValue="22:00" style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12, background: '#f9fafb', color: '#111827', fontFamily: 'inherit' }} />
        <span style={{ fontSize: 12, color: '#6b7280' }}>to</span>
        <input type="time" defaultValue="08:00" style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12, background: '#f9fafb', color: '#111827', fontFamily: 'inherit' }} />
      </div>
    </Card>
  </div>
);

const SectionAppearance = () => {
  const [theme, setTheme] = React.useState('light');
  const [accent, setAccent] = React.useState('#16a34a');
  const accents = ['#16a34a', '#2563eb', '#7c3aed', '#dc2626', '#d97706', '#0891b2', '#db2777'];
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Appearance</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>Customize how Study Pulse looks for you</p>
      </div>
      <Card label="Theme">
        <div className="theme-grid" style={{ display: 'grid', gap: 10, padding: '16px 20px' }}>
          {[['light', '☀️', 'Light'], ['dark', '🌙', 'Dark'], ['system', '💻', 'System']].map(([key, icon, label]) => (
            <div key={key} onClick={() => setTheme(key)} style={{
              border: `2px solid ${theme === key ? '#16a34a' : '#e5e7eb'}`,
              borderRadius: 10, padding: '12px 8px', textAlign: 'center',
              cursor: 'pointer', background: theme === key ? '#f0fdf4' : '#fff'
            }}>
              <div style={{ fontSize: 24, marginBottom: 5 }}>{icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: theme === key ? '#15803d' : '#6b7280' }}>{label}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card label="Accent color">
        <div style={{ display: 'flex', gap: 10, padding: '14px 20px', flexWrap: 'wrap' }}>
          {accents.map(c => (
            <div key={c} onClick={() => setAccent(c)} style={{
              width: 28, height: 28, borderRadius: '50%', background: c,
              cursor: 'pointer', border: `3px solid ${accent === c ? '#111827' : 'transparent'}`,
              transition: 'border-color 0.15s'
            }} />
          ))}
        </div>
      </Card>
      <Card label="Interface">
        <Row title="Font size" sub="Medium (14px)" right={
          <input type="range" min={12} max={18} step={1} defaultValue={14} style={{ width: 90 }} />
        } />
        <Row title="Compact mode" sub="Reduce spacing to fit more content" right={<Toggle />} />
      </Card>
      <Card label="Language & region">
        <Row title="Display language" right={
          <select style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12, fontFamily: 'inherit', background: '#f9fafb', color: '#111827' }}>
            <option>English (US)</option><option>English (UK)</option><option>Urdu</option><option>Arabic</option>
          </select>
        } />
        <Row title="Timezone" right={
          <select style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12, fontFamily: 'inherit', background: '#f9fafb', color: '#111827' }}>
            <option>UTC+5 Karachi</option><option>UTC+0 London</option><option>UTC-5 New York</option>
          </select>
        } />
      </Card>
    </div>
  );
};

const SectionPrivacy = () => (
  <div>
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Privacy & security</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>Control your data and who can see your profile</p>
    </div>
    <Card label="Profile visibility">
      <Row title="Public profile" sub="Allow others to view your profile and progress" right={<Toggle checked />} />
      <Row title="Show enrolled courses" sub="Visible on your public profile" right={<Toggle />} />
      <Row title="Show activity status" sub="Let others see when you were last active" right={<Toggle checked />} />
    </Card>
    <Card label="Security">
      <Row icon={<FaShieldAlt />} title="Two-factor authentication" sub="Extra protection on sign-in" right={<Badge label="On" color="green" />} />
      <Row icon={<FaBell />} title="Login alerts" sub="Email me when a new device signs in" right={<Toggle checked />} />
      <Row icon={<FaUser />} title="Active sessions" sub="3 devices currently signed in" right={<Btn>Manage</Btn>} />
    </Card>
    <Card label="Data & privacy">
      <Row title="Usage analytics" sub="Share anonymous data to improve Study Pulse" right={<Toggle checked />} />
      <Row title="Personalized recommendations" sub="Use learning history to suggest courses" right={<Toggle checked />} />
      <Row title="Download my data" sub="Export a copy of all your data" right={<Btn><FaDownload style={{ marginRight: 5 }} />Request</Btn>} />
    </Card>
  </div>
);

const SectionLearning = () => {
  const goals = ['10 min', '15 min', '30 min', '45 min', '60 min', '90 min'];
  const [goalIdx, setGoalIdx] = React.useState(2);
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Learning</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>Preferences that shape your experience</p>
      </div>
      <Card label="Goals">
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Daily learning goal</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                Target: <span style={{ color: '#16a34a', fontWeight: 700 }}>{goals[goalIdx]} / day</span>
              </div>
            </div>
            <input type="range" min={0} max={5} step={1} value={goalIdx} onChange={e => setGoalIdx(+e.target.value)} style={{ width: 100 }} />
          </div>
          <div style={{ height: 6, borderRadius: 3, background: '#e5e7eb', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, background: '#16a34a', width: `${((goalIdx + 1) / 6) * 100}%`, transition: 'width 0.3s' }} />
          </div>
        </div>
        <Row title="Weekly streak target" sub="Days per week to study" right={
          <select style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12, fontFamily: 'inherit', background: '#f9fafb', color: '#111827' }}>
            <option>3 days</option><option>4 days</option><option selected>5 days</option><option>7 days</option>
          </select>
        } />
      </Card>
      <Card label="Video player">
        <Row title="Autoplay next lesson" sub="Automatically start next when one ends" right={<Toggle checked />} />
        <Row title="Default playback speed" right={
          <select style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12, fontFamily: 'inherit', background: '#f9fafb', color: '#111827' }}>
            <option>0.75×</option><option selected>1.0×</option><option>1.25×</option><option>1.5×</option><option>2.0×</option>
          </select>
        } />
        <Row title="Subtitles / captions" sub="Show captions on videos by default" right={<Toggle />} />
      </Card>
      <Card label="Certificates">
        <Row title="Certificate name" sub="Printed on your completion certificates" right={<Inp value="Uzair Ansari" style={{ width: 160 }} />} />
        <Row title="Auto-share on LinkedIn" sub="Post certificate when you complete a course" right={<Toggle />} />
      </Card>
    </div>
  );
};

const SectionBilling = () => (
  <div>
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Billing</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>Manage your plan and payment methods</p>
    </div>
    <Card>
      <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0fdf4', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#15803d' }}>Study Pulse Pro</span>
            <Badge label="Active" color="green" />
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>Renews 15 Jun 2026 · $9.99 / month</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn>Change plan</Btn>
          <Btn variant="danger">Cancel</Btn>
        </div>
      </div>
    </Card>
    <Card label="Payment method">
      <Row icon={<FaCreditCard />} title="Visa ending in 4242" sub="Expires 08 / 27" right={<Btn>Update</Btn>} />
      <Row title="Billing address" sub="Karachi, Sindh, PK" right={<Btn>Edit</Btn>} />
    </Card>
    <Card label="Billing history">
      {['May 2026', 'Apr 2026', 'Mar 2026'].map(m => (
        <Row key={m} title={`${m} — Pro plan`} sub="$9.99" right={<Btn small>Receipt</Btn>} />
      ))}
    </Card>
  </div>
);

const SectionHelp = () => {
  const [open, setOpen] = React.useState(null);
  const faqs = [
    ['How do I get a certificate?', 'Complete all lessons and pass the final quiz with 70% or above. Your certificate is auto-generated and emailed within minutes.'],
    ['Can I download videos for offline viewing?', 'Offline downloads are available on the Pro plan via the mobile app. Desktop downloads are coming soon.'],
    ['How do I cancel my subscription?', 'Go to Billing in settings and click Cancel plan. Your access continues until the end of the billing period.'],
    ['Is my progress synced across devices?', 'Yes — all progress syncs in real time to your account across every device you sign into.'],
  ];
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Help & support</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>Find answers or reach out to our team</p>
      </div>
      <Card label="Quick actions">
        <Row icon={<FaExternalLinkAlt />} title="Browse documentation" sub="Guides, tutorials, and FAQs" right={<Btn>Open ↗</Btn>} />
        <Row icon={<FaBell />} title="Contact support" sub="Typically replies within 2 hours" right={<Btn variant="primary">Chat now</Btn>} />
        <Row icon={<FaTimes />} title="Report a bug" sub="Something broken? Let us know" right={<Btn>Report</Btn>} />
        <Row icon={<FaCheck />} title="Request a feature" sub="Share ideas for improvement" right={<Btn>Suggest</Btn>} />
      </Card>
      <Card label="FAQ">
        {faqs.map(([q, a], i) => (
          <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
            <div onClick={() => setOpen(open === i ? null : i)} style={{
              padding: '13px 20px', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{q}</span>
              <FaChevronDown style={{ fontSize: 12, color: '#9ca3af', flexShrink: 0, transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
            {open === i && (
              <div style={{ padding: '0 20px 14px', fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{a}</div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
};

const SectionAbout = () => (
  <div>
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>About</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>App info, stats, and legal</p>
    </div>
    <Card>
      <div style={{ padding: '20px 20px 14px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a' }}>Study Pulse</div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>Version 2.4.1 · Build 20260520 · Up to date</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: '0 20px 18px' }}>
        {[['12', 'Courses enrolled'], ['847', 'Minutes learned'], ['34', 'Day streak']].map(([v, l]) => (
          <div key={l} style={{ background: '#f0fdf4', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#15803d' }}>{v}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    </Card>
    <Card label="Legal">
      <Row title="Terms of service" right={<Btn>View ↗</Btn>} />
      <Row title="Privacy policy" right={<Btn>View ↗</Btn>} />
      <Row title="Open-source licenses" right={<Btn>View ↗</Btn>} />
    </Card>
  </div>
);

const SectionDanger = () => (
  <div>
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#dc2626' }}>Danger zone</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginTop: 3 }}>Irreversible actions — please proceed with caution</p>
    </div>
    <div style={{ background: '#fff', border: '1px solid #fca5a5', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '10px 20px', background: '#fee2e2', borderBottom: '1px solid #fca5a5' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>⚠ Permanent actions</div>
      </div>
      <Row icon={<FaExclamationTriangle />} title="Deactivate account" sub="Temporarily disable your account. Reactivate anytime." right={<Btn variant="warning">Deactivate</Btn>} danger />
      <Row icon={<FaTimes />} title="Clear learning history" sub="Remove all watch history and quiz attempts. Cannot be undone." right={<Btn variant="danger">Clear</Btn>} danger />
      <Row icon={<FaExclamationTriangle />} title="Delete account" sub="Permanently delete your account and all data. This is irreversible." right={<Btn variant="danger">Delete account</Btn>} danger />
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const navItems = [
  { id: 'account', label: 'Account', icon: <FaUser /> },
  { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
  { id: 'appearance', label: 'Appearance', icon: <FaPaintBrush /> },
  { id: 'privacy', label: 'Privacy & security', icon: <FaShieldAlt /> },
  { id: 'learning', label: 'Learning', icon: <FaBook /> },
  { id: 'billing', label: 'Billing', icon: <FaCreditCard /> },
  null,
  { id: 'help', label: 'Help & support', icon: <FaQuestionCircle /> },
  { id: 'about', label: 'About', icon: <FaInfoCircle /> },
  null,
  { id: 'danger', label: 'Danger zone', icon: <FaExclamationTriangle />, danger: true },
];

const sectionMap = {
  account: <SectionAccount />,
  notifications: <SectionNotifications />,
  appearance: <SectionAppearance />,
  privacy: <SectionPrivacy />,
  learning: <SectionLearning />,
  billing: <SectionBilling />,
  help: <SectionHelp />,
  about: <SectionAbout />,
  danger: <SectionDanger />,
};

const Settings = () => {
  const [active, setActive] = useState('account');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const activeLabel = navItems.find(i => i && i.id === active)?.label || 'Settings';

  const handleSelect = (id) => {
    setActive(id);
    setMenuOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Responsive styles — layout only, no color/design changes */}
      <style>{`
        .settings-shell { display: flex; min-height: 100vh; }
        .settings-sidebar {
          width: 240px; min-width: 240px;
          position: sticky; top: 0; height: 100vh; overflow-y: auto;
        }
        .settings-mobile-header { display: none; }
        .settings-overlay { display: none; }
        .settings-main { padding: 32px 36px; max-width: 800px; flex: 1; overflow-y: auto; box-sizing: border-box; }
        .profile-grid { grid-template-columns: 1fr 1fr; }
        .theme-grid { grid-template-columns: repeat(3,1fr); }

        @media (max-width: 860px) {
          .settings-main { max-width: 100%; }
        }

        @media (max-width: 768px) {
          .settings-shell { display: block; }
          .settings-mobile-header {
            display: flex; align-items: center; justify-content: space-between;
            top: 0; z-index: 900;
            padding: 14px 16px;
          }
          .settings-sidebar {
            position: fixed; top: 0; left: 0; z-index: 1000;
            width: 260px; min-width: 260px; height: 100vh;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            box-shadow: 2px 0 16px rgba(0,0,0,0.25);
          }
          .settings-sidebar.open { transform: translateX(0); }
          .settings-overlay {
            display: block; position: fixed; inset: 0;
            background: rgba(0,0,0,0.4); z-index: 999;
            opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
          }
          .settings-overlay.open { opacity: 1; pointer-events: auto; }
          .settings-main { padding: 20px 16px; max-width: 100%; }
          .profile-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 420px) {
          .theme-grid { gap: 6px; }
        }
      `}</style>

      <div className="settings-shell">
        {/* Mobile top bar */}
        {/* Mobile top bar */}
        <div className="settings-mobile-header">
          <div style={{ fontSize: 20, fontWeight: 800, color: '#000000', fontFamily: 'serif', display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={book} alt="" className='h-12 w-12'/>
            Study Pulse</div>
          <div
            onClick={() => setMenuOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              color: '#000000', cursor: 'pointer'
            }}
          >

            <FaBars style={{ fontSize: 19 }} />
          </div>
        </div>

        {/* Overlay backdrop for mobile drawer */}
        <div
          className={`settings-overlay${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Sidebar — matches your green/purple theme */}
        <div className={`settings-sidebar${menuOpen ? ' open' : ''}`} style={{
          background: 'linear-gradient(180deg, #24013d 0%, #4e0385 100%)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Logo */}
          <div style={{
            padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Study Pulse</div>
              <div style={{ fontSize: 11, color: '#86efac', marginTop: 2 }}>Settings</div>
            </div>
            <FaTimes
              className="settings-close-btn"
              onClick={() => setMenuOpen(false)}
              style={{ display: 'none', color: '#bbf7d0', fontSize: 16, cursor: 'pointer' }}
            />
          </div>

          {/* Back to dashboard */}
          <div
            onClick={() => navigate('/Dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', margin: '10px 10px 0',
              borderRadius: 8, cursor: 'pointer',
              background: 'rgba(255,255,255,0.08)', color: '#bbf7d0',
              fontSize: 13, fontWeight: 600, transition: 'background 0.15s'
            }}
          >
            <FaThLarge style={{ fontSize: 13 }} />
            Dashboard
          </div>

          <div style={{ padding: '10px 0', flex: 1 }}>
            {navItems.map((item, i) => {
              if (!item) return <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '6px 16px' }} />;
              const isActive = active === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 16px', margin: '1px 10px',
                    borderRadius: 8, cursor: 'pointer',
                    background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    borderLeft: isActive ? '3px solid #4ade80' : '3px solid transparent',
                    color: item.danger ? '#fca5a5' : isActive ? '#fff' : '#bbf7d0',
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                </div>
              );
            })}
          </div>

          {/* User chip at bottom */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#4ade80', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#14532d', flexShrink: 0
            }}>UA</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Uzair Ansari</div>
              <div style={{ fontSize: 11, color: '#86efac' }}>Pro member</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="settings-main">
          {sectionMap[active]}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .settings-close-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default Settings;
