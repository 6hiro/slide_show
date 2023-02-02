export const handleFocus = (id: string) => {
    // 編集画面とプレビュー画面が横並びの場合、
    // 編集中のブロックに対応するプレビュー画面のブロックに移動
    // drafts page で id を設定するか判断している
    document.getElementById(id+"-preview")?.scrollIntoView({ 
        behavior: 'smooth',
    });
};