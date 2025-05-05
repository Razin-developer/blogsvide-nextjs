import Link from "next/link"

const Footer = () => {
  return (
    <div>
      <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Razin</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="https://react.dev/" className="hover:underline">React</a>
                  </li>
                  <li>
                    <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="https://github.com/" className="hover:underline ">Github</a>
                  </li>
                  <li>
                    <a href="https://discord.com/" className="hover:underline">Discord</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <Link href="/" className="hover:underline text-gray-500 dark:text-gray-400">Razin</Link>. All Rights Reserved.
            </span>
            <div className="flex mt-4 sm:justify-center sm:mt-0">
              <a href="https://www.facebook.com/profile.php?id=61572614705263" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                  <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd" />
                </svg>
                <span className="sr-only">Facebook page</span>
              </a>
              <a href="https://www.instagram.com/razinnn__.10/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                {/* Instagram Icon */}
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.849.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.849c-.148 3.225-1.664 4.771-4.919 4.919-1.265.058-1.645.069-4.849.069s-3.584-.012-4.849-.07c-3.225-.148-4.771-1.664-4.919-4.919-.058-1.265-.069-1.645-.069-4.849s.012-3.584.07-4.849c.148-3.225 1.664-4.771 4.919-4.919 1.265-.058 1.645-.069 4.849-.069zm0-2.163C8.769 0 8.339.012 7.051.07 2.672.256.256 2.672.07 7.051.012 8.339 0 8.769 0 12s.012 3.661.07 4.949c.186 4.38 2.602 6.795 6.981 6.981C8.339 23.988 8.769 24 12 24s3.661-.012 4.949-.07c4.38-.186 6.795-2.602 6.981-6.981.058-1.288.07-1.718.07-4.949s-.012-3.661-.07-4.949c-.186-4.38-2.602-6.795-6.981-6.981C15.661.012 15.231 0 12 0z" />
                  <circle cx="12" cy="12" r="3.2" />
                  <circle cx="18.406" cy="5.594" r="1.439" />
                </svg>
                <span className="sr-only">Instagram Page</span>
              </a>

              <a href="https://www.linkedin.com/in/razin-mohammed-pt-3533722b3/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                {/* LinkedIn Icon */}
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.225 0H1.771C.792 0 0 .775 0 1.732v20.536C0 23.225.792 24 1.771 24h20.453C23.208 24 24 23.225 24 22.268V1.732C24 .775 23.208 0 22.225 0zM7.125 20.452H3.583V9h3.542v11.452zM5.354 7.543c-1.14 0-2.063-.926-2.063-2.065s.923-2.065 2.063-2.065 2.064.926 2.064 2.065-.924 2.065-2.064 2.065zM20.455 20.452h-3.542V14.52c0-1.415-.028-3.24-1.974-3.24-1.974 0-2.276 1.544-2.276 3.142v6.03H9.125V9h3.394v1.561h.05c.472-.89 1.62-1.825 3.338-1.825 3.566 0 4.222 2.348 4.222 5.402v6.314z" />
                </svg>
                <span className="sr-only">LinkedIn Profile</span>
              </a>

              <a href="https://github.com/Razin-developer/" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd" />
                </svg>
                <span className="sr-only">GitHub account</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
