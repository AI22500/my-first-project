import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Check, Trash2, Edit2, Calendar, Flag, Tag, Search, Moon, Sun,
  ChevronRight, ChevronDown, MoreVertical, Settings, X
} from 'lucide-react';

const defaultCategories = ['Work', 'Personal', 'Health', 'Learning'];

const translations = {
  en: {
    appName: 'Flow', total: 'Total', active: 'Active', done: 'Done', priority: 'Priority',
    searchPlaceholder: 'Search tasks...', all: 'All', completed: 'Completed', noTasksFound: 'No tasks found',
    tryDifferentSearch: 'Try a different search', addFirstTask: 'Add your first task below', newTask: 'New Task',
    whatToDo: 'What needs to be done?', lowPriority: 'Low Priority', mediumPriority: 'Medium Priority',
    highPriority: 'High Priority', addTask: 'Add Task', edit: 'Edit', delete: 'Delete', subtasks: 'subtasks',
    work: 'Work', personal: 'Personal', health: 'Health', learning: 'Learning', settings: 'Settings',
    language: 'Language', theme: 'Theme', darkMode: 'Dark Mode', lightMode: 'Light Mode', close: 'Close',
    activeOnly: 'Active', due: 'Due', overdue: 'Overdue', addSubtask: 'Add subtask'
  },
  ja: {
    appName: 'Flow', total: '合計', active: '進行中', done: '完了', priority: '優先',
    searchPlaceholder: 'タスクを検索...', all: 'すべて', completed: '完了済み', noTasksFound: 'タスクが見つかりません',
    tryDifferentSearch: '別の検索を試してください', addFirstTask: '最初のタスクを追加してください', newTask: '新しいタスク',
    whatToDo: '何をする必要がありますか？', lowPriority: '低優先度', mediumPriority: '中優先度',
    highPriority: '高優先度', addTask: 'タスクを追加', edit: '編集', delete: '削除', subtasks: 'サブタスク',
    work: '仕事', personal: '個人', health: '健康', learning: '学習', settings: '設定',
    language: '言語', theme: 'テーマ', darkMode: 'ダークモード', lightMode: 'ライトモード', close: '閉じる',
    activeOnly: '進行中', due: '期限', overdue: '期限切れ', addSubtask: 'サブタスクを追加'
  }
};

const themes = {
  light: {
    bg: '#fafafa', cardBg: '#ffffff', text: '#1a1a1a', textSecondary: '#666', border: '#e0e0e0', accent: '#6d28d9', accentLight: '#8b5cf6',
    priority: { high: '#e63946', medium: '#f4a261', low: '#2a9d8f' }
  },
  dark: {
    bg: '#0a0a0a', cardBg: '#1a1a1a', text: '#e0e0e0', textSecondary: '#999', border: '#2a2a2a', accent: '#7c3aed', accentLight: '#a78bfa',
    priority: { high: '#ff6b6b', medium: '#ffd93d', low: '#6bcf7f' }
  }
};

const categoryColors = { Work: '#5e60ce', Personal: '#48cae4', Health: '#06d6a0', Learning: '#ff006e' };

const storageApi = window.storage ?? {
  async get(key) { const value = localStorage.getItem(key); return value === null ? null : { value }; },
  async set(key, value) { localStorage.setItem(key, value); },
  async delete(key) { localStorage.removeItem(key); }
};

const getPriorityName = (priority, language) => ({ high: language === 'ja' ? '高' : 'High', medium: language === 'ja' ? '中' : 'Med', low: language === 'ja' ? '低' : 'Low' }[priority] ?? priority);
const isOverdue = (dueDate) => dueDate && new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  const t = translations[language];
  const theme = darkMode ? themes.dark : themes.light;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksResult, categoriesResult, darkModeResult, languageResult] = await Promise.all([
          storageApi.get('todo-tasks', false), storageApi.get('todo-categories', false), storageApi.get('todo-darkmode', false), storageApi.get('todo-language', false)
        ]);
        if (tasksResult?.value) setTasks(JSON.parse(tasksResult.value));
        if (categoriesResult?.value) setCategories(JSON.parse(categoriesResult.value));
        if (darkModeResult?.value) setDarkMode(JSON.parse(darkModeResult.value));
        if (languageResult?.value) setLanguage(JSON.parse(languageResult.value));
      } catch {
        console.log('No existing data, starting fresh');
      }
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      Promise.all([
        storageApi.set('todo-tasks', JSON.stringify(tasks), false),
        storageApi.set('todo-categories', JSON.stringify(categories), false),
        storageApi.set('todo-darkmode', JSON.stringify(darkMode), false),
        storageApi.set('todo-language', JSON.stringify(language), false)
      ]).catch((error) => console.error('Error saving data:', error));
    }
  }, [tasks, categories, darkMode, language, loading]);

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || (filterStatus === 'active' && !task.completed) || (filterStatus === 'completed' && task.completed);
    const categoryMatch = filterCategory === 'all' || task.category === filterCategory;
    const searchMatch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && categoryMatch && searchMatch;
  }), [tasks, filterStatus, filterCategory, searchTerm]);

  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
    highPriority: tasks.filter((task) => task.priority === 'high' && !task.completed).length
  }), [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = {
      id: Date.now(), text: newTask.trim(), completed: false,
      category: selectedCategory || categories[0], priority: selectedPriority, dueDate: selectedDate,
      createdAt: new Date().toISOString(), subtasks: [], recurring: null
    };
    setTasks((prev) => [task, ...prev]);
    setNewTask(''); setSelectedCategory(''); setSelectedPriority('medium'); setSelectedDate(''); setShowAddTask(false);
  };

  const updateTask = (id, patch) => setTasks((prev) => prev.map((task) => task.id === id ? { ...task, ...patch } : task));
  const deleteTask = (id) => setTasks((prev) => prev.filter((task) => task.id !== id));
  const addSubtask = (id) => {
    const text = prompt(t.addSubtask);
    if (!text?.trim()) return;
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, subtasks: [...task.subtasks, { id: Date.now(), text: text.trim(), completed: false }] } : task));
  };
  const toggleSubtask = (taskId, subtaskId) => setTasks((prev) => prev.map((task) => task.id === taskId ? { ...task, subtasks: task.subtasks.map((subtask) => subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask) } : task));

  return (
    <main className="app" style={{ '--bg': theme.bg, '--cardBg': theme.cardBg, '--text': theme.text, '--textSecondary': theme.textSecondary, '--border': theme.border, '--accent': theme.accent, '--accentLight': theme.accentLight }}>
      <header className="header">
        <div className="header-top">
          <h1>{t.appName}</h1>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setShowSettings(true)} aria-label={t.settings}><Settings size={18} /></button>
            <button className="icon-btn" onClick={() => setDarkMode((prev) => !prev)} aria-label="theme switch">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>
        </div>
        <div className="stats-grid">
          {[{ label: t.total, value: stats.total }, { label: t.active, value: stats.active }, { label: t.done, value: stats.completed }, { label: t.priority, value: stats.highPriority }].map((stat, i) => (
            <article key={stat.label} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}><p>{stat.label}</p><strong>{stat.value}</strong></article>
          ))}
        </div>
      </header>

      <section className="search-filter">
        <div className="search-box"><Search size={16} /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t.searchPlaceholder} /></div>
        <div className="filter-row">
          {['all', 'active', 'completed'].map((status) => <button key={status} className={filterStatus === status ? 'chip active' : 'chip'} onClick={() => setFilterStatus(status)}>{status === 'all' ? t.all : status === 'active' ? t.activeOnly : t.completed}</button>)}
        </div>
        <div className="filter-row horizontal">
          {['all', ...categories].map((category) => <button key={category} className={filterCategory === category ? 'chip active' : 'chip'} onClick={() => setFilterCategory(category)}>{category === 'all' ? t.all : t[category.toLowerCase()]}</button>)}
        </div>
      </section>

      <section className="task-list">
        {!filteredTasks.length && <div className="empty"><h3>{t.noTasksFound}</h3><p>{searchTerm ? t.tryDifferentSearch : t.addFirstTask}</p></div>}
        {filteredTasks.map((task, i) => {
          const doneSubtasks = task.subtasks.filter((subtask) => subtask.completed).length;
          const overdue = isOverdue(task.dueDate);
          return (
            <article key={task.id} className="task-card" style={{ borderColor: theme.priority[task.priority], animationDelay: `${i * 0.05}s` }}>
              <button className="check" style={{ borderColor: theme.priority[task.priority], background: task.completed ? theme.priority[task.priority] : 'transparent' }} onClick={() => updateTask(task.id, { completed: !task.completed })}>{task.completed && <Check size={16} />}</button>
              <div className="content">
                {editingId === task.id ? <input value={editingText} onChange={(e) => setEditingText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (updateTask(task.id, { text: editingText.trim() || task.text }), setEditingId(null))} /> : <p className={task.completed ? 'done' : ''}>{task.text}</p>}
                <div className="badges">
                  <span className="badge" style={{ color: categoryColors[task.category] }}><Tag size={13} /> {t[task.category.toLowerCase()]}</span>
                  {task.dueDate && <span className="badge" style={{ color: overdue ? theme.priority.high : theme.textSecondary }}><Calendar size={13} /> {overdue ? t.overdue : t.due} {new Date(task.dueDate).toLocaleDateString(language)}</span>}
                  <span className="badge"><Flag size={13} /> {getPriorityName(task.priority, language)}</span>
                </div>
                <button className="subtask-toggle" onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}>
                  {expandedTask === task.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />} {doneSubtasks}/{task.subtasks.length} {t.subtasks}
                </button>
                {expandedTask === task.id && (
                  <div className="subtasks">
                    {task.subtasks.map((subtask) => <label key={subtask.id}><input type="checkbox" checked={subtask.completed} onChange={() => toggleSubtask(task.id, subtask.id)} /> <span className={subtask.completed ? 'done' : ''}>{subtask.text}</span></label>)}
                    <button className="link-btn" onClick={() => addSubtask(task.id)}><Plus size={12} /> {t.addSubtask}</button>
                  </div>
                )}
              </div>
              <div className="menu-wrap">
                <button className="menu-btn" onClick={() => setShowMenu(showMenu === task.id ? null : task.id)}><MoreVertical size={16} /></button>
                {showMenu === task.id && <div className="menu"><button onClick={() => { setEditingId(task.id); setEditingText(task.text); setShowMenu(null); }}><Edit2 size={13} /> {t.edit}</button><button className="danger" onClick={() => deleteTask(task.id)}><Trash2 size={13} /> {t.delete}</button></div>}
              </div>
            </article>
          );
        })}
      </section>

      <button className="fab" onClick={() => setShowAddTask(true)} aria-label={t.addTask}><Plus size={28} /></button>

      {showAddTask && (
        <div className="sheet-overlay" onClick={() => setShowAddTask(false)}>
          <section className="sheet" onClick={(e) => e.stopPropagation()}>
            <h3>{t.newTask}</h3>
            <input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder={t.whatToDo} onKeyDown={(e) => e.key === 'Enter' && addTask()} />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">{t.work}</option>{categories.map((category) => <option key={category} value={category}>{t[category.toLowerCase()]}</option>)}
            </select>
            <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
              <option value="low">{t.lowPriority}</option><option value="medium">{t.mediumPriority}</option><option value="high">{t.highPriority}</option>
            </select>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <button className="add-btn" onClick={addTask} disabled={!newTask.trim()}>{t.addTask}</button>
          </section>
        </div>
      )}

      {showSettings && (
        <div className="sheet-overlay" onClick={() => setShowSettings(false)}>
          <section className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head"><h3>{t.settings}</h3><button className="icon-btn" onClick={() => setShowSettings(false)}><X size={16} /></button></div>
            <p>{t.language}</p>
            <div className="setting-grid"><button className={language === 'en' ? 'chip active' : 'chip'} onClick={() => setLanguage('en')}>🇺🇸 English</button><button className={language === 'ja' ? 'chip active' : 'chip'} onClick={() => setLanguage('ja')}>🇯🇵 日本語</button></div>
            <p>{t.theme}</p>
            <div className="setting-grid"><button className={!darkMode ? 'chip active' : 'chip'} onClick={() => setDarkMode(false)}><Sun size={14} /> {t.lightMode}</button><button className={darkMode ? 'chip active' : 'chip'} onClick={() => setDarkMode(true)}><Moon size={14} /> {t.darkMode}</button></div>
          </section>
        </div>
      )}
    </main>
  );
}
