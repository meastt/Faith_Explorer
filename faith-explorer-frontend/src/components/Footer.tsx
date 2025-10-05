import { Heart, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-sage-200 dark:border-gray-700 sepia:border-amber-200 bg-white dark:bg-gray-800 sepia:bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-sage-900 dark:text-gray-100 sepia:text-amber-900 mb-3">About Faith Explorer</h3>
            <p className="text-sm text-sage-600 dark:text-gray-400 sepia:text-amber-700 leading-relaxed">
              Discover and explore sacred texts from world religions. Compare perspectives, 
              gain wisdom, and deepen your understanding of faith traditions.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold text-sage-900 dark:text-gray-100 sepia:text-amber-900 mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-sage-600 dark:text-gray-400 sepia:text-amber-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                Search across 9 sacred texts
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                Compare religious perspectives
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                AI-powered verse discussions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                Save and organize favorites
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-bold text-sage-900 dark:text-gray-100 sepia:text-amber-900 mb-3">Support</h3>
            <div className="space-y-3">
              <a 
                href="mailto:support@faithexplorer.com" 
                className="flex items-center gap-2 text-sm text-sage-600 dark:text-gray-400 sepia:text-amber-700 hover:text-primary-600 dark:hover:text-primary-400 sepia:hover:text-primary-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>support@faithexplorer.com</span>
              </a>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="#" className="text-sage-600 dark:text-gray-400 sepia:text-amber-700 hover:text-primary-600 dark:hover:text-primary-400 sepia:hover:text-primary-700 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sage-600 dark:text-gray-400 sepia:text-amber-700 hover:text-primary-600 dark:hover:text-primary-400 sepia:hover:text-primary-700 transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-sage-200 dark:border-gray-700 sepia:border-amber-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-sage-600 dark:text-gray-400 sepia:text-amber-700">
              © {currentYear} Faith Explorer. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-sage-600 dark:text-gray-400 sepia:text-amber-700">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for seekers of wisdom</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
