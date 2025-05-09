<template>
  <div 
    class="ai-chat-message" 
    :class="[
      isUser ? 'ai-chat-message-user' : 'ai-chat-message-assistant',
      { 'ai-chat-message-error': isError }
    ]"
  >
    <!-- Avatar slot -->
    <div class="ai-chat-message-avatar">
      <slot 
        name="avatar" 
        :role="message.role"
        :is-user="isUser"
      >
        <!-- Default avatar implementation can be added here -->
      </slot>
    </div>
    
    <!-- Message bubble -->
    <div class="ai-chat-message-bubble-container">
      <!-- Message role/name -->
      <div v-if="showRoleName" class="ai-chat-message-name">
        <slot name="role-name" :role="message.role" :is-user="isUser">
          {{ formattedRoleName }}
        </slot>
      </div>
      
      <!-- Content bubble -->
      <slot name="bubble" :message="message" :is-user="isUser">
        <ChatBubble :is-user="isUser" :is-error="isError">
          <slot 
            name="content" 
            :content="message.content"
            :is-user="isUser"
          >
            <div v-if="!isError && !customContentSlot">
              <template v-if="!isStreaming">
                <div v-if="hasFormattedContent" v-html="formattedContent"></div>
                <div v-else>{{ message.content }}</div>
              </template>
              <MessageStream 
                v-else 
                :content="message.content" 
                :chunk-delay="streamingChunkDelay"
                @streaming-complete="$emit('streaming-complete')"
              />
            </div>
            <div v-else-if="isError && !customContentSlot" class="ai-chat-message-error-content">
              {{ errorMessage || message.content || 'An error occurred' }}
            </div>
          </slot>
        </ChatBubble>
      </slot>
      
      <!-- Timestamp -->
      <div v-if="showTimestamp && message.timestamp" class="ai-chat-message-timestamp">
        <slot name="timestamp" :timestamp="message.timestamp">
          {{ formattedTimestamp }}
        </slot>
      </div>
      
      <!-- Feedback buttons for assistant messages -->
      <div v-if="showFeedback && !isUser" class="ai-chat-message-feedback">
        <slot name="feedback" :message-id="message.id">
          <FeedbackButtons 
            :message-id="message.id"
            @feedback="handleFeedback"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import ChatBubble from './ChatBubble.vue';
import MessageStream from './MessageStream.vue';
import FeedbackButtons from './FeedbackButtons.vue';

export default {
  name: 'ChatMessage',
  
  components: {
    ChatBubble,
    MessageStream,
    FeedbackButtons
  },
  
  props: {
    /**
     * The message object
     */
    message: {
      type: Object,
      required: true,
      validator(value) {
        return value.hasOwnProperty('content') && value.hasOwnProperty('role');
      }
    },
    
    /**
     * Whether this is a user message
     */
    isUser: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether this message represents an error
     */
    isError: {
      type: Boolean,
      default: false
    },
    
    /**
     * Error message to display
     */
    errorMessage: {
      type: String,
      default: ''
    },
    
    /**
     * Whether to show the timestamp
     */
    showTimestamp: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether to show the role name
     */
    showRoleName: {
      type: Boolean,
      default: false
    },
    
    /**
     * Map of role names to display
     */
    roleNames: {
      type: Object,
      default: () => ({
        user: 'You',
        assistant: 'Assistant',
        system: 'System'
      })
    },
    
    /**
     * Whether to format the content with markdown, code blocks, etc.
     */
    formatContent: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether this message is currently streaming
     */
    isStreaming: {
      type: Boolean,
      default: false
    },
    
    /**
     * Chunk delay for streaming animation (ms)
     */
    streamingChunkDelay: {
      type: Number,
      default: 15
    },
    
    /**
     * Whether to show feedback buttons for assistant messages
     */
    showFeedback: {
      type: Boolean,
      default: false
    }
  },
  
  computed: {
    /**
     * Format the timestamp
     */
    formattedTimestamp() {
      if (!this.message.timestamp) return '';
      
      const timestamp = new Date(this.message.timestamp);
      return timestamp.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    },
    
    /**
     * Get the formatted role name
     */
    formattedRoleName() {
      const role = this.message.role;
      return this.roleNames[role] || role;
    },
    
    /**
     * Decide if we need to perform content formatting
     */
    hasFormattedContent() {
      return this.formatContent && !this.isStreaming;
    },
    
    /**
     * Format the content with markdown, code blocks, etc.
     * In a real implementation, this would use a markdown parser
     */
    formattedContent() {
      // Basic formatting that would normally use a markdown parser
      if (!this.formatContent || !this.message.content) return this.message.content;
      
      // Simple example just to illustrate - in real implementation you'd use a markdown library
      let content = this.message.content;
      
      // Simple code block handling (very naive implementation for example purposes)
      content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
      
      // Inline code
      content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
      
      return content;
    },
    
    /**
     * Check if a custom content slot was provided
     */
    customContentSlot() {
      return !!this.$scopedSlots.content;
    }
  },
  
  methods: {
    /**
     * Handle feedback from feedback buttons
     */
    handleFeedback(data) {
      this.$emit('feedback', {
        messageId: this.message.id,
        ...data
      });
    }
  }
};
</script>

<style scoped>
.ai-chat-message {
  display: flex;
  margin-bottom: 1rem;
  position: relative;
}

.ai-chat-message-user {
  flex-direction: row-reverse;
}

.ai-chat-message-avatar {
  flex: 0 0 40px;
  height: 40px;
  margin: 0 0.5rem;
}

.ai-chat-message-bubble-container {
  max-width: 80%;
}

.ai-chat-message-name {
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  color: #666;
}

.ai-chat-message-timestamp {
  font-size: 0.7rem;
  color: #999;
  margin-top: 0.25rem;
  text-align: right;
}

.ai-chat-message-user .ai-chat-message-timestamp {
  text-align: right;
}

.ai-chat-message-assistant .ai-chat-message-timestamp {
  text-align: left;
}

.ai-chat-message-feedback {
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
}

.ai-chat-message-error-content {
  color: #e74c3c;
}
</style> 