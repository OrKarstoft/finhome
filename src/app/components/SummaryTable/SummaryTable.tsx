"use client";

import ProgressBar from "../ProgressBar/ProgressBar";

export default function SummaryTable({ title, data, monthsPassed, type }) {
  const Icon = ({ className, children }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
  const Banknote = ({ className }) => (
    <Icon className={className}>
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </Icon>
  );
  const Home = ({ className }) => (
    <Icon className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </Icon>
  );
  const Utensils = ({ className }) => (
    <Icon className={className}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z" />
    </Icon>
  );
  const Car = ({ className }) => (
    <Icon className={className}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </Icon>
  );
  const Film = ({ className }) => (
    <Icon className={className}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18M17 3v18M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4" />
    </Icon>
  );
  const Plus = ({ className }) => (
    <Icon className={className}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </Icon>
  );
  const Edit = ({ className }) => (
    <Icon className={className}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </Icon>
  );
  const Trash2 = ({ className }) => (
    <Icon className={className}>
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </Icon>
  );
  const TrendingUp = ({ className }) => (
    <Icon className={className}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </Icon>
  );
  const TrendingDown = ({ className }) => (
    <Icon className={className}>
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </Icon>
  );
  const PiggyBank = ({ className }) => (
    <Icon className={className}>
      <path d="M19 5c-1.5 0-2.8 1-3.5 2.5s-1.7 2.5-3.5 2.5-2.8-1-3.5-2.5S6.5 5 5 5" />
      <path d="M12 12v2" />
      <path d="M2 9.5c0 2.5 2.3 4.5 5.1 4.5H17c2.8 0 5-2 5-4.5" />
      <path d="M10 17c0 .5-.4 1-1 1H6a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h2.8c.2 0 .5.1.7.2" />
    </Icon>
  );
  const Target = ({ className }) => (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </Icon>
  );
  const Sun = ({ className }) => (
    <Icon className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </Icon>
  );
  const Moon = ({ className }) => (
    <Icon className={className}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </Icon>
  );
  const Settings = ({ className }) => (
    <Icon className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
  const IconComponent = type === "income" ? TrendingUp : TrendingDown;
  const color = type === "income" ? "text-green-500" : "text-red-500";
  const CategoryRow = ({ category, monthsPassed }) => {
    return (
      <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark-mode-transition">
        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center gap-3">
          {getCategoryIcon(category.name)} {category.name}
        </td>
        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
          {Math.round(category.monthlyEquivalent).toLocaleString()} DKK
        </td>
        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
          {category.actual.toLocaleString()} DKK
        </td>
        <td className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400">
          {category.totalAnnualProjected.toLocaleString()} DKK
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-col">
            <ProgressBar
              value={category.actual}
              total={category.plannedYTD}
              type={category.type}
            />
            <span className="text-xs text-gray-500 mt-1 text-center">
              {category.actual > category.plannedYTD ? "Over" : "On"} track
            </span>
          </div>
        </td>
      </tr>
    );
  };
  const getCategoryIcon = (category) => {
    const icons = {
      Salary: <Banknote className="w-5 h-5 text-indigo-500" />,
      Freelance: <Plus className="w-5 h-5 text-indigo-500" />,
      Housing: <Home className="w-5 h-5 text-blue-500" />,
      Groceries: <Utensils className="w-5 h-5 text-blue-500" />,
      Transportation: <Car className="w-5 h-5 text-blue-500" />,
      Entertainment: <Film className="w-5 h-5 text-blue-500" />,
      Savings: <PiggyBank className="w-5 h-5 text-blue-500" />,
      Loan: <Banknote className="w-5 h-5 text-blue-500" />,
      Subscriptions: (
        <Icon className="w-5 h-5 text-blue-500">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </Icon>
      ),
      default: <Target className="w-5 h-5 text-gray-400" />,
    };
    return icons[category] || icons["default"];
  };
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden dark-mode-transition">
      <h3
        className={`text-xl font-bold p-4 border-b dark:border-gray-700 flex items-center gap-2 ${color}`}
      >
        <IconComponent className="w-6 h-6" /> {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                Category
              </th>
              <th scope="col" className="px-4 py-3">
                Avg. Monthly Planned
              </th>
              <th scope="col" className="px-4 py-3">
                Corrected (YTD)
              </th>
              <th scope="col" className="px-4 py-3">
                Projected (Annual)
              </th>
              <th scope="col" className="px-4 py-3">
                Progress (YTD)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((cat) => (
              <CategoryRow
                key={cat.name}
                category={cat}
                monthsPassed={monthsPassed}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
