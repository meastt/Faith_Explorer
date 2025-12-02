import { BarChart3, BookOpen, Globe, Tag, TrendingUp, Heart } from 'lucide-react';
import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { RELIGIONS } from '../types';

export function LibraryStats() {
  const { savedVerses } = useStore();

  // Calculate statistics
  const stats = useMemo(() => {
    if (savedVerses.length === 0) {
      return {
        totalVerses: 0,
        religionsCount: 0,
        mostExploredReligion: null,
        topTags: [],
        religionBreakdown: [],
        foldersUsed: 0,
        highlightsCount: 0,
        notesCount: 0,
      };
    }

    // Count verses per religion
    const religionCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    const uniqueReligions = new Set<string>();
    const uniqueFolders = new Set<string>();
    let totalHighlights = 0;
    let totalNotes = 0;

    savedVerses.forEach((verse) => {
      // Religion counts
      if (verse.religion) {
        uniqueReligions.add(verse.religion);
        religionCounts[verse.religion] = (religionCounts[verse.religion] || 0) + 1;
      }

      // Tag counts
      verse.tags.forEach((tag) => {
        if (tag !== 'AI Insight') {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      });

      // Folder tracking
      if (verse.folderId) {
        uniqueFolders.add(verse.folderId);
      }

      // Highlights count
      if (verse.highlights && verse.highlights.length > 0) {
        totalHighlights += verse.highlights.length;
      }

      // Notes count
      if (verse.notes && verse.notes.trim().length > 0) {
        totalNotes++;
      }
    });

    // Find most explored religion
    const mostExploredReligion = Object.entries(religionCounts).reduce(
      (max, [religion, count]) => (count > max.count ? { religion, count } : max),
      { religion: '', count: 0 }
    );

    // Get top 6 tags
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([tag, count]) => ({ tag, count }));

    // Religion breakdown for chart
    const religionBreakdown = Object.entries(religionCounts)
      .map(([religion, count]) => {
        const religionInfo = RELIGIONS.find((r) => r.id === religion);
        return {
          religion,
          name: religionInfo?.name || religion,
          count,
          percentage: Math.round((count / savedVerses.length) * 100),
          color: religionInfo?.color || '#6B7280',
        };
      })
      .sort((a, b) => b.count - a.count);

    return {
      totalVerses: savedVerses.length,
      religionsCount: uniqueReligions.size,
      mostExploredReligion:
        mostExploredReligion.religion
          ? {
              ...mostExploredReligion,
              name:
                RELIGIONS.find((r) => r.id === mostExploredReligion.religion)?.name ||
                mostExploredReligion.religion,
            }
          : null,
      topTags,
      religionBreakdown,
      foldersUsed: uniqueFolders.size,
      highlightsCount: totalHighlights,
      notesCount: totalNotes,
    };
  }, [savedVerses]);

  if (savedVerses.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl shadow-soft border border-sage-200 dark:border-gray-700 sepia:border-amber-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">
          Your Library Stats
        </h2>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Total Verses</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalVerses}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Religions</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {stats.religionsCount}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Tags Used</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {stats.topTags.length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">With Notes</span>
          </div>
          <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.notesCount}</p>
        </div>
      </div>

      {/* Most Explored Tradition */}
      {stats.mostExploredReligion && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Most Explored Tradition
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {stats.mostExploredReligion.name}
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.mostExploredReligion.count} verses
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Religion Breakdown */}
      {stats.religionBreakdown.length > 1 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Religion Distribution
          </h3>
          <div className="space-y-2">
            {stats.religionBreakdown.map((item) => (
              <div key={item.religion}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Topics (Tag Cloud) */}
      {stats.topTags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Top Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.topTags.map((item, idx) => {
              const sizes = ['text-lg', 'text-base', 'text-sm', 'text-sm', 'text-xs', 'text-xs'];
              const opacities = ['opacity-100', 'opacity-90', 'opacity-80', 'opacity-70', 'opacity-60', 'opacity-50'];
              return (
                <span
                  key={item.tag}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium ${sizes[idx]} ${opacities[idx]}`}
                >
                  <Tag className="w-3 h-3" />
                  {item.tag}
                  <span className="text-xs opacity-70">({item.count})</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Additional Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Folders Used</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.foldersUsed}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Highlights</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {stats.highlightsCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg per Religion</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {stats.religionsCount > 0
                ? Math.round(stats.totalVerses / stats.religionsCount)
                : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
