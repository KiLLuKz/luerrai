import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabaseClient';
import { MessageCircle, X, Send, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GOOFY_NAMES = [
  'นักรบหิวโซ', 'กะเพราไก่ไข่ดาว', 'คนรอกิน', 'ป้าบ่น', 'หมูพะโล้', 
  'เด็กหอพัก', 'ซอมบี้รอข้าว', 'ผู้หิวโหย', 'มนุษย์กินจุ', 'สายชิล', 
  'กิ้งก่าทอง', 'แมวอ้วน', 'ชานมไข่มุก', 'ไก่ทอดกระเทียม', 'หมูกรอบเลิฟเวอร์',
  'หิวข้าวจัง', 'ไม่รู้จะกินอะไร', 'ขอสองจาน'
];

interface ChatMessage {
  id: string;
  name: string;
  text: string;
  timestamp: number;
}

export const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  
  // สุ่มชื่อตั้งแต่ครั้งแรกที่เปิดเว็บ
  const [userName] = useState(() => {
    const randomSuffix = Math.floor(Math.random() * 99) + 1;
    const name = GOOFY_NAMES[Math.floor(Math.random() * GOOFY_NAMES.length)];
    return `${name}_${randomSuffix}`;
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // เลื่อนลงล่างสุดอัตโนมัติเวลามีข้อความใหม่ หรือเวลาเปิดแชท
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setHasNewMessage(false);
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    } else {
      setHasNewMessage(true);
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen]);

  // Handle Scroll to detect if user is at the bottom
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(atBottom);
    if (atBottom) {
      setHasNewMessage(false);
    }
  };

  // Cooldown Timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // เชื่อมต่อ Supabase Realtime Broadcast
  useEffect(() => {
    const channel = supabase.channel('public:chat', {
      config: { broadcast: { self: true } } 
    });

    // ตัวแปรสำหรับป้องกันการส่งประวัติซ้ำซ้อน
    let syncTimeout: ReturnType<typeof setTimeout>;

    channel
      .on('broadcast', { event: 'chat_message' }, (payload) => {
        setMessages(prev => {
          const newMessages = [...prev, payload.payload as ChatMessage];
          if (newMessages.length > 30) return newMessages.slice(newMessages.length - 30);
          return newMessages;
        });
      })
      .on('broadcast', { event: 'request_sync' }, () => {
        // มีคนเข้าใหม่ขอประวัติแชท!
        setMessages(currentMessages => {
          if (currentMessages.length > 0) {
            // สุ่มหน่วงเวลา 0-500ms เพื่อป้องกันทุกคนแย่งกันส่ง (Broadcast Storm)
            const delay = Math.random() * 500;
            syncTimeout = setTimeout(() => {
              channel.send({
                type: 'broadcast',
                event: 'sync_history',
                payload: { messages: currentMessages }
              });
            }, delay);
          }
          return currentMessages;
        });
      })
      .on('broadcast', { event: 'sync_history' }, (payload) => {
        // มีคนใจดีส่งประวัติมาให้ หรือส่งให้คนอื่นไปแล้ว
        clearTimeout(syncTimeout); // ยกเลิกการส่งของตัวเองถ้ามีคนอื่นส่งไปแล้ว
        
        setMessages(prev => {
          // รับประวัติเฉพาะตอนที่เรายังไม่มีข้อความ (เพิ่งเข้ามา)
          if (prev.length === 0) {
            return payload.payload.messages;
          }
          return prev;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // พอเชื่อมต่อสำเร็จ ร้องขอประวัติแชทจากคนที่อยู่ก่อนหน้า
          await channel.send({
            type: 'broadcast',
            event: 'request_sync',
            payload: {}
          });
        }
      });

    return () => {
      clearTimeout(syncTimeout);
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || cooldown > 0) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      name: userName,
      text: inputText.trim(),
      timestamp: Date.now()
    };

    // ส่งข้อความไปใน Channel แบบไม่ต้องลง Database
    await supabase.channel('public:chat').send({
      type: 'broadcast',
      event: 'chat_message',
      payload: newMessage
    });

    setInputText('');
    setCooldown(5); // ตั้ง Cooldown 5 วินาที
    setTimeout(scrollToBottom, 50); // เลื่อนจอลงเมื่อส่งเอง
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:shadow-xl z-50 transition-shadow duration-300 ease-out"
          >
            <MessageCircle size={26} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 right-6 w-[90vw] sm:w-[350px] h-[450px] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-surface-hover p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-sm">สมาคมคนหิว</h3>
                  <p className="text-[10px] text-text-secondary">คุณคือ: <span className="text-primary font-bold">{userName}</span></p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-text-primary bg-background/50 hover:bg-background p-1.5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50 flex flex-col relative"
              ref={scrollContainerRef}
              onScroll={handleScroll}
            >
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-text-secondary space-y-2 opacity-50">
                  <MessageCircle size={32} />
                  <p className="text-sm font-medium">ยังไม่มีใครบ่นหิวเลย... เปิดวงเลยสิ!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.name === userName;
                  // ตรวจสอบว่าข้อความก่อนหน้ามาจากคนเดียวกันไหม เพื่อยุบระยะห่าง
                  const isSequential = idx > 0 && messages[idx - 1].name === msg.name;
                  
                  return (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isSequential ? 'mt-1' : 'mt-4'}`}
                    >
                      {!isSequential && (
                        <span className="text-[10px] md:text-xs text-text-secondary font-bold mb-1 ml-1">{msg.name}</span>
                      )}
                      <div className={`px-4 py-2 md:px-5 md:py-3 rounded-2xl max-w-[85%] text-sm md:text-base shadow-sm ${
                        isMe 
                          ? 'bg-primary text-text-primary rounded-tr-sm' 
                          : 'bg-surface-hover text-text-primary rounded-tl-sm border border-border'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
              
              {/* Floating New Message Arrow */}
              <AnimatePresence>
                {hasNewMessage && !isAtBottom && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={scrollToBottom}
                    className="sticky bottom-2 left-1/2 -translate-x-1/2 bg-primary/90 backdrop-blur-sm text-text-primary px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-primary/20 flex items-center gap-1 z-10"
                  >
                    <ArrowDown size={14} /> ข้อความใหม่
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-3 bg-surface-hover/80 border-t border-border flex gap-2 relative">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={cooldown > 0 ? `ใจเย็นๆ รอแปปพี่ (${cooldown}s)` : "บ่นเรื่องของกินที่นี่..."}
                maxLength={100}
                disabled={cooldown > 0}
                className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || cooldown > 0}
                className="bg-primary hover:bg-primary/90 disabled:bg-surface disabled:text-text-secondary text-text-primary p-2.5 rounded-xl transition-colors flex items-center justify-center"
              >
                <Send size={16} className={inputText.trim() && cooldown === 0 ? "translate-x-0.5 -translate-y-0.5" : ""} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
