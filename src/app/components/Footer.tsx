import Link from "next/link";
import Image from "next/image";

// Add links later
const Links = [
  {
    title: "SOLUTIONS",
    links: [
      { name: "Student Training", href: "#" },
      { name: "Corporate Partnership", href: "#" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { name: "Contact Us", href: "#" },
      { name: "FAQs", href: "#" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { name: "About", href: "https://a2sv.org/about" },
      { name: "Blog", href: "#" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { name: "Privacy", href: "https://a2sv.org/privacy-policy" },
      { name: "Terms", href: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#1F2937] text-white w-full mt-16">
      <div className="max-w-7xl mx-auto pb-10 pt-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link
              href="https://a2sv.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Image
                src="/images/logoWhite.png"
                alt="A2SV Logo"
                width={128}
                height={56}
                className="h-auto w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              Preparing Africa's top tech talent for global opportunities.
            </p>
          </div>

          {Links.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-base text-gray-300 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} A2SV. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;