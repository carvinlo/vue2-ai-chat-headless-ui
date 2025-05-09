# Vue2 AI Chat UI

A headless UI component library for building AI chat interfaces in Vue2 applications.

## Installation

```bash
npm install vue2-ai-chat-ui
# or
yarn add vue2-ai-chat-ui
```

## Features

- 🔮 **Headless UI Components**: Full control over styling while handling all complex logic
- 🧠 **AI-specific Components**: Components tailored for AI chat interactions
- 🛠️ **Fully Customizable**: Extensive slot system and customization options
- 🔄 **Streaming Support**: Built-in handling for streaming AI responses
- 🎯 **Lightweight**: Minimal bundle size with zero dependencies

## Usage

### Basic Chat Interface

```vue
<template>
  <ChatContainer :messages="messages" :loading="loading">
    <template #header>
      <h2>AI Assistant</h2>
    </template>
    
    <template #messages="{ messages }">
      <ChatMessage 
        v-for="(message, index) in messages" 
        :key="index"
        :message="message"
        :is-user="message.role === 'user'"
      />
    </template>
    
    <template #input>
      <ChatInput 
        v-model="userInput" 
        @submit="sendMessage" 
        :disabled="loading"
      />
    </template>
  </ChatContainer>
</template>

<script>
import { ChatContainer, ChatMessage, ChatInput } from 'vue2-ai-chat-ui';

export default {
  components: {
    ChatContainer,
    ChatMessage,
    ChatInput
  },
  data() {
    return {
      userInput: '',
      messages: [],
      loading: false
    }
  },
  methods: {
    sendMessage() {
      if (!this.userInput.trim()) return;
      
      // Add user message
      this.messages.push({
        role: 'user',
        content: this.userInput
      });
      
      this.loading = true;
      
      // Simulate AI response
      setTimeout(() => {
        this.messages.push({
          role: 'assistant',
          content: 'This is a response from the AI assistant.'
        });
        this.loading = false;
      }, 1000);
      
      this.userInput = '';
    }
  }
}
</script>
```

## Components

- `ChatContainer`: Main layout container for chat interfaces
- `ChatMessage`: Displays individual messages with role-based styling
- `ChatInput`: Input field with submit functionality for user messages
- `ChatBubble`: Stylable message bubble component
- `MessageStream`: Handles streaming AI responses with typing animations
- `ThinkingIndicator`: Loading indicator for when AI is generating a response
- `CodeBlock`: Code syntax highlighting and copying functionality
- `SuggestionChips`: Quick response suggestions UI
- `FeedbackButtons`: Thumbs up/down feedback collection

## Documentation

For complete documentation and examples, please visit [https://vue2-ai-chat-ui.example.com](https://vue2-ai-chat-ui.example.com)

## License

MIT 