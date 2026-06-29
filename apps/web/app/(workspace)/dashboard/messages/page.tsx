import { 
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/solid';
import Image from 'next/image';

const conversations = [
  {
    id: 1,
    user: 'Ahmed Al-Fayed',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    item: 'Mercedes-Benz G63 AMG',
    lastMessage: 'Is the price negotiable for cash buyer?',
    time: '2m ago',
    unread: true,
  },
  {
    id: 2,
    user: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    item: 'Sony A7IV Camera',
    lastMessage: 'Great, I will meet you at the mall at 5 PM.',
    time: '2h ago',
    unread: false,
  },
  {
    id: 3,
    user: 'Mohammed R.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    item: 'Dubai Marina Appt',
    lastMessage: 'Can we schedule a viewing for tomorrow?',
    time: '1d ago',
    unread: false,
  }
];

export default function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col lg:flex-row overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] shadow-[var(--shadow-lg)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Conversations List (Left Pane) */}
      <div className="flex w-full flex-col border-b border-[var(--border-subtle)] lg:w-96 lg:border-b-0 lg:border-r">
        <div className="flex h-16 shrink-0 items-center border-b border-[var(--border-subtle)] px-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ul role="list" className="divide-y divide-[var(--border-subtle)]">
            {conversations.map((chat) => (
              <li 
                key={chat.id} 
                className={`relative flex cursor-pointer p-4 transition-colors hover:bg-white/5 ${chat.unread ? 'bg-brand-primary/5' : ''}`}
              >
                {chat.unread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-r" />
                )}
                <div className="relative h-12 w-12 flex-shrink-0 rounded-full border border-white/10 overflow-hidden">
                  <Image src={chat.avatar} alt={chat.user} fill className="object-cover" />
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-bold text-[var(--text-primary)]">{chat.user}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{chat.time}</p>
                  </div>
                  <p className="truncate text-xs font-semibold text-brand-primary mt-0.5">{chat.item}</p>
                  <p className={`mt-1 truncate text-sm ${chat.unread ? 'text-white font-medium' : 'text-[var(--text-secondary)]'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Active Chat (Right Pane) */}
      <div className="flex flex-1 flex-col bg-[var(--background)]/50">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border-subtle)] px-6 bg-[var(--surface-alt)]">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 flex-shrink-0 rounded-full border border-white/10 overflow-hidden">
              <Image src={conversations[0].avatar} alt={conversations[0].user} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center">
                {conversations[0].user}
                <CheckBadgeIcon className="h-4 w-4 text-brand-primary ml-1" />
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">Interested in: {conversations[0].item}</p>
            </div>
          </div>
          <button type="button" className="text-[var(--text-secondary)] hover:text-white transition-colors">
            <EllipsisVerticalIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-end">
              <div className="relative h-8 w-8 flex-shrink-0 rounded-full overflow-hidden mr-3">
                <Image src={conversations[0].avatar} alt="" fill className="object-cover" />
              </div>
              <div className="max-w-[70%] rounded-2xl rounded-bl-none border border-white/10 bg-[var(--surface)] px-4 py-3 shadow-sm">
                <p className="text-sm text-white">Hi there! Beautiful G63. Are you the first owner?</p>
              </div>
            </div>

            <div className="flex items-end justify-end">
              <div className="max-w-[70%] rounded-2xl rounded-br-none bg-brand-primary px-4 py-3 shadow-sm">
                <p className="text-sm text-white">Hello Ahmed! Yes, I am the first owner. Full service history at Gargash.</p>
              </div>
            </div>

            <div className="flex items-end">
              <div className="relative h-8 w-8 flex-shrink-0 rounded-full overflow-hidden mr-3">
                <Image src={conversations[0].avatar} alt="" fill className="object-cover" />
              </div>
              <div className="max-w-[70%] rounded-2xl rounded-bl-none border border-white/10 bg-[var(--surface)] px-4 py-3 shadow-sm">
                <p className="text-sm text-white">Is the price negotiable for cash buyer?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
          <div className="flex items-center space-x-3">
            <div className="min-w-0 flex-1">
              <input
                type="text"
                placeholder="Type your message..."
                className="block w-full rounded-full border-0 bg-[var(--surface)] px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white/30 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary text-white shadow-sm hover:bg-brand-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary transition-transform hover:scale-105"
            >
              <PaperAirplaneIcon className="h-5 w-5 -ml-0.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
