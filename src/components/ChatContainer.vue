<template>
  <div class="ai-chat-container">
    <!-- Header slot -->
    <div class="ai-chat-header">
      <slot name="header"></slot>
    </div>
    
    <!-- Messages section -->
    <div class="ai-chat-messages" ref="messagesContainer">
      <slot 
        name="messages" 
        :messages="messages"
      ></slot>
      
      <!-- Thinking/loading indicator -->
      <div v-if="loading" class="ai-chat-thinking">
        <slot name="thinking">
          <ThinkingIndicator />
        </slot>
      </div>
      
      <!-- Empty state when no messages -->
      <div v-if="messages.length === 0 && !loading" class="ai-chat-empty">
        <slot name="empty">
          <p>No messages yet</p>
        </slot>
      </div>
    </div>
    
    <!-- Input section -->
    <div class="ai-chat-input-container">
      <slot name="input"></slot>
    </div>
  </div>
</template>

<script>
import ThinkingIndicator from './ThinkingIndicator.vue';

export default {
  name: 'ChatContainer',
  
  components: {
    ThinkingIndicator
  },
  
  props: {
    /**
     * Array of message objects
     */
    messages: {
      type: Array,
      default: () => []
    },
    
    /**
     * Whether the AI is currently thinking/generating a response
     */
    loading: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether to automatically scroll to the bottom when new messages arrive
     */
    autoScroll: {
      type: Boolean,
      default: true
    }
  },
  
  watch: {
    messages: {
      handler() {
        if (this.autoScroll) {
          this.$nextTick(this.scrollToBottom);
        }
      },
      deep: true
    },
    
    loading(newVal) {
      if (newVal && this.autoScroll) {
        this.$nextTick(this.scrollToBottom);
      }
    }
  },
  
  mounted() {
    if (this.autoScroll) {
      this.scrollToBottom();
    }
  },
  
  methods: {
    /**
     * Scroll the message container to the bottom
     */
    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        const container = this.$refs.messagesContainer;
        container.scrollTop = container.scrollHeight;
      }
    }
  }
};
</script>

<style scoped>
.ai-chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
}

.ai-chat-header {
  flex: 0 0 auto;
}

.ai-chat-messages {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1rem;
  scroll-behavior: smooth;
}

.ai-chat-input-container {
  flex: 0 0 auto;
}

.ai-chat-thinking {
  padding: 0.5rem 0;
}

.ai-chat-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}
</style> 