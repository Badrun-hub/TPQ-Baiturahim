import Navbar from './Navbar';
import Footer from './Footer';

export default function PageLayout({ children }) {
  const whatsappNumber = "6287700147309";
  const whatsappMessage = encodeURIComponent("Assalamu'alaikum, saya ingin bertanya mengenai pendaftaran santri baru TPQ Baiturrahim.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />

      {/* Floating Sticky WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95 group text-xs sm:text-sm"
        aria-label="Tanya Pendaftaran WhatsApp"
      >
        <svg
          className="w-4 h-4 sm:w-5 h-5 fill-current shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45h.007c5.437 0 9.862-4.424 9.866-9.865.002-2.636-1.019-5.114-2.873-6.97C16.51 1.913 14.037.892 11.4.892c-5.44 0-9.866 4.425-9.87 9.866-.001 1.77.478 3.49 1.388 5.017l-.992 3.626 3.725-.977zm11.237-7.652c-.3-.15-1.774-.875-2.046-.975-.27-.1-.468-.15-.665.15-.198.3-.766.975-.94 1.175-.173.2-.347.225-.647.075-.3-.15-1.266-.467-2.41-1.487-.89-.793-1.49-1.773-1.665-2.073-.173-.3-.018-.462.13-.61.135-.133.3-.347.45-.52.15-.174.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.665-1.603-.91-2.193-.24-.576-.484-.497-.665-.506-.17-.008-.368-.01-.566-.01s-.518.074-.79.373c-.27.3-1.03 1.008-1.03 2.46 0 1.454 1.057 2.859 1.205 3.06.148.2 2.08 3.176 5.04 4.456.703.304 1.253.486 1.68.623.707.224 1.35.193 1.86.117.567-.085 1.774-.725 2.023-1.424.25-.7.25-1.299.173-1.424-.075-.125-.27-.2-.57-.35z" />
        </svg>
        <span className="font-semibold whitespace-nowrap">Tanya Pendaftaran</span>
      </a>
    </div>
  );
}
