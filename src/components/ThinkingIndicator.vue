<template>
  <div class="ai-thinking-indicator">
    <div class="ai-thinking-bubble">
      <div 
        v-for="n in dotCount" 
        :key="n" 
        class="ai-thinking-dot"
        :style="{
          'animation-delay': `${(n - 1) * 0.15}s`
        }"
      ></div>
    </div>
    <div v-if="showLabel" class="ai-thinking-label">
      <slot>{{ label }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThinkingIndicator',
  
  props: {
    /**
     * Label to display under the thinking dots
     */
    label: {
      type: String,
      default: 'Thinking...'
    },
    
    /**
     * Number of dots to display
     */
    dotCount: {
      type: Number,
      default: 3
    },
    
    /**
     * Whether to show the label text
     */
    showLabel: {
      type: Boolean,
      default: true
    },
    
    /**
     * Type of animation: 'bounce', 'pulse', 'fade'
     */
    animationType: {
      type: String,
      default: 'bounce',
      validator: value => ['bounce', 'pulse', 'fade'].includes(value)
    }
  }
};
</script>

<style scoped>
.ai-thinking-indicator {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
}

.ai-thinking-bubble {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f1f3f5;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
}

.ai-thinking-dot {
  width: 8px;
  height: 8px;
  margin: 0 4px;
  background-color: #adb5bd;
  border-radius: 50%;
  animation: thinking-bounce 1.4s infinite ease-in-out both;
}

.ai-thinking-label {
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 4px;
  margin-left: 4px;
}

@keyframes thinking-bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
}

@keyframes thinking-pulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes thinking-fade {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}
</style> 