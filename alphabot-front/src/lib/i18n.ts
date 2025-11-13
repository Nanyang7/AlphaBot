// 간단한 i18n 't' 함수 모의
const translations = {
  'bookmark.message.add': '메시지 북마크하기',
  'bookmark.message.remove': '메시지 북마크 삭제',
  'bookmark.chat.add': '채팅방 북마크하기',
  'bookmark.chat.remove': '채팅방 북마크 삭제',
  'bookmark.error.generic': '북마크 처리에 실패했습니다.',
  'bookmark.error.404': '대상을 찾을 수 없습니다.',
  'bookmark.error.409': '이미 처리된 요청입니다.',
  'error.auth.401': '로그인이 필요합니다.',
};

export const useTranslation = () => {
  const t = (key: keyof typeof translations) => translations[key] || key;
  return { t };
};