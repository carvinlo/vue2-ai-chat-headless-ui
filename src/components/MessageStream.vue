<template>
  <div class="ai-message-stream">
    <span>{{ displayedContent }}</span>
    <span class="ai-message-stream-cursor" :class="{ 'ai-message-stream-cursor-blink': isComplete }"></span>
  </div>
</template>

<script>
export default {
  name: 'MessageStream',
  
  props: {
    /**
     * The full content to stream
     */
    content: {
      type: String,
      required: true
    },
    
    /**
     * Delay between characters (in milliseconds)
     */
    chunkDelay: {
      type: Number,
      default: 15
    },
    
    /**
     * Whether to start streaming automatically
     */
    autoStart: {
      type: Boolean,
      default: true
    },
    
    /**
     * Number of characters to add per chunk
     */
    chunkSize: {
      type: Number,
      default: 1
    },
    
    /**
     * Stream mode: 'character' or 'word'
     */
    streamMode: {
      type: String,
      default: 'character',
      validator: value => ['character', 'word'].includes(value)
    }
  },
  
  data() {
    return {
      displayedContent: '',
      streamInterval: null,
      contentIndex: 0,
      isComplete: false,
      isPaused: false
    };
  },
  
  watch: {
    content: {
      handler(newContent) {
        // Reset and restart streaming when content changes
        this.reset();
        
        if (this.autoStart && newContent) {
          this.startStreaming();
        }
      },
      immediate: true
    }
  },
  
  beforeDestroy() {
    this.stopStreaming();
  },
  
  methods: {
    /**
     * Start the streaming animation
     */
    startStreaming() {
      if (this.streamInterval) {
        this.stopStreaming();
      }
      
      this.isPaused = false;
      
      // Don't start if content is empty
      if (!this.content) {
        this.isComplete = true;
        return;
      }
      
      this.streamInterval = setInterval(() => {
        if (this.isPaused) return;
        
        // Handle different streaming modes
        if (this.streamMode === 'word') {
          this.streamNextWord();
        } else {
          this.streamNextChars();
        }
        
        // Check if streaming is complete
        if (this.contentIndex >= this.content.length) {
          this.completeStreaming();
        }
      }, this.chunkDelay);
    },
    
    /**
     * Stream next set of characters
     */
    streamNextChars() {
      const nextIndex = Math.min(this.contentIndex + this.chunkSize, this.content.length);
      const newChunk = this.content.substring(this.contentIndex, nextIndex);
      this.displayedContent += newChunk;
      this.contentIndex = nextIndex;
    },
    
    /**
     * Stream next word
     */
    streamNextWord() {
      if (this.contentIndex >= this.content.length) {
        this.completeStreaming();
        return;
      }
      
      // Find the next space or end of content
      let nextSpaceIndex = this.content.indexOf(' ', this.contentIndex);
      if (nextSpaceIndex === -1) {
        nextSpaceIndex = this.content.length;
      }
      
      // Add one to include the space in the output
      nextSpaceIndex = Math.min(nextSpaceIndex + 1, this.content.length);
      
      // Add the word to displayed content
      const nextWord = this.content.substring(this.contentIndex, nextSpaceIndex);
      this.displayedContent += nextWord;
      this.contentIndex = nextSpaceIndex;
    },
    
    /**
     * Stop the streaming animation
     */
    stopStreaming() {
      if (this.streamInterval) {
        clearInterval(this.streamInterval);
        this.streamInterval = null;
      }
    },
    
    /**
     * Pause the streaming animation
     */
    pauseStreaming() {
      this.isPaused = true;
    },
    
    /**
     * Resume the streaming animation
     */
    resumeStreaming() {
      this.isPaused = false;
    },
    
    /**
     * Complete the streaming immediately
     */
    completeStreaming() {
      this.stopStreaming();
      this.displayedContent = this.content;
      this.contentIndex = this.content.length;
      this.isComplete = true;
      this.$emit('streaming-complete');
    },
    
    /**
     * Reset the streaming animation
     */
    reset() {
      this.stopStreaming();
      this.displayedContent = '';
      this.contentIndex = 0;
      this.isComplete = false;
      this.isPaused = false;
    }
  }
};
</script>

<style scoped>
.ai-message-stream {
  white-space: pre-wrap;
  word-break: break-word;
}

.ai-message-stream-cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  background-color: currentColor;
  margin-left: 2px;
  vertical-align: text-bottom;
  opacity: 1;
}

.ai-message-stream-cursor-blink {
  animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style> 