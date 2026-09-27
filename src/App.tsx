import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';

type View = 'dashboard' | 'profile' | 'settings' | 'feed';
type Project = { id: string; title: string; description: string; tags: string[]; link: string; accent: string; featured: boolean };
type Profile = { name: string; role: string; bio: string; location: string; email: string; availability: string; username: string; skills: string[] };

const defaultProfile: Profile = {
  name: 'Maya Chen', role: 'Product designer & developer',
  bio: 'I turn complex ideas into clear, useful digital experiences. Currently building thoughtful tools for people who care about how work gets done.',
  location: 'Toronto, Canada', email: 'maya@studiochen.co', availability: 'Available for select projects', username: 'mayachen',
  skills: ['Product design', 'React', 'Prototyping', 'Design systems']
};
const defaultProjects: Project[] = [
  { id: '1', title: 'Northstar', description: 'A calm, focused workspace for teams that want to do their best work.', tags: ['Product design', 'Web app'], link: 'https://example.com', accent: 'sunrise', featured: true },
  { id: '2', title: 'Commonplace', description: 'A better way to collect, connect, and revisit the things that inspire you.', tags: ['Brand identity', 'Mobile'], link: 'https://example.com', accent: 'ocean', featured: true },
  { id: '3', title: 'Field Notes', description: 'An editorial identity for a new kind of independent travel journal.', tags: ['Art direction', 'Editorial'], link: 'https://example.com', accent: 'forest', featured: false }
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-2v-.48A1.7 1.7 0 0 0 12.4 19a1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.44 16a1.7 1.7 0 0 0-1.56-1.03H7v-2h.48A1.7 1.7 0 0 0 9 11.94a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.42-1.42.06.06A1.7 1.7 0 0 0 11.96 9a1.7 1.7 0 0 0 1.03-1.56V7h2v.48A1.7 1.7 0 0 0 16 9a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19 11.96a1.7 1.7 0 0 0 1.56 1.03H21v2h-.48A1.7 1.7 0 0 0 19.4 15Z"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    external: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></>,
    edit: <><path d="m4 16-.8 4.8L8 20l11-11-3.8-3.8L4 16Z"/><path d="m13.8 6.2 3.8 3.8M4 20l3.9-.9"/></>,
    trash: <><path d="M4 7h16M10 11v5M14 11v5M6 7l1 13h10l1-13M9 7V4h6v3"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [profile, setProfile] = useState<Profile>(() => load('folio-profile', defaultProfile));
  const [projects, setProjects] = useState<Project[]>(() => load('folio-projects', defaultProjects));
  const [editing, setEditing] = useState<Project | null>(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => { localStorage.setItem('folio-profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('folio-projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(''), 2800); return () => window.clearTimeout(timer); }, [notice]);

  const featuredCount = projects.filter(project => project.featured).length;
  const saveProject = (project: Project) => { setProjects(current => current.some(item => item.id === project.id) ? current.map(item => item.id === project.id ? project : item) : [...current, project]); setEditing(null); setNotice('Project saved'); };
  const deleteProject = (id: string) => { setProjects(current => current.filter(project => project.id !== id)); setNotice('Project removed'); };
  const copyLink = async () => { await navigator.clipboard?.writeText(`${window.location.origin}/p/${profile.username}`); setNotice('Profile link copied'); };
  const nav = (next: View) => { setView(next); setShowProfileEdit(false); };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">f</span><span>folio</span></div>
      <div className="workspace"><div className="avatar small">MC</div><div><strong>{profile.name}</strong><span>Personal workspace</span></div><span className="chevron">⌄</span></div>
      <nav className="main-nav">
        <NavItem icon="grid" label="Overview" active={view === 'dashboard'} onClick={() => nav('dashboard')} />
        <NavItem icon="user" label="Public profile" active={view === 'profile'} onClick={() => nav('profile')} />
        <NavItem icon="grid" label="Feed" active={view === 'feed'} onClick={() => nav('feed')} />
        <NavItem icon="gear" label="Settings" active={view === 'settings'} onClick={() => nav('settings')} />
      </nav>
      <div className="sidebar-bottom"><div className="help-card"><span className="help-icon">?</span><div><strong>Need a hand?</strong><span>Read the quick guide</span></div><Icon name="arrow" size={16}/></div><div className="local-note"><span className="status-dot"/> Saved locally in this browser</div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="mobile-brand"><span className="brand-mark">f</span><span>folio</span></div><div className="breadcrumb">Workspace <span>/</span> {view === 'dashboard' ? 'Overview' : view === 'profile' ? 'Public profile' : view === 'feed' ? 'Feed' : 'Settings'}</div><div className="top-actions"><button className="icon-button" onClick={() => nav('profile')} aria-label="View public profile"><Icon name="external" size={18}/></button><div className="avatar">MC</div></div></header>
      {view === 'dashboard' && <Dashboard profile={profile} projects={projects} featuredCount={featuredCount} onAdd={() => setEditing(emptyProject())} onEdit={setEditing} onDelete={deleteProject} onProfile={() => setShowProfileEdit(true)} />}
      {view === 'profile' && <PublicProfile profile={profile} projects={projects} onCopy={copyLink} />}
      {view === 'settings' && <Settings profile={profile} onSave={setProfile} />}
    </main>
    {editing && <ProjectModal project={editing} onClose={() => setEditing(null)} onSave={saveProject} />}
    {showProfileEdit && <ProfileModal profile={profile} onClose={() => setShowProfileEdit(false)} onSave={(next) => { setProfile(next); setShowProfileEdit(false); setNotice('Profile updated'); }} />}
    {notice && <div className="toast"><span className="toast-check"><Icon name="check" size={14}/></span>{notice}</div>}
  </div>;
}

function NavItem({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}><Icon name={icon}/><span>{label}</span></button>; }
function Dashboard({ profile, projects, featuredCount, onAdd, onEdit, onDelete, onProfile }: { profile: Profile; projects: Project[]; featuredCount: number; onAdd: () => void; onEdit: (p: Project) => void; onDelete: (id: string) => void; onProfile: () => void }) {
  return <div className="page"><section className="page-heading"><div><p className="eyebrow">Tuesday, September 24, 2024</p><h1>Good morning, {profile.name.split(' ')[0]}.</h1><p className="subheading">Shape your corner of the internet.</p></div><button className="primary-button" onClick={onAdd}><Icon name="plus" size={18}/> Add project</button></section>
    <section className="stats-grid"><Stat label="Total projects" value={projects.length.toString().padStart(2, '0')} note="Keep building" tone="blue"/><Stat label="Featured work" value={featuredCount.toString().padStart(2, '0')} note="On your profile" tone="green"/><Stat label="Profile views" value="1,284" note="+18% this month" tone="orange"/></section>
    <section className="content-grid"><div className="panel projects-panel"><div className="panel-header"><div><h2>Your projects</h2><p>Manage the work shown on your public profile.</p></div><button className="text-button" onClick={onAdd}>Add new <Icon name="plus" size={15}/></button></div><div className="project-list">{projects.length === 0 ? <EmptyState onAdd={onAdd}/> : projects.map((project, index) => <ProjectRow key={project.id} project={project} index={index} onEdit={() => onEdit(project)} onDelete={() => onDelete(project.id)}/>)}</div></div><div className="side-column"><div className="panel profile-card"><div className="panel-header compact"><h2>Profile strength</h2><span className="more">•••</span></div><div className="strength-ring"><div><strong>{projects.length > 0 ? '82' : '34'}%</strong><span>complete</span></div></div><p className="center-note">You’re making a great first impression. Add a social link to reach 100%.</p><button className="outline-button full" onClick={onProfile}>Edit profile <Icon name="arrow" size={16}/></button></div><div className="panel link-card"><div className="link-card-top"><span className="link-icon"><Icon name="external" size={18}/></span><div><h3>Your public profile</h3><p>folio.site/p/{profile.username}</p></div></div><button className="copy-button" onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/p/${profile.username}`)}><Icon name="copy" size={15}/> Copy link</button></div></div></section>
  </div>;
}

function Feed({ projects }: { projects: Project[] }) {
  return (
    <div className="page">
      <section className="page-heading">
        <div><h2>Feed</h2><p>Browse all projects.</p></div>
      </section>
      <section className="content-grid">
        <div className="panel projects-panel">
          <div className="project-list">
            {projects.map((project, index) => (
              <article key={project.id} className="project-row">
                <div className={`project-thumb ${project.accent}`}><span>{project.title.slice(0,1)}</span></div>
                <div className="project-info">
                  <div className="project-title"><h3>{project.title}</h3></div>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><span/></div><div><p>{label}</p><strong>{value}</strong><small>{note}</small></div></div>; }
function ProjectRow({ project, index, onEdit, onDelete }: { project: Project; index: number; onEdit: () => void; onDelete: () => void }) { return <article className="project-row"><div className={`project-thumb ${project.accent}`}><span>{project.title.slice(0, 1)}</span><div className="thumb-lines"/></div><div className="project-info"><div className="project-title"><h3>{project.title}</h3>{project.featured && <span className="featured">Featured</span>}</div><p>{project.description}</p><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><div className="row-actions"><span className="order">0{index + 1}</span><button onClick={onEdit} aria-label={`Edit ${project.title}`}><Icon name="edit" size={17}/></button><button onClick={onDelete} aria-label={`Delete ${project.title}`}><Icon name="trash" size={17}/></button></div></article>; }
function EmptyState({ onAdd }: { onAdd: () => void }) { return <div className="empty-state"><div className="empty-art"><Icon name="plus" size={24}/></div><h3>Your project shelf is empty</h3><p>Start with one great piece of work and build from there.</p><button className="primary-button" onClick={onAdd}><Icon name="plus" size={16}/> Add first project</button></div>; }

function PublicProfile({ profile, projects, onCopy }: { profile: Profile; projects: Project[]; onCopy: () => void }) { return <div className="public-page"><div className="public-toolbar"><span className="public-label"><span className="live-dot"/> Live profile</span><div><button className="toolbar-button" onClick={onCopy}><Icon name="copy" size={15}/> Copy link</button><button className="toolbar-button dark" onClick={() => window.print()}><Icon name="external" size={15}/> Export</button></div></div><div className="profile-hero"><div className="hero-copy"><p className="eyebrow">{profile.role}</p><h1>{profile.name}<span className="green-dot">.</span></h1><p>{profile.bio}</p><div className="hero-meta"><span>{profile.location}</span><span className="meta-separator">·</span><span className="availability"><i/>{profile.availability}</span></div></div><div className="hero-avatar">MC<div className="avatar-spark">✦</div></div></div><div className="profile-divider"/><section className="work-section"><div className="section-intro"><p className="eyebrow">Selected work</p><h2>A few things I’ve made.</h2><div className="skills">{profile.skills.map(skill => <span key={skill}>{skill}</span>)}</div></div><div className="public-projects">{projects.filter(project => project.featured).map(project => <PublicProject key={project.id} project={project}/>)}</div></section><footer className="public-footer"><span>© {new Date().getFullYear()} {profile.name}</span><a href={`mailto:${profile.email}`}>{profile.email}</a><span>Made with <b>folio</b></span></footer></div>; }
function PublicProject({ project }: { project: Project }) { return <a className="public-project" href={project.link} target="_blank" rel="noreferrer"><div className={`public-project-art ${project.accent}`}><span className="project-art-label">{project.title}</span><div className="art-shape one"/><div className="art-shape two"/></div><div className="public-project-copy"><div><h3>{project.title}</h3><p>{project.description}</p></div><span className="round-arrow"><Icon name="arrow" size={17}/></span></div><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></a>; }

function Settings({ profile, onSave }: { profile: Profile; onSave: (profile: Profile) => void }) { const [draft, setDraft] = useState(profile); return <div className="page narrow"><section className="page-heading"><div><p className="eyebrow">Workspace preferences</p><h1>Settings</h1><p className="subheading">Keep your local portfolio feeling like yours.</p></div></section><div className="panel settings-panel"><div className="setting-row"><div><h2>Public profile address</h2><p>Your profile is available at folio.site/p/{draft.username}</p></div><label className="field inline-field"><span>Username</span><input value={draft.username} onChange={e => setDraft({...draft, username: e.target.value.replace(/[^a-z0-9]/gi, '').toLowerCase()})}/></label></div><div className="setting-row"><div><h2>Local data</h2><p>Your projects and profile are stored only in this browser.</p></div><button className="outline-button" onClick={() => { localStorage.removeItem('folio-profile'); localStorage.removeItem('folio-projects'); window.location.reload(); }}>Reset demo data</button></div><div className="setting-actions"><button className="primary-button" onClick={() => onSave(draft)}>Save settings</button></div></div></div>; }

function ProjectModal({ project, onClose, onSave }: { project: Project; onClose: () => void; onSave: (project: Project) => void }) { const [draft, setDraft] = useState(project); const update = (key: keyof Project, value: string | boolean | string[]) => setDraft({...draft, [key]: value}); const submit = (e: FormEvent) => { e.preventDefault(); onSave({...draft, tags: draft.tags.filter(Boolean)}); }; return <div className="modal-backdrop"><form className="modal" onSubmit={submit}><div className="modal-header"><div><p className="eyebrow">{project.title ? 'Edit project' : 'New project'}</p><h2>{project.title ? 'Refine your work' : 'Add a project'}</h2></div><button type="button" className="close-button" onClick={onClose}><Icon name="close"/></button></div><div className="form-grid"><label className="field full-field"><span>Project title</span><input required value={draft.title} placeholder="e.g. Northstar" onChange={e => update('title', e.target.value)}/></label><label className="field full-field"><span>Short description</span><textarea required value={draft.description} placeholder="What did you make, and why?" rows={3} onChange={e => update('description', e.target.value)}/></label><label className="field"><span>Tags</span><input value={draft.tags.join(', ')} placeholder="Design, Web" onChange={e => update('tags', e.target.value.split(',').map(tag => tag.trim()))}/></label><label className="field"><span>Project link</span><input type="url" value={draft.link} placeholder="https://" onChange={e => update('link', e.target.value)}/></label></div><div className="modal-footer"><label className="toggle-label"><input type="checkbox" checked={draft.featured} onChange={e => update('featured', e.target.checked)}/><span className="toggle"/> Show on public profile</label><div><button type="button" className="outline-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save project</button></div></div></form></div>; }
function ProfileModal({ profile, onClose, onSave }: { profile: Profile; onClose: () => void; onSave: (profile: Profile) => void }) { const [draft, setDraft] = useState(profile); return <div className="modal-backdrop"><form className="modal profile-modal" onSubmit={e => { e.preventDefault(); onSave(draft); }}><div className="modal-header"><div><p className="eyebrow">Public profile</p><h2>Tell your story</h2></div><button type="button" className="close-button" onClick={onClose}><Icon name="close"/></button></div><div className="form-grid"><label className="field"><span>Name</span><input required value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})}/></label><label className="field"><span>Role</span><input required value={draft.role} onChange={e => setDraft({...draft, role: e.target.value})}/></label><label className="field full-field"><span>Bio</span><textarea required rows={4} value={draft.bio} onChange={e => setDraft({...draft, bio: e.target.value})}/></label><label className="field"><span>Location</span><input value={draft.location} onChange={e => setDraft({...draft, location: e.target.value})}/></label><label className="field"><span>Email</span><input type="email" value={draft.email} onChange={e => setDraft({...draft, email: e.target.value})}/></label><label className="field full-field"><span>Skills</span><input value={draft.skills.join(', ')} onChange={e => setDraft({...draft, skills: e.target.value.split(',').map(item => item.trim()).filter(Boolean)})}/></label></div><div className="modal-footer"><span className="local-note"><span className="status-dot"/> Saved locally</span><div><button type="button" className="outline-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save profile</button></div></div></form></div>; }
function emptyProject(): Project { return { id: crypto.randomUUID(), title: '', description: '', tags: [], link: '', accent: ['sunrise', 'ocean', 'forest'][Math.floor(Math.random() * 3)], featured: true }; }
function load<T>(key: string, fallback: T): T { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
export default App;
