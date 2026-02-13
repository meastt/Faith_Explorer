import { useTranslation } from 'react-i18next';

interface ThreadNode {
  era: string;
  faith: string;
  title: string;
  quote: string;
  description: string;
}

interface GoldenThread {
  id: string;
  title: string;
  description: string;
  nodes: ThreadNode[];
}

const GOLDEN_THREAD_IDS = ['goldenRule', 'hospitality'] as const;

export function LearningPaths() {
  const { t } = useTranslation('learn');

  // Build threads from i18n data
  const threads: GoldenThread[] = GOLDEN_THREAD_IDS.map(id => {
    const nodes = t(`goldenThreads.threads.${id}.nodes`, { returnObjects: true }) as ThreadNode[];
    return {
      id,
      title: t(`goldenThreads.threads.${id}.title`),
      description: t(`goldenThreads.threads.${id}.description`),
      nodes: Array.isArray(nodes) ? nodes : [],
    };
  });

  return (
    <div className="bg-white dark:bg-stone-800 sepia:bg-amber-50 rounded-2xl border border-sand-200 dark:border-stone-700 sepia:border-amber-300 p-4 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-gold-400 to-bronze-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✦</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 sepia:text-amber-900 uppercase tracking-wide">
            {t('goldenThreads.sectionTitle')}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 sepia:text-amber-700">
            {t('goldenThreads.sectionDescription')}
          </p>
        </div>
      </div>

      {/* Thread Preview Cards */}
      <div className="space-y-2">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className="group relative p-3 rounded-xl border border-sand-200 dark:border-stone-600 sepia:border-amber-300 hover:border-gold-300 dark:hover:border-gold-700 sepia:hover:border-amber-400 transition-all duration-300 cursor-pointer hover:shadow-md bg-gradient-to-r from-transparent to-gold-50/30 dark:to-gold-900/10 sepia:to-amber-100/50"
          >
            <div className="flex items-start gap-3">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-gold-400 dark:bg-gold-500" />
                <div className="w-0.5 h-8 bg-gradient-to-b from-gold-300 to-gold-100 dark:from-gold-600 dark:to-gold-900" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 sepia:text-amber-900 group-hover:text-bronze-700 dark:group-hover:text-bronze-300 sepia:group-hover:text-amber-700 transition-colors">
                  {thread.title}
                </h4>
                <p className="text-sm text-stone-500 dark:text-stone-400 sepia:text-amber-700 leading-snug pr-4">
                  {thread.description}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs text-gold-600 dark:text-gold-400 sepia:text-amber-700 font-medium">
                    {t('goldenThreads.passagesThroughHistory', { total: thread.nodes.length })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}