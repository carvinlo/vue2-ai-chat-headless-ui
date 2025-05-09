module.exports = {
  // 输出目录设置
  outputDir: 'dist',
  
  // 不需要源码映射
  productionSourceMap: false,
  
  // 开发服务器配置
  devServer: {
    port: 8080,
    open: true
  },
  
  // CSS 相关选项
  css: {
    // 不要在开发环境下提取CSS
    extract: process.env.NODE_ENV === 'production',
    sourceMap: false
  },
  
  // 设置公共路径为根目录
  publicPath: '/',
  
  // 关闭eslint错误显示在浏览器中
  lintOnSave: false,
  
  // 简化运行时编译
  runtimeCompiler: true
} 