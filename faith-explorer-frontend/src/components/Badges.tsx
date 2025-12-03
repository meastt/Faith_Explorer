import { Award, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Badge } from '../types';

export function Badges() {
  const { badges, getUnlockedBadges, getLockedBadges } = useStore();

  const unlockedBadges = getUnlockedBadges();
  const lockedBadges = getLockedBadges();

  const renderBadge = (badge: Badge, isUnlocked: boolean) => (
    <div
      key={badge.id}
      className={`relative p-4 rounded-xl border transition-all ${
        isUnlocked
          ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700 shadow-md'
          : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${
            isUnlocked
              ? 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-400 dark:border-amber-600'
              : 'bg-stone-200 dark:bg-stone-700 border-2 border-stone-400 dark:border-stone-600'
          }`}
        >
          {isUnlocked ? (
            badge.icon
          ) : (
            <Lock className="w-5 h-5 text-stone-500 dark:text-stone-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-bold text-sm mb-1 ${
              isUnlocked
                ? 'text-amber-900 dark:text-amber-200'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {badge.name}
          </h4>
          <p
            className={`text-xs ${
              isUnlocked
                ? 'text-amber-800 dark:text-amber-300'
                : 'text-stone-500 dark:text-stone-500'
            }`}
          >
            {badge.description}
          </p>
          {isUnlocked && badge.unlockedAt && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            Achievement Badges
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {unlockedBadges.length} of {badges.length} unlocked
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
          style={{ width: `${(unlockedBadges.length / badges.length) * 100}%` }}
        />
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
            Unlocked ({unlockedBadges.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unlockedBadges.map((badge) => renderBadge(badge, true))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">
            Locked ({lockedBadges.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lockedBadges.map((badge) => renderBadge(badge, false))}
          </div>
        </div>
      )}
    </div>
  );
}
