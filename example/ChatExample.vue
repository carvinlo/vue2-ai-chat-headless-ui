<template>
  <div class="chat-example">
    <ChatContainer 
      :messages="messages" 
      :loading="loading"
    >
      <template #header>
        <header class="chat-header">
          <h1>AI Chat Assistant</h1>
          <p>Ask me anything!</p>
        </header>
      </template>
      
      <template #messages="{ messages }">
        <ChatMessage 
          v-for="(message, index) in messages" 
          :key="index"
          :message="message"
          :is-user="message.role === 'user'"
          :show-timestamp="true"
          :format-content="true"
          :show-feedback="message.role === 'assistant'"
          @feedback="handleFeedback"
        >
          <template #avatar="{ isUser }">
            <div :class="['chat-avatar', isUser ? 'chat-avatar-user' : 'chat-avatar-assistant']">
              {{ isUser ? '👤' : '🤖' }}
            </div>
          </template>
        </ChatMessage>
      </template>
      
      <template #thinking>
        <ThinkingIndicator 
          label="AI is thinking..." 
          :dot-count="3"
        />
      </template>
      
      <template #input>
        <div class="chat-input-container">
          <ChatInput 
            v-model="userInput" 
            @submit="sendMessage" 
            :disabled="loading"
            :suggestions="suggestions"
            :show-suggestions="messages.length > 0 && !loading"
            placeholder="Type your message here..."
            :auto-resize="true"
          />
        </div>
      </template>
    </ChatContainer>
  </div>
</template>

<script>
import { 
  ChatContainer, 
  ChatMessage, 
  ChatInput, 
  ThinkingIndicator 
} from 'vue2-ai-chat-ui';

export default {
  components: {
    ChatContainer,
    ChatMessage,
    ChatInput,
    ThinkingIndicator
  },
  
  data() {
    return {
      userInput: '',
      loading: false,
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m an AI assistant. How can I help you today?',
          timestamp: new Date().toISOString(),
          id: 'welcome-msg'
        }
      ],
      suggestions: [
        'Tell me a joke',
        'What can you help me with?',
        'How does AI work?',
        {
          text: 'What\'s the weather like today?',
          autoSubmit: true
        }
      ]
    };
  },
  
  methods: {
    sendMessage(text) {
      // Add user message
      this.messages.push({
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
        id: `user-${Date.now()}`
      });
      
      // Clear input
      this.userInput = '';
      
      // Show thinking indicator
      this.loading = true;
      
      // Simulate AI response after delay
      setTimeout(() => {
        this.receiveAIResponse(text);
      }, 1500);
    },
    
    receiveAIResponse(userMessage) {
      // This would normally be an API call to your AI service
      let response;
      
      if (userMessage.toLowerCase().includes('joke')) {
        response = "Why don't scientists trust atoms? Because they make up everything!";
      } else if (userMessage.toLowerCase().includes('help')) {
        response = "I can answer questions, provide information, tell jokes, assist with tasks, and much more. Just let me know what you need!";
      } else if (userMessage.toLowerCase().includes('weather')) {
        response = "I don't have access to real-time weather data, but I can help you find a weather service or explain how weather patterns work!";
      } else if (userMessage.toLowerCase().includes('ai')) {
        response = "AI (Artificial Intelligence) works through a combination of machine learning algorithms, neural networks, and pattern recognition. Modern AI systems like me are trained on vast amounts of text data to recognize patterns and generate responses. Would you like me to go into more detail on a specific aspect of AI?";
      } else {
        response = `Thanks for your message! This is a demo of the Vue2 AI Chat UI component library. Your message was: "${userMessage}". In a real application, this would be connected to an actual AI service.`;
      }
      
      // Add AI response with slight delay
      setTimeout(() => {
        this.messages.push({
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
          id: `assistant-${Date.now()}`
        });
        
        this.loading = false;
      }, 500);
    },
    
    handleFeedback(feedback) {
      console.log('Received feedback:', feedback);
      // In a real app, you would send this to your backend
      alert(`Feedback received: ${feedback.type}${feedback.comment ? ` - ${feedback.comment}` : ''}`);
    }
  }
};
</script>

<style scoped>
.chat-example {
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}

.chat-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #343a40;
}

.chat-header p {
  margin: 0.5rem 0 0;
  color: #6c757d;
  font-size: 0.875rem;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.chat-avatar-user {
  background-color: #e7f5ff;
}

.chat-avatar-assistant {
  background-color: #f8f9fa;
}

.chat-input-container {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  background-color: white;
}
</style> 