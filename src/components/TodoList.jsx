export default function TodoList({tasks}) {
    return (
    <div className="listWrap">
      <h3>Tareas ({tasks.length})</h3>

      {tasks.length === 0 ? (
        <p className="empty">Aún no hay tareas.</p>
      ) : (
        <ul className="list">
          {tasks.map((t) => (
            <li key={t.id} className="item">
              <div className="itemTitle">{t.title}</div>
              {t.description && <div className="itemDesc">{t.description}</div>}
              <div className="itemMeta">Fecha: {t.date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}