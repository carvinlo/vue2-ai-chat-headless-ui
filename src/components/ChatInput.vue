<template>
  <div class="ai-chat-input-wrapper">
    <slot name="before-input"></slot>
    
    <form @submit.prevent="handleSubmit" class="ai-chat-input-form">
      <slot 
        name="input" 
        :value="localValue"
        :update:value="updateValue"
        :submit="handleSubmit"
        :disabled="disabled"
      >
        <textarea
          ref="textarea"
          class="ai-chat-input"
          :class="{ 'ai-chat-input-disabled': disabled }"
          :value="localValue"
          @input="updateValue($event.target.value)"
          @keydown="handleKeydown"
          :placeholder="placeholder"
          :disabled="disabled"
          :rows="rows"
          :maxlength="maxLength"
        ></textarea>
      </slot>
      
      <div class="ai-chat-input-actions">
        <slot 
          name="actions" 
          :submit="handleSubmit"
          :disabled="isSubmitDisabled"
        >
          <button
            type="submit"
            class="ai-chat-submit-button"
            :disabled="isSubmitDisabled"
            :class="{ 'ai-chat-submit-button-disabled': isSubmitDisabled }"
          >
            <slot name="submit-button-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </slot>
          </button>
        </slot>
      </div>
    </form>
    
    <div v-if="showSuggestions && suggestions.length > 0" class="ai-chat-suggestions">
      <slot name="suggestions" :suggestions="suggestions" :select-suggestion="selectSuggestion">
        <SuggestionChips 
          :suggestions="suggestions" 
          @select="selectSuggestion"
        />
      </slot>
    </div>
    
    <slot name="after-input"></slot>
  </div>
</template>

<script>
import SuggestionChips from './SuggestionChips.vue';

export default {
  name: 'ChatInput',
  
  components: {
    SuggestionChips
  },
  
  props: {
    /**
     * The input value (v-model)
     */
    value: {
      type: String,
      default: ''
    },
    
    /**
     * Placeholder text
     */
    placeholder: {
      type: String,
      default: 'Type a message...'
    },
    
    /**
     * Whether the input is disabled
     */
    disabled: {
      type: Boolean,
      default: false
    },
    
    /**
     * Number of rows for the textarea
     */
    rows: {
      type: Number,
      default: 1
    },
    
    /**
     * Maximum allowed characters
     */
    maxLength: {
      type: Number,
      default: 2000
    },
    
    /**
     * Whether to submit on Enter key (Shift+Enter will add new line)
     */
    submitOnEnter: {
      type: Boolean,
      default: true
    },
    
    /**
     * Whether to auto-resize the textarea based on content
     */
    autoResize: {
      type: Boolean,
      default: true
    },
    
    /**
     * Maximum height for auto-resize (in pixels)
     */
    maxHeight: {
      type: Number,
      default: 200
    },
    
    /**
     * Suggested queries/responses for quick selection
     */
    suggestions: {
      type: Array,
      default: () => []
    },
    
    /**
     * Whether to show suggestions
     */
    showSuggestions: {
      type: Boolean,
      default: false
    },
    
    /**
     * Minimum input value length required to enable submission
     */
    minLength: {
      type: Number,
      default: 1
    }
  },
  
  data() {
    return {
      localValue: this.value,
      isComposing: false
    };
  },
  
  computed: {
    /**
     * Determine if the submit button should be disabled
     */
    isSubmitDisabled() {
      return this.disabled || 
        !this.localValue.trim() || 
        this.localValue.trim().length < this.minLength;
    }
  },
  
  watch: {
    value(newValue) {
      this.localValue = newValue;
    },
    
    localValue() {
      if (this.autoResize) {
        this.$nextTick(this.resize);
      }
    }
  },
  
  mounted() {
    if (this.autoResize) {
      this.resize();
      window.addEventListener('resize', this.resize);
    }
  },
  
  beforeDestroy() {
    if (this.autoResize) {
      window.removeEventListener('resize', this.resize);
    }
  },
  
  methods: {
    /**
     * Update the input value
     */
    updateValue(value) {
      this.localValue = value;
      this.$emit('input', value);
    },
    
    /**
     * Handle keydown events
     */
    handleKeydown(event) {
      // Submit on Enter if enabled
      if (this.submitOnEnter && event.key === 'Enter' && !event.shiftKey && !this.isComposing) {
        if (!this.isSubmitDisabled) {
          event.preventDefault();
          this.handleSubmit();
        }
      }
      
      // Emit keydown event for external listeners
      this.$emit('keydown', event);
    },
    
    /**
     * Handle form submission
     */
    handleSubmit() {
      if (this.isSubmitDisabled) return;
      
      this.$emit('submit', this.localValue.trim());
      
      // Clear the input only if the parent doesn't control it via v-model
      if (this.value !== this.localValue) {
        this.localValue = '';
      }
      
      // Focus the input after submission
      this.$nextTick(() => {
        this.$refs.textarea.focus();
      });
    },
    
    /**
     * Select a suggestion
     */
    selectSuggestion(suggestion) {
      if (typeof suggestion === 'string') {
        this.updateValue(suggestion);
      } else if (suggestion && suggestion.text) {
        this.updateValue(suggestion.text);
      }
      
      // Auto-submit if configured
      if (suggestion && suggestion.autoSubmit) {
        this.$nextTick(this.handleSubmit);
      }
      
      this.$emit('suggestion-selected', suggestion);
    },
    
    /**
     * Auto-resize the textarea
     */
    resize() {
      const textarea = this.$refs.textarea;
      if (!textarea) return;
      
      // Reset height to empty to accurately measure scroll height
      textarea.style.height = 'auto';
      
      // Set the height based on scroll height, but limit to maxHeight
      const height = Math.min(textarea.scrollHeight, this.maxHeight);
      textarea.style.height = `${height}px`;
      
      // Show/hide scrollbars based on content exceeding maxHeight
      textarea.style.overflowY = textarea.scrollHeight > this.maxHeight ? 'auto' : 'hidden';
    }
  }
};
</script>

<style scoped>
.ai-chat-input-wrapper {
  position: relative;
  width: 100%;
}

.ai-chat-input-form {
  display: flex;
  align-items: flex-end;
  position: relative;
  border-radius: 1.5rem;
  background-color: #f1f3f5;
  transition: box-shadow 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.ai-chat-input-form:focus-within {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.ai-chat-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.75rem 1rem;
  resize: none;
  max-height: 200px;
  min-height: 24px;
  line-height: 1.5;
  font-size: 1rem;
  font-family: inherit;
  overflow-y: auto;
  outline: none;
}

.ai-chat-input-disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ai-chat-input-actions {
  display: flex;
  align-items: center;
  padding-right: 0.5rem;
}

.ai-chat-submit-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1e88e5;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s ease;
}

.ai-chat-submit-button:hover:not(:disabled) {
  background-color: #1976d2;
}

.ai-chat-submit-button-disabled {
  background-color: #b0bec5;
  cursor: not-allowed;
}

.ai-chat-submit-button svg {
  width: 18px;
  height: 18px;
}

.ai-chat-suggestions {
  margin-top: 0.5rem;
}
</style> 