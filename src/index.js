import ChatContainer from './components/ChatContainer.vue';
import ChatMessage from './components/ChatMessage.vue';
import ChatInput from './components/ChatInput.vue';
import ChatBubble from './components/ChatBubble.vue';
import MessageStream from './components/MessageStream.vue';
import ThinkingIndicator from './components/ThinkingIndicator.vue';
import CodeBlock from './components/CodeBlock.vue';
import SuggestionChips from './components/SuggestionChips.vue';
import FeedbackButtons from './components/FeedbackButtons.vue';

const components = {
  ChatContainer,
  ChatMessage,
  ChatInput,
  ChatBubble,
  MessageStream,
  ThinkingIndicator,
  CodeBlock,
  SuggestionChips,
  FeedbackButtons
};

// Install function executed by Vue.use()
const install = function(Vue) {
  if (install.installed) return;
  install.installed = true;
  
  Object.keys(components).forEach(componentName => {
    Vue.component(componentName, components[componentName]);
  });
};

// Auto-install when Vue is found
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
};

export {
  ChatContainer,
  ChatMessage,
  ChatInput,
  ChatBubble,
  MessageStream,
  ThinkingIndicator,
  CodeBlock,
  SuggestionChips,
  FeedbackButtons
}; 