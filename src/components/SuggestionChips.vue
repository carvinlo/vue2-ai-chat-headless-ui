<template>
  <div class="ai-suggestion-chips">
    <button
      v-for="(suggestion, index) in normalizedSuggestions"
      :key="index"
      class="ai-suggestion-chip"
      :class="{ 'ai-suggestion-chip-selected': suggestion.selected }"
      @click="selectSuggestion(suggestion)"
      :disabled="suggestion.disabled"
    >
      <slot
        name="chip"
        :suggestion="suggestion"
        :index="index"
      >
        {{ suggestion.text }}
      </slot>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SuggestionChips',
  
  props: {
    /**
     * Array of suggestion strings or objects
     */
    suggestions: {
      type: Array,
      required: true,
      validator(value) {
        return value.every(item => 
          typeof item === 'string' || 
          (typeof item === 'object' && item !== null)
        );
      }
    },
    
    /**
     * Property name to use for displaying text (if suggestions are objects)
     */
    textKey: {
      type: String,
      default: 'text'
    },
    
    /**
     * Property name to determine if a suggestion is disabled
     */
    disabledKey: {
      type: String,
      default: 'disabled'
    },
    
    /**
     * Whether to allow multiple selections
     */
    multiple: {
      type: Boolean,
      default: false
    },
    
    /**
     * Whether to auto-submit when a suggestion is selected
     */
    autoSubmit: {
      type: Boolean,
      default: false
    },
    
    /**
     * Maximum number of suggestions to display
     */
    maxSuggestions: {
      type: Number,
      default: Infinity
    }
  },
  
  computed: {
    /**
     * Normalize suggestions to a consistent object format
     */
    normalizedSuggestions() {
      return this.suggestions
        .slice(0, this.maxSuggestions)
        .map(suggestion => {
          if (typeof suggestion === 'string') {
            return {
              text: suggestion,
              selected: false,
              disabled: false,
              autoSubmit: this.autoSubmit
            };
          } else {
            return {
              text: suggestion[this.textKey] || suggestion.text || '',
              selected: suggestion.selected || false,
              disabled: suggestion[this.disabledKey] || suggestion.disabled || false,
              autoSubmit: suggestion.autoSubmit !== undefined ? suggestion.autoSubmit : this.autoSubmit,
              ...suggestion
            };
          }
        });
    }
  },
  
  methods: {
    /**
     * Handle suggestion selection
     */
    selectSuggestion(suggestion) {
      if (suggestion.disabled) return;
      
      // Handle selection state updates if needed
      if (this.multiple) {
        suggestion.selected = !suggestion.selected;
        
        // Emit selected suggestions
        const selectedSuggestions = this.normalizedSuggestions
          .filter(s => s.selected)
          .map(s => this.preserveOriginalFormat(s));
          
        this.$emit('selection-change', selectedSuggestions);
      }
      
      this.$emit('select', this.preserveOriginalFormat(suggestion));
    },
    
    /**
     * Preserve original suggestion format
     */
    preserveOriginalFormat(normalizedSuggestion) {
      const index = this.normalizedSuggestions.findIndex(s => s === normalizedSuggestion);
      const originalSuggestion = this.suggestions[index];
      
      if (typeof originalSuggestion === 'string') {
        return originalSuggestion;
      } else {
        return originalSuggestion;
      }
    }
  }
};
</script>

<style scoped>
.ai-suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ai-suggestion-chip {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #495057;
  font-family: inherit;
}

.ai-suggestion-chip:hover:not(:disabled) {
  background-color: #e9ecef;
  border-color: #ced4da;
}

.ai-suggestion-chip:active:not(:disabled) {
  background-color: #dee2e6;
}

.ai-suggestion-chip:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
}

.ai-suggestion-chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-suggestion-chip-selected {
  background-color: #e7f5ff;
  border-color: #74c0fc;
  color: #1864ab;
}
</style> 