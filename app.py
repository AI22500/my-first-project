import streamlit as st
from supabase import create_client
import os

# -------------------------
# Supabase接続
# -------------------------
url = os.environ["SUPABASE_URL"]
key = os.environ["SUPABASE_KEY"]
supabase = create_client(url, key)

# -------------------------
# ページ設定
# -------------------------
PAGE_TITLE = "Todoリスト"
PAGE_ICON = "📝"

st.set_page_config(page_title=PAGE_TITLE, page_icon=PAGE_ICON)

st.title(f"{PAGE_ICON} {PAGE_TITLE}")
st.write("やることを追加して、完了チェックで管理できます。")

# -------------------------
# DB操作関数
# -------------------------
def get_todos():
    res = supabase.table("todos").select("*").order("created_at").execute()
    return res.data

def add_todo(task):
    task = task.strip()
    if task:
        supabase.table("todos").insert({"task": task}).execute()

def toggle_done(todo_id, done):
    supabase.table("todos").update({"done": done}).eq("id", todo_id).execute()

def delete_done():
    supabase.table("todos").delete().eq("done", True).execute()

def clear_all():
    supabase.table("todos").delete().neq("task", "").execute()

# -------------------------
# UI：追加フォーム
# -------------------------
with st.form("add_form", clear_on_submit=True):
    new_task = st.text_input("新しいタスク", placeholder="例: 牛乳を買う")
    submitted = st.form_submit_button("追加")

if submitted:
    add_todo(new_task)
    st.success("追加しました！")
    st.rerun()

st.divider()

# -------------------------
# UI：タスク一覧表示
# -------------------------
todos = get_todos()

if todos:
    st.subheader("タスク一覧")

    completed = 0

    for todo in todos:
        checked = st.checkbox(
            todo["task"],
            value=todo["done"],
            key=todo["id"]
        )

        if checked != todo["done"]:
            toggle_done(todo["id"], checked)
            st.rerun()

        if checked:
            completed += 1

    total = len(todos)
    st.progress(completed / total, text=f"進捗: {completed}/{total} 完了")

    st.caption(f"未完了タスク: {total - completed}件")

    col1, col2 = st.columns(2)

    with col1:
        if st.button("完了済みを削除", use_container_width=True):
            delete_done()
            st.rerun()

    with col2:
        if st.button("すべて削除", use_container_width=True):
            clear_all()
            st.rerun()

else:
    st.info("まだタスクがありません。上のフォームから追加しましょう。")