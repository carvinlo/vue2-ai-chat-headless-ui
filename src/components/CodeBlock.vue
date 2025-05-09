<template>
  <div class="ai-code-block">
    <div class="ai-code-header">
      <div v-if="language" class="ai-code-language">{{ language }}</div>
      <button 
        v-if="copyable" 
        class="ai-code-copy-button"
        @click="copyToClipboard"
        :disabled="copying"
      >
        <span v-if="!copied">
          <slot name="copy-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </slot>
        </span>
        <span v-else>
          <slot name="copied-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </slot>
        </span>
      </button>
    </div>
    
    <pre ref="codeBlock" class="ai-code-pre">{{ code }}</pre>
  </div>
</template>

<script>
export default {
  name: 'CodeBlock',
  
  props: {
    /**
     * Code to display
     */
    code: {
      type: String,
      required: true
    },
    
    /**
     * Programming language for syntax highlighting
     */
    language: {
      type: String,
      default: ''
    },
    
    /**
     * Whether to show copy button
     */
    copyable: {
      type: Boolean,
      default: true
    },
    
    /**
     * Time in ms for how long the "Copied" state is shown
     */
    copiedTimeout: {
      type: Number,
      default: 2000
    }
  },
  
  data() {
    return {
      copied: false,
      copying: false,
      copyTimeout: null
    };
  },
  
  watch: {
    code() {
      this.$nextTick(() => {
        this.highlightCode();
      });
    }
  },
  
  mounted() {
    this.highlightCode();
  },
  
  beforeDestroy() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
  },
  
  methods: {
    /**
     * Apply syntax highlighting to the code block
     * This is a placeholder where you would integrate a syntax highlighting library
     */
    highlightCode() {
      // In a real implementation, you would use a syntax highlighter library
      // such as Prism.js or highlight.js
      // 
      // Example with Prism.js:
      // if (this.$refs.codeBlock && window.Prism) {
      //   Prism.highlightElement(this.$refs.codeBlock);
      // }
      
      // This is a headless component, so we don't include actual highlighting libraries
      this.$emit('highlighted');
    },
    
    /**
     * Copy code to clipboard
     */
    async copyToClipboard() {
      if (this.copying || !this.code) return;
      
      this.copying = true;
      
      try {
        // Use modern clipboard API
        await navigator.clipboard.writeText(this.code);
        this.copied = true;
        
        // Reset the copied state after timeout
        if (this.copyTimeout) {
          clearTimeout(this.copyTimeout);
        }
        
        this.copyTimeout = setTimeout(() => {
          this.copied = false;
        }, this.copiedTimeout);
        
        this.$emit('copied', true);
      } catch (error) {
        console.error('Failed to copy code to clipboard', error);
        this.$emit('copied', false);
      } finally {
        this.copying = false;
      }
    }
  }
};
</script>

<style scoped>
.ai-code-block {
  position: relative;
  border-radius: 0.5rem;
  background-color: #2d2d2d;
  color: #f8f8f2;
  margin: 1rem 0;
  overflow: hidden;
}

.ai-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #202020;
  color: #ccc;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.75rem;
}

.ai-code-language {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ai-code-copy-button {
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.ai-code-copy-button:hover {
  color: #fff;
}

.ai-code-copy-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-code-pre {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}
</style> 