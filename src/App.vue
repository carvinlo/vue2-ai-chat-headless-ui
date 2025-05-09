<template>
  <div id="app">
    <div class="demo-container">
      <h1 class="demo-title">Vue2 AI Chat UI 组件库</h1>
      <div class="demo-chat">
        <ChatContainer 
          :messages="messages" 
          :loading="loading"
        >
          <template #header>
            <header class="demo-chat-header">
              <h2>AI 智能助手</h2>
              <p>可以问我任何问题!</p>
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
                <div :class="['demo-avatar', isUser ? 'demo-avatar-user' : 'demo-avatar-assistant']">
                  {{ isUser ? '👤' : '🤖' }}
                </div>
              </template>
            </ChatMessage>
          </template>
          
          <template #thinking>
            <ThinkingIndicator 
              label="AI 正在思考..." 
              :dot-count="3"
            />
          </template>
          
          <template #input>
            <div class="demo-input-container">
              <ChatInput 
                v-model="userInput" 
                @submit="sendMessage" 
                :disabled="loading"
                :suggestions="suggestions"
                :show-suggestions="messages.length > 0 && !loading"
                placeholder="请输入你的问题..."
                :auto-resize="true"
              />
            </div>
          </template>
        </ChatContainer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  
  data() {
    return {
      userInput: '',
      loading: false,
      messages: [
        {
          role: 'assistant',
          content: '你好！我是AI助手。有什么可以帮到你的吗？',
          timestamp: new Date().toISOString(),
          id: 'welcome-msg'
        }
      ],
      suggestions: [
        '讲个笑话',
        '你能帮我做什么?',
        'AI是如何工作的?',
        {
          text: '今天天气怎么样?',
          autoSubmit: true
        }
      ]
    };
  },
  
  methods: {
    sendMessage(text) {
      // 添加用户消息
      this.messages.push({
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
        id: `user-${Date.now()}`
      });
      
      // 清空输入
      this.userInput = '';
      
      // 显示思考指示器
      this.loading = true;
      
      // 模拟AI响应延迟
      setTimeout(() => {
        this.receiveAIResponse(text);
      }, 1500);
    },
    
    receiveAIResponse(userMessage) {
      // 在真实应用中，这里会调用AI服务API
      let response;
      
      if (userMessage.toLowerCase().includes('笑话')) {
        response = "为什么科学家不相信原子？因为它们构成了一切！";
      } else if (userMessage.toLowerCase().includes('帮') || userMessage.toLowerCase().includes('做什么')) {
        response = "我可以回答问题、提供信息、讲笑话、协助完成任务等等。请告诉我你需要什么帮助！";
      } else if (userMessage.toLowerCase().includes('天气')) {
        response = "我没有实时天气数据访问权限，但我可以帮你找到天气服务或解释天气模式是如何工作的！";
      } else if (userMessage.toLowerCase().includes('ai') || userMessage.toLowerCase().includes('人工智能')) {
        response = "AI（人工智能）通过机器学习算法、神经网络和模式识别的组合工作。像我这样的现代AI系统接受了大量文本数据的训练，以识别模式并生成响应。你想要了解AI的更多细节吗？";
      } else {
        response = `感谢你的留言！这是Vue2 AI Chat UI组件库的演示。你的消息是："${userMessage}"。在实际应用中，这里会连接到真实的AI服务。`;
      }
      
      // 添加AI响应，带有轻微延迟
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
      console.log('收到反馈:', feedback);
      // 在真实应用中，你会将这个发送到后端
      alert(`收到反馈: ${feedback.type}${feedback.comment ? ` - ${feedback.comment}` : ''}`);
    }
  }
};
</script>

<style>
#app {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.demo-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #1867c0;
}

.demo-chat {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  height: 80vh;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.demo-chat-header {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  text-align: center;
}

.demo-chat-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #343a40;
}

.demo-chat-header p {
  margin: 0.5rem 0 0;
  color: #6c757d;
  font-size: 0.875rem;
}

.demo-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.demo-avatar-user {
  background-color: #e7f5ff;
}

.demo-avatar-assistant {
  background-color: #f8f9fa;
}

.demo-input-container {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  background-color: white;
}
</style> 