import { useState } from 'react';
import { 
  addMessageBookmark, removeMessageBookmark,
  addChatBookmark, removeChatBookmark, ApiError
} from '../lib/api';
import { useToast } from './useToast';
import { useTranslation } from '../lib/i18n';
import { logAnalyticsEvent, logError } from '../lib/analytics';

type BookmarkType = 'message' | 'chat';

type UseBookmarkProps = {
  type: BookmarkType;
  targetId: string;
  isInitiallyBookmarked: boolean;
  // 분석 이벤트에 필요한 추가 컨텍스트
  analyticsContext: {
    page: string;
    position: 'header' | 'message_item' | 'context_menu';
  }
};

export const useBookmark = ({ 
  type, 
  targetId, 
  isInitiallyBookmarked,
  analyticsContext 
}: UseBookmarkProps) => {
  
  const [isBookmarked, setIsBookmarked] = useState(isInitiallyBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const { t } = useTranslation();

  // 타입에 따라 API 함수와 분석 속성 분기
  const api = {
    add: type === 'message' ? addMessageBookmark : addChatBookmark,
    remove: type === 'message' ? removeMessageBookmark : removeChatBookmark,
  };
  const analyticsType = type;


  const handleApiError = (error: unknown) => {
    let toastMessage = t('bookmark.error.generic');
    
    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          toastMessage = t('error.auth.401');
          // TODO: 전역 핸들러를 호출하여 로그인 페이지로 리디렉션
          // globalAuthHandler.redirectToLogin();
          break;
        case 404:
          toastMessage = t('bookmark.error.404');
          break;
        case 409:
          // 409(중복/멱등) 에러는 롤백 대신 성공으로 간주하거나, 
          // 현재 상태로 UI를 강제 동기화 (재조회) 할 수 있습니다.
          // 여기서는 '이미 처리됨'으로 알립니다.
          toastMessage = t('bookmark.error.409');
          // 409는 롤백하지 않고 현재 UI 상태(newState)를 유지하는 것이 나을 수 있음
          // (이미 서버에 반영된 상태이므로)
          // 여기서는 명확한 롤백을 보여주기 위해 롤백을 수행합니다.
          break;
        case 500:
        default:
          // 5xx 서버 오류
          toastMessage = t('bookmark.error.generic');
          break;
      }
    }
    
    addToast({ title: toastMessage, status: 'error' });
    logError(error, { 
      component: 'useBookmark', 
      targetId, 
      type,
    });
  };

  const toggleBookmark = async () => {
    // 로딩 중 중복 클릭 방지 (AC)
    if (isLoading) return;

    setIsLoading(true);

    const previousState = isBookmarked;
    const newState = !isBookmarked;
    
    // 1. 낙관적 업데이트: UI 즉시 반영 (AC)
    setIsBookmarked(newState);

    try {
      // 2. API 호출
      const apiCall = newState ? api.add : api.remove;
      await apiCall(targetId);

      // 3. 성공: 분석 로그 전송 (AC)
      logAnalyticsEvent(
        newState ? 'bookmark_add' : 'bookmark_remove',
        {
          target_type: analyticsType,
          target_id: targetId,
          ...analyticsContext
        }
      );

    } catch (error) {
      // 4. 실패: 롤백 및 에러 처리 (AC)
      
      // 300ms 내 롤백 (AC) - API 지연(500ms) > 롤백(즉시)
      // 스펙의 300ms는 UX적 허용 시간을 의미하며, 롤백은 즉시(0ms) 수행
      setIsBookmarked(previousState); 
      
      handleApiError(error);

    } finally {
      setIsLoading(false);
    }
  };

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
  };
};