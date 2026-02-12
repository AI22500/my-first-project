from supabase import create_client
import os

url = os.environ["SUPABASE_URL"]
key = os.environ["SUPABASE_KEY"]

supabase = create_client(url, key)
import streamlit as st

PAGE_TITLE = "Todoリスト"
PAGE_ICON = "📝"

st.set_page_config(page_title=PAGE_TITLE, page_icon=PAGE_ICON)

st.title(f"{PAGE_ICON} {PAGE_TITLE}")
st.write("やることを追加して、完了チェックで管理できます。")

def get_todos():
    res = supabase.table("todos").select("*").order("created_at").execute()
    return res.data

def add_todo(task):
    supabase.table("todos").insert({"task": task}).execute()

def toggle_done(todo_id, done):
    supabase.table("todos").update({"done": done}).eq("id", todo_id).execute()

def delete_done():
    supabase.table("todos").delete().eq("done", True).execute()


def init_state() -> None:
    if "todos" not in st.session_state:
        st.session_state.todos = []
    if "next_id" not in st.session_state:
        st.session_state.next_id = 1
    if "all_done_notified" not in st.session_state:
        st.session_state.all_done_notified = False


def add_todo(task_text: str) -> bool:
    normalized = task_text.strip()
    if not normalized:
        return False

    duplicated = any(todo["task"] == normalized for todo in st.session_state.todos)
    if duplicated:
        st.info("同じ名前のタスクがすでにあります。")
        return False

    st.session_state.todos.append(
        {"id": st.session_state.next_id, "task": normalized, "done": False}
    )
    st.session_state.next_id += 1
    return True


def remove_completed() -> None:
    st.session_state.todos = [todo for todo in st.session_state.todos if not todo["done"]]
    st.session_state.all_done_notified = False


def clear_all() -> None:
    st.session_state.todos = []
    st.session_state.all_done_notified = False


init_state()

with st.form("add_todo_form", clear_on_submit=True):
    new_todo = st.text_input("新しいタスク", placeholder="例: 牛乳を買う")
    submitted = st.form_submit_button("追加")

if submitted:
    if add_todo(new_todo):
        st.success(f"「{new_todo.strip()}」を追加しました")
    elif not new_todo.strip():
        st.warning("タスク名を入力してください")

if st.session_state.todos:
    st.subheader("タスク一覧")

    for i, todo in enumerate(st.session_state.todos):
        checked = st.checkbox(todo["task"], value=todo["done"], key=f"todo_{todo['id']}")
        st.session_state.todos[i]["done"] = checked

    completed = sum(todo["done"] for todo in st.session_state.todos)
    total = len(st.session_state.todos)
    progress = completed / total
    st.progress(progress, text=f"進捗: {completed}/{total} 完了")

    pending = total - completed
    st.caption(f"未完了タスク: {pending}件")

    col1, col2 = st.columns(2)
    with col1:
        remove_clicked = st.button("完了済みを削除", use_container_width=True)
    with col2:
        clear_clicked = st.button("すべて削除", use_container_width=True)

    if remove_clicked:
        remove_completed()
        st.rerun()
    if clear_clicked:
        clear_all()
        st.rerun()

    all_done = completed == total
    if all_done and not st.session_state.all_done_notified:
        st.balloons()
        st.session_state.all_done_notified = True
    elif not all_done:
        st.session_state.all_done_notified = False
else:
    st.info("まだタスクがありません。上のフォームから追加しましょう。")
