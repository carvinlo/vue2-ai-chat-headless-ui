import Vue, { VueConstructor } from 'vue';

// Common interfaces
export interface Message {
  role: 'user' | 'assistant' | 'system' | string;
  content: string;
  id?: string | number;
  timestamp?: string | Date;
  [key: string]: any;
}

export interface Suggestion {
  text: string;
  selected?: boolean;
  disabled?: boolean;
  autoSubmit?: boolean;
  [key: string]: any;
}

export interface FeedbackData {
  messageId: string | number;
  type: 'positive' | 'negative' | null;
  comment: string;
  timestamp: string;
}

// Component interfaces
export interface ChatContainerProps {
  messages: Message[];
  loading?: boolean;
  autoScroll?: boolean;
}

export interface ChatMessageProps {
  message: Message;
  isUser?: boolean;
  isError?: boolean;
  errorMessage?: string;
  showTimestamp?: boolean;
  showRoleName?: boolean;
  roleNames?: Record<string, string>;
  formatContent?: boolean;
  isStreaming?: boolean;
  streamingChunkDelay?: number;
  showFeedback?: boolean;
}

export interface ChatBubbleProps {
  isUser?: boolean;
  isError?: boolean;
}

export interface ChatInputProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  submitOnEnter?: boolean;
  autoResize?: boolean;
  maxHeight?: number;
  suggestions?: Array<string | Suggestion>;
  showSuggestions?: boolean;
  minLength?: number;
}

export interface MessageStreamProps {
  content: string;
  chunkDelay?: number;
  autoStart?: boolean;
  chunkSize?: number;
  streamMode?: 'character' | 'word';
}

export interface ThinkingIndicatorProps {
  label?: string;
  dotCount?: number;
  showLabel?: boolean;
  animationType?: 'bounce' | 'pulse' | 'fade';
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  copyable?: boolean;
  copiedTimeout?: number;
}

export interface SuggestionChipsProps {
  suggestions: Array<string | Suggestion>;
  textKey?: string;
  disabledKey?: string;
  multiple?: boolean;
  autoSubmit?: boolean;
  maxSuggestions?: number;
}

export interface FeedbackButtonsProps {
  messageId: string | number;
  disabled?: boolean;
  showLabels?: boolean;
  positiveLabel?: string;
  negativeLabel?: string;
  showFeedbackForm?: boolean;
  commentPlaceholder?: string;
  commentRows?: number;
  maxCommentLength?: number;
  submitLabel?: string;
  cancelLabel?: string;
  disableSubmitWithoutComment?: boolean;
  showThankYou?: boolean;
  thankYouMessage?: string;
}

// Component declarations
export const ChatContainer: VueConstructor<Vue & {
  scrollToBottom: () => void;
}>;

export const ChatMessage: VueConstructor<Vue>;
export const ChatBubble: VueConstructor<Vue>;
export const ChatInput: VueConstructor<Vue>;
export const MessageStream: VueConstructor<Vue & {
  startStreaming: () => void;
  stopStreaming: () => void;
  pauseStreaming: () => void;
  resumeStreaming: () => void;
  completeStreaming: () => void;
  reset: () => void;
}>;

export const ThinkingIndicator: VueConstructor<Vue>;
export const CodeBlock: VueConstructor<Vue & {
  highlightCode: () => void;
  copyToClipboard: () => Promise<void>;
}>;

export const SuggestionChips: VueConstructor<Vue>;
export const FeedbackButtons: VueConstructor<Vue & {
  reset: () => void;
}>;

// Plugin installation
export interface InstallFunction {
  (Vue: typeof import('vue')['default'], options?: any): void;
}

export const install: InstallFunction;

// Default export
declare const _default: {
  install: InstallFunction;
};

export default _default; 