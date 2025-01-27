interface OptionCardProps {
  title: string;
  children: React.ReactNode;
  vertical?: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({ title, children, vertical = false }) => {
  return (
    <div
      className={`min-h-16 w-full bg-white dark:bg-dark-400 border border-dashed border-stone-400 rounded-md p-4 ${
        !vertical ? "flex-between" : "flex flex-col space-y-3"
      }`}
    >
      <div className="text-sm font-bold text-emerald-800 dark:text-emerald-100">{title}</div>
      {children}
    </div>
  );
};

export default OptionCard;
