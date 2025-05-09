<template>
  <div class="ai-feedback-buttons">
    <button 
      class="ai-feedback-button ai-feedback-thumbs-up"
      :class="{ 'ai-feedback-selected': feedback === 'positive' }"
      @click="submitFeedback('positive')"
      :disabled="disabled || submitted"
    >
      <slot name="positive-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
      </slot>
      <span v-if="showLabels" class="ai-feedback-label">{{ positiveLabel }}</span>
    </button>
    
    <button 
      class="ai-feedback-button ai-feedback-thumbs-down"
      :class="{ 'ai-feedback-selected': feedback === 'negative' }"
      @click="submitFeedback('negative')"
      :disabled="disabled || submitted"
    >
      <slot name="negative-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm10-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
        </svg>
      </slot>
      <span v-if="showLabels" class="ai-feedback-label">{{ negativeLabel }}</span>
    </button>
    
    <!-- Feedback form that appears when negative feedback is given -->
    <div v-if="showFeedbackForm && feedback === 'negative' && !submitted" class="ai-feedback-form">
      <slot name="feedback-form" :submit-comment="submitComment">
        <div class="ai-feedback-textarea-wrapper">
          <textarea
            v-model="comment"
            class="ai-feedback-textarea"
            :placeholder="commentPlaceholder"
            :rows="commentRows"
            :maxlength="maxCommentLength"
          ></textarea>
          <div class="ai-feedback-actions">
            <button 
              class="ai-feedback-submit"
              @click="submitComment"
              :disabled="disableSubmitWithoutComment && !comment.trim()"
            >
              {{ submitLabel }}
            </button>
            <button 
              class="ai-feedback-cancel"
              @click="cancelFeedback"
            >
              {{ cancelLabel }}
            </button>
          </div>
        </div>
      </slot>
    </div>
    
    <!-- Thank you message after submission -->
    <div v-if="submitted && showThankYou" class="ai-feedback-thank-you">
      <slot name="thank-you">
        {{ thankYouMessage }}
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeedbackButtons',
  
  props: {
    /**
     * Message ID to associate feedback with
     */
    messageId: {
      type: [String, Number],
      required: true
    },
    
    /**
     * Whether the feedback buttons are disabled
     */
    disabled: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether to show text labels on the buttons
     */
    showLabels: {
      type: Boolean,
      default: false
    },
    
    /**
     * Label for positive feedback button
     */
    positiveLabel: {
      type: String,
      default: 'Helpful'
    },
    
    /**
     * Label for negative feedback button
     */
    negativeLabel: {
      type: String,
      default: 'Not helpful'
    },
    
    /**
     * Whether to show the feedback form when negative feedback is given
     */
    showFeedbackForm: {
      type: Boolean,
      default: true
    },
    
    /**
     * Placeholder text for feedback comment textarea
     */
    commentPlaceholder: {
      type: String,
      default: 'Please tell us what was wrong or unhelpful...'
    },
    
    /**
     * Number of rows for the feedback textarea
     */
    commentRows: {
      type: Number,
      default: 3
    },
    
    /**
     * Maximum length for feedback comments
     */
    maxCommentLength: {
      type: Number,
      default: 500
    },
    
    /**
     * Label for feedback submit button
     */
    submitLabel: {
      type: String,
      default: 'Submit'
    },
    
    /**
     * Label for feedback cancel button
     */
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    
    /**
     * Whether to disable submit button when no comment is provided
     */
    disableSubmitWithoutComment: {
      type: Boolean,
      default: true
    },
    
    /**
     * Whether to show thank you message after submission
     */
    showThankYou: {
      type: Boolean,
      default: true
    },
    
    /**
     * Thank you message shown after feedback submission
     */
    thankYouMessage: {
      type: String,
      default: 'Thank you for your feedback!'
    }
  },
  
  data() {
    return {
      feedback: null,
      comment: '',
      submitted: false
    };
  },
  
  methods: {
    /**
     * Submit feedback (positive or negative)
     */
    submitFeedback(type) {
      this.feedback = type;
      
      // If it's positive feedback or we're not showing the form for negative feedback,
      // submit immediately
      if (type === 'positive' || !this.showFeedbackForm) {
        this.emitFeedback();
        this.submitted = true;
      }
    },
    
    /**
     * Submit the feedback comment
     */
    submitComment() {
      if (this.disableSubmitWithoutComment && !this.comment.trim()) {
        return;
      }
      
      this.emitFeedback();
      this.submitted = true;
    },
    
    /**
     * Cancel feedback submission
     */
    cancelFeedback() {
      this.feedback = null;
      this.comment = '';
    },
    
    /**
     * Emit feedback event with all data
     */
    emitFeedback() {
      this.$emit('feedback', {
        messageId: this.messageId,
        type: this.feedback,
        comment: this.comment.trim(),
        timestamp: new Date().toISOString()
      });
    },
    
    /**
     * Reset feedback state
     */
    reset() {
      this.feedback = null;
      this.comment = '';
      this.submitted = false;
    }
  }
};
</script>

<style scoped>
.ai-feedback-buttons {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ai-feedback-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  background-color: transparent;
  border: 1px solid #dee2e6;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.75rem;
}

.ai-feedback-button:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #ced4da;
}

.ai-feedback-button:active:not(:disabled) {
  background-color: #e9ecef;
}

.ai-feedback-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-feedback-label {
  margin-left: 0.25rem;
}

.ai-feedback-selected {
  background-color: #e7f5ff;
  border-color: #74c0fc;
  color: #1864ab;
}

.ai-feedback-thumbs-up.ai-feedback-selected {
  background-color: #d3f9d8;
  border-color: #8ce99a;
  color: #2b8a3e;
}

.ai-feedback-thumbs-down.ai-feedback-selected {
  background-color: #ffe3e3;
  border-color: #ffa8a8;
  color: #c92a2a;
}

.ai-feedback-form {
  width: 100%;
  margin-top: 0.5rem;
}

.ai-feedback-textarea-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ai-feedback-textarea {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 0.875rem;
  resize: vertical;
  color: #212529;
  width: 100%;
}

.ai-feedback-textarea:focus {
  outline: none;
  border-color: #74c0fc;
  box-shadow: 0 0 0 2px rgba(116, 192, 252, 0.25);
}

.ai-feedback-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.ai-feedback-submit,
.ai-feedback-cancel {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  border: 1px solid;
}

.ai-feedback-submit {
  background-color: #339af0;
  border-color: #1c7ed6;
  color: white;
  transition: background-color 0.2s;
}

.ai-feedback-submit:hover:not(:disabled) {
  background-color: #1c7ed6;
}

.ai-feedback-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-feedback-cancel {
  background-color: transparent;
  border-color: #ced4da;
  color: #6c757d;
}

.ai-feedback-cancel:hover {
  background-color: #f8f9fa;
}

.ai-feedback-thank-you {
  width: 100%;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #2b8a3e;
}
</style> 