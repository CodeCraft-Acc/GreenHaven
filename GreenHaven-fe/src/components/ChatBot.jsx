import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa';
import { BiSend } from 'react-icons/bi';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import PropTypes from 'prop-types';

// Komponen TypeWriter dengan PropTypes
const TypeWriter = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);

  useEffect(() => {
    if (index.current < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((current) => current + text[index.current]);
        index.current += 1;
      }, 20);

      return () => clearTimeout(timeoutId);
    } else if (onComplete) {
      onComplete();
    }
  }, [displayedText, text, onComplete]);

  return <span>{displayedText}</span>;
};

// PropTypes untuk TypeWriter
TypeWriter.propTypes = {
  text: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
};

TypeWriter.defaultProps = {
  onComplete: undefined,
};

function ChatBot({ isMenuOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const chatRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const requestBody = sessionId
        ? {
            message: inputMessage,
            session_id: sessionId,
          }
        : {
            message: inputMessage,
          };

      const response = await fetch('https://greenhaven.aisma.co.id/api/chatbot/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        if (!sessionId && data.session_id) {
          setSessionId(data.session_id);
        }

        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: data.text,
            timestamp: new Date(),
            messageId: prev.length,
            intent: data.intent,
            references: data.content_references,
            isTyping: true,
          },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendFeedback = async (messageIndex, rating, comment = '') => {
    if (!sessionId) return;

    try {
      const userMessage = messages[messageIndex - 1];
      const botResponse = messages[messageIndex];

      if (!userMessage || !botResponse) return;

      const feedbackBody = {
        session_id: sessionId,
        user_message: userMessage.content,
        ai_response: botResponse.content,
        rating,
        comment,
      };

      const response = await fetch('https://greenhaven.aisma.co.id/api/chatbot/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackBody),
      });

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === messageIndex ? { ...msg, feedbackGiven: true, feedbackRating: rating } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  // Fungsi untuk scroll ke bawah
  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  // Scroll saat pesan baru ditambahkan
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll saat typing selesai
  const handleTypingComplete = (index) => {
    setMessages((prev) => prev.map((msg, i) => (i === index ? { ...msg, isTyping: false } : msg)));
    // Tambah setTimeout untuk memastikan DOM sudah diupdate
    setTimeout(scrollToBottom, 100);
  };

  return (
    <>
      {/* Floating Button - hidden when menu is open */}
      <motion.button
        className={`fixed bottom-6 right-14 z-50 w-14 h-14 bg-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-emerald-700 transition-colors ${
          isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <FaRobot className="w-6 h-6" />
      </motion.button>

      {/* Chat Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-28 bottom-24 right-6 z-50 w-[calc(100%-3rem)] sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaRobot className="w-6 h-6" />
                <span className="font-medium">Celya Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-emerald-700 rounded-full transition-colors"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-4">
                  <p>👋 Hai! Saya Celya, asisten virtual GreenHaven.</p>
                  <p className="mt-2">Ada yang bisa saya bantu?</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div key={message.timestamp.getTime()} className="space-y-2">
                  <div
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : message.isError
                            ? 'bg-red-100 text-red-800 rounded-bl-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {message.type === 'bot' && message.isTyping ? (
                        <TypeWriter
                          text={message.content}
                          onComplete={() => handleTypingComplete(index)}
                        />
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>

                  {/* Feedback buttons - hanya tampilkan setelah typing selesai */}
                  {message.type === 'bot' &&
                    !message.isError &&
                    !message.feedbackGiven &&
                    !message.isTyping && (
                      <div className="flex justify-start gap-2">
                        <button
                          onClick={() => sendFeedback(index, 2)}
                          className="text-gray-400 hover:text-emerald-600"
                        >
                          <AiOutlineLike className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => sendFeedback(index, 1)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <AiOutlineDislike className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                </div>
              ))}

              {/* Loading Animation */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-3 rounded-bl-none">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-emerald-600 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-emerald-600 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-emerald-600 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ketik pesan..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-emerald-600 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <BiSend className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Tambahkan PropTypes
ChatBot.propTypes = {
  isMenuOpen: PropTypes.bool,
};

ChatBot.defaultProps = {
  isMenuOpen: false,
};

export default ChatBot;
