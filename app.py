import streamlit as st
import pickle
import numpy as np

# 1. 保存した「秘伝のタレ（モデル）」を読み込む
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

# 2. 画面のタイトルを書く
st.title("AI住宅価格予測アプリ")
st.write("部屋の数を入力すると、カリフォルニアの住宅価格を予測します。")

# 3. 入力フォーム（スライダー）を作る
# 1部屋から10部屋まで選べるようにします
rooms = st.slider("部屋の数（AveRooms）を選んでください", 1.0, 10.0, 5.0)

# 4. ボタンを押したら予測を実行する
if st.button("価格を予測する"):
    # AIに渡す形（2次元配列）に整える
    input_data = np.array([[rooms]])
    prediction = model.predict(input_data)
    
    # 結果を表示
    st.success(f"予測価格は {prediction[0]:.2f} (10万ドル単位) です！")
