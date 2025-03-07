import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-scroll';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: t('nav.home'), to: 'home' },
    { name: t('nav.whatWeDo'), to: 'what-we-do' },
    { name: t('nav.benefits'), to: 'benefits' },
    { name: t('nav.demo'), to: 'demo' },
    { name: t('nav.pricing'), to: 'pricing' },
    { name: t('nav.contact'), to: 'contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold text-primary">
            MatchFloor
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="text-gray-700 hover:text-primary cursor-pointer transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4 language-selector">
          <button
            onClick={() => changeLanguage('es')}
            className={`px-2 py-1 rounded ${
              i18n.language === 'es'
                ? 'active'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ES
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`px-2 py-1 rounded ${
              i18n.language === 'en'
                ? 'active'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            EN
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-2 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="block text-gray-700 hover:text-primary cursor-pointer transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex space-x-4 pt-2 border-t border-gray-200 language-selector">
              <button
                onClick={() => {
                  changeLanguage('es');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-2 py-1 rounded ${
                  i18n.language === 'es'
                    ? 'active'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => {
                  changeLanguage('en');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-2 py-1 rounded ${
                  i18n.language === 'en'
                    ? 'active'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 