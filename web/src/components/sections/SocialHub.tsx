'use client'
import { Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react'
import { MOCK_SOCIAL_POSTS } from '@/lib/constants'
import { relativeTime } from '@/lib/utils'
import type { SocialPlatform } from '@/lib/types'

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  const icons: Record<SocialPlatform, { bg: string; label: string; emoji: string }> = {
    linkedin:  { bg: 'bg-blue-600',  label: 'LinkedIn',  emoji: 'in' },
    instagram: { bg: 'bg-gradient-to-br from-purple-600 to-pink-500', label: 'Instagram', emoji: '📸' },
    x:         { bg: 'bg-slate-800', label: 'X (Twitter)', emoji: '𝕏' },
  }
  const cfg = icons[platform]
  return (
    <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center text-white text-xs font-black`}>
      {cfg.emoji}
    </div>
  )
}

export function SocialHub() {
  return (
    <section className="py-24 bg-navy-950">
      <div className="section-width px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-fuel text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-8 h-px bg-fuel" /> Social Media Hub <span className="w-8 h-px bg-fuel" />
          </div>
          <h2 className="font-display text-5xl font-black text-white mb-4">Latest From TswanaFuel</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-fuel to-fuel-300 rounded-full mx-auto mb-6" />
          <p className="text-slate-400 max-w-xl mx-auto">Live aggregated content from LinkedIn, Instagram and X — follow us for updates.</p>
        </div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_SOCIAL_POSTS.map(post => (
            <div key={post.id} className="glass rounded-2xl p-5 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-card hover:border-fuel/15 flex flex-col">

              {/* Author row */}
              <div className="flex items-center gap-3 mb-4">
                <PlatformIcon platform={post.platform} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{post.author}</p>
                  <p className="text-xs text-slate-400 truncate">{post.handle}</p>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">{relativeTime(post.timestamp)}</span>
              </div>

              {/* Content */}
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5 line-clamp-5">
                {post.content}
              </p>

              {/* Engagement */}
              <div className="flex items-center justify-between pt-4 border-t border-white/06">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer">
                    <Heart size={13} /> {post.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer">
                    <MessageCircle size={13} /> {post.comments}
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-green-400 transition-colors cursor-pointer">
                    <Share2 size={13} /> {post.shares}
                  </span>
                </div>
                <a href={post.url} target="_blank" rel="noopener noreferrer"
                  className="text-fuel hover:text-fuel-300 transition-colors">
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Follow us */}
        <div className="mt-10 text-center flex items-center justify-center gap-4">
          {(['LinkedIn', 'Instagram', 'X (Twitter)'] as const).map(p => (
            <a key={p} href="#"
              className="glass hover:border-fuel/25 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white transition-all duration-200 hover:-translate-y-0.5">
              {p}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
