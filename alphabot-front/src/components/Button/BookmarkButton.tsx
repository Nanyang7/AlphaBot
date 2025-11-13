import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa'; // 아이콘 라이브러리 (예시)
import { useBookmark } from '../hooks/useBookmark';
import { useTranslation } from '../lib/i18n';

// CSS-in-JS (혹은 CSS Module) 사용을 권장합니다.
// 터치 영역(40px) 및 포커스 스타일을 위한 기본 스타일
const styles: { [key: string]: React.CSSProperties } = {
  button: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px', // 전체 영역 확보
    margin: 0,
    borderRadius: '50%',
    minWidth: '40px', // 최소 터치 영역 (DoD)
    minHeight: '40px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
  },
  loading: {
    opacity: 0.5,
    cursor: 'wait',
  },
  bookmarked: {
    color: '#FFD700', // 강조 색
  },
  // 키보드 접근성: 포커스 링 (A11y)
  focus: {
    outline: '2px solid #007BFF',
    outlineOffset: '2px',
  },
  icon: {
    width: '20px',
    height: '20px',
  }
};

// :focus-visible 의사 클래스를 사용하면 더 좋습니다.
// 여기서는 간단히 JS로 포커스 스타일을 관리합니다.
const useFocusStyles = () => {
  const [isFocused, setIsFocused] = React.useState(false);
  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);
  
  const style = isFocused ? styles.focus : {};
  return { style, onFocus, onBlur };
};


type BookmarkType = 'message' | 'chat';

type BookmarkButtonProps = {
  type: BookmarkType;
  targetId: string;
  isInitiallyBookmarked: boolean;
  // 분석 이벤트에 필요한 추가 컨텍스트
  analyticsContext: {
    page: string;
    position: 'header' | 'message_item' | 'context_menu';
  }
};

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ 
  type, 
  targetId, 
  isInitiallyBookmarked, 
  analyticsContext 
}) => {
  
  const { isBookmarked, isLoading, toggleBookmark } = useBookmark({
    type,
    targetId,
    isInitiallyBookmarked,
    analyticsContext,
  });

  const { t } = useTranslation();
  const { style: focusStyle, ...focusHandlers } = useFocusStyles();

  // A11y: 상태에 따른 동적 aria-label 생성
  const i18nKey = type === 'message'
    ? (isBookmarked ? 'bookmark.message.remove' : 'bookmark.message.add')
    : (isBookmarked ? 'bookmark.chat.remove' : 'bookmark.chat.add');
  const label = t(i18nKey);

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      disabled={isLoading} // 로딩 중 비활성화 (AC)
      aria-label={label} // A11y: 스크린리더가 읽을 레이블
      aria-pressed={isBookmarked} // A11y: 현재 상태 (눌림/안눌림) (AC)
      style={{
        ...styles.button,
        ...(isBookmarked && styles.bookmarked),
        ...(isLoading && styles.loading),
        ...focusStyle, // 키보드 포커스 스타일
      }}
      {...focusHandlers}
    >
      {isBookmarked ? (
        <FaStar style={styles.icon} /> // 활성 아이콘
      ) : (
        <FaRegStar style={styles.icon} /> // 비활성 아이콘
      )}
    </button>
  );
};