interface MessageProps {
  role: 'user' | 'assistant'
  content: string
}

export default function Message({ role, content }: MessageProps) {
  const isUser = role === 'user'
  
  return (
    <div className={`group w-full px-4 py-6 ${isUser ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">U</span>
            </div>
          ) : (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #495EE3 0%, #9749E3 100%)' }}
            >
              <span className="text-white text-xs font-bold">N</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}
