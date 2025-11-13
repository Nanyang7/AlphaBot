type AnalyticsEvent = 'bookmark_add' | 'bookmark_remove';
type AnalyticsProps = {
  target_type: 'message' | 'chat';
  target_id: string;
  page: string; // 'chat', 'chat_list' 등
  position: 'header' | 'message_item' | 'context_menu';
};

export const logAnalyticsEvent = (event: AnalyticsEvent, props: AnalyticsProps) => {
  console.log('[Analytics]', event, props);
  // Amplitude, GA, Mixpanel 등으로 실제 전송
};

export const logError = (error: unknown, context: object) => {
   console.error('[Error Log]', error, context);
   // Sentry, Datadog 등으로 실제 전송
};