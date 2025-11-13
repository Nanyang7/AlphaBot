// API 계약(가안)에 따른 모의 API 함수
// 500ms 지연과 10%의 에러 확률을 시뮬레이션합니다.

const apiDelay = 500;

// HTTP 에러 시뮬레이션을 위한 커스텀 에러
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const simulateRequest = (id: string, successStatus: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 10% 확률로 서버 에러 (5xx) 시뮬레이션
      if (Math.random() < 0.1) {
        reject(new ApiError('Internal Server Error', 500));
        return;
      }
      
      // 409 중복 생성 시뮬레이션 (id '409'로 테스트)
      if (id === '409') {
        reject(new ApiError('Conflict', 409));
        return;
      }
      
      // 404 대상 없음 시뮬레이션
      if (id === '404') {
         reject(new ApiError('Not Found', 404));
         return;
      }

      resolve({ status: successStatus, data: { bookmark_id: 123, target_id: id } });
    }, apiDelay);
  });
};

// 메시지 북마크
export const addMessageBookmark = (message_id: string) => 
  simulateRequest(message_id, 201);
export const removeMessageBookmark = (message_id: string) => 
  simulateRequest(message_id, 204);

// 채팅방 북마크
export const addChatBookmark = (chat_id: string) => 
  simulateRequest(chat_id, 201);
export const removeChatBookmark = (chat_id: string) => 
  simulateRequest(chat_id, 204);