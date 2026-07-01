import type { InputCategoryMeta } from "./types";

export const INPUT_CATEGORY_META: InputCategoryMeta[] = [
  {
    key: "past_experience",
    label: "過去の経験",
    description: "学業・部活・サークル・アルバイト・インターンなど、印象に残っている経験を書いてください。",
    placeholder: "例：大学2年から3年間、個別指導塾のアルバイトリーダーをしていた。新人講師の研修を任されていた。",
  },
  {
    key: "timeline",
    label: "時系列の人生ログ",
    description: "小中高〜大学まで、時期ごとにどんなことに力を入れていたかを時系列で書いてください。",
    placeholder: "例：高校時代は吹奏楽部でパートリーダー／大学1年は授業中心／大学2年からアルバイトに力を入れ始めた",
  },
  {
    key: "likes_dislikes",
    label: "好きなこと・嫌いなこと",
    description: "好きなこと・作業・状況と、逆に苦手・嫌いなことを書いてください。",
    placeholder: "例：人に説明して「わかった」と言われるのが好き。単調な繰り返し作業は苦手。",
  },
  {
    key: "hobby",
    label: "趣味",
    description: "普段の趣味や、時間を忘れて没頭できることを書いてください。",
    placeholder: "例：ボルダリング、カメラで風景を撮ること",
  },
  {
    key: "relationships",
    label: "交友関係",
    description: "友人関係やコミュニティの中での自分の立ち位置・関わり方を書いてください。",
    placeholder: "例：グループの中では聞き役になることが多く、意見がぶつかったときに間に入ることが多い。",
  },
  {
    key: "strengths_weaknesses",
    label: "得意なこと・苦手なこと",
    description: "自分で自覚している得意なこと・苦手なことを具体的に書いてください。",
    placeholder: "例：スケジュールを立てて計画的に進めるのは得意。人前で急に話を振られるのは苦手。",
  },
  {
    key: "want_to_do",
    label: "やりたいこと",
    description: "仕事や将来にかかわらず、今後やってみたいことを書いてください。",
    placeholder: "例：人の意思決定を助けるような仕事をしてみたい。海外で働く経験をしてみたい。",
  },
  {
    key: "dont_want_to_do",
    label: "やりたくないこと",
    description: "できれば避けたい仕事の進め方や環境を書いてください。",
    placeholder: "例：成果が見えないまま黙々と同じ作業を続けるのは避けたい。",
  },
  {
    key: "memorable_success_failure",
    label: "印象に残っている成功・失敗",
    description: "具体的なエピソードとして印象に残っている成功体験・失敗体験を書いてください。",
    placeholder: "例：文化祭の出し物で準備が遅れて揉めたが、役割分担を仕切り直して当日は無事開催できた。",
  },
  {
    key: "feedback_from_others",
    label: "周囲から言われること",
    description: "友人・家族・先輩・先生などからよく言われる、自分の印象や評価を書いてください。",
    placeholder: "例：「話をちゃんと聞いてくれる」「頼むと最後までやってくれる」とよく言われる。",
  },
  {
    key: "free_text",
    label: "自由記入欄",
    description: "上の項目に当てはまらないが、自己分析に使ってほしいことがあれば自由に書いてください。",
    placeholder: "例：その他、伝えておきたいエピソードや考えていること",
  },
];
