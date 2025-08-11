/* eslint-disable react/no-unescaped-entities */
interface AboutUsProps {
  isDarkMode: boolean;
}

export const AboutUs = ({ isDarkMode }: AboutUsProps) => {
  return (
    <section className="space-y-6">
      <div
        className={`rounded-lg border ${
          isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-gray-50'
        } p-6 text-left shadow-sm`}>
        <h2 className={`mb-4 text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>About Us</h2>

        <div className="space-y-6">
          <div
            className={`my-6 rounded-lg border p-4 ${
              isDarkMode ? 'border-slate-700 bg-slate-700' : 'border-gray-200 bg-gray-100'
            }`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Our Team</h3>
            <p className={`mt-2 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Developed by RBI for RBI.<br></br>@Chirag Team + Saurabh Pal.
              <br></br>For feedback or queries, please write to chiragsupport@rbi.org.in
            </p>
          </div>

          <div
            className={`my-6 rounded-lg border p-4 ${
              isDarkMode ? 'border-slate-700 bg-slate-700' : 'border-gray-200 bg-gray-100'
            }`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>What's Next</h3>
            <p className={`mt-2 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We are constantly working on new features and improvements. Here are some of the things we are planning
              for the near future:
            </p>
            <ul className={`mt-4 list-disc space-y-2 pl-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>Background working: Let it work in the background</li>
              <li>Tab indications: Agentic tabs are highlighted for easy recognition</li>
              <li>Faster & smarter: Faster and smarter with in-built AI support</li>
              <li>Speech to text: Speak your task instead of tying, talk to your assistant.</li>
              <li>
                Conversational AI: Converse with your assistant and get your queries answered in a faster humane way.
              </li>
              <li>Enhanced prompts: Self learning from user prompts to understand better</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
