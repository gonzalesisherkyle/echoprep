
/**
 * @returns {JSX.Element}
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-border bg-bg text-muted"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs sm:flex-row">
        <p>
          &copy; {year} EchoPrep. Practice out loud. Land the role.
        </p>
        <nav aria-label="Legal">
          <ul className="flex items-center gap-4">
            <li>
              <a
                href="#privacy"
                className="text-muted transition-default hover:text-text focus-visible:text-text"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="#terms"
                className="text-muted transition-default hover:text-text focus-visible:text-text"
              >
                Terms
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-muted transition-default hover:text-text focus-visible:text-text"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;

