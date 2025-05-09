<template>
  <div 
    class="ai-chat-bubble" 
    :class="[
      isUser ? 'ai-chat-bubble-user' : 'ai-chat-bubble-assistant',
      { 'ai-chat-bubble-error': isError }
    ]"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ChatBubble',
  
  props: {
    /**
     * Whether this is a user message bubble
     */
    isUser: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether this bubble represents an error message
     */
    isError: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.ai-chat-bubble {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.ai-chat-bubble-user {
  background-color: #1e88e5;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.ai-chat-bubble-assistant {
  background-color: #f1f3f5;
  color: #212529;
  border-bottom-left-radius: 0.25rem;
}

.ai-chat-bubble-error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

/* Styling for code blocks within bubbles */
.ai-chat-bubble pre {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.ai-chat-bubble code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
}

.ai-chat-bubble-user pre {
  background-color: rgba(255, 255, 255, 0.2);
}

.ai-chat-bubble-user code {
  color: white;
}

.ai-chat-bubble p:first-child {
  margin-top: 0;
}

.ai-chat-bubble p:last-child {
  margin-bottom: 0;
}
</style> 